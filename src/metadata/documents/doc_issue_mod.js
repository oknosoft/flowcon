/**
 * ### Модуль менеджера и документа Задача
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2018
 *
 * @module doc_issue
 */

import FrmObjIssue from '../../components/Issues/FrmObjIssue';

export default function ({doc, DocIssue}) {

  // подключаем особую форму объекта
  doc.issue.FrmObj = FrmObjIssue;

  // модифицируем работу с табчастью тегов
  const {prototype} = DocIssue;
  delete prototype.tags;
  Object.defineProperty(prototype, 'tags', {
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
  });

}
