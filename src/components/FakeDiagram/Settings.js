/**
 * Настройки диаграмм
 *
 * @module Settings
 *
 * Created by Evgeniy Malyarov on 23.08.2018.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloudQueue from '@material-ui/icons/LineStyle';
import Popper from '@material-ui/core/Popper';
import Paper from '@material-ui/core/Paper';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Switch from '@material-ui/core/Switch';

import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import Grid1 from './grid1';
import Grid2 from './grid2';
import Grid3 from './grid3';
import Grid12 from './grid12';
import Grid13 from './grid13';
import Grid123 from './grid123';

import {withIface} from 'metadata-redux';

class Settings extends React.Component {

  state = {open: false}

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  setLayout(mode) {
    this.handleClose()
    this.props.handleNavigate(`${location.pathname}?grid=${mode}`);
  }

  render() {
    return <div>
      <IconButton

        title="Настройка диаграмм"
        buttonRef={node => {
          this.anchorEl = node;
        }}
        onClick={this.handleOpen}
      >
        <CloudQueue color="inherit"/>
      </IconButton>
      <Popper
        open={this.state.open}
        anchorEl={this.anchorEl}
        placement="bottom-end"
        modifiers={{
          flip: {
            enabled: false,
          }
        }}
      >
        <Paper>
          <DialogTitle>Расположение диаграмм</DialogTitle>
          <DialogContent>
            <MenuList>
              <MenuItem onClick={() => this.setLayout(1)}>
                <ListItemIcon>
                  <Grid1 />
                </ListItemIcon>
                <ListItemText inset primary="Одна колонка" />
              </MenuItem>
              <MenuItem onClick={() => this.setLayout(2)}>
                <ListItemIcon>
                  <Grid2 />
                </ListItemIcon>
                <ListItemText inset primary="Две колонки" />
              </MenuItem>
              <MenuItem onClick={() => this.setLayout(3)}>
                <ListItemIcon>
                  <Grid3 />
                </ListItemIcon>
                <ListItemText inset primary="Три колонки" />
              </MenuItem>
              <MenuItem onClick={() => this.setLayout(12)}>
                <ListItemIcon>
                  <Grid12 />
                </ListItemIcon>
                <ListItemText inset primary="Одна + две" />
              </MenuItem>
              <MenuItem onClick={() => this.setLayout(13)}>
                <ListItemIcon>
                  <Grid13 />
                </ListItemIcon>
                <ListItemText inset primary="Одна + три" />
              </MenuItem>
              <MenuItem onClick={() => this.setLayout(123)}>
                <ListItemIcon>
                  <Grid123 />
                </ListItemIcon>
                <ListItemText inset primary="Одна + две + три" />
              </MenuItem>
            </MenuList>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Записать
            </Button>
            <Button onClick={this.handleClose} color="primary">
              Закрыть
            </Button>
          </DialogActions>
        </Paper>
      </Popper>
    </div>;
  }
};

export default withIface(Settings);
