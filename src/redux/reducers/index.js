import {combineReducers} from 'redux';
import {routerReducer as router} from 'react-router-redux';

import {metaReducer as meta, getIfaceReducer} from 'metadata-redux';
import ifaceInitialState from './iface';

const reducer = combineReducers({
  meta,
  iface: getIfaceReducer(ifaceInitialState),
  router,
});
export default reducer;
