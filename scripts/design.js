function (newDoc, oldDoc, userCtx, secObj) {
  if(userCtx.roles.indexOf('_admin') !== -1 || userCtx.roles.indexOf('ram_editor') !== -1) {
    if(!newDoc.hasOwnProperty('search')){
      newDoc.search = (
        (newDoc.number_doc || newDoc.id || '') +
        (newDoc.name ? ' ' + newDoc.name : '') +
        (newDoc.note ? ' ' + newDoc.note : '')
        ).toLowerCase();
    }
    return;
  }
  else {
    throw({forbidden: 'Только администраторы могут изменять справочники в базе ram'});
  }
}

"date": "2017-01-26T02:00:01.000Z",

{
  "selector": {
  "class_name": {
    "$eq": "doc.cash_moving"
  },
  "$and": [
    {"date": {"$gte": "2016-01-01"}},
    {"date": {"$lte": "2017-12-31"}}
  ],
    "search": {
    "$regex": ""
  }
},
  "fields": ["_id", "posted", "name", "note", "date", "number_doc", "doc_amount","search"]
}
