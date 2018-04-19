/**
 * Бесконечный список статей
 * @module Infinit
 *
 * Created by Evgeniy Malyarov on 17.04.2018.
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import AutoSizer from 'react-virtualized/dist/es/AutoSizer';
import InfiniteLoader from 'react-virtualized/dist/es/InfiniteLoader';
import List from 'react-virtualized/dist/es/List';
import WindowScroller from 'react-virtualized/dist/es/WindowScroller';
import {withStyles} from 'material-ui/styles';
import ArticleRow from './ArticleRow';

const STATUS_LOADING = 1;
const STATUS_LOADED = 2;

const list = new Map();
list.set(0, {name: 'name0'});
list.set(1, {name: 'name'});
list.set(2, {name: 'name2'});

const styles = theme => ({
  list: {
    marginTop: theme.spacing.unit * 3,
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
  },
  scroller: {
    flex: '1 1 auto',
  }
});

class InfiniteArticles extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loadedRowCount: 0,
      loadedRowsMap: {},
      loadingRowCount: 0,
    };
  }

  componentDidUpdate(prevProps) {
    // If props/state signals that the underlying collection has changed,
    // Reload the most recently requested batch of rows:
    if(this.props.tags.length !== prevProps.tags.length) {
      this._loadMoreRows({
        startIndex: this._loadMoreRowsStartIndex,
        stopIndex: this._loadMoreRowsStopIndex
      });
    }
  }

  render() {

    const {classes} = this.props;

    //height={300}autoHeight
    return (

      <WindowScroller
        ref={this._setRef}
        scrollElement={window}>
        {({height, isScrolling, registerChild, onChildScroll, scrollTop}) => (
          <InfiniteLoader
            className={classes.scroller}
            isRowLoaded={this._isRowLoaded}
            loadMoreRows={this._loadMoreRows}
            rowCount={list.size}>
            {({onRowsRendered, registerChild}) => (
              <AutoSizer disableHeight>
                {({width}) => (
                  <List
                    ref={registerChild}
                    className={classes.list}
                    onRowsRendered={onRowsRendered}
                    rowCount={list.size}
                    rowHeight={this._getRowHeight}
                    rowRenderer={this._rowRenderer}
                    width={width}
                    height={height}
                    autoHeight
                  />
                )}
              </AutoSizer>
            )}
          </InfiniteLoader>
        )}
      </WindowScroller>
    );
  }

  _clearData = () => {
    list.clear();
    this.setState({
      loadedRowCount: 0,
      loadedRowsMap: {},
      loadingRowCount: 0,
    });
  }

  _isRowLoaded = ({index}) => {
    const {loadedRowsMap} = this.state;
    return !!loadedRowsMap[index]; // STATUS_LOADING or STATUS_LOADED
  }

  _loadMoreRows = ({startIndex, stopIndex}) => {
    const {loadedRowsMap, loadingRowCount} = this.state;
    const increment = stopIndex - startIndex + 1;

    this._loadMoreRowsStartIndex = startIndex;
    this._loadMoreRowsStopIndex = stopIndex;

    for (let i = startIndex; i <= stopIndex; i++) {
      loadedRowsMap[i] = STATUS_LOADING;
    }

    this.setState({
      loadingRowCount: loadingRowCount + increment,
    });

    const selector = {
      selector: {
        sorting_field: {$gt: 0},
        tags: {$ne: null}
      },
      fields: ['_id', 'id', 'name', 'h1', 'introduction', 'date', 'author', 'tags'],
      use_index: 'sorting_field_tags',
      sort: [{'sorting_field': 'asc'}]
    };
    if(this.props.tags.length) {
      selector.selector.tags = {
        $elemMatch: {
          $in: this.props.tags
        }
      };
    }
    return $p.cat.articles.pouch_db.find(selector)
      .then((res) => {
        this._clearData();
        for(let i=0; i < res.docs.length; i++) {
          list.set(i, res.docs[i]);
          loadedRowsMap[i] = STATUS_LOADED;
        }

        const {loadedRowCount, loadingRowCount} = this.state;
        this.setState({
          loadingRowCount: loadingRowCount - increment,
          loadedRowCount: loadedRowCount + increment,
        });
      });
  }

  _getRowHeight({index}) {
    const row = list.get(index);
    if(row) {
      return 70 + (row.introduction ? row.introduction.length / 6 : 0);
    }
    else {
      return 40;
    }
  }

  _rowRenderer = ({index, key, style}) => {
    const {classes, match, handleNavigate} = this.props;

    let content;
    const row = list.get(index);
    if(row) {
      content = <ArticleRow row={row} match={match} handleNavigate={handleNavigate} classes={classes}/>;
    }
    else {
      content = (
        <div className={classes.placeholder} style={{width: Math.floor(Math.random() * 200)}}/>
      );
    }

    return (
      <div className={classes.row} key={key} style={style}>
        {content}
      </div>
    );
  }
}

InfiniteArticles.propTypes = {
  tags: PropTypes.array.isRequired,
  classes: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  handleNavigate: PropTypes.func.isRequired,
};

export default withStyles(styles)(InfiniteArticles);
