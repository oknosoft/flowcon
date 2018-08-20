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
import Swipeable from 'react-swipeable';
import Bar from './Bar';
import Line from './Line';

let Recharts;

function TypedDiagram(props) {
  const {kind} = props.data;
  return <Swipeable onSwipingLeft={props.swipingLeft} onSwipingRight={props.swipingRight} delta={20}>
    {kind === 'bar' ?
      Bar(props) :
      (
        kind === 'line' ?
          Line(props) :
          (
            kind === 'pie' ?
              Bar(props) :
              (
                <div>{`Неизвестный тип диаграммы '${props.data.kind}'`}</div>
              )
          )
      )
    }
  </Swipeable>;
}

class Diagram extends React.Component {

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
    const {width, data, classes, isFullscreen, toggleFullscreen, prev, next} = this.props;
    return [
      <div key="title" className={classes.container}>
        <Typography variant="title" component="h3" color="primary" className={classes.flex}>{data.title}</Typography>
        <IconButton title={isFullscreen ? 'Свернуть' : 'Развернуть'} onClick={toggleFullscreen}>
          {isFullscreen ? <FullscreenExitIcon/> : <FullscreenIcon/>}
        </IconButton>
      </div>,
      !Recharts && <div key="loading"><CircularProgress size={24} /> Загрузка...</div>,
      Recharts && <TypedDiagram
        key="diagram"
        Recharts={Recharts}
        swipingLeft={prev}
        swipingRight={next}
        width={width}
        data={data}
        isFullscreen={isFullscreen}/>,
      ];
  }
}

Diagram.propTypes = {
  width: PropTypes.number.isRequired,
  data: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  isFullscreen: PropTypes.bool,
  toggleFullscreen: PropTypes.func,
  prev: PropTypes.func,
  next: PropTypes.func,
};

export default Diagram;
