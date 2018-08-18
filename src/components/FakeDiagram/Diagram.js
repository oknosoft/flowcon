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
import Bar from './Bar';

let Recharts;

function TypedDiagram(props) {
  switch (props.data.kind) {
  case 'bar':
  case undefined:
    return Bar(props);
  default:
    return <div>{`Неизвестный тип диаграммы '${props.data.kind}'`}</div>;
  }
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
      Recharts && <TypedDiagram key="diagram" width={width} data={data} isFullscreen={isFullscreen} Recharts={Recharts}/>,
      ];
  }
}

Diagram.propTypes = {
  width: PropTypes.number.isRequired,
  data: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  isFullscreen: PropTypes.bool,
  toggleFullscreen: PropTypes.func,
};

export default Fullscreenable()(Diagram);
