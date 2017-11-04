import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Switch, Route} from 'react-router';

// сообщения в верхней части страницы (например, обновить после первого запуска)
import Snackbar from 'material-ui/Snackbar';
import Button from 'material-ui/Button';

// диалог сообщения пользователю
import Dialog, {DialogActions, DialogContent, DialogContentText, DialogTitle} from 'material-ui/Dialog';



// заставка "загрузка занных"
import DumbScreen from '../DumbScreen';

// вложенный маршрутизатор страниц с данными
import DataRoute from '../DataRoute';

// домашняя страница, в данном проекте - просто редирект на список заказов
import HomeView from '../../pages/Home';

// информация о программе
import AboutPage from '../../pages/About';

// 404
import NotFoundPage from '../NotFoundPage';

// дерево метаданных
import MetaTreePage from '../MetaTreePage';

// логин и свойства подключения
import FrmLogin from 'metadata-react/FrmLogin';

import Settings from '../Settings';

import {withNavigateAndMeta} from 'metadata-redux/with.min';

class AppRoot extends Component {

  constructor(props, context) {
    super(props, context);
    this.handleAlertClose = this.handleDialogClose.bind(this, 'alert');
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

  shouldComponentUpdate(props) {
    const {user, data_empty, couch_direct, offline, path_log_in} = props;
    let res = true;

    // если есть сохранённый пароль и online, пытаемся авторизоваться
    if(!user.logged_in && user.has_login && !user.try_log_in && !offline) {
      props.handleLogin();
      res = false;
    }

    // если это первый запуск или couch_direct и offline, переходим на страницу login
    if(!path_log_in && ((data_empty === true && !user.try_log_in && !user.logged_in) || (couch_direct && offline))) {
      props.handleNavigate('/login');
      res = false;
    }

    return res;
  }

  handleReset = () => {
    const {handleNavigate, first_run} = this.props;
    if(first_run) {
      $p.eve && ($p.eve.redirect = true);
      location.replace('/');
    }
    else {
      handleNavigate('/');
    }
  }

  handleDialogClose(name) {
    this.props.handleIfaceState({component: '', name, value: {open: false}});
  }


  render() {
    const {props} = this;
    const {snack, alert, doc_ram_loaded} = props;

    return (
      <div>

        {
          (!props.path_log_in && !props.complete_loaded) ?
            <DumbScreen
              title={doc_ram_loaded ? 'Подготовка данных в памяти...' : 'Загрузка из IndexedDB...'}
              page={{text: doc_ram_loaded ? 'Цены и характеристики...' : 'Почти готово...'}}
              top={92}/>
            :
            <Switch>
              <Route exact path="/" render={(routeProps) => <HomeView handleNavigate={props.handleNavigate} {...routeProps} />}/>
              <Route path="/:area(doc|cat|ireg|cch|rep).:name" component={DataRoute}/>
              <Route path="/about" render={(routeProps) => <AboutPage {...props} {...routeProps} />}/>
              <Route path="/meta" component={MetaTreePage}/>
              <Route path="/login" component={FrmLogin}/>
              <Route path="/settings" component={Settings} />
              <Route component={NotFoundPage}/>
            </Switch>
        }

        {((snack && snack.open) || (props.first_run && doc_ram_loaded)) && <Snackbar
          anchorOrigin={{vertical: 'top', horizontal: 'center'}}
          open
          message={snack && snack.open ? snack.message : 'Требуется перезагрузить страницу после первой синхронизации данных'}
          action={<Button
            color="accent"
            onClick={snack && snack.open ? this.handleDialogClose.bind(this, 'snack') : this.handleReset}
          >Выполнить</Button>}
        />}

        {
          alert && alert.open && <Dialog open onRequestClose={this.handleAlertClose}>
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
        }

      </div>
    );
  }
}

AppRoot.propTypes = {
  handleOffline: PropTypes.func.isRequired,
  handleNavigate: PropTypes.func.isRequired,
  handleIfaceState: PropTypes.func.isRequired,
  first_run: PropTypes.bool.isRequired,
};

export default withNavigateAndMeta(AppRoot);

