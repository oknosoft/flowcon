import React from 'react';
import PropTypes from 'prop-types';

import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import RemoveIcon from '@material-ui/icons/DeleteOutline';
import withStyles from 'metadata-react/Header/toolbar';

import AddUser from './AddUser';
import UserBases from './UserBases';

function handleRemove({refresh, user}) {
  if(!user) {
    return $p.ui.dialogs.alert({text: 'Пользователь не указан'});
  }
  $p.ui.dialogs.confirm({text: `Подтвердите удаление пользователя '${user}' из списка администрирования`})
    .then(() => {
      return $p.superlogin.rm_user(user)
        .then(refresh)
        .catch((err) => {
          const error = err.response && err.response.data.message || err.message;
          $p.ui.dialogs.alert({title: 'Ошибка удаления пользователя', text: error});
        });
    })
    .catch(() => null);
}

function UsersToolbar({classes, refresh, user, myDBs}) {
 return <Toolbar disableGutters className={classes.toolbar}>
   <AddUser refresh={refresh}/>
   <IconButton title="Удалить пользователя" onClick={handleRemove.bind(null, {refresh, user: user.name || user})}><RemoveIcon/></IconButton>
   <UserBases refresh={refresh} name={user} rows={myDBs}/>
 </Toolbar>;
}

UsersToolbar.propTypes = {
  classes: PropTypes.object,
  refresh: PropTypes.func,
  user: PropTypes.any,
  myDBs: PropTypes.array,
};

export default withStyles(UsersToolbar);
