// подгрузим стили асинхронно
import('metadata-react/styles/react-data-grid.css');


// конструктор metadata.js
import MetaEngine from 'metadata-core';
import plugin_pouchdb from 'metadata-pouchdb';
import plugin_ui from 'metadata-abstract-ui';
import plugin_ui_tabulars from 'metadata-abstract-ui/tabulars';
import plugin_react from 'metadata-react/plugin';

// функция установки параметров сеанса
import settings from '../../config/app.settings';

// скрипт инициализации метаданных
import meta_init from './init';

// скрипты модификаторов DataObj`s и DataManager`s
import modifiers from './modifiers';

// генератор события META_LOADED для redux
import {metaActions} from 'metadata-redux';

MetaEngine
  .plugin(plugin_pouchdb)     // подключаем pouchdb-адаптер к прототипу metadata.js
  .plugin(plugin_ui)          // подключаем общие методы интерфейса пользователя
  .plugin(plugin_ui_tabulars) // подключаем методы экспорта табличной части
  .plugin(plugin_react);      // подключаем react-специфичные модификаторы к scheme_settings

// создаём экземпляр MetaEngine
const $p = new MetaEngine();

// параметры сеанса и метаданные инициализируем без лишних проволочек
$p.wsql.init(settings, meta_init);

// подгружаем дополнительные стили
$p.utils.load_script('https://cdn.jsdelivr.net/fontawesome/4.7.0/css/font-awesome.min.css', 'link');
$p.utils.load_script('https://fonts.googleapis.com/css?family=Roboto', 'link');

// скрипт инициализации в привязке к store приложения
export function init(store) {

  return Promise.resolve()
    .then(() => {

      // выполняем модификаторы
      modifiers($p);

      // информируем хранилище о готовности MetaEngine
      store.dispatch(metaActions.META_LOADED($p));

      // читаем локальные данные в ОЗУ
      return $p.adapters.pouch.load_data();

    });
}

// экспортируем $p и PouchDB глобально
global.$p = $p;
global.PouchDB = MetaEngine.classes.PouchDB;

export default $p;
