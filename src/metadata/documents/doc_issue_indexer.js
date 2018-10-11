/**
 *
 *
 * @module doc_issue
 *
 * Created by Evgeniy Malyarov on 11.10.2018.
 */

export default function indexer() {
  const {adapters: {pouch}, doc: {issue}, classes} = $p;
  const {remote} = pouch;
  const mngrs = [issue];
  for(const db in remote) {
    if(db !== 'remote' && db !== issue.cachable) {
      const mngr = new classes.DocManager($p.doc, 'doc.issue');
      mngr._cachable = db;
      mngrs.push(mngr);
    }
  }
  return Promise.resolve();
}
