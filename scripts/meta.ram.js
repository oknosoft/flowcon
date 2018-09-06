/**
 * ### Модуль сборки *.js по описанию метаданных
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2018
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
  .plugin(require('metadata-pouchdb'));

const {DBUSER, DBPWD} = process.env;
const db = new MetaEngine.classes.PouchDB(config.couch_local + config.zone + '_ram', {skip_setup: true});
const slu = new MetaEngine.classes.PouchDB(config.couch_local.replace('fl_', 'sl_users'), {
  auth: {
    username: DBUSER,
    password: DBPWD
  },
  skip_setup: true});

debug(`Читаем данные из CouchDB ${config.couch_local}`);
return db.info()
  .then((info) => {
    debug(`Подключение к ${info.host}`);
    return db.allDocs({include_docs: true, attachments: true});
  })
  .catch((err) => {
    debug('Не удалось получить объект meta из CouchDB\nПроверьте логин, пароль и строку подключения');
    debug(err);
    process.exit(1);
  })
  .then(({rows}) => {
    let jstext = '/* eslint-disable */\nmodule.exports = ['; // в этой переменной будем накапливать текст модуля
    for(const {doc} of rows) {
      if(doc._id[0] === '_' || doc._id.startsWith('cat.contact_information_kinds') || doc._id.startsWith('doc.issue')) {
        continue;
      }
      delete doc.timestamp;
      delete doc._rev;
      if(doc.hasOwnProperty('predefined_name') && !doc.predefined_name) {
        delete doc.predefined_name;
      }
      jstext += JSON.stringify(doc) + ',\n';
    }

    return slu.query('doc/dbs',{include_docs: true})
      .then(({rows}) => {
        for(const {doc} of rows) {
          const user = {
            _id: `cat.users|${doc.profile.ref}`,
            id: doc._id,
            name: doc.profile.name,
            email_addr: doc.email,
            subscription: doc.profile.subscription || false,
          }
          jstext += JSON.stringify(user) + ',\n';
        }
      })
      .then(() => {
        jstext += '];';
        debug('Записываем результат');
        const fname = path.resolve(__dirname, '../src/metadata/ram.js');
        fs.writeFile(fname, jstext, 'utf8', (err) => {
          if (err) {
            debug(err);
            process.exit(1);
          } else {
            debug(`Успешно записан > ${fname}`);
            process.exit(0);
          }
        });
      });
  })
  .catch((err) => {
    debug(err);
    process.exit(1);
  });
