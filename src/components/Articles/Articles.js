/**
 * Список статей
 *
 * @module Articles
 *
 * Created by Evgeniy Malyarov on 17.04.2018.
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import Typography from 'material-ui/Typography';
import AppContent from 'metadata-react/App/AppContent';
import SelectTags from './SelectTags';
import InfiniteArticles from './InfiniteArticles';

const title = 'Статьи о программировании бизнеса';

class Articles extends Component {

  state = {
    tags: [],
  };

  handleChange = event => {
    this.setState({ tags: event.target.value });
  };

  render() {
    return <AppContent >
      <Helmet title={title} />
      <div style={{marginTop: 16}}>
        <Typography variant="display1" component="h1" color="primary">{title}</Typography>
        <SelectTags tags={this.state.tags} handleChange={this.handleChange}/>
        <InfiniteArticles tags={this.state.tags} match={this.props.match} handleNavigate={this.props.handleNavigate}/>
      </div>
    </AppContent>;
  }
}

Articles.propTypes = {
  match: PropTypes.object.isRequired,
  handleNavigate: PropTypes.func.isRequired,
};

export default Articles;
