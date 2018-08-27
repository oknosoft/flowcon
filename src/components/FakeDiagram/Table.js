/**
 * ### Диаграмма Table
 *
 * @module Table
 *
 * Created by Evgeniy Malyarov on 18.08.2018.
 */

import React from 'react';
import PropTypes from 'prop-types';

import {chartData} from './Bar';
import ReactDataGrid from 'metadata-external/react-data-grid.min';


function Table ({width, height, data, isFullscreen}) {
  if(isFullscreen) {
    width = window.innerWidth - 16;
    height = window.innerHeight - 64;
  }
  else if(!height) {
    height = width <= 600 ? width * 1.2 : width / 2.6;
  }

  const _rows = chartData(data);
  function rowGetter(i) {
    return _rows[i];
  }

  function transform(column) {
    const res = {};
    if(column.presentation && column.name && !column.key){
      res.key = column.name;
      res.name = column.presentation;
    }
    else {
      res.key = column.key;
      res.name = column.name;
    }

    if(column.resizable) {
      res.resizable = column.resizable;
    }

    if(typeof column.width === 'number') {
      res.width = column.width;
    }
    else if(typeof column.width === 'string') {
      res.width = width * parseFloat(column.width.replace('%', '')) / 100;
    }
    return res;
  }

  return (
    <ReactDataGrid
      columns={data.columns.map(transform)}
      rowGetter={rowGetter}
      rowsCount={_rows.length}
      minHeight={Math.min(height, 320)}
      minWidth={width}
      minColumnWidth={100}
    />
  );
}

Table.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number,
  data: PropTypes.object.isRequired,
  isFullscreen: PropTypes.bool,
};

export default Table;
