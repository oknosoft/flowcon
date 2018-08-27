module.exports = {
  auth: {
    language: "javascript",
    validate_doc_update: "function (newDoc, oldDoc, userCtx, secObj) {\\n  if (!userCtx || userCtx.roles.indexOf('_admin') !== -1 || userCtx.roles.indexOf('doc_full') !== -1) {return}\\n  var msg = {forbidden: 'Недостаточно прав для изменения документа: ' + newDoc._id};\\n  if (newDoc._id.substr(0, 19) == 'cat.scheme_settings' && newDoc.user != userCtx.name) {\\n    throw(msg)\\n  }\\n  if (newDoc._id.substr(0, 12) == 'cat.formulas') {\\n    throw(msg)\\n  }\\n  if (Array.isArray(doc.charts) && userCtx.roles.indexOf('charts_editor') === -1) {\\n    throw(msg)\\n  }\\n  if (userCtx.roles.indexOf('doc_editor') !== -1) {\\n    if ([\\n      'registers_correction',\\n      'purchase',\\n      'credit_cash_order',\\n      'debit_bank_order',\\n      'credit_bank_order',\\n      'debit_cash_order',\\n      'credit_cash_order',\\n      'selling'].some(function (name) {\\n          if (newDoc._id.indexOf(name) != -1) return true\\n        })) {\\n      throw(msg)\\n    }\\n  }\\n  else {\\n    throw(msg)\\n  }\\n}"
  }
};
