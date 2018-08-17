/**
 * ### Диаграмма
 * обработчики событий и модификаторы данных
 *
 * Created by Evgeniy Malyarov on 16.08.2018
 */

import {connect} from 'react-redux';
import withStyles from './styles';
import compose from 'recompose/compose';

const diagrams = [
  {
    _id: 'first',
    title: 'Это диаграмма',
    rows: [
      {name: 'Page A',
        uv: {value: 4000, color: '#ff7f0e'},
        pv: {value: 2400, color: '#7f7f7f'},
        amt: 2400
      },
      {name: 'Page B',
        uv: {value: 3000, color: '#ff7f0e'},
        pv: {value: 2700, color: '#2ca02c'},
        amt: 2400
      },
    ],
    series: [{name: 'pv', color: '#7f7f7f'}, {name: 'uv', color: '#ff7f0e'}],
  }
];


function mapStateToProps(state, {user}) {
  return {
    diagrams() {
      // если вход не выполнен, рисуем всплывающее сообщение
      if(user.logged_in) {
        const {superlogin, adapters: {pouch}} = $p;
        let reports;
        if(pouch.remote.reports) {
          reports = pouch.remote.reports;
        }
        else {
          const rurl = superlogin.getDbUrl('reports');
          if(rurl) {
            let dbpath = pouch.dbpath('reports');
          }
        }
      }
      return Promise.resolve(diagrams);
    }
  };
}

// function mapDispatchToProps(dispatch) {
//   return {};
// }

export default compose(
  withStyles,
  connect(mapStateToProps /*, mapDispatchToProps */),
);
