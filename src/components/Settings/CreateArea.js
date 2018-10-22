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

class CreateArea extends React.Component {

  state = {
    open: false,
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    return <div>
      <IconButton title="Создать область" onClick={this.handleClickOpen}><AddIcon/></IconButton>
      <Dialog
        open={this.state.open}
        onClose={this.handleClose}
      >
        <DialogTitle>Новая область данных</DialogTitle>
        <DialogContent>
          <DialogContentText>
            В названии области допустимы стрчные символы латинского алфавита и цифры
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary">
            Создать
          </Button>
        </DialogActions>
      </Dialog>
    </div>;
  }

}

export default CreateArea;
