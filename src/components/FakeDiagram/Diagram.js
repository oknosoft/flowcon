/**
 * ### Диаграмма
 * Рисует диаграмму
 *
 * @module Diagram
 *
 * Created by Evgeniy Malyarov on 16.08.2018.
 */

import React from 'react';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

let Recharts;

const data = [
  {name: 'Page A', uv: 4000, pv: 2400, amt: 2400},
];

function Bar() {
  const {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend} = Recharts;
  return (
    <BarChart width={300} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3"/>
      <XAxis dataKey="name"/>
      <YAxis/>
      <Tooltip/>
      <Legend />
      <Bar dataKey="pv" fill="#8884d8" />
      <Bar dataKey="uv" fill="#82ca9d" />
    </BarChart>
  );
}

export default class Diagram extends React.Component {

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
    return [
      <Typography key="title" variant="title" component="h3" color="primary">Это диаграмма</Typography>,
      !Recharts && <div key="loading"><CircularProgress size={24} /> Загрузка...</div>,
      Recharts && <Bar key="bar" />,
      ];
  }
}
