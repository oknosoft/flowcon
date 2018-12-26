/**
 * ### Дополнительные методы справочника _Пользователи_
 * Тянем пользователей из связвнных баз
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2018
 *
 * @module cat_users
 */

export default function ({cat: {users}, adapters: {pouch}, superlogin}) {
  pouch.on('on_log_in', () => {
    return superlogin.shared_users()
      .then(({data}) => {
        return users.load_array(data.filter(({ref}) => !users.by_ref[ref]));
      });
  });
}
