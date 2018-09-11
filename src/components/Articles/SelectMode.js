/**
 * Режим просмотра - оглавление или список
 *
 * @module SelectMode
 *
 * Created by Evgeniy Malyarov on 11.09.2018.
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import IconList from '@material-ui/icons/FormatListBulleted';
import IconContents from '@material-ui/icons/FormatListNumbered';
import {path} from './queryString';

class SelectMode extends Component {

  state = {open: false};

  handleOpen = () => {
    this.setState({open: !this.state.open});
    let {view, handleNavigate} = this.props;
    if(view) {
      view = '';
    }
    else {
      view = 'contents';
    }
    handleNavigate(path({view}));
  }

  render() {
    const {view, classes} = this.props;

    return <IconButton
      onClick={this.handleOpen}
      className={classes.top}
    >
      {view === 'contents' ? <IconContents /> : <IconList />}
    </IconButton>;
  }

}

SelectMode.propTypes = {
  classes: PropTypes.object.isRequired,
  view: PropTypes.string,
  handleNavigate: PropTypes.func.isRequired,
};

export default SelectMode;
