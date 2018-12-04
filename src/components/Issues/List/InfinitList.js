/**
 * Динамический список задач
 *
 * @module InfinitList
 *
 * Created by Evgeniy Malyarov on 27.11.2018.
 */

import React from 'react';
import PropTypes from 'prop-types';

import List from 'react-virtualized/dist/es/List';

export default function InfinitList(props) {

  const {_list, ...others} = props;

  function rowRenderer({index, key, style}) {

    const row = _list[index + 1];

    return row ?
      <div key={key} style={style}>
        {row ? row.date : '...'}
      </div>
      :
      null;
  }

  return <List {...others} rowRenderer={rowRenderer} />;
}

