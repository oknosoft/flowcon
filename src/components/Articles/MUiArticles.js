/**
 * Бесконечный список статей
 * @module Infinit
 *
 * Created by Evgeniy Malyarov on 17.04.2018.
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import qs from 'qs';
import cn from 'classnames';

import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import ArticleRow from './ArticleRow';


const list = new Map();
list.set(0, {name: 'Загрузка списка статей...'});

const styles = theme => ({
  list: {
    width: '100%',
    marginTop: theme.spacing.unit,
  },
  bottom: {
    paddingBottom: theme.spacing.unit * 2,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  chip: {
    marginRight: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
    cursor: 'pointer',
  },
  author: {
    cursor: 'pointer',
    '&:hover': {
      fontWeight: 500,
    },
  },
  placeholder: {
    display: 'inline-block',
    height: '1em',
    backgroundColor: '#DDD',
  },
  nowrap: {
    flexWrap: 'nowrap',
    marginBottom: theme.spacing.unit,
  },
  flex: {
    flex: 1,
    whiteSpace: 'nowrap',
  },
  scroller: {
    flex: '1 1 auto',
  },
  disabled: {
    display: 'none',
  }
});


class MUiArticles extends Component {

  constructor(props) {
    super(props);

    this.state = {
      next: false,
      prev: false,
    };
  }

  componentDidMount() {
    this.loadRows();
  }

  componentDidUpdate(prevProps) {
    // If props/state signals that the underlying collection has changed,
    // Reload the most recently requested batch of rows:
    if(this.props.tags.length !== prevProps.tags.length
      || this.props.match.path !== prevProps.match.path
      || this.props.location.search !== prevProps.location.search) {
      this.loadRows();
    }
  }

  clearData = () => {
    list.clear();
    this.setState({
      next: false,
      prev: false,
    });
  }

  get page() {
    const query = qs.parse(this.props.location.search.replace('?',''));
    return query.page ? query.page - 1 : 0;
  }

  loadRows() {

    const {props: {tags, tagList, news}, page} = this;

    this.clearData();

    const selector = {
      selector: {
        sorting_field: {$gte: 0},
        tags: {
          $elemMatch: {
            $in: tags.length ? tags : tagList.map(({ref}) => ref)
          }
        }
      },
      fields: ['_id', 'id', 'name', 'h1', 'introduction', 'date', 'author', 'tags', 'acl'],
      use_index: 'sorting_field_tags',
      sort: [{'sorting_field': 'asc'}],
      skip: page * 30,
      limit: 30,
    };

    return $p.cat.articles.pouch_db.find(selector)
      .then((res) => {
        for(let i=0; i < res.docs.length; i++) {
          list.set(i, res.docs[i]);
        }
        if(!res.docs.length) {
          list.set(0, {
            name: news ? 'Нет новостей' : `Нет статей на странице №${page + 1}`,
            introduction: news ? '' : 'Проверьте фильтр по категориям и параметр page в url'
          });
        }
        this.setState({
          prev: false,
          next: res.docs.length === 30,
        });
      });
  }


  renderRows = () => {
    const {classes, match, handleNavigate, news} = this.props;
    const res = [];

    for(const [key, value] of list) {
      res.push(<ArticleRow news={news} key={key} row={value} match={match} handleNavigate={handleNavigate} classes={classes}/>);
    }

    return res;
  }

  render() {
    const {props: {classes, match, handleNavigate}, page} = this;
    const {prev, next} = this.state;

    return [
      <List key="list" className={cn(classes.list, classes.bottom)}>
        {this.renderRows()}
      </List>,
      <div key="footer" className={classes.row}>
        <Typography
          component="a"
          href={`${match.path}${page > 1 ? `?page=${page-1}` : ''}`}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            handleNavigate(`${match.path}${page > 1 ? `?page=${page-1}` : ''}`);
          }}
          color="primary"
          className={cn({[classes.disabled]: !prev})}
        >← сюда</Typography>
        <div className={classes.scroller}> </div>
        <Typography
          component="a"
          href={`${match.path}?page=${page+1}`}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            handleNavigate(`${match.path}?page=${page+1}`);
          }}
          color="primary"
          className={cn({[classes.disabled]: !next})}
        >туда →</Typography>
      </div>
      ];
  }

}

MUiArticles.propTypes = {
  tags: PropTypes.array.isRequired,
  news: PropTypes.bool,
  classes: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  tagList: PropTypes.array.isRequired,
  handleNavigate: PropTypes.func.isRequired,
};

export default withStyles(styles)(MUiArticles);