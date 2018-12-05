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
  },
  square: {
    width: theme.spacing.unit * 3,
    height: theme.spacing.unit * 3,
    textAlign: 'center',
    border: '1px whitesmoke solid',
    color: theme.palette.text.secondary,
  },
  selected: {
    color: theme.palette.text.primary,
    borderBottom: '2px grey solid',
    fontWeight: 500,
  },
});

function Status({row, classes}) {
  return <div className={classes.root}>
    <div
      className={cn(classes.square, row.quickly && classes.selected)}
      title={row.quickly ? 'Срочно' : 'Не срочно'}
    >с</div>
    <div
      className={cn(classes.square, row.important && classes.selected)}
      title={row.important ? 'Важно' : 'Не важно'}
    >в</div>
    <div
      className={cn(classes.square, row.executor_accepted && classes.selected)}
      title={row.executor_accepted ? 'Принято в работу исполнителем' : 'Не принято в работу исполнителем'}
    >п</div>
    <div
      className={cn(classes.square, row.specify && classes.selected)}
      title={row.specify ? 'Отправлено на доработку' : 'Доработка постановки задачи не требуется'}
    >д</div>
    <div
      className={cn(classes.square, row.canceled && classes.selected)}
      title={row.canceled ? 'Задача отменена' : 'Не отменено'}
    >х</div>
    <div
      className={cn(classes.square, row.completed && classes.selected)}
      title={row.completed ? 'Выполнено' : 'Пока не выполнено'}
    >+</div>
    <div
      className={cn(classes.square, row.initiator_accepted && classes.selected)}
      title={row.initiator_accepted ? 'Принято инициатором' : 'Не принято инициатором'}
    >{row.initiator_accepted ? '+' : '-'}</div>
  </div>;
}

export default withStyles(styles)(Status);
