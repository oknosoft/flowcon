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
import AppContent from 'metadata-react/App/AppContent';
import Diagram from './Diagram';

const ltitle = 'Диаграммы';

function DiagramsArray() {
  return [
    <Diagram key="0" />
  ];
}

export default class Diagrams extends React.Component {

  componentDidMount() {
    this.shouldComponentUpdate(this.props);
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
    return <AppContent>
      <Helmet title={ltitle}>
        <meta name="description" content="Комплект диаграмм" />
      </Helmet>
      <DiagramsArray />
    </AppContent>;
  }
}
