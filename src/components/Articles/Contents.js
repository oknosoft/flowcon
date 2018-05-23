/**
 * Иерархический список (оглавление) статей
 *
 * @module Contents
 *
 * Created by Evgeniy Malyarov on 26.04.2018.
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import withStyles from '@material-ui/core/styles/withStyles';

const styles = theme => ({
  row: {
    display: 'flex',
    flexDirection: 'row',
  }
});

class Contents extends Component {

}

Contents.propTypes = {
  classes: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  handleNavigate: PropTypes.func.isRequired,
};

export default withStyles(styles)(Contents);
