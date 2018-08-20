/**
 * ### Диаграмма Line
 *
 * @module Line
 *
 * Created by Evgeniy Malyarov on 18.08.2018.
 */

import React from 'react';
import PropTypes from 'prop-types';

function Line({width, data, isFullscreen, Recharts}) {
  const {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} = Recharts;
  let height;
  if(isFullscreen) {
    width = window.innerWidth - 16;
    height = window.innerHeight - 64;
  }
  else {
    height = width < 400 ? width * 1.2 : width / 1.8;
  }
  const xDataKey = data.points && data.points.length && data.points[0].name || 'name';

  return (
    <LineChart width={width} height={height} margin={{left: isFullscreen ? 0 : -8, top: 8, bottom: 8}} data={data.rows.map((v) => {
      const clone = {};
      for(const fld in v) {
        const val = v[fld];
        clone[fld] = typeof val === 'object' ? val.value : val;
      }
      return clone;
    })}>
      <CartesianGrid strokeDasharray="3 3"/>
      {!data.hideXAxis && <XAxis dataKey={xDataKey}/>}
      {!data.hideYAxis && <YAxis/>}
      {!data.hideTooltip && <Tooltip/>}
      {!data.hideLegend && <Legend/>}
      {
        data.series.map((ser, key) =>
          <Line key={`ser-${key}`} type="monotone" dataKey={ser.name} stroke={ser.color || '#8884d8'} activeDot={{r: 6}} />)
      }
    </LineChart>

  );
}

Line.propTypes = {
  width: PropTypes.number.isRequired,
  data: PropTypes.object.isRequired,
  isFullscreen: PropTypes.bool,
  Recharts: PropTypes.func.isRequired,
};

export default Line;
