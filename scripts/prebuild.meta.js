/**
 * ### Модуль сборки *.js по описанию метаданных
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2017
 * @module  metadata-prebuild
 */

'use strict';

const fs = require('fs');
const path = require('path');

process.env.DEBUG = 'prebuild:,-not_this';
const debug = require('debug')('prebuild:');

debug('Читаем конструктор и плагины');

// путь настроек приложения
const settings_path = path.resolve(__dirname, '../config/app.settings.js');

// текст модуля начальных настроек приложения для включения в итоговый скрипт
const settings = fs.readFileSync(settings_path, 'utf8');

// конфигурация подключения к CouchDB
const config = require(settings_path)();

// конструктор metadata-core и плагин metadata-pouchdb
const MetaEngine = require('metadata-core')
  .plugin(require('metadata-pouchdb'))
  .plugin(require('metadata-abstract-ui/meta'))
  .plugin(require('metadata-abstract-ui'));

debug('Создаём объект MetaEngine');

const $p = new MetaEngine();    // подключим метадату
let jstext = '';            // в этой переменной будем накапливать текст модуля

debug('Настраиваем MetaEngine');

// инициализация и установка параметров
$p.wsql.init((prm) => {

  // разделитель для localStorage
  prm.local_storage_prefix = config.local_storage_prefix;

  // по умолчанию, обращаемся к зоне 0
  prm.zone = config.zone;

  // расположение 1C
  if (config.rest_path)
    prm.rest_path = config.rest_path;

  // расположение couchdb
  prm.couch_path = config.couch_local;

}, ($p) => {

  const db = new MetaEngine.classes.PouchDB(config.couch_local + 'meta', {
    skip_setup: true,
  });

  let _m;

  debug('Читаем описание метаданных из CouchDB');
  return db.info()
    .then(() => db.get('meta'))
    .catch((err) => {
      debug('Не удалось получить объект meta из CouchDB\nПроверьте логин, пароль и строку подключения');
      debug(err);
      process.exit(1);
    })
    .then((doc) => {
      _m = doc;
      doc = null;
      return db.get('meta_patch')
        .catch((err) => ({}))
        .then((doc) => doc);
    })
    .then((doc) => {
      $p.utils._patch(_m, doc);
      doc = null;
      delete _m._id;
      delete _m._rev;

      // фильтруем метаданные для облегчения рабочего места
      // let filter = {
      //   cat: ['users','users_acl','stores','divisions','individuals','parameters_keys','work_shifts','work_center_kinds','work_centers','property_values'],
      //   doc: ['planning_event'],
      //   dp: [],
      //   areg: [],
      //   ireg: ['log']
      // }, filtred_meta = {};
      // for(var cls in _m){
      //   if(!filter[cls]){
      //     filtred_meta[cls] = _m[cls]
      //   }else{
      //     filtred_meta[cls] = {};
      //     filter[cls].forEach(function (name) {
      //       filtred_meta[cls][name] = _m[cls][name]
      //     })
      //   }
      // }

      return $p.md.init(_m);
    })
    .then((_m) => {

      debug('Создаём текст модуля конструкторов данных');
      let text = create_modules(_m);

      debug('Выполняем текст модуля, чтобы создать менеджеры данных');
      eval(text);

      debug('Получаем скрипт таблиц alasql');
      $p.md.create_tables((sql) => {

        text = '/* eslint-disable */\nmodule.exports = function meta($p) {\n\n'
          + '$p.wsql.alasql(\'' + sql + '\', []);\n\n'
          + '$p.md.init(' + JSON.stringify(_m) + ');\n\n'
          + text + '};';

        debug('Записываем результат');
        const fname = path.resolve(__dirname, '../src/metadata/init.js');
        fs.writeFile(fname, text, 'utf8', (err) => {
          if (err) {
            debug(err);
            process.exit(1);
          } else {
            debug(`Успешно записан > ${fname}`);
            process.exit(0);
          }
        });

        $p = null;

      });

    })
    .catch((err) => {
      debug(err);
      process.exit(1);
    });
});


function create_modules(_m) {

  let name,
    sys_nsmes = ['log', 'meta_objs', 'meta_fields', 'scheme_settings'],
    categoties = {
      cch: {mgr: 'ChartOfCharacteristicManager', obj: 'CatObj'},
      cacc: {mgr: 'ChartOfAccountManager', obj: 'CatObj'},
      cat: {mgr: 'CatManager', obj: 'CatObj'},
      bp: {mgr: 'BusinessProcessManager', obj: 'BusinessProcessObj'},
      tsk: {mgr: 'TaskManager', obj: 'TaskObj'},
      doc: {mgr: 'DocManager', obj: 'DocObj'},
      ireg: {mgr: 'InfoRegManager', obj: 'RegisterRow'},
      areg: {mgr: 'AccumRegManager', obj: 'RegisterRow'},
      dp: {mgr: 'DataProcessorsManager', obj: 'DataProcessorObj'},
      rep: {mgr: 'DataProcessorsManager', obj: 'DataProcessorObj'},
    },
    text = `(function(){
  const {EnumManager,CatManager,DocManager,DataProcessorsManager,ChartOfCharacteristicManager,ChartOfAccountManager,
    InfoRegManager,AccumRegManager,BusinessProcessManager,TaskManager,CatObj, DocObj, TabularSectionRow, DataProcessorObj,
    RegisterRow, BusinessProcessObj, TaskObj} = $p.constructor.classes;
    
  const _define = Object.defineProperties;
    
  function conf(target, key, descriptor) {
    descriptor.configurable = true;
    return descriptor;
  }\n\n`;


  // менеджеры перечислений
  for (name in _m.enm){
    text += `$p.enm.create('${name}');\n`;
  }

  // менеджеры объектов данных, отчетов и обработок
  for (var category in categoties) {
    for (name in _m[category]) {
      if (sys_nsmes.indexOf(name) == -1) {
        text += obj_constructor_text(_m, category, name, categoties[category].obj);
        text += `$p.${category}.create('${name}');\n`;
      }
    }
  }

  return text + '})();\n';

}

function obj_constructor_text(_m, category, name, proto) {

  const {DataManager} = MetaEngine.classes;
  let meta = _m[category][name],
    fn_name = DataManager.prototype.obj_constructor.call({class_name: category + '.' + name, constructor_names: {}}),
    text = '\n/**\n* ### ' + $p.msg.meta[category] + ' ' + meta.name,
    f, props = '';

  text += '\n* ' + (meta.illustration || meta.synonym);
  text += '\n* @class ' + fn_name;
  text += '\n* @extends ' + proto;
  text += '\n* @constructor \n*/\n';
  text += `class ${fn_name} extends ${proto}{\n`;

  // реквизиты по метаданным
  if (meta.fields) {
    for (f in meta.fields) {
      text += `get ${f}(){return this._getter('${f}')}\nset ${f}(v){this._setter('${f}',v)}\n`;
    }
  }
  else {
    for (f in meta.dimensions) {
      text += `get ${f}(){return this._getter('${f}')}\nset ${f}(v){this._setter('${f}',v)}\n`;
    }
    for (f in meta.resources) {
      text += `get ${f}(){return this._getter('${f}')}\nset ${f}(v){this._setter('${f}',v)}\n`;
    }
    for (f in meta.attributes) {
      text += `get ${f}(){return this._getter('${f}')}\nset ${f}(v){this._setter('${f}',v)}\n`;
    }
  }

  // табличные части по метаданным - устанавливаем геттер и сеттер для табличной части
  for (let ts in meta.tabular_sections) {
    text += `get ${ts}(){return this._getter_ts('${ts}')}\nset ${ts}(v){this._setter_ts('${ts}',v)}\n`;
  }

  text += `}\n`;
  text += `$p.${fn_name} = ${fn_name};\n`;


  // табличные части по метаданным
  for (let ts in meta.tabular_sections) {

    // создаём конструктор строки табчасти
    let row_fn_name = DataManager.prototype.obj_constructor.call({class_name: category + '.' + name, constructor_names: {}}, ts);

    text += `class ${row_fn_name} extends TabularSectionRow{\n`;

    // в прототипе строки табчасти создаём свойства в соответствии с полями табчасти
    for (var rf in meta.tabular_sections[ts].fields) {
      text += `get ${rf}(){return this._getter('${rf}')}\nset ${rf}(v){this._setter('${rf}',v)}\n`;
    }

    text += `}\n`;
    text += `$p.${row_fn_name} = ${row_fn_name};\n`;

  }

  return text;

}
