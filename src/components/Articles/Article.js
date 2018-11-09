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
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import IconContents from '@material-ui/icons/FormatListNumbered';

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
    const {props, state: {doc}} = this;
    if(!doc) {
      return <AppContent><CircularProgress size={24} /> Загрузка...</AppContent>;
    }
    else if(doc === 404) {
      return <NotFound />;
    }
    else if(doc instanceof Error) {
      return <NotFound />;
    }
    const contents = !$p.utils.is_empty_guid(doc.contents) && $p.cat.contents.get(doc.contents);
    return (
      <MarkdownDocs
        key="doc"
        htitle={doc.name || 'без названия'}
        TopButton={contents && <IconButton
          onClick={() => props.handleNavigate(`/contents/${contents.id}`)}
          title="Перейти к оглавлению"
        >
          <IconContents />
        </IconButton>}
        h1={doc.h1}
        descr={doc.descr}
        canonical={props.match.path.replace(':ref', doc.id)}
        img={doc.img || 'https://business-programming.ru/imgs/flask_192.png'}
        markdown={doc.content || 'текст отсутствует'}
        footer={ props.match.path.match(/\/(articles|files)\//) && [
          <Attachments key="attachments" _obj={doc} handleIfaceState={props.handleIfaceState} />,
          <Social key="social" title={doc.name}/>,
          props.match.path.match(/\/(articles)\//) &&
          <Grid key="subscribe" container >
            <Grid item sm={12} md={6}>
              <Subscribe title="Художественная литература про ИТ" area="comp.paper.itfiction" />
            </Grid>
            <Grid item sm={12} md={6}>
              <Subscribe title="Бизнес-программирование" area="business.tech.bizprogramming" />
            </Grid>
          </Grid>
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
