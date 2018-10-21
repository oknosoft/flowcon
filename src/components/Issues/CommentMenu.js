import React from 'react';
import PropTypes from 'prop-types';

import IconButton from '@material-ui/core/IconButton';
import MoreHoriz from '@material-ui/icons/MoreHoriz';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

class CommentMenu extends React.Component {

  state = {anchorEl: null};

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const {props: {classes, toggleEdit, handleDelete}, state: {anchorEl}} = this;
    return <div>
      <IconButton
        className={classes.button}
        onClick={this.handleClick}
        title="Меню"
      >
        <MoreHoriz className={classes.icon} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={this.handleClose}
      >
        <MenuItem onClick={() => {
          toggleEdit();
          this.handleClose();
        }}>Режим (редактор/просмотр)</MenuItem>
        {handleDelete && <MenuItem onClick={() => {
          handleDelete();
          this.handleClose();
        }}>Удалить комментарий</MenuItem>}
      </Menu>
    </div>;
  }

}

export default CommentMenu;
