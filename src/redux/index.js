import {compose, createStore, applyMiddleware} from 'redux';
import rootReducer from './reducers';

// маршрутизация url
import createHistory from 'history/createBrowserHistory';
import {routerMiddleware} from 'react-router-redux';

// асинхронные действия
import thunk from 'redux-thunk';

// события pouchdb
import {metaMiddleware} from 'metadata-redux';

// Create a history of your choosing (we're using a browser history in this case)
export const history = createHistory();


export default function configureStore(preloadedState) {
  return createStore(
    rootReducer,
    preloadedState,
    compose(
      // add middleware for intercepting and dispatching async and navigation actions
      applyMiddleware(thunk, routerMiddleware(history), metaMiddleware($p)),

      /**
       * Conditionally add the Redux DevTools extension enhancer
       * if it is installed.
       */
      window.devToolsExtension ? window.devToolsExtension() : f => f,
    ),
  );
}
