/**
 * Страница статьи
 *
 * @module Article
 *
 * Created by Evgeniy Malyarov on 17.04.2018.
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';

class Article extends Component {

  render() {
    return <div>Article</div>;
  }
}

Article.propTypes = {
  match: PropTypes.object.isRequired,
};

export default Article;
