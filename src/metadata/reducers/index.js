import {combineReducers} from 'redux';

import {metaReducer as meta, ifaceReducer} from 'metadata-redux';
import ifaceInitialState from './iface';

const reducer = combineReducers({
  meta,
  iface: ifaceReducer(ifaceInitialState),
});
export default reducer;
