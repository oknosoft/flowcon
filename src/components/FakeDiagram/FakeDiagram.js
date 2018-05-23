// @flow

import React from 'react';
import Helmet from 'react-helmet';
import Typography from '@material-ui/core/Typography';
import AppContent from 'metadata-react/App/AppContent';

export default class Diagram extends React.Component {

  render() {
    return <AppContent >
      <Helmet title="Диаграмма эффективности">
        <meta name="description" content="Прмер диаграммы" />
      </Helmet>
      <div style={{marginTop: 16}}>
        <Typography variant="display1" component="h1" color="primary">Это диаграмма</Typography>
      </div>
    </AppContent>;
  }
}
