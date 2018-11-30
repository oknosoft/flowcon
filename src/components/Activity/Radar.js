/**
 * Диаграмма активности
 *
 * @module Radar
 *
 * Created by Evgeniy Malyarov on 30.11.2018.
 */

import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';

function Radar(props) {

  return <Typography color="primary">{'Radar'}</Typography>;
}

Radar.propTypes = {
  totals: PropTypes.object.isRequired,
};

export default Radar;
