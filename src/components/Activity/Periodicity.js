/**
 * Переключатель периодичности
 *
 * @module Periodicity
 *
 * Created by Evgeniy Malyarov on 29.11.2018.
 */

import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import IconDate from '@material-ui/icons/DateRange';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

export const options = {
  today: 'Сегодня',
  yesterday: 'Вчера',
  date: 'Дата',
  week: 'Неделя',
  month: 'Месяц',
  all: 'Вся жизнь',
};

class Periodicity extends React.Component {

  state = {anchorEl: null, selectDate: false};

  handleOpen = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({anchorEl: null, selectDate: false});
  };

  handleClick = (periodicity) => {
    let date = new Date();
    switch (periodicity) {
    case 'yesterday':
      date = new Date(date - 24 * 3600 * 1000);
      break;
    case 'date':
      this._date = this.props.date;
      this.setState({anchorEl: null, selectDate: true});
      return;
    default:
    }
    this.handleClose();
    this.props.handlePeriodicity(periodicity, date);
  };

  handleDate = () => {
    this.handleClose();
    this.props.handlePeriodicity('date', this._date);
  };

  handleDateChange = ({target}) => {
    if(target.value) {
      this._date = new Date(target.value);
    }
  };

  render() {
    const {props: {periodicity, date, classes}, state: {anchorEl, selectDate}} = this;
    return [
      <Button
        key="button"
        variant="text"
        size="small"
        className={classes.button}
        title={`Интервал итогов (${options[periodicity]})`}
        onClick={this.handleOpen}
      >
        <IconDate className={classes.leftIcon} />
        {periodicity === 'date' ? moment(date).format('DD MMM') : options[periodicity]}
      </Button>,
      <Menu
        key="menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={this.handleClose}
      >
        {Object.keys(options).map((option) => (
          <MenuItem
            key={option}
            selected={option === periodicity}
            onClick={() => this.handleClick(option)}
          >
            {options[option]}
          </MenuItem>
        ))}
      </Menu>,
      <Dialog
        key="dialog"
        open={selectDate}
        onClose={this.handleClose}
      >
        <DialogTitle>Укажите дату активности</DialogTitle>
        <DialogContent>
          <TextField
            //label="Дата активности"
            type="date"
            margin="dense"
            defaultValue={date.toISOString().substr(0,10)}
            onChange={this.handleDateChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleDate} color="primary">
            Ок
          </Button>
          <Button onClick={this.handleClose} color="primary">
            Отмена
          </Button>
        </DialogActions>
      </Dialog>
    ];
  }
}

Periodicity.propTypes = {
  periodicity: PropTypes.string.isRequired,
  date: PropTypes.object.isRequired,
  handlePeriodicity: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

export default Periodicity;
