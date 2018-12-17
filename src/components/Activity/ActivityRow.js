/**
 * ### Строка активности
 * С кнопками добавить, итогом и раскраской
 *
 * @module ActivityRow
 *
 * Created by Evgeniy Malyarov on 28.11.2018.
 */

import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';
import FormGroup from '@material-ui/core/FormGroup';
import IconButton from '@material-ui/core/IconButton';
import RemoveIcon from '@material-ui/icons/RemoveCircleOutline';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import cn from 'classnames';

function ActivityRow ({row, classes, register, totals, navigate, periodicity}) {

  const href = `/cat.activity/${row.ref}?urlback=/activity?open=${row.flow.predefined_name}`;
  const busy = !'date,today,yesterday'.includes(periodicity);
  const busyText = 'Для регистрации, установите период "Сегодня", "Вчера" или "Дата"';

  return <FormGroup row classes={{root: classes.nowrap}}>
    <Typography
      component="a"
      variant="subtitle1"
      color="primary"
      href={href}
      onClick={(e) => navigate(e, href)}
      className={cn(classes.flex, classes.ptop)}
    >{row.name}</Typography>
    <Typography color="primary" className={cn(classes.mr16, classes.ptop)}>{(totals.get(row) || 0).toFixed(0)}</Typography>
    <div title={(busy && busyText) || ''}>
      <IconButton
        className={cn(classes.icon, busy && classes.busy)}
        title="Отменить регистрацию"
        onClick={() => register(row, true)}
      ><RemoveIcon /></IconButton>
      <IconButton
        className={cn(classes.icon, busy && classes.busy)}
        title="Зарегистрировать"
        onClick={() => register(row)}
      ><AddIcon /></IconButton>
    </div>
  </FormGroup>;
}

ActivityRow.propTypes = {
  row: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  totals: PropTypes.object.isRequired,
  periodicity: PropTypes.string.isRequired,
  register: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired,
};

export default ActivityRow;
