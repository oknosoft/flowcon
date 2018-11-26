import React from 'react';
import PropTypes from 'prop-types';
import IconChart from '@material-ui/icons/InsertChart';
import MenuItem from '@material-ui/core/MenuItem';

export default function ExecutionMenuItem ({handleNavigate}) {
  return <MenuItem key="execution" onClick={() => handleNavigate('/doc.issue/list/execution')}>
    <IconChart/> &nbsp;Исполнение
  </MenuItem>;
}

ExecutionMenuItem.propTypes = {
  handleNavigate: PropTypes.func.isRequired,
};
