import React from 'react';
import PropTypes from 'prop-types';

import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import RemoveIcon from '@material-ui/icons/DeleteOutline';
import withStyles from 'metadata-react/Header/toolbar';

import CreateArea from './CreateArea';
import UserBases from './UserBases';
import ShareArea from './ShareArea';


function BasesToolbar({classes, handleAdd, refresh, base, user, myDBs, myUsers}) {
 return <Toolbar disableGutters className={classes.toolbar}>
   <CreateArea refresh={refresh}/>
   <IconButton title="Удалить область" onClick={handleAdd}><RemoveIcon/></IconButton>
   <ShareArea refresh={refresh} name={base} rows={myUsers} />
   <UserBases refresh={refresh} name={user} rows={myDBs}/>
 </Toolbar>;
}

BasesToolbar.propTypes = {
  classes: PropTypes.object,
  handleAdd: PropTypes.func,
  refresh: PropTypes.func,
  base: PropTypes.string,
  user: PropTypes.any,
  myDBs: PropTypes.array,
  myUsers: PropTypes.array,
};

export default withStyles(BasesToolbar);
