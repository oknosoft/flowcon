import React from 'react';
import PropTypes from 'prop-types';
import {Switch, Route} from 'react-router';

import NotFound from './NotFound';  // 404
import About from './About';        // информация о программе


export default function MarkdownRoute() {
  return <Switch>
    <Route path="/about" component={About}/>
    <Route component={NotFound}/>
  </Switch>;
}

MarkdownRoute.propTypes = {
  match: PropTypes.object.isRequired,
};




