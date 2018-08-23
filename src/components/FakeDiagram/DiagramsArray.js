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
    const {props: {diagrams}, state: {fullscreen}} = this;
    if(fullscreen > 0) {
      this.setState({fullscreen: fullscreen - 1});
    }
    else if(fullscreen !== null) {
      this.setState({fullscreen: diagrams.length - 1});
    }
  };

  next = () => {
    const {props: {diagrams}, state: {fullscreen}} = this;
    if(fullscreen !== null) {
      if(fullscreen < diagrams.length - 1) {
        this.setState({fullscreen: fullscreen + 1});
      }
      else {
        this.setState({fullscreen: 0});
      }
    }
  };

  toggleFullscreen(key) {
    this.props.toggleFullscreen();
    this.setState({fullscreen: this.state.fullscreen === key ? null : key});
  }

  renderGrid() {

  }

  renderDiagram({width, classes, data, key, isFullscreen}) {
    return <Diagram
      key={`d-${key}`}
      ref={(el) => this[`d-${key}`] = el}
      width={width}
      data={data}
      classes={classes}
      isFullscreen={isFullscreen}
      toggleFullscreen={this.toggleFullscreen.bind(this, key)}
      prev={this.prev}
      next={this.next}
    />;
  }

  render() {
    const {width, classes, diagrams, isFullscreen} = this.props;
    const fullscreen = isFullscreen && this.state.fullscreen;

    return diagrams.length ?
      (
        typeof fullscreen === 'number' ?
          this.renderDiagram({width, classes, data: diagrams[fullscreen], key: fullscreen, isFullscreen})
        :
          diagrams.map((data, key) => this.renderDiagram({width, classes, data, key, isFullscreen}))
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
