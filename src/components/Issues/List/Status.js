/**
 * с - срочно
 * в - важно
 * п - принято исполнителем
 * д - отправлено на доработку
 * х - отменено
 * + - готово
 * √ - принятно инициатором
 *
 * @module Status
 *
 * Created by Evgeniy Malyarov on 05.12.2018.
 */

import React from 'react';
import PropTypes from 'prop-types';

import withStyles from '@material-ui/core/styles/withStyles';
import cn from 'classnames';

const styles = theme => ({
  root: {
    display: 'flex',
    marginRight: theme.spacing.unit / 2,
  },
  square: {
    width: theme.spacing.unit * 3,
    height: theme.spacing.unit * 3,
    textAlign: 'center',
    border: '1px lightgrey solid',
    color: theme.palette.text.secondary,
    userSelect: 'none',
    '&:hover': {
      backgroundColor: 'lightgrey'
    },
    cursor: 'pointer',
  },
  primary: {
    color: theme.palette.text.primary,
  },
  selected: {
    color: theme.palette.text.primary,
    borderBottom: '2px grey solid',
    fontWeight: 500,
  },
});

function Status({row, classes, handleFilter}) {
  return <div className={classes.root}>
    <div
      className={cn(classes.square, row.mark && classes.primary)}
      title={row.mark ? row.mark : 'Баллы не указаны'}
    >{row.mark || '?'}</div>
    <div
      className={cn(classes.square, row.quickly && classes.selected)}
      title={row.quickly ? 'Срочно' : 'Не срочно'}
      onClick={() => handleFilter('quickly', row.quickly)}
    >с</div>
    <div
      className={cn(classes.square, row.important && classes.selected)}
      title={row.important ? 'Важно' : 'Не важно'}
      onClick={() => handleFilter('important', row.important)}
    >в</div>
    {
      row.canceled ?
        (<div
          className={cn(classes.square, classes.selected)}
          title={'Отменено'}
          onClick={() => handleFilter('canceled', row.canceled)}
        >х</div>)
        :
        (
          row.specify ?
        <div
          className={cn(classes.square, classes.selected)}
          title={'Отправлено на доработку'}
          onClick={() => handleFilter('specify', row.specify)}
        >д</div>
        :
        <div
          className={cn(classes.square, row.executor_accepted && classes.selected)}
          title={row.executor_accepted ? 'Принято в работу исполнителем' : 'Не принято в работу исполнителем'}
          onClick={() => handleFilter('executor_accepted', row.executor_accepted)}
        >{row.executor_accepted ? 'п' : 'н'}</div>
        )
    }
    <div
      className={cn(classes.square, row.completed && classes.selected)}
      title={row.completed ? 'Выполнено' : 'Пока не выполнено'}
      onClick={() => handleFilter('completed', row.completed)}
    >{row.completed ? '+' : '-'}</div>
    <div
      className={cn(classes.square, row.initiator_accepted && classes.selected)}
      title={row.initiator_accepted ? 'Принято инициатором' : 'Не принято инициатором'}
      onClick={() => handleFilter('initiator_accepted', row.initiator_accepted)}
    >{row.initiator_accepted ? '+' : '-'}</div>
  </div>;
}

Status.propTypes = {
  row: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  handleFilter: PropTypes.func.isRequired,
};

export default withStyles(styles)(Status);
