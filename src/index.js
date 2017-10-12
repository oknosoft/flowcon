import React, {Component} from "react";
import {render} from 'react-dom';

// скрипт инициализации структуры метаданных и модификаторы
import {init} from './metadata';

import {Provider} from 'react-redux';
import configureStore, {history} from './redux';
import RootView from './components/App/RootView';

const store = configureStore();

class RootProvider extends Component {

  componentWillMount() {
    init(store)
      .catch(() => {
        //console.log(err)
    });
  }

  render() {
    return <Provider store={store}>
      <RootView history={history} />
    </Provider>;
  }
}

// TODO: перенести загрузку библиотек из jsdelivr сюда
render(
  <RootProvider />,
  document.getElementById('root'),
);
