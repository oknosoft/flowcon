// шрифты и стили подгрузим асинхронно
import('metadata-react/styles/react-data-grid.css');
import('font-awesome/css/font-awesome.min.css');

import React, {Component} from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';

// скрипт инициализации структуры метаданных и модификаторы
import {init} from './metadata';

// метод инициализации хранилища состояния приложения
import configureStore, {history} from './redux';

// метод для вычисления need_meta, need_user для location.pathname
import {item_props} from './pages';

// заставка "загрузка занных"
import DumbScreen from './components/DumbScreen';

// корневыой контейнер приложения
import AppView from './components/App';

// дополняем-переопределяем тему оформления
import theme from './styles/muiTheme';

// типовой RootView, в котором подключается Router и основной макет приложения
import RootView from 'metadata-react/App/RootView';

// создаём redux-store
const store = configureStore();


class RootProvider extends Component {

  componentWillMount() {
    init(store.dispatch).catch($p && $p.record_log);
  }

  render() {
    return <Provider store={store}>
      <RootView
        history={history}
        item_props={item_props}
        theme={theme}
        DumbScreen={DumbScreen}
        AppView={AppView}
      />
    </Provider>;
  }
}

render(
  <RootProvider/>,
  document.getElementById('root'),
);
