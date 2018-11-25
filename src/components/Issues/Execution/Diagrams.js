/**
 * ### Комплект диаграмм
 * Получает настройки из профиля пользователя и выводит пачку
 *
 * @module Diagrams
 *
 * Created by Evgeniy Malyarov on 16.08.2018.
 */

import React from 'react';
import PropTypes from 'prop-types';

import Helmet from 'react-helmet';
import AutoSizer from 'react-virtualized/dist/es/AutoSizer';
import AppContent from 'metadata-react/App/AppContent';
import DiagramsArray from 'metadata-react/Diagrams/DiagramsArray';
import withStyles from 'metadata-react/Diagrams/styles';
import {withIface} from 'metadata-redux';
import calculate from './calculate';

const ltitle = 'Исполнение задач';
const descr = 'Диаграммы исполнения задач';

class ExecutionDiagrams extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      diagrams: [],
      grid: '3',
      reseted: false,
    };
  }

  componentDidMount() {
    this.shouldComponentUpdate(this.props);
    $p.doc.issue._indexer._mgrs.forEach((_mgr) => _mgr.on('change', this.calculate));
    setTimeout(() => this.calculate(), 200);
  }

  componentWillUnmount() {
    $p.doc.issue._indexer._mgrs.forEach((_mgr) => _mgr.off('change', this.calculate));
  }

  calculate = () => {
    Promise.resolve()
      .then(() => this.setState({diagrams: calculate()}));
  };


  shouldComponentUpdate({handleIfaceState, title, user}) {
    if(title != ltitle) {
      handleIfaceState({
        component: '',
        name: 'title',
        value: ltitle,
      });
      return false;
    }
    return true;
  }

  render() {
    const {props: {classes}, state: {diagrams, grid}}  = this;

    return <AppContent fullWidth>
      <Helmet title={ltitle}>
        <meta name="description" content={descr} />
        <meta property="og:title" content={ltitle} />
        <meta property="og:description" content={descr} />
      </Helmet>
      <AutoSizer disableHeight style={{overflow: 'hidden', width: '100%', paddingBottom: 48}}>
        {({width}) => <DiagramsArray
          width={width}
          classes={classes}
          diagrams={diagrams}
          grid={grid}
        />}
      </AutoSizer>
    </AppContent>;
  }
}

ExecutionDiagrams.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  handleIfaceState: PropTypes.func.isRequired,
  user: PropTypes.object,
};

export default withIface(withStyles(ExecutionDiagrams));
