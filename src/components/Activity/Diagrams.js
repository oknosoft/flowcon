/**
 * Диаграмма активности
 *
 * @module Radar
 *
 * Created by Evgeniy Malyarov on 30.11.2018.
 */

import React from 'react';
import PropTypes from 'prop-types';

import AutoSizer from 'react-virtualized/dist/es/AutoSizer';
import DiagramsArray from 'metadata-react/Diagrams/DiagramsArray';
import withStyles from 'metadata-react/Diagrams/styles';

import {options} from './Periodicity';
import {categories} from './activity_options';
import {clrs} from '../Issues/Execution/calculate';

function radar({totals}) {
  return {
    title: "Радар активностей",
    description: "Радар баланса активностей",
    kind: "radar",
    hideLegend: false,
    points: [
      {
        name: "activity",
        presentation: "Активность"
      }
    ],
    series: [
      {
        name: "value",
        presentation: "Баланс",
        color: "#488436",
        opacity: 0.3
      }
    ],
    rows: categories.map((category) => ({
      value: totals.get(category) || 0,
      activity: category.presentation
    }))
  };
}

function bar({totals, periodicity, date}) {
  const row = {name: periodicity === 'date' ? moment(date).format('DD MMMM YYYY') : options[periodicity]};
  categories.forEach((category) => {
    row[category.predefined_name] = totals.get(category) || 0;
  });
  return {
    title: 'Гистограмма активностей',
    description: 'Гистограмма баланса активностей',
    rows: [row],
    series: categories.map((category, index) => ({name: category.predefined_name, presentation: category.presentation, color: clrs[index]})),
    kind: 'bar'
  };
}

function Diagrams(props) {

  const {classes} = props;
  const diagrams = [radar(props), bar(props)];

  return <AutoSizer disableHeight style={{overflow: 'hidden', width: '100%', paddingTop: 16, paddingBottom: 48}}>
    {({width}) => <DiagramsArray
      width={width}
      height={width / 3}
      classes={classes}
      diagrams={diagrams}
      grid="2"
    />}
  </AutoSizer>;
}

Diagrams.propTypes = {
  totals: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  date: PropTypes.object.isRequired,
  periodicity: PropTypes.string.isRequired,
};

export default withStyles(Diagrams);
