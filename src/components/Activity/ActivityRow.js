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

class ActivityRow extends React.Component {

  render() {
    const {row, classes, register, totals} = this.props;
    return <FormGroup row classes={{root: classes.nowrap}}>
      <Typography color="primary" className={cn(classes.flex, classes.ptop)}>{row.name}</Typography>
      <Typography color="primary" className={cn(classes.mr16, classes.ptop)}>{(totals.get(row) || 0).toFixed(1)}</Typography>
      <IconButton
        className={classes.icon}
        onClick={() => register(row, true)}
      ><RemoveIcon /></IconButton>
      <IconButton
        className={classes.icon}
        onClick={() => register(row)}
      ><AddIcon /></IconButton>
    </FormGroup>;
  }
}

ActivityRow.propTypes = {
  row: PropTypes.object.isRequired,
};

export default ActivityRow;
