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
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AppContent from 'metadata-react/App/AppContent';
import SelectTags from 'metadata-react/DataField/SelectTags';
//import InfiniteArticles from './InfiniteArticles';
import InfiniteArticles from './MUiArticles';
import {description} from '../App/menu';
import {fromQuery, path} from './queryString';

class Articles extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      tags: [],
      tagList: this.tagList(props.tagFilter)
    };
  }

  handleChange = event => {
    this.setState({ tags: event.target.value });
  };

  componentDidMount() {
    this.shouldComponentUpdate(this.props);
  }

  tagList(tagFilter) {
    const tagList = [];
    $p.cat.tags.find_rows({category: {in: tagFilter}}, (tag) => tagList.push(tag));
    return tagList;
  }

  shouldComponentUpdate({title, match, tagFilter}) {
    if(title != this.ltitle || match.path !== this.props.match.path) {

      if(match.path === '/articles') {
        this.ltitle = 'Статьи';
        this.title = this.ltitle + ' о программировании бизнеса';
      }
      else if(match.path === '/news') {
        this.ltitle = 'Новости';
        this.title = this.ltitle + ' и события';
      }
      else {
        this.ltitle = 'Файлы';
        this.title = this.ltitle + ' и дополнительные материалы';
      }
      this.props.handleIfaceState({
        component: '',
        name: 'title',
        value: this.ltitle,
      });


      this.setState({tagList: this.tagList(tagFilter), tags: []});

      return false;
    }
    return true;
  }

  render() {
    const session = $p.superlogin.getSession();
    const {handleNavigate, match, location} = this.props;
    const {tagList, tags} = this.state;
    const prm = fromQuery();

    return <AppContent >
      <Helmet title={this.title}>
        <meta name="description" content={description} />
        <link rel="canonical" href={match.path + (match.path.endsWith('/') ? '' : '/')} />
        <meta property="og:title" content={this.title} />
        <meta property="og:description" content={description} />
      </Helmet>
      <div style={{marginTop: 16}}>
        <Typography variant="display1" component="h1" color="primary">{this.title}</Typography>
        <SelectTags
          tags={tags}
          fullWidth
          handleChange={this.handleChange}
          tagList={tagList}
        />
        {
          session && session.roles.indexOf('doc_full') !== -1 &&
          <Button color="primary" size="small" onClick={() => handleNavigate('/cat.articles/list')}>Перейти к редактору статей</Button>
        }

        <InfiniteArticles
          tags={tags}
          tagList={tagList}
          page={prm.page}
          match={match}
          location={location}
          handleNavigate={handleNavigate}
        />
      </div>
    </AppContent>;
  }
}

Articles.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  tagFilter: PropTypes.array.isRequired,
  handleNavigate: PropTypes.func.isRequired,
  handleIfaceState: PropTypes.func.isRequired,
};

export default Articles;
