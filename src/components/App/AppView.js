/* eslint-disable flowtype/require-valid-file-annotation */

import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import Tooltip from 'material-ui/Tooltip';
import MenuIcon from 'material-ui-icons/Menu';
import {Switch, Route} from 'react-router';

import Github from '../../styles/icons/GitHub';
import AppDrawer from 'metadata-react/App/AppDrawer';

// заставка "загрузка занных"
import DumbScreen from '../DumbScreen';

// вложенный маршрутизатор страниц с данными
import DataRoute from '../DataRoute';

import HomeView from '../../pages/Home';      // домашняя страница
import AboutPage from '../../pages/About';    // информация о программе
import Readme from '../../pages/Readme';      // вводный текст
import NotFound from '../../pages/NotFound';  // 404

import items from '../../pages';  // 404

import FakeDiagram from '../FakeDiagram';

import FakeList from '../FakeList';

// дерево метаданных
import MetaTreePage from '../MetaTreePage';

// логин и свойства подключения
import FrmLogin from 'metadata-react/FrmSuperLogin';

import Settings from '../Settings';

import {withNavigateAndMeta} from 'metadata-redux';

const styles = theme => ({
  '@global': {
    html: {
      background: theme.palette.background.default,
      WebkitFontSmoothing: 'antialiased', // Antialiasing.
      MozOsxFontSmoothing: 'grayscale', // Antialiasing.
      boxSizing: 'border-box',
    },
    '*, *:before, *:after': {
      boxSizing: 'inherit',
    },
    body: {
      margin: 0,
    },
    '#nprogress': {
      pointerEvents: 'none',
      '& .bar': {
        position: 'fixed',
        background:
          theme.palette.type === 'light' ? theme.palette.common.black : theme.palette.common.white,
        borderRadius: 1,
        zIndex: theme.zIndex.tooltip,
        top: 0,
        left: 0,
        width: '100%',
        height: 2,
      },
      '& dd, & dt': {
        position: 'absolute',
        top: 0,
        height: 2,
        boxShadow: `${theme.palette.type === 'light'
          ? theme.palette.common.black
          : theme.palette.common.white} 1px 0 6px 1px`,
        borderRadius: '100%',
        animation: 'nprogress-pulse 2s ease-out 0s infinite',
      },
      '& dd': {
        opacity: 0.6,
        width: 20,
        right: 0,
        clip: 'rect(-6px,22px,14px,10px)',
      },
      '& dt': {
        opacity: 0.6,
        width: 180,
        right: -80,
        clip: 'rect(-6px,90px,14px,-6px)',
      },
    },
    '@keyframes nprogress-pulse': {
      '30%': {
        opacity: 0.6,
      },
      '60%': {
        opacity: 0,
      },
      to: {
        opacity: 0.6,
      },
    },
  },
  root: {
    //display: 'flex',
    alignItems: 'stretch',
    minHeight: '100vh',
    width: '100%',
  },
  grow: {
    flex: '1 1 auto',
  },
  title: {
    marginLeft: 24,
    flex: '0 1 auto',
  },
  appBar: {
    transition: theme.transitions.create('width'),
  },
  appBarHome: {
    boxShadow: 'none',
  },
  appBarShift: {
    [theme.breakpoints.up('lg')]: {
      width: 'calc(100% - 280px)',
    },
  },
  drawer: {
    [theme.breakpoints.up('lg')]: {
      width: 280,
    },
  },
  navIconHide: {
    [theme.breakpoints.up('lg')]: {
      display: 'none',
    },
  },
});

class AppView extends React.Component<any, any> {

  state = {
    mobileOpen: false,
  };

  handleDrawerToggle = () => {
    this.setState({mobileOpen: !this.state.mobileOpen});
  };

  render() {
    const {props} = this;
    const {classes, handleNavigate, location} = props;
    const title = 'title';
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

    return (
      <div className={classes.root}>
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
                {title}
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
        />

        <Switch>
          <Route exact path="/" render={(routeProps) => {
            const {root, hero, content, text, headline, button, logo} = classes;
            return <HomeView classes={{root, hero, content, text, headline, button, logo}} handleNavigate={handleNavigate} {...routeProps} />;
          }}/>
          <Route path="/:area(doc|cat|ireg|cch|rep).:name" component={DataRoute}/>
          <Route path="/about" render={(routeProps) => <AboutPage {...props} {...routeProps} />}/>
          <Route path="/diagram" render={(routeProps) => <FakeDiagram {...props} {...routeProps} />}/>
          <Route path="/list" render={(routeProps) => <FakeList {...props} {...routeProps} />}/>
          <Route path="/readme" render={(routeProps) => <Readme {...props} {...routeProps} />}/>
          <Route path="/login" render={(routeProps) => <FrmLogin {...props} {...routeProps} />}/>
          <Route path="/settings" component={Settings}/>
          <Route component={NotFound}/>
        </Switch>

      </div>
    );
  }
}

AppView.propTypes = {
  classes: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

export default withStyles(styles, {name: 'AppView'})(withNavigateAndMeta(AppView));
