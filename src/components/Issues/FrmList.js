import React from 'react';

import Lazy from 'metadata-react/DumbLoader/Lazy';
import {Switch, Route} from 'react-router';

class FrmIssueList extends Lazy {
  componentDidMount() {
    import('./FrmIssueList')
      .then((module) => this.setState({Component: module.default}));
  }
}

function Execution(props) {
  return 'Execution';
}

export default function IssuesRoute(props) {

  const wraper = (Component, routeProps) => {
    return <Component {...props} {...routeProps} />;
  };

  return <Switch>
    <Route path={`${props.match.url}/execution`} render={(routeProps) => wraper(Execution, routeProps)}/>
    <Route render={(routeProps) => wraper(FrmIssueList, routeProps)}/>
  </Switch>;
}
