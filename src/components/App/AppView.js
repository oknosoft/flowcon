/* eslint-disable flowtype/require-valid-file-annotation */

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Typography from 'material-ui/Typography';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import Tooltip from 'material-ui/Tooltip';
import MenuIcon from 'material-ui-icons/Menu';
import {Switch, Route} from 'react-router';
import {withIfaceAndMeta} from 'metadata-redux';
import Button from 'material-ui/Button';
import Snackbar from 'material-ui/Snackbar';        // сообщения в верхней части страницы (например, обновить после первого запуска)
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from 'material-ui/Dialog';                        // диалог сообщения пользователю

import items from '../../pages';                    // массив элементов меню
import DumbScreen from '../DumbScreen';             // заставка "загрузка занных"
import DataRoute from '../DataRoute';               // вложенный маршрутизатор страниц с данными
import MarkdownRoute from '../MarkdownRoute';       // вложенный маршрутизатор страниц с Markdown, 404 живёт внутри Route
import HomeView from '../../pages/Home';            // домашняя страница
import MetaTreePage from '../MetaTreePage';         // дерево метаданных
import FrmLogin from 'metadata-react/FrmSuperLogin';// логин и свойства подключения
import Settings from '../Settings';                 // страница настроек приложения
import {item_props} from '../../pages';             // метод для вычисления need_meta, need_user для location.pathname

import FakeDiagram from '../FakeDiagram';
import FakeList from '../FakeList';

import Github from '../../styles/icons/GitHub';
import AppDrawer from 'metadata-react/App/AppDrawer';

import withStyles from './styles';

// основной layout
class AppView extends Component {

  constructor(props, context) {
    super(props, context);
    this.handleAlertClose = this.handleDialogClose.bind(this, 'alert');
    const iprops = item_props();
    this.state = {
      need_meta: !!iprops.need_meta,
      need_user: !!iprops.need_user,
      mobileOpen: false,
    };
  }

  componentDidMount() {
    const {handleOffline} = this.props;
    this._online = handleOffline.bind(this, false);
    this._offline = handleOffline.bind(this, true);
    window.addEventListener('online', this._online, false);
    window.addEventListener('offline', this._offline, false);
  }

  componentWillUnmount() {
    window.removeEventListener('online', this._online);
    window.removeEventListener('offline', this._offline);
  }

  shouldComponentUpdate(props, {need_user, need_meta}) {
    const {meta_loaded, user, data_empty, couch_direct, offline} = props;
    const iprops = item_props();
    let res = true;

    if(need_user != !!iprops.need_user) {
      this.setState({need_user: !!iprops.need_user});
      res = false;
    }

    if(need_meta != !!iprops.need_meta) {
      this.setState({need_meta: !!iprops.need_meta});
      res = false;
    }

    // если есть сохранённый пароль и online, пытаемся авторизоваться
    if(meta_loaded && !user.logged_in && user.has_login && !user.try_log_in && !offline) {
      props.handleLogin();
      res = false;
    }

    // если это первый запуск или couch_direct и offline, переходим на страницу login
    if(meta_loaded && res && need_user && ((data_empty === true && !user.try_log_in && !user.logged_in) || (couch_direct && offline))) {
      props.handleNavigate('/login');
      res = false;
    }

    return res;
  }

  handleDrawerToggle = () => {
    this.setState({mobileOpen: !this.state.mobileOpen});
  };

  renderHome = (routeProps) => {
    const {classes, handleNavigate} = this.props;
    const {root, hero, content, text, headline, button, logo} = classes;
    return <HomeView
      classes={{root, hero, content, text, headline, button, logo}}
      handleNavigate={handleNavigate}
      {...routeProps}
    />;
  };


  handleReset = () => {
    const {handleNavigate, first_run} = this.props;
    if(first_run) {
      $p.eve && ($p.eve.redirect = true);
      location.replace('/');
    }
    else {
      handleNavigate('/');
    }
  };

  handleDialogClose(name) {
    this.props.handleIfaceState({component: '', name, value: {open: false}});
  }

  render() {
    const {props} = this;
    const {classes, handleNavigate, location, snack, alert, doc_ram_loaded, title} = props;
    const isHome = location.pathname === '/';

    let disablePermanent = false;
    let navIconClassName = '';
    let appBarClassName = classes.appBar;

    if(isHome) {
      // home route, don't shift app bar or dock drawer
      disablePermanent = true;
      appBarClassName += ` ${classes.appBarHome}`;
    }
    else {
      navIconClassName = classes.navIconHide;
      appBarClassName += ` ${classes.appBarShift}`;
    }

    return [
      // основной layout
      <div key="content" className={classes.root}>
        <AppBar className={appBarClassName}>
          <Toolbar>
            <IconButton
              color="contrast"
              aria-label="open drawer"
              onClick={this.handleDrawerToggle}
              className={navIconClassName}
            >
              <MenuIcon/>
            </IconButton>
            {title !== null && (
              <Typography className={classes.title} type="title" color="inherit" noWrap>
                {title || 'Flowcon'}
              </Typography>
            )}
            <div className={classes.grow}/>

            <IconButton
              component="a"
              title="GitHub"
              color="contrast"
              href="https://github.com/oknosoft/flowcon"
            >
              <Github/>
            </IconButton>
          </Toolbar>
        </AppBar>
        <AppDrawer
          className={classes.drawer}
          disablePermanent={disablePermanent}
          onRequestClose={this.handleDrawerToggle}
          mobileOpen={this.state.mobileOpen}
          handleNavigate={handleNavigate}
          items={items}
          isHome={isHome}
          title="Flowcon"
        />
        <Switch>
          <Route exact path="/" render={this.renderHome}/>
          <Route path="/:area(doc|cat|ireg|cch|rep).:name" component={DataRoute}/>
          <Route path="/diagram" render={(routeProps) => <FakeDiagram {...props} {...routeProps} />}/>
          <Route path="/list" render={(routeProps) => <FakeList {...props} {...routeProps} />}/>
          <Route path="/login" render={(routeProps) => <FrmLogin {...props} {...routeProps} />}/>
          <Route path="/settings" component={Settings}/>
          <Route component={MarkdownRoute}/>
        </Switch>
      </div>,

      // всплывающтй snackbar оповещений пользователя
      ((snack && snack.open) || (props.first_run && doc_ram_loaded)) && <Snackbar
        key="snack"
        anchorOrigin={{vertical: 'top', horizontal: 'center'}}
        open
        message={snack && snack.open ? snack.message : 'Требуется перезагрузить страницу после первой синхронизации данных'}
        action={<Button
          color="accent"
          onClick={snack && snack.open ? this.handleDialogClose.bind(this, 'snack') : this.handleReset}
        >Выполнить</Button>}
      />,

      // диалог сообщений пользователю
      alert && alert.open && <Dialog key="alert" open onRequestClose={this.handleAlertClose}>
        <DialogTitle>
          {alert.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {alert.text}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleAlertClose} color="primary">
            Ок
          </Button>
        </DialogActions>
      </Dialog>
    ];
  }
}

AppView.propTypes = {
  handleOffline: PropTypes.func.isRequired,
  handleNavigate: PropTypes.func.isRequired,
  handleIfaceState: PropTypes.func.isRequired,
  first_run: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

export default withStyles(withIfaceAndMeta(AppView));
