// @flow

import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import {withStyles} from 'material-ui/styles';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import AppContent from 'metadata-react/App/AppContent';

export default class FakeList extends React.Component {

  render() {
    return <AppContent >
      <Helmet title="Некий список" />
      <Typography type="display3" component="h1" color="primary">Это список</Typography>
    </AppContent>;
  }
}
