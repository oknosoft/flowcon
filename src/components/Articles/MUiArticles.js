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

import List from 'material-ui/List';
import Typography from 'material-ui/Typography';
import {withStyles} from 'material-ui/styles';
import ArticleRow from './ArticleRow';


const list = new Map();
list.set(0, {name: 'Загрузка списка статей...'});

const styles = theme => ({
  list: {
    width: '100%',
    marginTop: theme.spacing.unit * 2,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
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
  scroller: {
    flex: '1 1 auto',
  },
  disabled: {
    pointerEvents: 'none',
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
    if(this.props.tags.length !== prevProps.tags.length || this.props.location.search !== prevProps.location.search) {
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

    const {props: {tags}, page} = this;

    this.clearData();

    const selector = {
      selector: {
        sorting_field: {$gte: 0},
        tags: {$ne: null}
      },
      fields: ['_id', 'id', 'name', 'h1', 'introduction', 'date', 'author', 'tags', 'acl'],
      use_index: 'sorting_field_tags',
      sort: [{'sorting_field': 'asc'}],
      skip: page * 30,
      limit: 30,
    };
    if(tags.length) {
      selector.selector.tags = {
        $elemMatch: {
          $in: tags
        }
      };
    }
    return $p.cat.articles.pouch_db.find(selector)
      .then((res) => {
        for(let i=0; i < res.docs.length; i++) {
          list.set(i, res.docs[i]);
        }
        if(!res.docs.length) {
          list.set(0, {name: `Нет статей на странице №${page + 1}`, introduction: 'Проверьте фильтр по категориям и параметр page в url'});
        }
        this.setState({
          prev: false,
          next: res.docs.length === 30,
        });
      });
  }


  renderRows = () => {
    const {classes, match, handleNavigate} = this.props;
    const res = [];

    for(const [key, value] of list) {
      res.push(<ArticleRow key={key} row={value} match={match} handleNavigate={handleNavigate} classes={classes}/>);
    }

    return res;
  }

  render() {
    const {props: {classes, match, handleNavigate}, page} = this;
    const {prev, next} = this.state;

    return [
      <List key="list" className={classes.list}>
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
  classes: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  handleNavigate: PropTypes.func.isRequired,
};

export default withStyles(styles)(MUiArticles);
