import React from 'react';
import PropTypes from 'prop-types';

/**
 * ### Диаграмма Bar
 *
 * @module Bar
 *
 * Created by Evgeniy Malyarov on 18.08.2018.
 */

function CustomTooltip({type, payload, label, active}) {
  return active && <div>{`${label} : ${payload[0].value}`}</div>;
}

function Bar({width, data, isFullscreen, Recharts}) {
  const {BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend} = Recharts;
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
    <BarChart width={width} height={height} margin={{left: isFullscreen ? 0 : -16, top: 8}} data={data.rows.map((v) => {
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
      {data.customTooltip ?
        <Tooltip content={<CustomTooltip/>}/>
        :
        !data.hideTooltip && <Tooltip/>
      }
      {!data.hideLegend && <Legend/>}
      {data.customCell ?
        data.series.map((ser, key) => <Bar key={`ser-${key}`} dataKey={ser.name} fill={ser.color || '#8884d8'}>
          {
            data.rows.map((entry, key) => (
              <Cell key={`cell-${key}`} fill={entry[ser.name].color}/>
            ))
          }
          </Bar>)
        :
        data.series.map((ser, key) => <Bar key={`ser-${key}`} dataKey={ser.name} fill={ser.color || '#8884d8'} />)
      }
    </BarChart>
  );
}

Bar.propTypes = {
  width: PropTypes.number.isRequired,
  data: PropTypes.object.isRequired,
  isFullscreen: PropTypes.bool,
};

export default Bar;
