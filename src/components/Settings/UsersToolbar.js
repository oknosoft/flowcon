import React from 'react';
import PropTypes from 'prop-types';

import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import RemoveIcon from '@material-ui/icons/DeleteOutline';
import withStyles from 'metadata-react/Header/toolbar';

import AddUser from './AddUser';
import UserBases from './UserBases';

function UsersToolbar({classes, handleAdd, refresh, user, myDBs}) {
 return <Toolbar disableGutters className={classes.toolbar}>
   <AddUser refresh={refresh}/>
   <IconButton title="Удалить область" onClick={handleAdd}><RemoveIcon/></IconButton>
   <UserBases refresh={refresh} name={user} rows={myDBs}/>
 </Toolbar>;
}

UsersToolbar.propTypes = {
  classes: PropTypes.object,
  handleAdd: PropTypes.func,
  refresh: PropTypes.func,
  user: PropTypes.any,
  myDBs: PropTypes.array,
};

export default withStyles(UsersToolbar);
