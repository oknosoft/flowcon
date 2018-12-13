/**
 * Добавление-убавление активности
 *
 * @module register
 *
 * Created by Evgeniy Malyarov on 28.11.2018.
 */

export default function register(activity, minus = false) {

  this.setState({busy: true});

  const _mgr = $p.doc.activity;
  let {date} = this.props;
  if(!date) {
    date = new Date();
  }
  return _mgr.adapter.local.doc.query('activity', {
    key: [date.getFullYear(), date.getMonth() + 1, date.getDate()],
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
        doc = _mgr.create({date, activity}, false, true);
      }
      const delta = activity.by_default || 1;
      if(minus) {
        if(doc.value) {
          doc.value -= delta;
        }
        else {
          return;
        }
      }
      else {
        doc.value += delta;
      }
      return doc.save();
    });
}
