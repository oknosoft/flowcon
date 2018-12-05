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

export const options = {
  today: 'Сегодня',
  yesterday: 'Вчера',
  week: 'Неделя',
  month: 'Месяц',
};

class Periodicity extends React.Component {

  state = {
    anchorEl: null,
  };

  handleOpen = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleClick = (option) => {
    this.setState({anchorEl: null });
    this.props.handlePeriodicity(option);
  };

  render() {
    const {props: {periodicity, classes}, state: {anchorEl}} = this;
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
        {options[periodicity]}
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
      </Menu>
    ];
  }
}

Periodicity.propTypes = {
  periodicity: PropTypes.string.isRequired,
  handlePeriodicity: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

export default Periodicity;
