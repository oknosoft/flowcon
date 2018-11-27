import React from 'react';
import PropTypes from 'prop-types';

import Lazy from 'metadata-react/DumbLoader/Lazy';
import {Switch, Route} from 'react-router';

class FrmIssueList extends Lazy {
  componentDidMount() {
    import('./List/FrmIssueList')
      .then((module) => this.setState({Component: module.default}));
  }
}

class ExecutionDiagrams extends Lazy {
  componentDidMount() {
    import('./Execution/Diagrams')
      .then((module) => this.setState({Component: module.default}));
  }
}

export default function IssuesRoute(props) {

  const wraper = (Component, routeProps) => {
    return <Component {...props} {...routeProps} />;
  };

  return <Switch>
    <Route path={`${props.match.url}/execution`} render={(routeProps) => wraper(ExecutionDiagrams, routeProps)}/>
    <Route render={(routeProps) => wraper(FrmIssueList, routeProps)}/>
  </Switch>;
}

IssuesRoute.propTypes = {
  match: PropTypes.object.isRequired,
};
