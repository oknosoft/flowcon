/**
 * ### Диаграмма
 * Рисует диаграмму
 *
 * @module Diagram
 *
 * Created by Evgeniy Malyarov on 16.08.2018.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import Fullscreenable from 'react-fullscreenable';

let Recharts;

function CustomTooltip({type, payload, label, active}) {
  return active && <div>{`${label} : ${payload[0].value}`}</div>;
}

function Bar({width, data, isFullscreen}) {
  const {BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend} = Recharts;
  let height;
  if(isFullscreen) {
    width = window.innerWidth - 16;
    height = window.innerHeight - 64;
  }
  else {
    height = width < 400 ? width * 1.2 : width / 1.8;
  }
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
      {data.rows.length > 1 && <XAxis dataKey="name"/>}
      <YAxis/>
      <Tooltip content={<CustomTooltip/>}/>
      <Legend/>
      {data.series.map((ser, key) => <Bar key={`ser-${key}`} dataKey={ser.name} fill={ser.color}>
        {
          data.rows.map((entry, key) => (
            <Cell key={`cell-${key}`} fill={entry[ser.name].color}/>
          ))
        }
      </Bar> /*fill="#8884d8"*/)}
    </BarChart>
  );
}

class Diagram extends React.Component {

  state = {fullscreen: false};

  componentDidMount() {
    if(!Recharts) {
      import('recharts')
        .then((module) => {
          Recharts = module;
          this.forceUpdate();
        });
    }
  }

  render() {
    const {width, data, classes, isFullscreen, toggleFullscreen} = this.props;
    return [
      <div key="title" className={classes.container}>
        <Typography variant="title" component="h3" color="primary" className={classes.flex}>{data.title}</Typography>
        <IconButton title={isFullscreen ? 'Свернуть' : 'Развернуть'} onClick={toggleFullscreen}>
          {isFullscreen ? <FullscreenExitIcon/> : <FullscreenIcon/>}
        </IconButton>
      </div>,
      !Recharts && <div key="loading"><CircularProgress size={24} /> Загрузка...</div>,
      Recharts && <Bar key="bar" width={width} data={data} isFullscreen={isFullscreen}/>,
      ];
  }
}

Bar.propTypes = {
  width: PropTypes.number.isRequired,
  data: PropTypes.object.isRequired,
  isFullscreen: PropTypes.bool,
};

Diagram.propTypes = {
  width: PropTypes.number.isRequired,
  data: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  isFullscreen: PropTypes.bool,
  toggleFullscreen: PropTypes.func,
};

export default Fullscreenable()(Diagram);
