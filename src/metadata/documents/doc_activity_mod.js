/**
 * Менеджер документа activity проверяет индекс
 *
 * @module doc_activity
 *
 * Created by Evgeniy Malyarov on 11.10.2018.
 */

const activity = {
  _id: "_design/activity",
  views: {
    activity: {
      map: "function (doc) {\n  if((doc._id.substr(0, 12) === 'doc.activity' || doc._id.substr(0, 9) === 'doc.issue') && (doc.activity || doc.flow)){\n    var d = new Date(doc.date);\n    var v = {};\n    v[doc.activity || doc.ref] = doc.value || 0;\n    emit([d.getFullYear(), d.getMonth() + 1, d.getDate()] , v); \n  }\n}",
      reduce: "function (key, values, rereduce) {\nreturn values.reduce(function(sum, row){\n  for(var activity in row) {\n    if(sum[activity]){\n      sum[activity] += row[activity];\n    }\n    else {\n      sum[activity] = row[activity];\n    }\n  }\n  return sum;\n},{});\n}"
    }
  },
  language: "javascript"
}

export default function ({adapters: {pouch}}) {

  pouch.on('on_log_in', () => {
    return pouch.remote.doc.get('_design/activity')
      .catch((err) => {
        err.status === 404 && pouch.remote.doc.put(activity);
      });
  });
}
