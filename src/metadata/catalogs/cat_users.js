/**
 * ### Дополнительные методы справочника _Пользователи_
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2018
 *
 * @module cat_users
 */


exports.CatUsersManager = class CatUsersManager extends Object {

  // при загрузке пользователей, морозим объект, чтобы его невозможно было изменить из интерфейса
  load_array(aattr, forse) {
    const res = [];
    for (let aobj of aattr) {
      if(this.by_ref[aobj.ref]) {
        continue;
      }
      if(!aobj.acl_objs) {
        aobj.acl_objs = [];
      }
      const {acl} = aobj;
      delete aobj.acl;
      const obj = new $p.CatUsers(aobj, this, true);
      const {_obj} = obj;
      if(_obj && !_obj._acl) {
        _obj._acl = acl;
        obj._set_loaded();

        // Object.freeze(obj);
        // Object.freeze(_obj);
        // for (let j in _obj) {
        //   if(typeof _obj[j] == 'object') {
        //     Object.freeze(_obj[j]);
        //     for (let k in _obj[j]) {
        //       typeof _obj[j][k] == 'object' && Object.freeze(_obj[j][k]);
        //     }
        //   }
        // }
        res.push(obj);
      }
    }
    return res;
  }

  // пользователей не выгружаем
  unload_obj() {	}

};

//exports.CatUsersManager._freeze = true;

exports.CatUsers = class CatUsers extends Object {
  get invalid(){return this._getter('invalid')}
  set invalid(v){this._setter('invalid',v)}
  get note(){return this._getter('note')}
  set note(v){this._setter('note',v)}
  get ancillary(){return this._getter('ancillary')}
  set ancillary(v){this._setter('ancillary',v)}
  get user_ib_uid(){return this._getter('user_ib_uid')}
  set user_ib_uid(v){this._setter('user_ib_uid',v)}
  get user_fresh_uid(){return this._getter('user_fresh_uid')}
  set user_fresh_uid(v){this._setter('user_fresh_uid',v)}
  get id(){return this._getter('id')}
  set id(v){/* this._setter('id',v) */}
  get prefix(){return this._getter('prefix')}
  set prefix(v){this._setter('prefix',v)}
  get branch(){return this._getter('branch')}
  set branch(v){this._setter('branch',v)}
  get push_only(){return this._getter('push_only')}
  set push_only(v){this._setter('push_only',v)}
  get subscription(){return this._getter('subscription')}
  set subscription(v){
    // запрос к superlogin на изменение профиля
    this._setter('subscription',v);
    $p.superlogin.change_subscription(v)
      .catch((err) => {
        $p.record_log(err);
      });
  }
  get suffix(){return this._getter('suffix')}
  set suffix(v){this._setter('suffix',v)}
  get direct(){return this._getter('direct')}
  set direct(v){this._setter('direct',v)}
  get sex(){return this._getter('sex')}
  set sex(v){this._setter('sex',v)}
  get email_addr(){return this._getter('email_addr')}
  set email_addr(v){this._setter('email_addr',v)}
  get predefined_name(){return this._getter('predefined_name')}
  set predefined_name(v){this._setter('predefined_name',v)}
  get extra_fields(){return this._getter_ts('extra_fields')}
  set extra_fields(v){this._setter_ts('extra_fields',v)}
  get acl_objs(){return this._getter_ts('acl_objs')}
  set acl_objs(v){this._setter_ts('acl_objs',v)}
};
exports.CatUsers._replace = true;
