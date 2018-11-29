/**
 * Переключатель периодичности
 *
 * @module Periodicity
 *
 * Created by Evgeniy Malyarov on 29.11.2018.
 */

import React from 'react';
import PropTypes from 'prop-types';

import IconButton from '@material-ui/core/IconButton';
import IconDate from '@material-ui/icons/DateRange';

class Periodicity extends React.Component {

  render() {
    const {periodicity, handlePeriodicity} = this.props;
    return <IconButton
      title="Интервал итогов"
      periodicity={periodicity}
      handlePeriodicity={handlePeriodicity}
    >
      <IconDate />
    </IconButton>;
  }
}

Periodicity.propTypes = {
  periodicity: PropTypes.string.isRequired,
  handlePeriodicity: PropTypes.func.isRequired,
};

export default Periodicity;
