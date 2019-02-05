/**
 * Форма списка документа Задача
 *
 * @module FrmIssueList
 *
 * Created by Evgeniy Malyarov on 05.10.2018.
 */

import React from 'react';
import PropTypes from 'prop-types';

import DataList from 'metadata-react/DataList';
import WindowSizer from 'metadata-react/WindowSize';

import {withObj} from 'metadata-redux';
import qs from 'qs';

import SelectMgr from './SelectMgr';
import Responsible from './Responsible';
import ExecutionMenuItem from '../Execution/MenuItem';
import InfinitList from './InfinitList';


class FrmIssueList extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.handlers = Object.assign({}, props.handlers);
    this.handlers.handleEdit = this.handleEdit.bind(this);
    this.handlers.handleAdd = this.handleAdd.bind(this);
    this.handlers.handleMarkDeleted = this.handleMarkDeleted.bind(this);
    this.state = {anchorEl: null, responsible: null};
  }

  componentDidMount() {
    if($p.doc.issue._indexer && $p.doc.issue._indexer._mgrs) {
      $p.doc.issue._indexer._mgrs.forEach((_mgr) => _mgr.on('change', this.handleChange));
    }
    else {
      setTimeout(() => this.componentDidMount(), 1000);
    }
  }

  componentWillUnmount() {
    $p.doc.issue._indexer &&
    $p.doc.issue._indexer._mgrs &&
    $p.doc.issue._indexer._mgrs.forEach((_mgr) => _mgr.off('change', this.handleChange));
  }

  handleChange = () => {
    this.filterChange && Promise.resolve().then(() => this.filterChange());
  };

  handleSelect = (row, _mgr) => {
    this.handleRequestClose();
    this.props.handleSelect(row, _mgr);
  };

  handleEdit({row: {_area}, ref, _mgr}) {
    this.props.handleEdit({ref: `${ref}?area=${_area}`, _mgr});
  }

  handleAdd(_mgr, event) {
    this.setState({anchorEl: event.currentTarget});
  }

  handleMarkDeleted({row: {_area}, ref, _mgr}) {
    let __mgr;
    _mgr._indexer._mgrs.some((mgr) => {
      if(mgr.cachable === _area){
        return __mgr = mgr;
      }
    });
    this.props.handleMarkDeleted({ref, _mgr: __mgr});
  }

  find_rows = (selector, scheme) => {
    const {$and} = selector.selector;

    if(!$and.some((elm) => Object.keys(elm)[0] === 'date')){
      $and.push({date: {$gte: moment().subtract(3, 'month').format()}});
      $and.push({date: {$lte: moment().add(1, 'day').format()}});
    }

    // дополняем селектор отбором по ответственному
    const {responsible} = this.state;
    responsible && !responsible.empty() && $and.push({responsible: responsible.valueOf()});

    // дополняем селектор отбором по булевым полям
    scheme.append_selection(selector.selector);

    selector.sort = [{date: 'desc'}];

    return Promise.resolve()
      .then(() => {
        const data = $p.doc.issue._indexer ? $p.doc.issue._indexer.find(selector) : $p.classes.RamIndexer.waitError();
        data.docs = data.docs.map((src) => {
          const doc = Object.assign({}, src);
          doc.ref = doc._id.split('|')[1];
          delete doc._id;
          return doc;
        });
        return data;
      });

  };

  handleMenuClose = () => {
    this.setState({anchorEl: null});
  };

  handleMenuSelect = (_mgr) => {
    this.props.handleAdd(_mgr);
  };

  handleResponsible = (responsible) => {
    this.setState({responsible}, () => {
      this.handleChange();
    });
  };

  handleSubFilter = (name) => {
    name = null;
  };

  getChildContext() {
    return {handleSubFilter: this.handleSubFilter};
  }

  render() {

    const {props: {windowHeight, windowWidth, location, handleNavigate}, state: {anchorEl, responsible}} = this;
    const sizes = {
      windowHeight,
      windowWidth,
      height: windowHeight > 480 ? windowHeight - 52 : 428,
      width: windowWidth > 800 ? windowWidth - (windowHeight < 480 ? 20 : 0) : 800,
    };
    const rowHeight = windowWidth > 480 ? 53 : 79;

    const prm = qs.parse(location.search.replace('?',''));

    return [
      <DataList
        key="list"
        _mgr={$p.doc.issue}
        _acl={'e'}
        _ref={prm.ref}
        {...sizes}
        handlers={this.handlers}
        find_rows={this.find_rows}
        rowHeight={rowHeight}
        toolbar2row
        show_variants
        show_search
        btns={<Responsible responsible={responsible} onChange={this.handleResponsible}/>}
        menu_items={[<ExecutionMenuItem key="execution" handleNavigate={handleNavigate}/>]}
        registerFilterChange={(filterChange) => this.filterChange = filterChange}
        GridRenderer={InfinitList}
      />,
      anchorEl && <SelectMgr key="select" anchorEl={anchorEl} onClose={this.handleMenuClose} onSelect={this.handleMenuSelect} />
      ];
  }
}

FrmIssueList.propTypes = {
  handlers: PropTypes.object.isRequired,
};

FrmIssueList.childContextTypes = {
  handleSubFilter: PropTypes.func,
};


export default WindowSizer(withObj(FrmIssueList));

