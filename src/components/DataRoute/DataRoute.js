import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Switch, Route} from 'react-router';

import {withObj} from 'metadata-redux';
import DataList from 'metadata-react/DataList';
import DataObj from 'metadata-react/FrmObj';
import FrmReport from 'metadata-react/FrmReport';

//import MetaObjPage from '../../components/MetaObjPage';
import NotFound from '../NotFound';

class DataRoute extends Component {

  static propTypes = {
    match: PropTypes.object.isRequired,
    windowHeight: PropTypes.number.isRequired,
    windowWidth: PropTypes.number.isRequired,
    disablePermanent: PropTypes.bool,
    handlers: PropTypes.object.isRequired,
  };

  static childContextTypes = {
    components: PropTypes.object,
  };

  render() {
    const {match, handlers, windowHeight, windowWidth, disablePermanent} = this.props;
    const {area, name} = match.params;
    const _mgr = $p[area][name];

    if(!_mgr) {
      return <NotFound/>;
    }

    // если нет текущего пользователя, переходим на страницу login
    if(!$p.current_user) {
      handlers.handleNavigate('/login');
      return false;
    }

    const _acl = $p.current_user.get_acl(_mgr.class_name);

    const dx = (windowWidth > 1280 && !disablePermanent) ? 280 : 0;

    const sizes = {
      height: windowHeight > 480 ? windowHeight - 52 : 428,
      width: windowWidth > 800 ? windowWidth - (windowHeight < 480 ? 20 : dx) : 800
    };

    const wraper = (Component, props, type) => {
      if(type === 'obj' && _mgr.FrmObj) {
        Component = _mgr.FrmObj;
      }
      else if(type === 'list' && _mgr.FrmList) {
        Component = _mgr.FrmList;
      }
      return <Component _mgr={_mgr} _acl={_acl} handlers={handlers} {...props} {...sizes} />;
    };

    if(match.params.area === 'rep') {
      const Component = _mgr.FrmObj || FrmReport;
      return <Component _mgr={_mgr} _acl={_acl} match={match} {...sizes} />;
    }

    return <Switch>
      <Route path={`${match.url}/:ref([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})`} render={(props) => wraper(DataObj, props, 'obj')}/>
      <Route path={`${match.url}/list`} render={(props) => wraper(DataList, props, 'list')}/>
      {/**<Route path={`${match.url}/meta`} render={(props) => wraper(MetaObjPage, props)} />**/}
      <Route component={NotFound}/>
    </Switch>;
  }

  getChildContext() {
    return {components: {DataObj, DataList}};
  }
}

export default withObj(DataRoute);




