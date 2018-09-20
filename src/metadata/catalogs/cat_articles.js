/**
 * ### Дополнительные методы справочника _Статьи_
 *
 * @module cat_articles
 *
 * Created by Evgeniy Malyarov on 20.04.2018.
 */

import EditorArticle from '../../components/Articles/Editor';

export default function ({cat, CatArticles}) {

  // подключаем особую форму объекта
  cat.articles.FrmObj = EditorArticle;

  // реквизит поиска по строке
  cat.articles.build_search = function (tmp, tObj) {
    tmp.search = (tObj.name + ' ' + tObj.id).toLowerCase();
  };

  // модифицируем работу с табчастью тегов
  const {prototype} = CatArticles;
  delete prototype.tags;
  delete prototype.acl;
  Object.defineProperties(prototype, {
    tags: {
      get() {
        const {tags} = this._obj;
        return Array.isArray(tags) ? tags : [];
      },
      set(v) {
        const {_obj} = this;
        if(!Array.isArray(v)) {
          v = [];
        }
        if(_obj.tags !== v) {
          this.__notify('tags');
          if(_obj.tags) {
            _obj.tags.length = 0;
            _obj.tags.push.apply(_obj.tags, v);
          }
          else {
            _obj.tags = v;
          }
        }
      }
    },
    acl: {
      get() {
        const {acl} = this._obj;
        return Array.isArray(acl) ? acl : [];
      },
      set(v) {
        const {_obj} = this;
        if(!Array.isArray(v)) {
          v = [];
        }
        if(_obj.acl !== v) {
          this.__notify('acl');
          if(_obj.acl) {
            _obj.acl.length = 0;
            _obj.acl.push.apply(_obj.acl, v);
          }
          else {
            _obj.acl = v;
          }
        }
      }
    },
  });
}
