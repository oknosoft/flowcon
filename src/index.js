// шрифты и стили подгрузим асинхронно
import('metadata-react/styles/react-data-grid.css');
import('font-awesome/css/font-awesome.min.css');
import('typeface-roboto');
import './styles/global.css';

import React, {Component} from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';

// метод инициализации хранилища состояния приложения
import configureStore, {history} from './redux';

// метод для вычисления need_meta, need_user для location.pathname
import {item_props} from './components/App/menu';

// заставка "загрузка занных"
import DumbScreen from './components/DumbScreen';

// корневыой контейнер приложения
import AppView from './components/App';

// подключаем google analitics
import Ga from './components/App/Ga';

// дополняем-переопределяем тему оформления
import theme from './styles/muiTheme';

// типовой RootView, в котором подключается Router и основной макет приложения
import RootView from 'metadata-react/App/RootView';

// создаём redux-store
const store = configureStore();

class RootProvider extends Component {

  componentDidMount() {
    // скрипт инициализации структуры метаданных и модификаторы
    setTimeout(() => {
      import('./metadata')
        .then((module) => module.init(store));
    }, 1000);
  }

  render() {
    return [
      <Ga key="helmet" id="UA-97463198-6" host="business-programming"/>,
      <Provider key="root" store={store}>
        <RootView
          history={history}
          item_props={item_props}
          theme={theme}
          DumbScreen={DumbScreen}
          AppView={AppView}
          ie11
          disableAutoLogin
        />
      </Provider>
    ];
  }
}

render(<RootProvider/>, document.getElementById('root'));
