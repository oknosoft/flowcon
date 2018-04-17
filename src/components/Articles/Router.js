/**
 * Маршрутизатор статей
 *
 * @module Router
 *
 * Created by Evgeniy Malyarov on 17.04.2018.
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Switch, Route} from 'react-router';
import {withIfaceAndMeta} from 'metadata-redux';

import Articles from './Articles';
import Article from './Article';

class ArticlesRoute extends Component {

  render() {

    /* eslint-disable-next-line */
    const {classes, match, ...mainProps} = this.props;

    const wraper = (Component, routeProps) => {
      return <Component {...mainProps} {...routeProps} />;
    };

    return <Switch>
      <Route path={`${match.url}/:ref`} render={(props) => wraper(Article, props)}/>
      <Route render={(props) => wraper(Articles, props)}/>
    </Switch>;
  }
}

ArticlesRoute.propTypes = {
  match: PropTypes.object.isRequired,
  height: PropTypes.number,
  width: PropTypes.number,
};

export default withIfaceAndMeta(ArticlesRoute);
