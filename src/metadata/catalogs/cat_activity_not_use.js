/**
 * Не используется - сохранён для примера
 *
 * @module cat_activity
 *
 * Created by Evgeniy Malyarov on 27.11.2018.
 */


exports.CatActivityManager = class CatActivityManager extends Object {
  constructor(owner, class_name) {
    super(owner, class_name);
    // структура индивидуальной формы объекта
    const _meta = this.metadata();
    if(!_meta.form) {
      _meta.form = {};
    }
    _meta.form.obj = {
      items: [
        {
          element: 'FormGroup',
          row: true,
          items: [
            {
              element: 'FormGroup',
              items: [
                {element: 'DataField', fld: 'name'},
                {element: 'DataField', fld: 'flow'},
                {element: 'DataField', fld: 'use'},
                {element: 'DataField', fld: 'sorting_field'},
                {element: 'DataField', fld: 'plan'},
                {element: 'DataField', fld: 'period'},
                {element: 'DataField', fld: 'by_default'},
              ]
            },
            {
              element: 'FormGroup',
              items: [
                {element: 'DataField', fld: 'health'},
                {element: 'DataField', fld: 'work'},
                {element: 'DataField', fld: 'family'},
                {element: 'DataField', fld: 'humanity'},
                {element: 'DataField', fld: 'personal'},
              ]
            },
          ]
        },
      ]
    };
  }
}



exports.CatActivity = class CatActivity extends Object {
  after_create() {

  }
}
