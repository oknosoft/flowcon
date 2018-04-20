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

  // модифицируем работу с табчастью тегов
  const {prototype} = CatArticles;
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
