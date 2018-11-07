/**
 *
 *
 * @module superlogin
 *
 * Created by Evgeniy Malyarov on 07.11.2018.
 */

export default function ($p) {
  if(process.env.NODE_ENV === 'development') {
    const {classes: {AdapterPouch}, adapters: {pouch}} = $p;
    pouch.dbpath = function(name) {
      return AdapterPouch.prototype.dbpath.call(this, name).replace('fl211:5984', 'localhost:8000/couchdb');
    };
  }
}
