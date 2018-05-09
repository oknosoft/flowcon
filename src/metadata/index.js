
// конструктор metadata.js
import MetaEngine from 'metadata-core/index.min';
import plugin_pouchdb from 'metadata-pouchdb/index.min';
import plugin_ui from 'metadata-abstract-ui/index.min';
import plugin_ui_tabulars from 'metadata-abstract-ui/tabulars.min';
import plugin_superlogin from 'metadata-superlogin/index.min';

// import MetaEngine from 'metadata-core';
// import plugin_pouchdb from 'metadata-pouchdb';
// import plugin_ui from 'metadata-abstract-ui';
// import plugin_ui_tabulars from 'metadata-abstract-ui/tabulars';
// import plugin_superlogin from 'metadata-superlogin';

import plugin_react from 'metadata-react/plugin';

// настройки суперлогина
import superlogin_config from '../../config/superlogin.config.client';

// генератор события META_LOADED для redux
import {metaActions} from 'metadata-redux';

// функция установки параметров сеанса
import settings from '../../config/app.settings';

// читаем скрипт инициализации метаданных, полученный в результате выполнения meta:prebuild
import {meta_init} from './init';
import modifiers from './modifiers';
import docs from './ram';


MetaEngine
  .plugin(plugin_pouchdb)     // подключаем pouchdb-адаптер к прототипу metadata.js
  .plugin(plugin_ui)          // подключаем общие методы интерфейса пользователя
  .plugin(plugin_ui_tabulars) // подключаем методы экспорта табличной части
  .plugin(plugin_react)       // подключаем react-специфичные модификаторы к scheme_settings
  .plugin(plugin_superlogin(superlogin_config));  // подключаем авторизацию через социальные сети

// создаём экземпляр MetaEngine
const $p = new MetaEngine();

// параметры сеанса инициализируем сразу
$p.wsql.init(settings);

if($p.wsql.get_user_param('couch_path') !== $p.job_prm.couch_local && process.env.NODE_ENV !== 'development') {
  $p.wsql.set_user_param('couch_path', $p.job_prm.couch_local);
}

// скрипт инициализации в привязке к store приложения
export function init(dispatch) {


  // шрифт Roboto грузим асинхронно
  $p.utils.load_script('https://fonts.googleapis.com/css?family=Roboto:300,400,500', 'link');

  try {
    // выполняем скрипт инициализации метаданных
    meta_init($p);

    // сообщяем адаптерам пути, суффиксы и префиксы
    const {wsql, job_prm, adapters: {pouch}} = $p;
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

    // при наличии сохраненной сессии - подключаемся
    setTimeout(() => {
      const session = $p.superlogin.getSession();
      if(session && navigator.onLine) {
        dispatch(metaActions.USER_TRY_LOG_IN(pouch, session.user_id));
      }
    }, 100);
  }
  catch (err) {
    $p && $p.record_log(err);
  }
}

// экспортируем $p и PouchDB глобально
global.$p = $p;

export default $p;
