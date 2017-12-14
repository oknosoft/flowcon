import React from 'react';
import PropTypes from 'prop-types';
import {Switch, Route} from 'react-router';

import NotFound from '../../pages/NotFound';  // 404
import About from '../../pages/About';        // информация о программе
import Readme from '../../pages/Readme';      // Справка


export default function MarkdownRoute() {
  return <Switch>
    <Route path="/about" component={About}/>
    <Route path="/readme" component={Readme}/>
    <Route component={NotFound}/>
  </Switch>;
}

MarkdownRoute.propTypes = {
  match: PropTypes.object.isRequired,
};




