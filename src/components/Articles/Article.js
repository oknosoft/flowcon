/**
 * Страница статьи
 *
 * @module Article
 *
 * Created by Evgeniy Malyarov on 17.04.2018.
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import AppContent from 'metadata-react/App/AppContent';
import MarkdownDocs from 'metadata-react/Markdown/MarkdownDocs';
import NotFound from '../Pages/NotFound';  // 404
import Social from './Social';
import Subscribe from './Subscribe';
import Attachments from './Attachments';

class Article extends Component {

  state = {doc: null, name: ''};

  componentDidMount() {
    const {ref} = this.props.match.params;
    $p.cat.articles.pouch_db.query('doc/number_doc', {
      key: ['cat.articles', 0, ref],
      limit: 1,
      include_docs: true,
    })
      .then((res) => {
        if(res.rows.length) {
          this.setState({doc: res.rows[0].doc});
        }
        else {
          this.setState({doc: 404});
        }
      })
      .catch((err) => {
        this.setState({doc: err});
      });
  }

  componentDidUpdate(prevProps) {
    // If props/state signals that the underlying collection has changed,
    // Reload the most recently requested batch of rows:
    if(this.props.match.params.ref !== prevProps.match.params.ref ) {
      this.componentDidMount();
    }
  }

  render() {
    const {doc} = this.state;
    if(!doc) {
      return <AppContent><CircularProgress size={24} /> Загрузка...</AppContent>;
    }
    else if(doc === 404) {
      return <NotFound />;
    }
    else if(doc instanceof Error) {
      return <NotFound />;
    }
    return (
      <MarkdownDocs
        key="doc"
        htitle={doc.name || 'без названия'}
        h1={doc.h1}
        descr={doc.descr}
        markdown={doc.content || 'текст отсутствует'}
        footer={ this.props.match.path.match(/\/(articles|files)\//) && [
          <Attachments key="attachments" _obj={doc} handleIfaceState={this.props.handleIfaceState} />,
          <Social key="social" title={doc.name}/>,
          this.props.match.path.match(/\/(articles)\//) &&
          <Subscribe key="subscribe" title="Художественная литература про ИТ" area="comp.paper.itfiction" />
        ]}
      />
    );
  }
}

Article.propTypes = {
  match: PropTypes.object.isRequired,
  handleIfaceState: PropTypes.func.isRequired,
};

export default Article;
