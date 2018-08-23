/**
 * ### Диаграмма
 * обработчики событий и модификаторы данных
 *
 * Created by Evgeniy Malyarov on 16.08.2018
 */

import {connect} from 'react-redux';
import withStyles from './styles';
import compose from 'recompose/compose';
import qs from 'qs';

function mapStateToProps(state, {user}) {

  const changes = [];

  function dbs() {
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
      doc = pouch.local.doc;
    }
    else {
      reports = doc = pouch.remote.remote;
    }
    return {reports, doc};
  }

  function charts(reports, doc) {
    return doc.allDocs({include_docs: true, keys: ['default', user.name]})
      .then(({rows}) => {
        let settings;
        for(const row of rows) {
          if(row.doc && (row.id === user.name || !settings)){
            settings = row.doc;
          }
        }
        if(!settings && reports !== doc) {
          return reports.allDocs({include_docs: true, keys: ['default', user.name]})
            .then(({rows}) => {
              for(const row of rows) {
                if(row.doc && (row.id === user.name || !settings)){
                  settings = row.doc;
                }
              }
              return settings;
            });
        }
        return settings;
      });
  }

  function unsubscribe() {
    for(const ch of changes) {
      ch.cancel();
    }
    changes.length = 0;
  }

  function grid() {
    const query = qs.parse(location.search.replace('?',''));
    if(query.grid) {
      return Promise.resolve(query.grid);
    }

    const {reports, doc} = dbs();
    charts(reports, doc)
  }

  return {
    diagrams() {
      unsubscribe();
      const {reports, doc} = dbs();
      return charts(reports, doc)
        .then(({charts}) => {
          return charts ?
            Promise.all(charts.map((chart) => {
              const path = chart.split('/');
              const db = path[0] === 'doc' ? doc : reports;
              return db.get(path[1]);
            })) : [];
        });
    },

    subscribe(onChange) {
      const {reports, doc} = dbs();
      charts(reports, doc)
        .then(({charts}) => {
          if(!charts) return;
          const map = new Map;
          for(const chart of charts) {
            const path = chart.split('/');
            const db = path[0] === 'doc' ? doc : reports;
            if(!map.has(db)){
              map.set(db, []);
            }
            map.get(db).push(path[1]);
          }
          for(const [db, keys] of map) {
            changes.push(db.changes({
              since: 'now',
              live: true,
              selector: {_id: {$in: keys}}
            })
              .on('change', onChange)
            );
          }
        });
    },

    grid,

    unsubscribe
  };
}

// function mapDispatchToProps(dispatch) {
//   return {};
// }

export default compose(
  withStyles,
  connect(mapStateToProps /*, mapDispatchToProps */),
);
