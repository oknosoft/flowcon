module.exports = {
  activity: {
    language: "javascript",
    views: {
      activity: {
        "map": "function (doc) {\n  if((doc._id.substr(0, 12) === 'doc.activity' || doc._id.substr(0, 9) === 'doc.issue') && (doc.activity || doc.flow)){\n    var d = new Date(doc.date);\n    var v = {};\n    v[doc.activity || doc.ref] = doc.value || 0;\n    emit([d.getFullYear(), d.getMonth() + 1, d.getDate()] , v); \n  }\n}",
        "reduce": "function (key, values, rereduce) {\nreturn values.reduce(function(sum, row){\n  for(var activity in row) {\n    if(sum[activity]){\n      sum[activity] += row[activity];\n    }\n    else {\n      sum[activity] = row[activity];\n    }\n  }\n  return sum;\n},{});\n}"
      }
    }
  }
};
