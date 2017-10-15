import React, {Component} from 'react';

import {ConnectedRouter as Router} from 'react-router-redux';
import {Route} from 'react-router';

// статусы "загружено и т.д." в ствойствах компонента
import {withMeta} from 'metadata-redux/with.min';

import {item_props} from '../../pages/menu_items';

// заставка "загрузка занных"
import DumbScreen from '../DumbScreen';

// корневые контейнеры
//import AppView from './AppView';
import AppView from './AppFrame';

import browser_compatible from 'metadata-react/BrowserCompatibility/browser_compatible';
import BrowserCompatibility from 'metadata-react/BrowserCompatibility';

// тема для material-ui
import {MuiThemeProvider} from 'material-ui/styles';
import theme from '../../styles/muiTheme';

class RootView extends Component {

  constructor(props) {
    super(props);
    const iprops = item_props(location.pathname);
    this.state = {
      need_meta: !!iprops.need_meta,
      need_user: !!iprops.need_user,
      browser_compatible: browser_compatible() || true,
    };
  }

  shouldComponentUpdate(props, state) {
    const {user, data_empty, couch_direct, offline, history} = props;
    const {need_user, need_meta} = state;
    const iprops = item_props(location.pathname);

    let res = true;

    if(need_user != iprops.need_user) {
      this.setState({need_user: iprops.need_user});
      res = false;
    }

    if(need_meta != iprops.need_meta) {
      this.setState({need_meta: iprops.need_meta});
      res = false;
    }

    // если есть сохранённый пароль и online, пытаемся авторизоваться
    if(!user.logged_in && user.has_login && !user.try_log_in && !offline) {
      props.handleLogin();
      res = false;
    }

    // если это первый запуск или couch_direct и offline, переходим на страницу login
    if(!need_user && ((data_empty === true && !user.try_log_in) || (couch_direct && offline))) {
      history.push('/login');
      res = false;
    }

    return res;
  }

  render() {

    const {props, state} = this;
    const {meta_loaded, data_empty, data_loaded, history} = props;
    const show_dumb = state.need_meta && (
      !meta_loaded ||
      (data_empty === undefined) ||
      (data_empty === false && !data_loaded)
    );

    return <MuiThemeProvider theme={theme}>
      {
        state.browser_compatible ?
          (show_dumb ?
            <DumbScreen {...props} />
            :
            <Router history={history}>
              <Route component={AppView}/>
            </Router>)
          :
          (<BrowserCompatibility/>)
      }
    </MuiThemeProvider>;

  }
}

export default withMeta(RootView);
