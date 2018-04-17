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



{
  "selector": {
  "sorting_field": {
    "$gt": 0
  },
  "tags": {
    "$elemMatch": {
      "$in": [
        "da3c6aab-4241-11e8-8505-d85d4c80ec2a",
        "507e3e9d-418d-11e8-8505-d85d4c80ec2a"
      ]
    }
  }
},
  "fields": [
  "_id",
  "id",
  "name",
  "h1",
  "introduction",
  "date",
  "author",
  "tags"
],
  "use_index": "sorting_field_tags",
  "sort": [
  {
    "sorting_field": "asc"
  }
]
}
