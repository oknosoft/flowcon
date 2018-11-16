/**
 * Добавляет-убавляет базы пользователя
 *
 * @module UserBases
 *
 * Created by Evgeniy Malyarov on 25.10.2018.
 */

import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import withStyles from 'metadata-react/styles/paper600';
import BtnsDialog from './BtnsDialog';
import BasesTable from './BasesTable';

function getRows(rows, user) {
  return rows.map((db) => {
    return user.name && user.value.includes(db) ? {name: db, checked: true} : db;
  });
}

class UserBases extends BtnsDialog {

  render() {
    const {state: {open, name, error, query}, props} = this;
    return <div>
      <IconButton title="Состав баз пользователя" onClick={this.handleClickOpen}><EditIcon/></IconButton>
      <Dialog
        open={open}
        onClose={this.handleClose}
        classes={{paper: query ? props.classes.disabled : ''}}
      >
        <DialogTitle>Области данных пользователя</DialogTitle>
        <DialogContent>
          <TextField
            label="Пользователь"
            value={name}
            margin="dense"
            onChange={this.handleChange}
            InputProps={{
              readOnly: Boolean(props.name),
            }}
          />
          <BasesTable title="Области" rows={getRows(props.rows, props.name)} check multi/>
          <DialogContentText>
            {error}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary">
            Отмена
          </Button>
        </DialogActions>
      </Dialog>
    </div>;
  }

}

UserBases.propTypes = {
  name: PropTypes.string,
  refresh: PropTypes.func,
};

export default withStyles(UserBases);
