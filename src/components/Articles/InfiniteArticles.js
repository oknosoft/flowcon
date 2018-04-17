/**
 * Бесконечный список статей
 * @module Infinit
 *
 * Created by Evgeniy Malyarov on 17.04.2018.
 */

import React from 'react';
import PropTypes from 'prop-types';

import AutoSizer from 'react-virtualized/dist/es/AutoSizer';
import InfiniteLoader from 'react-virtualized/dist/es/InfiniteLoader';
import List from 'react-virtualized/dist/es/List';

import {withStyles} from 'material-ui/styles';


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
    alignItems: 'center',
    padding: '0 25px',
    borderBottom: '1px solid #e0e0e0',
  },
  placeholder: {
    display: 'inline-block',
    height: '1em',
    backgroundColor: '#DDD',
  }
});

class InfiniteArticles extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      loadedRowCount: 0,
      loadedRowsMap: {},
      loadingRowCount: 0,
    };

    this._timeoutIdMap = {};

    this._clearData = this._clearData.bind(this);
    this._isRowLoaded = this._isRowLoaded.bind(this);
    this._loadMoreRows = this._loadMoreRows.bind(this);
    this._rowRenderer = this._rowRenderer.bind(this);
  }

  componentWillUnmount() {
    Object.keys(this._timeoutIdMap).forEach(timeoutId => {
      clearTimeout(timeoutId);
    });
  }

  render() {

    const {loadedRowCount, loadingRowCount} = this.state;
    const {classes} = this.props;

    return (
      <InfiniteLoader
        isRowLoaded={this._isRowLoaded}
        loadMoreRows={this._loadMoreRows}
        rowCount={list.size}>
        {({onRowsRendered, registerChild}) => (
          <AutoSizer disableHeight>
            {({width}) => (
              <List
                ref={registerChild}
                className={classes.list}
                height={200}
                onRowsRendered={onRowsRendered}
                rowCount={list.size}
                rowHeight={this._getRowHeight}
                rowRenderer={this._rowRenderer}
                width={width}
              />
            )}
          </AutoSizer>
        )}
      </InfiniteLoader>
    );
  }

  _clearData() {
    list.clear();
    this.setState({
      loadedRowCount: 0,
      loadedRowsMap: {},
      loadingRowCount: 0,
    });
  }

  _isRowLoaded({index}) {
    const {loadedRowsMap} = this.state;
    return !!loadedRowsMap[index]; // STATUS_LOADING or STATUS_LOADED
  }

  _loadMoreRows({startIndex, stopIndex}) {
    const {loadedRowsMap, loadingRowCount} = this.state;
    const increment = stopIndex - startIndex + 1;

    for (let i = startIndex; i <= stopIndex; i++) {
      loadedRowsMap[i] = STATUS_LOADING;
    }

    this.setState({
      loadingRowCount: loadingRowCount + increment,
    });

    return $p.cat.articles.pouch_db.find({
      selector: {
        sorting_field: {$gt: 0},
        tags: {
          $elemMatch: {
            $in: [
              'da3c6aab-4241-11e8-8505-d85d4c80ec2a',
              '507e3e9d-418d-11e8-8505-d85d4c80ec2a'
            ]
          }
        }
      },
      fields: ['_id', 'id', 'name', 'h1', 'introduction', 'date', 'author', 'tags'],
      use_index: 'sorting_field_tags',
      sort: [{'sorting_field': 'asc'}]
    })
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
      return 60;
    }
    else {
      return 40;
    }
  }

  _rowRenderer({index, key, style}) {
    const {loadedRowsMap} = this.state;
    const {classes} = this.props;

    let content;
    const row = list.get(index);
    if(row) {
      content = row.name;
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
};

export default withStyles(styles)(InfiniteArticles);
