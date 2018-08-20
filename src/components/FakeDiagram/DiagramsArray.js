/**
 * Swipeable массив диаграмм
 *
 * @module DiagramsArray
 *
 * Created by Evgeniy Malyarov on 20.08.2018.
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fullscreenable from 'react-fullscreenable';
import Diagram from './Diagram';

class DiagramsArray extends Component {

  state = {fullscreen: null};

  prev = () => {
    const {isFullscreen} = this.props;
    if(this.state.fullscreen > 0) {
      this.setState({fullscreen: this.state.fullscreen - 1});
    }
  };

  next = () => {
    const {diagrams} = this.props;
    if(this.state.fullscreen < diagrams.length - 1) {
      this.setState({fullscreen: this.state.fullscreen + 1});
    }
  };

  toggleFullscreen(key) {
    this.props.toggleFullscreen();
    this.setState({fullscreen: this.state.fullscreen === key ? null : key});
  }

  render() {
    const {width, classes, diagrams, isFullscreen} = this.props;
    const fullscreen = isFullscreen && this.state.fullscreen;

    return diagrams.length ?
      (
        fullscreen ? <Diagram
          key={`d-${fullscreen}`}
          ref={(el) => this[`d-${fullscreen}`] = el}
          width={width}
          data={diagrams[fullscreen]}
          classes={classes}
          isFullscreen={isFullscreen}
          toggleFullscreen={this.toggleFullscreen.bind(this, fullscreen)}
          prev={this.prev}
          next={this.next}
        />
        :
          diagrams.map((data, key) => <Diagram
            key={`d-${key}`}
            ref={(el) => this[`d-${key}`] = el}
            width={width}
            data={data}
            classes={classes}
            isFullscreen={isFullscreen}
            toggleFullscreen={this.toggleFullscreen.bind(this, key)}
            prev={this.prev}
            next={this.next}
          />)
      )
      :
      <div><CircularProgress size={24} /> Загрузка...</div>;
  }
}

DiagramsArray.propTypes = {
  classes: PropTypes.object.isRequired,
  width: PropTypes.number.isRequired,
  diagrams: PropTypes.array.isRequired,
  toggleFullscreen: PropTypes.func,
  isFullscreen: PropTypes.bool,
};

export default Fullscreenable()(DiagramsArray);
