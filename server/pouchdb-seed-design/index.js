var objmap = require('object-map');
var objfilter = require('object-filter');
var objkeysmap = require('object-keys-map');
var objmaptoarr = require('object-map-to-array');
var objsome = require('object-some');

if(typeof Promise !== 'function') {
  var Promise = require('lie');
}

function addDesign(s) {
  return '_design/' + s;
}

function normalizeDoc(doc, id) {
  var normalized = {
    _id: id || doc._id,
    _rev: doc._rev
  };
  if(doc.language) normalized.language = doc.language;
  if(doc.views) normalized.views = objmap(doc.views, normalizeView);
  if(doc.updates) normalized.updates = objmap(doc.updates, stringify);
  if(doc.filters) normalized.filters = objmap(doc.filters, stringify);
  if(doc.lists) normalized.lists = objmap(doc.lists, stringify);
  if(doc.shows) normalized.shows = objmap(doc.shows, stringify);
  if(doc.validate_doc_update) normalized.validate_doc_update = stringify(doc.validate_doc_update);
  return normalized;
}

function stringify(obj) {
  return obj.toString();
}

function normalizeView(view) {
  var r = {};
  if (typeof view === 'function' || typeof view === 'string') {
    return { map: view.toString() };
  }
  // Make sure that functions are stringified.
  if (view.map) {
    // oknosoft
    if(view.map.fields){
      return view;
    }
    r.map = view.map.toString();
  }
  if (view.reduce) {
    r.reduce = view.reduce.toString();
  }
  return r;
}

function objEqual(a, b) {
  // If neither are specified, they are equal
  if(!a && !b) {
    return true;
  }
  // if either a or b exist, but one of them is undefined they are not equal
  if((a || b) && (!a || !b)) {
    return false;
  }
  // Crawl
  return !objsome(a, function (v, k) {
    return v !== b[k];
  });
}

function viewEqual(a, b) {
  if(!a && !b) {
    return true;
  }
  if((a || b) && (!a || !b)) {
    return false;
  }
  return b && a.map === b.map && a.reduce === b.reduce;
}

function viewsEqual(a, b) {
  // If neither are specified, they are equal
  if(!a && !b) {
    return true;
  }
  // if either a or b exist, but one of them is undefined they are not equal
  if((a || b) && (!a || !b)) {
    return false;
  }
  return !objsome(a, function (v, k) {
    return !viewEqual(v, b[k]);
  });
}

function docEqual(local, remote) {
  if (!remote) {
    return false;
  }

  return viewsEqual(local.views, remote.views) &&
         objEqual(local.updates, remote.updates) &&
         objEqual(local.filters, remote.filters) &&
         objEqual(local.lists, remote.lists) &&
         objEqual(local.shows, remote.shows) &&
         local.validate_doc_update === remote.validate_doc_update;
}

module.exports = function (db, design, cb) {
  if (!db || !design) {
    throw new TypeError('`db` and `design` are required');
  }

  var local = objmap(objkeysmap(design, addDesign), normalizeDoc);

  var seedPromise = db.allDocs({ include_docs: true, keys: Object.keys(local) })

    .then(function (docs) {

      var diff;
      var remote = {};
      var update;

      docs.rows.forEach(function (doc) {
        if (doc.doc) {
          remote[doc.key] = normalizeDoc(doc.doc);
        }
      });

      update = objmaptoarr(objfilter(local, function (value, key) {
        return !docEqual(value, remote[key]);
      }), function (v, k) {
        if (remote[k]) {
          v._rev = remote[k]._rev;
        }

        return v;
      });

      if (update.length > 0) {
        return db.bulkDocs({ docs: update });
      } else {
        return Promise.resolve(false);
      }
    })
    .then(function(result) {
      if(typeof cb === 'function') {
        cb(null, result);
      }
      return Promise.resolve(result);
    })
    .catch(function(err) {
      if(typeof cb === 'function') {
        cb(err, null);
      }
      console.log(err);
      return Promise.reject(err);
    });

  return seedPromise;

};
