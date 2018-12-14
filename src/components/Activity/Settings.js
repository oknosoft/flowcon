/**
 * Меню управления активностями
 *
 * @module Settings
 *
 * Created by Evgeniy Malyarov on 14.12.2018.
 */

import React from 'react';
import PropTypes from 'prop-types';

import IconButton from '@material-ui/core/IconButton';
import IconSettings from '@material-ui/icons/Settings';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

class Settings extends React.Component {

  state = {anchorEl: null};

  handleOpen = event => {
    this.setState({anchorEl: event.currentTarget});
  };

  handleClose = () => {
    this.setState({anchorEl: null});
  };

  render() {
    const {props: {navigate, grouping, handleGrouping}, state: {anchorEl}} = this;
    return [
      <IconButton
        key="button"
        onClick={this.handleOpen}
        title="Настройка состава активностей"
      >
        <IconSettings />
      </IconButton>,
      <Menu
        key="menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={this.handleClose}
      >
        <MenuItem
          onClick={(e) => navigate(e, `/cat.activity/list`)}
        >
          Виды активностей
        </MenuItem>
        <MenuItem
          onClick={(e) => navigate(e, `/doc.activity/list`)}
        >
          События активности
        </MenuItem>
        <MenuItem
          onClick={() => {
            this.handleClose();
            handleGrouping();
          }}
        >
          {grouping ? 'Плоский список' : 'Группировка по потокам'}
        </MenuItem>
      </Menu>,
    ];
  }

}

Settings.propTypes = {
  navigate: PropTypes.func.isRequired,
  grouping: PropTypes.bool.isRequired,
  handleGrouping: PropTypes.func.isRequired,
};

export default Settings;
