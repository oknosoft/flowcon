/**
 * Состав диаграмм
 *
 * @module Composition
 *
 * Created by Evgeniy Malyarov on 01.09.2018.
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactDataGrid from 'metadata-external/react-data-grid.min';

const columns = [
  {key:"name", name: "Диаграмма"}
];

class Composition extends Component {

  rowSelection(rows) {
    return {
      showCheckbox: true,
      enableShiftSelect: true,
      selectBy: {
        keys: {
          rowKey: 'row',
          markKey: 'use',
          values: rows.filter(r => r.use).map(r => r.row)
        }
      },
      onRowsSelected: this.onRowsSelected,
      onRowsDeselected: this.onRowsDeselected,
    };
  }

  rowGetter = (i) => {
    return this.props.rows[i];
  };

  onRowsSelected = (select) => {
    for(const {row} of select) {
      row.use = true;
    }
    this.forceUpdate();
    this.props.changeCharts(this.props.rows);
  };

  onRowsDeselected = (select) => {
    for(const {row} of select) {
      row.use = false;
    }
    this.forceUpdate();
    this.props.changeCharts(this.props.rows);
  };

  render() {
    const {rows} = this.props;
    const height = 100 + rows.length * 30;
    return (
      <ReactDataGrid
        columns={columns}
        rowGetter={this.rowGetter}
        rowsCount={rows.length}
        minHeight={height > 260 ? 260 : height}
        minWidth={260}
        rowSelection={this.rowSelection(rows)}
      />
    );
  }

}

Composition.propTypes = {
  rows:       PropTypes.array.isRequired,
  changeCharts: PropTypes.func.isRequired,
};

export default Composition;
