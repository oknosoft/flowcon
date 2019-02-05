/**
 *
 *
 * @module Responsibles
 *
 * Created by Evgeniy Malyarov on 06.12.2018.
 */

import React from 'react';
import PropTypes from 'prop-types';

import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
    display: 'flex',
    marginRight: theme.spacing.unit / 2,
    width: theme.spacing.unit * 3 * 6
  },
  text: {
    width: '50%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    userSelect: 'none',
    '&:hover': {
      backgroundColor: 'lightgrey'
    },
    cursor: 'pointer',
  },
});

function Responsibles({row, classes}) {
  const {users} = $p.cat;
  const initiator = users.get(row.initiator);
  const executor = users.get(row.executor);
  return <div className={classes.root}>
    <Typography
      variant="caption"
      className={classes.text}
      title={initiator.empty() ? 'Инициатор не указан' : initiator.name}
    >
      {initiator.empty() ? '?' : initiator.id}
    </Typography>
    <Typography
      variant="caption"
      className={classes.text}
      title={executor.empty() ? 'Исполнитель не назначен' : executor.name}
    >
      {executor.empty() ? '?' : executor.id}
    </Typography>
  </div>;
}

export default withStyles(styles)(Responsibles);
