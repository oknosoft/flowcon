module.exports = {
  doc: {
    language: "javascript",
    views: {
      by_date: {
        map: "function(doc){\r\n  if(doc.date){\r\n    var d0=doc.date.split('T');\r\n    if(d0.length>1){\r\n      var d=d0[0].split('-');\r\n      var key = doc._id.split('|')[0];\r\n      key && emit([key,Number(d[0]),Number(d[1]),Number(d[2]),doc.number_doc||doc.id||''], null);\r\n    }\r\n  }\r\n}"
      },
      number_doc: {
        map: "function(doc) {\r\n  var c = doc._id.split('|')[0], cn = c && c.substr(0, 3);\r\n  if (cn == 'doc' || cn == 'tsk' || cn == 'bp.') {\r\n  var d = doc.date.split('T')[0].split('-');\r\n    emit([c, Number(d[0]), doc.number_doc], null);\r\n  }\r\n  else if (doc.id){\r\n    emit([c, 0, doc.id], null)\r\n  }\r\n}"
      },
      scheme_settings: {
        map: "function(doc) {\n    if (doc._id.substr(0, 19) == 'cat.scheme_settings') emit([doc.obj, doc.order || 0, doc.user || ''], doc.name)\n}"
      }
    }
  }
};
