/**
 * ### Диаграмма
 * обработчики событий и модификаторы данных
 *
 * Created by Evgeniy Malyarov on 16.08.2018
 */

import {connect} from 'react-redux';
import withStyles from './styles';
import compose from 'recompose/compose';

function mapStateToProps(state, {user}) {
  return {
    diagrams() {
      // если вход не выполнен, рисуем всплывающее сообщение
      const {superlogin, adapters: {pouch}, classes} = $p;
      let reports, doc;
      if(user.logged_in) {
        if(pouch.remote.reports && pouch.remote.reports.name.indexOf(superlogin.getSession().token) !== -1) {
          reports = pouch.remote.reports;
        }
        else {
          const rurl = superlogin.getDbUrl('reports');
          if(rurl) {
            const dbpath = pouch.dbpath('reports');
            const dbname = rurl.substr(rurl.lastIndexOf('/'));
            reports = pouch.remote.reports = new classes.PouchDB(dbpath.substr(0, dbpath.lastIndexOf('/')) + dbname, {skip_setup: true, adapter: 'http'});
          }
        }
        doc = pouch.remote.doc;
      }
      else {
        reports = doc = pouch.remote.remote;
      }
      return doc.allDocs({include_docs: true, keys: ['default', user.name]})
        .then(({rows}) => {
          let charts;
          for(const row of rows) {
            if(row.doc && (row.id === user.name || !charts)){
              charts = row.doc.charts;
            }
          }
          if(!charts && reports !== doc) {
            return reports.allDocs({include_docs: true, keys: ['default', user.name]})
              .then(({rows}) => {
                for(const row of rows) {
                  if(row.doc && (row.id === user.name || !charts)){
                    charts = row.doc.charts;
                  }
                }
                return charts;
              });
          }
          return charts;
        })
        .then((charts) => {
          return charts ?
            Promise.all(charts.map((chart) => {
              const path = chart.split('/');
              const db = path[0] === 'doc' ? doc : reports;
              return db.get(path[1]);
            })) : [];
        });
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
