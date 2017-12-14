import {combineReducers} from 'redux';
import {routerReducer as router} from 'react-router-redux';

import {metaReducer as meta, ifaceReducer} from 'metadata-redux';
import ifaceInitialState from './iface';

const reducer = combineReducers({
  meta,
  iface: ifaceReducer(ifaceInitialState),
  router,
});
export default reducer;
