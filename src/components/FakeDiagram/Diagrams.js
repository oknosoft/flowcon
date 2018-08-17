/**
 * ### Комплект диаграмм
 * Получает настройки из профиля пользователя и выводит пачку
 *
 * @module Diagrams
 *
 * Created by Evgeniy Malyarov on 16.08.2018.
 */

import React from 'react';
import Helmet from 'react-helmet';
import AutoSizer from 'react-virtualized/dist/es/AutoSizer';
import AppContent from 'metadata-react/App/AppContent';
import Diagram from './Diagram';
import connect from './connect';
import PropTypes from 'prop-types';

const ltitle = 'Диаграммы';
const data = [
  {name: 'Page A', uv: 4000, pv: 2400, amt: 2400},
];

function DiagramsArray({width, classes}) {
  return [
    <Diagram key="0" width={width} data={data} classes={classes}/>
  ];
}

class Diagrams extends React.Component {

  state = {diagrams: []};

  componentDidMount() {
    const {props} = this;
    this.shouldComponentUpdate(this.props);
    props.diagrams()
      .then(diagrams => this.setState({diagrams}));
  }

  shouldComponentUpdate({handleIfaceState, title}) {
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
    const {classes} = this.props;
    return <AppContent>
      <Helmet title={ltitle}>
        <meta name="description" content="Комплект диаграмм" />
      </Helmet>
      <AutoSizer disableHeight style={{overflow: 'hidden', width: '100%'}}>
        {({width}) => <DiagramsArray width={width} classes={classes}/>}
      </AutoSizer>
    </AppContent>;
  }
}

Diagrams.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  handleIfaceState: PropTypes.func.isRequired,
  diagrams: PropTypes.func.isRequired,
};

export default connect(Diagrams);
