/**
 * Кнопка панели инструментов, порождающая диалог
 *
 * @module BtnsDialog
 *
 * Created by Evgeniy Malyarov on 26.10.2018.
 */

import React from 'react';
import PropTypes from 'prop-types';

class BtnsDialog extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      open: false,
      name: typeof props.name === 'object' ? props.name.name : props.name || '',
      error: '',
      query: false,
    };
  }

  shouldComponentUpdate(nextProps) {
    if(this.props.name !== nextProps.name) {
      this.setState({name: typeof nextProps.name === 'object' ? nextProps.name.name : nextProps.name || ''});
      return false;
    }
    return true;
  }

  handleClickOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false, query: false});
  };

  handleChange = ({target}) => {
    this.setState({name: target.value, error: ''});
  };

}

BtnsDialog.propTypes = {
  name: PropTypes.func,
  refresh: PropTypes.func,
};

export default BtnsDialog;
