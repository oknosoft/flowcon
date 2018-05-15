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
  delete prototype.aliases;
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
    acl: {
      get() {
        const {acl} = this._obj;
        return Array.isArray(acl) ? acl : [];
      },
      set(v) {
        const {_obj} = this;
        if(_obj.acl != v) {
          this.__notify('acl');
          _obj.acl = Array.isArray(v) ? v : [];
        }
      }
    },
    aliases: {
      get() {
        const {aliases} = this._obj;
        return Array.isArray(aliases) ? aliases : [];
      },
      set(v) {
        const {_obj} = this;
        if(_obj.aliases != v) {
          this.__notify('aliases');
          _obj.aliases = Array.isArray(v) ? v : [];
        }
      }
    }
  });
}
