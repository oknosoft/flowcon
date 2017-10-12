import React from 'react';
import PropTypes from 'prop-types';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import List from 'material-ui/List';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import Hidden from 'material-ui/Hidden';
import Divider from 'material-ui/Divider';
import MenuIcon from 'material-ui-icons/Menu';

import withStyles from '../../styles/app';

import items from '../../pages/menu_items'; // массив элементов меню
import HeaderButtons from './HeaderButtons';
import NavList from './NavList';

class ResponsiveDrawer extends React.Component {
  state = {
    mobileOpen: false,
  };

  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };

  render() {
    const { classes, theme, title, handleNavigate, ...other } = this.props;

    const navlist = (
      <div>
        <div className={classes.drawerHeader} >
          Заголовок
        </div>
        <Divider />
        <NavList items={items} handleClose={this.handleDrawerToggle} handleNavigate={handleNavigate}/>
      </div>
    );

    const drawer = <Drawer
      type="temporary"
      anchor={theme.direction === 'rtl' ? 'right' : 'left'}
      open={this.state.mobileOpen}
      classes={{
        paper: classes.drawerPaper,
      }}
      onRequestClose={this.handleDrawerToggle}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
    >
      {navlist}
    </Drawer>;

    return (
      <div>
        <AppBar className={classes.appBar} position="absolute">
          <Toolbar>
            <IconButton
              color="contrast"
              aria-label="open drawer"
              onClick={this.handleDrawerToggle}
              className={classes.navIconHide}
            >
              <MenuIcon />
            </IconButton>
            <Typography type="title" color="inherit" noWrap>{title}</Typography>
            <HeaderButtons {...other} handleNavigate={handleNavigate} />
          </Toolbar>
        </AppBar>

        <Hidden mdUp>
          {drawer}
        </Hidden>

        <Hidden mdDown implementation="css">
          <Drawer
            type="permanent"
            open
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            {navlist}
          </Drawer>
        </Hidden>

      </div>
    );
  }
}

ResponsiveDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(ResponsiveDrawer);
