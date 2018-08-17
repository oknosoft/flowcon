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


function Bar({width, data, isFullscreen}) {
  const {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend} = Recharts;
  let height;
  if(isFullscreen) {
    width = window.innerWidth - 16;
    height = window.innerHeight - 64;
  }
  else {
    height = width < 400 ? width * 1.2 : width / 1.6;
  }
  return (
    <BarChart width={width} height={height} data={data} margin={{left: isFullscreen ? 0 : -16, top: 8}}>
      <CartesianGrid strokeDasharray="3 3"/>
      {data.length > 1 && <XAxis dataKey="name"/>}
      <YAxis/>
      <Tooltip/>
      <Legend />
      {[
      <Bar key={0} dataKey="pv" fill="#8884d8" />,
      <Bar key={1} dataKey="uv" fill="#82ca9d" />
      ]}
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
        <Typography variant="title" component="h3" color="primary" className={classes.flex}>Это диаграмма</Typography>
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
};

Diagram.propTypes = {
  width: PropTypes.number.isRequired,
  data: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  isFullscreen: PropTypes.bool,
  toggleFullscreen: PropTypes.func,
};

export default Fullscreenable()(Diagram);
