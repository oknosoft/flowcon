/**
 *
 *
 * @module refill
 *
 * Created by Evgeniy Malyarov on 27.08.2018.
 */

const PouchDB = require('pouchdb');
const seed = require('superlogin/lib/pouchdb-seed-design');
const config = require('../config/superlogin.config.server');

// получаем параметры сеанса
const {DBUSER, DBPWD, COUCHPATH} = process.env;

function getDesignDoc(docName) {
  if(!docName) {
    return null;
  }
  var designDoc;
  var designDocDir = './design';
  try {
    designDoc = require(designDocDir + '/' + docName);
  }
  catch(err) {
    console.warn('Design doc: ' + designDocDir + '/' + docName + ' not found.');
    designDoc = null;
  }
  return designDoc;
};

const ddocs = config.userDBs.model.fl_0_doc.designDocs.map(getDesignDoc);

const dbs = new PouchDB(`${COUCHPATH}/_all_dbs`, {
  auth: {
    username: DBUSER,
    password: DBPWD
  },
  skip_setup: true
});

dbs.info()
  .then((docs) => {
    return docs.reduce((sum, doc) => {
      if(doc.indexOf('fl_0_doc$') === -1) {
        return sum;
      }
      return sum.then(() => {
        const db = PouchDB(`${COUCHPATH}/${doc}`, {
          auth: {
            username: DBUSER,
            password: DBPWD
          },
          skip_setup: true
        });
        return db.get('default')
          .then(() => {
            console.log('skip: ' + db.name);
          })
          .catch((err) => {
            const promises = []
            if (err.status === 404) {
              ddocs.forEach((dDoc) => {
                if(dDoc) {
                  if(dDoc._no_design) {
                    const doc = Object.assign({}, dDoc);
                    delete doc._no_design;
                    promises.push(seed(db, doc, true));
                  }
                  else {
                    promises.push(seed(db, dDoc));
                  }
                }
                else {
                  console.warn('Failed to locate design doc: ' + ddName);
                }
              });
              console.log(db.name);
              return Promise.all(promises);
            }
          });
      });
    }, Promise.resolve());
  });


