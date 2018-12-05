/**
 *
 *
 * @module cat_activity
 *
 * Created by Evgeniy Malyarov on 27.11.2018.
 */

import FrmObj from '../../components/Activity/FrmObjActivityLazy';

export default function ({cat, CatActivity}) {

  // подключаем особую форму объекта
  cat.activity.FrmObj = FrmObj;

  // значения по умолчению
  CatActivity.prototype.after_create = function () {
    this.date = new Date();
    this.use = true;
    this.by_default = 1;
    this.period = 'week';
    return this;
  };
}
