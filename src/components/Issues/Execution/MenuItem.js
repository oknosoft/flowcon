import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import IconChart from '@material-ui/icons/InsertChart';

export default function ({handleNavigate}) {
  return <MenuItem key="execution" onClick={() => handleNavigate('/doc.issue/list/execution')}>
    <IconChart/> &nbsp;Исполнение
  </MenuItem>
}
