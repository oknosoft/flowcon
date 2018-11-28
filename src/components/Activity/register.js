/**
 * Добавление-убавление активности
 *
 * @module register
 *
 * Created by Evgeniy Malyarov on 28.11.2018.
 */

export default function register(activity, minus = false) {

  const d = new Date();
  const _mgr = $p.doc.activity;
  return _mgr.adapter.local.doc.query('activity', {
    key: [d.getFullYear(), d.getMonth() + 1, d.getDate()],
    reduce: false,
  })
    .then(({rows}) => {
      let doc;
      for(const {id, value} of rows) {
        if(Object.keys(value)[0] == activity) {
          doc = _mgr.get(id.substr(13), 'promise');
          break;
        }
      }
      return doc;
    })
    .then((doc) => {
      if(!doc && minus) {
        return;
      }
      if(!doc) {
        doc = _mgr.create({date: new Date, activity}, false, true);
      }
      const delta = activity.by_default || 1;
      if(minus) {
        doc.value -= delta;
      }
      else {
        doc.value += delta;
      }
      return doc.save();
    });
}
