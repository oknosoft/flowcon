/**
 * Форма списка документа Задача
 *
 * @module FrmIssueList
 *
 * Created by Evgeniy Malyarov on 05.10.2018.
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import IconButton from '@material-ui/core/IconButton';
import DataList from 'metadata-react/DataList';
import WindowSizer from 'metadata-react/WindowSize';
import {withObj} from 'metadata-redux';
import qs from 'qs';


class FrmIssueList extends Component {

  constructor(props, context) {
    super(props, context);
    //this.state = {open: false};
  }

  handleSelect = (row, _mgr) => {
    this.handleRequestClose();
    this.props.handleSelect(row, _mgr);
  };

  find_rows = (selector) => {
    const {token, password} = $p.superlogin.getSession();
    const {$and} = selector.selector;

    if(!$and.some((elm) => Object.keys(elm)[0] === 'date')){
      $and.push({date: {$gte: moment().subtract(3, 'month').format()}});
      $and.push({date: {$lte: moment().add(1, 'day').format()}});
    }
    selector.sort = [{date: 'desc'}];

    return Promise.resolve()
      .then(() => {
        const data = $p.doc.issue._indexer.find(selector);
        data.docs = data.docs.map((src) => {
          const doc = Object.assign({}, src);
          doc.ref = doc._id.split('|')[1];
          delete doc._id;
          return doc;
        });
        return data;
      });

  };

  render() {

    const {props: {windowHeight, windowWidth, handlers, location}, state} = this;

    const sizes = {
      windowHeight,
      windowWidth,
      height: windowHeight > 480 ? windowHeight - 52 : 428,
      width: windowWidth > 800 ? windowWidth - (windowHeight < 480 ? 20 : 0) : 800
    };

    const prm = qs.parse(location.search.replace('?',''));

    return (
      <DataList
        _mgr={$p.doc.issue}
        _acl={'e'}
        _ref={prm.ref}
        handlers={handlers}
        find_rows={this.find_rows}
        //selectionMode
        //denyAddDel
        show_variants
        show_search
        //btns={<Statuses/>}
        {...sizes}
      />
    );
  }
}

FrmIssueList.propTypes = {
  handlers: PropTypes.object.isRequired,
};


export default WindowSizer(withObj(FrmIssueList));

