
// конструктор metadata.js
// import MetaEngine from 'metadata-core/index.min';
// import plugin_pouchdb from 'metadata-pouchdb/index.min';
// import plugin_ui from 'metadata-abstract-ui/index.min';
// import plugin_ui_tabulars from 'metadata-abstract-ui/tabulars.min';
// import plugin_superlogin from 'metadata-superlogin/index.min';

import MetaEngine from 'metadata-core';
import plugin_pouchdb from 'metadata-pouchdb';
import plugin_ui from 'metadata-abstract-ui';
import plugin_ui_tabulars from 'metadata-abstract-ui/tabulars';
import plugin_superlogin from 'metadata-superlogin';

import plugin_react from 'metadata-react/plugin';

// настройки суперлогина
import superlogin_config from '../../config/superlogin.config.client';

// функция установки параметров сеанса
import settings from '../../config/app.settings';

// читаем скрипт инициализации метаданных, полученный в результате выполнения meta:prebuild
import {meta_init} from './init';
import modifiers from './modifiers';
import docs from './ram';

// генераторы действий и middleware для redux
//import {combineReducers} from 'redux';
import {addMiddleware} from 'redux-dynamic-middlewares';
import {metaActions, metaMiddleware} from 'metadata-redux';

// индексеры статей и задач
import issue_indexer from './documents/doc_issue_indexer';

MetaEngine
  .plugin(plugin_pouchdb)     // подключаем pouchdb-адаптер к прототипу metadata.js
  .plugin(plugin_ui)          // подключаем общие методы интерфейса пользователя
  .plugin(plugin_ui_tabulars) // подключаем методы экспорта табличной части
  .plugin(plugin_react)       // подключаем react-специфичные модификаторы к scheme_settings
  .plugin(plugin_superlogin(superlogin_config));  // подключаем авторизацию через социальные сети

// создаём экземпляр MetaEngine и экспортируем его глобально
const $p = global.$p = new MetaEngine();

// параметры сеанса инициализируем сразу
$p.wsql.init(settings);

// со скрипом инициализации метаданных, так же - не затягиваем
meta_init($p);
// смещаем настройки компоновки в ram
$p.cat.scheme_settings.metadata().cachable = 'ram';

// скрипт инициализации в привязке к store приложения
export function init(store) {

  try {

    const {dispatch} = store;

    // подключаем metaMiddleware
    addMiddleware(metaMiddleware($p));

    // сообщяем адаптерам пути, суффиксы и префиксы
    const {wsql, job_prm, adapters: {pouch}} = $p;
    if(wsql.get_user_param('couch_path') !== job_prm.couch_local && process.env.NODE_ENV !== 'development') {
      wsql.set_user_param('couch_path', job_prm.couch_local);
    }
    pouch.init(wsql, job_prm);

    // выполняем модификаторы
    modifiers($p);

    // информируем хранилище о готовности MetaEngine
    dispatch(metaActions.META_LOADED($p));

    // читаем локальные данные в ОЗУ
    pouch.load_changes({docs});
    pouch.call_data_loaded({
      total_rows: docs.length,
      docs_written: docs.length,
      page: 1,
      limit: 300,
      start: Date.now(),
    });

    pouch.on('on_log_in', () => {
      return issue_indexer();
    });

    pouch.on('user_log_out', () => {
      return null;
    });

  }
  catch (err) {
    $p && $p.record_log(err);
  }
}

export default $p;
