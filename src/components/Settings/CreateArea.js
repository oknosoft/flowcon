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

class CreateArea extends React.Component {

  state = {
    open: false,
    name: '',
    error: '',
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleChange = ({target}) => {
    this.setState({name: target.value});
  };

  handleSend = () => {
    this.setState({name: target.value});
  };

  render() {
    const {open, name, error} = this.state;
    return <div>
      <IconButton title="Создать область" onClick={this.handleClickOpen}><AddIcon/></IconButton>
      <Dialog
        open={open}
        onClose={this.handleClose}
      >
        <DialogTitle>Новая область данных</DialogTitle>
        <DialogContent>
          <DialogContentText>
            В названии области допустимы стрчные символы латинского алфавита и цифры
          </DialogContentText>
          <TextField
            label="Имя области"
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

export default CreateArea;
