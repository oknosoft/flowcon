/**
 * ### middleware
 * для смешанного рендеринга
 */

const https = require('https');
const marked = require('marked');
const sitemap = require('./sitemap');
const fs = require('fs');

let pluginFind;
try {
  pluginFind = require('superlogin/node_modules/pouchdb-find');
}
catch(err) {
  pluginFind = require('pouchdb-find');
}
const PouchDB = require('pouchdb').plugin(pluginFind);

const cache = new Map();
const timeout = 600000;

module.exports = function (superlogin) {

  // подключимся к базе со статьями
  const db = new PouchDB(superlogin.couchAuthDB.name.replace(/_users$/, 'fl_0_remote'), {skip_setup: true});

  // вернём роутер
  return function (req, res, next) {
    sitemap(req, res, () => index()
      .then((html) => {
        const key = req.url.replace(/^\/(articles|files|news)/, '').replace(/^\//, '').split('?')[0];
        if(!key) {
          return res.send(html);
        }
        doc(db, key)
          .then((doc) => {
            res.send(fill(html, doc));
            if(!doc) {
              console.error(req.url);
            }
          })
          .catch((err) => {
            res.send(html);
            console.error(`${req.url}/n${err}`);
          });
      }), db);
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
        const {doc} = rows[0];
        if(doc.acl && doc.acl.includes('_anonymous')){
          cache.set(key, {time: Date.now(), doc: rows[0].doc});
          return rows[0].doc;
        }
      }
    });
}

function fill(html, doc) {
  if(!doc) return html;
  const title = doc.name;
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
  html = html.replace(
    '<div id="root"></div>',
    `<div id="root"><div style="max-width: 960px; padding-top: 48px; margin: auto;">
<h1>${doc.h1 || doc.name}</h1>${marked(doc.content || '')}</div></div>`);

  if(doc.img) {
    html = html.replace('https://business-programming.ru/imgs/flask_192.png', doc.img);
  }

  return html;
}

