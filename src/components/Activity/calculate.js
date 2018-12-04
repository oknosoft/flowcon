/**
 * Рассчитывает итоги активностей и их категорий
 *
 * @module calculate
 *
 * Created by Evgeniy Malyarov on 28.11.2018.
 */

export default function calculate(periodicity) {

  const {props} = this;

  this.setState({busy: true});

  let d = new Date();
  const opt = {};
  switch (periodicity || props.periodicity) {
  case 'today':
    opt.key = [d.getFullYear(), d.getMonth() + 1, d.getDate()];
    break;
  case 'yesterday':
    d = new Date(d - 24 * 3600 * 1000);
    opt.key = [d.getFullYear(), d.getMonth() + 1, d.getDate()];
    break;
  case 'week':
    opt.endKey = [d.getFullYear(), d.getMonth() + 1, d.getDate()];
    d = new Date(d - 7 * 24 * 3600 * 1000);
    opt.startKey = [d.getFullYear(), d.getMonth() + 1, d.getDate()];
    break;
  case 'month':
    opt.endKey = [d.getFullYear(), d.getMonth() + 1, d.getDate()];
    d = new Date(d - 30 * 24 * 3600 * 1000);
    opt.startKey = [d.getFullYear(), d.getMonth() + 1, d.getDate()];
    break;
  default:

  }

  const {doc, cat} = $p;
  return doc.activity.adapter.local.doc.query('activity', opt)
    .then(({rows}) => {
      const totals = new Map();
      if(rows.length) {
        const {value} = rows[0];
        let queue = Promise.resolve([]);
        for(let ref in value) {
          const activity = cat.activity.get(ref, true);
          if(!activity) {
            continue;
            // queue = queue.then((sum) => {
            //   doc.activity.get(ref, 'promise')
            //     .then((doc) => {
            //       sum.push(doc);
            //       return sum;
            //     });
            // });
          }
          totals.set(activity, value[ref]);
          for(const category of props.categories) {
            if(!totals.get(category)) {
              totals.set(category, 0);
            }
            const val = totals.get(category) + value[ref] * activity[category.predefined_name];
            totals.set(category, val);
          }
        }
      }
      return totals;
    })
    .then((totals) => {
      this.setState({busy: false});
      props.handleTotals(totals);
    })
    .catch(() => this.setState({busy: false}));
}
