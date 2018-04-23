
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

// функция установки параметров сеанса
import settings from '../../config/app.settings';

// генератор события META_LOADED для redux
import {metaActions} from 'metadata-redux';

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

// скрипт инициализации в привязке к store приложения
export function init(dispatch) {

  // читаем скрипт инициализации метаданных, полученный в результате выполнения meta:prebuild
  return import('./init')
    .then((meta_init) => {

      // выполняем скрипт инициализации метаданных
      meta_init($p);

      // сообщяем адаптерам пути, суффиксы и префиксы
      const {wsql, job_prm, adapters} = $p;
      adapters.pouch.init(wsql, job_prm);

      // шрифт Roboto грузим асинхронно
      $p.utils.load_script('https://fonts.googleapis.com/css?family=Roboto:300,400,500', 'link');

      // читаем скрипты модификаторов DataObj`s и DataManager`s
      return import('./modifiers');
    })
    .then((modifiers) => {

      // выполняем модификаторы
      modifiers.default($p);

      // информируем хранилище о готовности MetaEngine
      dispatch(metaActions.META_LOADED($p));

      // читаем локальные данные в ОЗУ
      return $p.adapters.pouch.load_data();
    })
    .catch($p && $p.record_log);
}

// экспортируем $p и PouchDB глобально
global.$p = $p;

export default $p;
