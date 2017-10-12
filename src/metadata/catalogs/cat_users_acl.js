/**
 * ### Дополнительные методы справочника _Права внешних пользователей_
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2017
 * @module cat_users_acl
 */

export default function ($p) {

	$p.cat.users_acl.__define({

		load_array: {
			value: function(aattr, forse){

				var ref, obj, res = [], acl;

				for(var i in aattr){

					ref = $p.utils.fix_guid(aattr[i]);

					acl = aattr[i].acl;
					if(acl)
						delete aattr[i].acl;

					if(!(obj = this.by_ref[ref])){
						obj = new $p.CatUsers_acl(aattr[i], this);
						if(forse)
							obj._set_loaded();

					}else if(obj.is_new() || forse){
						obj._mixin(aattr[i]);
						obj._set_loaded();
					}

					if(acl && !obj._acl){
						var _acl = {};
						for(var i in acl){
							_acl.__define(i, {
								value: {},
								writable: false
							});
							for(var j in acl[i]){
								_acl[i].__define(j, {
									value: acl[i][j],
									writable: false
								});
							}
						}
						obj.__define({
							_acl: {
								value: _acl,
								writable: false
							}
						});
					}

					res.push(obj);
				}

				return res;
			}
		}
	});

	$p.CatUsers_acl.prototype.__define({

		/**
		 * ### Идентификаторы доступных контрагентов
		 * Для пользователей с ограниченным доступом
		 *
		 * @returns {Array}
		 */
		partners_uids: {
			get: function () {
				var res = [];
				this.acl_objs.each(function (row) {
					if(row.acl_obj instanceof $p.CatPartners)
						res.push(row.acl_obj.ref)
				});
				return res;
			}
		}
	});

}

