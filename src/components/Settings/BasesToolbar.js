import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import RemoveIcon from '@material-ui/icons/DeleteOutline';
import EditIcon from '@material-ui/icons/Edit';
import ShareIcon from '@material-ui/icons/Share';
import withStyles from 'metadata-react/Header/toolbar';

function BasesToolbar({classes, handleAdd}) {
 return <Toolbar disableGutters className={classes.toolbar}>
   <IconButton title="Создать область" onClick={handleAdd}><AddIcon/></IconButton>
   <IconButton title="Удалить область" onClick={handleAdd}><RemoveIcon/></IconButton>
   <IconButton title="Поделиться областью" onClick={handleAdd}><ShareIcon/></IconButton>
   <IconButton title="Состав баз пользователя" onClick={handleAdd}><EditIcon/></IconButton>
 </Toolbar>
}

export default withStyles(BasesToolbar);
