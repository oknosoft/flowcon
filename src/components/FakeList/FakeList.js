// @flow

import React from 'react';
import Helmet from 'react-helmet';
import Typography from 'material-ui/Typography';
import AppContent from 'metadata-react/App/AppContent';

export default class FakeList extends React.Component {

  render() {
    return <AppContent >
      <Helmet title="Некий список" />
      <div style={{marginTop: 16}}>
        <Typography type="display2" component="h1" color="primary">Это список</Typography>
      </div>
    </AppContent>;
  }
}
