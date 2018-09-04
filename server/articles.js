/**
 * ### middleware
 * для смешанного рендеринга
 */

const PouchDB = require('pouchdb');
const https = require('https');

const cache = new Map();
const timeout = 600000;

module.exports = function (superlogin) {

  // подключимся к базе со статьями
  const db = new PouchDB(superlogin.couchAuthDB.name.replace(/_users$/, 'fl_0_remote'), {skip_setup: true});
  db.info()
    .then(info => {
      console.log(info);
    });

  // вернём роутер
  return function (req, res, next) {
    index()
      .then((html) => {
        const key = req.url.replace(/^\/(articles|files|news)/, '').replace(/^\//, '').split('?')[0];
        if(!key) {
          res.status(200).send(html);
        }
        doc(db, key)
          .then((doc) => {
            res.status(200).send(fill(html, doc));
          })
          .catch(() => {
            console.err(err);
            res.status(200).send(html);
          });
      });
  }
}

function index() {
  return new Promise((resolve, reject) => {
    const tmp = cache.get('index.html');
    if(tmp && tmp.time + timeout > Date.now()) {
      return resolve(tmp.html);
    }

    https.get(process.env.SERVER_URL, (res) => {
      let rawData = '';
      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
        cache.set('index.html', {time: Date.now(), html: rawData});
        resolve(rawData);
      });
      res.on('error', (e) => {
        resolve(tmp.html);
      });
    });
  });
}

function doc(db, key) {
  const tmp = cache.get(key);
  if(tmp && tmp.time + timeout > Date.now()) {
    return Promise.resolve(tmp.doc);
  }
  return db.query('doc/number_doc', {
    key: ['cat.articles', 0, key],
    limit: 1,
    include_docs: true,
  })
    .then(({rows}) => {
      if(rows.length) {
        cache.set(key, {time: Date.now(), doc: rows[0].doc});
        return rows[0].doc;
      }
    });
}

function fill(html, doc) {
  if(!doc) return html;
  const title = doc.h1 || doc.name;
  const descr = doc.descr || doc.introduction;
  html = html.replace(
    '<title>Программирование бизнеса</title>',
    `<title>${title}</title>`);
  html = html.replace(
    '<meta property="og:title" content="Программирование бизнеса" data-react-helmet="true">',
    `<meta property="og:title" content="${title}" data-react-helmet="true">`);
  html = html.replace(
    '<meta name="description" content="Сайт для владельцев и руководителей о решении проблем управления бизнесом" data-react-helmet="true">',
    `<meta name="description" content="${descr}" data-react-helmet="true">`);
  html = html.replace(
    '<meta property="og:description" content="Сайт для владельцев и руководителей о решении проблем управления бизнесом" data-react-helmet="true">',
    `<meta property="og:description" content="${descr}" data-react-helmet="true">`);
  return html;
}

