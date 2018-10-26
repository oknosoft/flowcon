/**
 * Создаёт область данных
 *
 * @module CreateArea
 *
 * Created by Evgeniy Malyarov on 23.10.2018.
 */

import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import withStyles from 'metadata-react/styles/paper600';
import BtnsDialog from './BtnsDialog';

class CreateArea extends BtnsDialog {

  handleSend = () => {
    const {name} = this.state;
    if(!name) {
      return this.setState({error: 'Пустое имя области'});
    }
    this.setState({query: true});
    $p.superlogin.create_db(name)
    /* eslint-disable-next-line*/
      .then((data) => {
        this.handleClose();
        this.props.refresh();
      })
      .catch((err) => {
        const error = err.response && err.response.data.message || err.message;
        this.setState({query: false, error});
      });
  };

  render() {
    const {state: {open, name, error, query}, props: {classes}} = this;
    return <div>
      <IconButton title="Создать область" onClick={this.handleClickOpen}><AddIcon/></IconButton>
      <Dialog
        open={open}
        onClose={this.handleClose}
        classes={{paper: query ? classes.disabled : ''}}
      >
        <DialogTitle>Новая область данных</DialogTitle>
        <DialogContent>
          <TextField
            label="Имя области"
            helperText="Разрешены стрчные символы латинского алфавита и цифры"
            value={name}
            margin="dense"
            onChange={this.handleChange}
          />
          <DialogContentText>
            {error}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleSend} color="primary">
            Создать
          </Button>
          <Button onClick={this.handleClose} color="primary">
            Отмена
          </Button>
        </DialogActions>
      </Dialog>
    </div>;
  }

}

CreateArea.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(CreateArea);
