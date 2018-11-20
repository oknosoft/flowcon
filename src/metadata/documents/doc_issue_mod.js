/**
 * ### Модуль менеджера и документа Задача
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2018
 *
 * @module doc_issue
 */

import FrmObjIssue from '../../components/Issues/FrmObj';
import FrmIssueList from '../../components/Issues/FrmList';

export default function ({doc, DocIssue}) {

  // подключаем особые формы объекта и списка
  doc.issue.constructor.prototype.FrmObj = FrmObjIssue;
  doc.issue.constructor.prototype.FrmList = FrmIssueList;

  // модифицируем работу с табчастью тегов
  const {prototype} = DocIssue;
  delete prototype.tags;
  Object.defineProperties(prototype, {
    tags: {
      get() {
        const {tags} = this._obj;
        return Array.isArray(tags) ? tags : [];
      },
      set(v) {
        const {_obj} = this;
        if(_obj.tags != v) {
          this.__notify('tags');
          _obj.tags = Array.isArray(v) ? v : [];
        }
      }
    },

    // умолчания при добавлении комментария
    add_note: {
      value() {
        this.notes.add({
          date: new Date(),
          author: $p.current_user,
        });
      }
    },

    // умолчания при создании объекта
    after_create: {
      value() {
        this.date = new Date();
        this.initiator = $p.current_user;
        return this;
      }
    },

    // при изменении реквизита, регистрируем факт события
    value_change: {
      value(field, type, value) {
        if(/mark|executor|quickly|important|canceled|completed|specify|executor_accepted|initiator_accepted/.test(field) && this[field] !== value) {
          const stub = {date: $p.utils.blank.date, event: field};
          const row = this.history.find(stub) || this.history.add(stub);
          row.value = value;
        }
      }
    },

    // перед записью, проставляем даты пустых событий
    before_save: {
      value() {
        this.history.find_rows({date: $p.utils.blank.date}, (row) => {
          row.date = new Date();
          if(/quickly|important|canceled|completed|specify|executor_accepted|initiator_accepted/.test(row.event.valueOf())) {
            this.state_date = row.date;
          }
        });
      }
    }

  });

}
