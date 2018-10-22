import React from 'react';
import PropTypes from 'prop-types';

import AppContent from 'metadata-react/App/AppContent';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Cnn from './Cnn';
import Bases from './Bases';

class Settings extends React.Component {

  state = {index: 0};

  render() {
    const {state, props} = this;

    return <AppContent>

      <Tabs value={state.index} onChange={(event, index) => this.setState({index})}>
        <Tab label="Подключение"/>
        <Tab label="Области данных"/>
      </Tabs>

      {state.index === 0 && <Cnn {...props}/>}

      {state.index === 1 && <Bases {...props}/>}

    </AppContent>;
  }
}

export default Settings;
