/**
 * ### Модуль менеджера перечисления "Роли couchdb"
 *
 * @module doc_issue
 */


export default function ({enm, classes}) {

  // добавляем специфичные для текущего проекта роли
  new classes.EnumObj({order:10, name: "article_editor", synonym:"article_editor"}, enm.couchdb_roles);

}
