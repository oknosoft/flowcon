/**
 * ### Дополнительные методы плана видов характеристик _Свойства объектов_
 * аналог подсистемы _Свойства_ БСП
 *
 * @module cch_properties
 */

export default function ($p) {

	$p.cch.properties.__define({

		/**
		 * ### Проверяет заполненность обязательных полей
		 *
		 * @method check_mandatory
		 * @override
		 * @param prms {Array}
		 * @param title {String}
		 * @return {boolean}
		 */
		check_mandatory: {
			value: function(prms, title){

				var t, row;

				// проверяем заполненность полей
				for(t in prms){
					row = prms[t];
					if(row.param.mandatory && (!row.value || row.value.empty())){
						$p.msg.show_msg({
							type: "alert-error",
							text: $p.msg('bld_empty_param') + row.param.presentation,
							title: title || $p.msg('bld_title')});
						return true;
					}
				}
			}
		},

		/**
		 * ### Возвращает массив доступных для данного свойства значений
		 *
		 * @method slist
		 * @override
		 * @param prop {CatObj} - планвидовхарактеристик ссылка или объект
		 * @param ret_mgr {Object} - установить в этом объекте указатель на менеджера объекта
		 * @return {Array}
		 */
		slist: {
			value: function(prop, ret_mgr){

				var res = [], rt, at, pmgr, op = this.get(prop);

				if(op && op.type.is_ref){
					// параметры получаем из локального кеша
					for(rt in op.type.types)
						if(op.type.types[rt].indexOf(".") > -1){
							at = op.type.types[rt].split(".");
							pmgr = $p[at[0]][at[1]];
							if(pmgr){

								if(ret_mgr)
									ret_mgr.mgr = pmgr;

								if(pmgr.class_name=="enm.open_directions")
									pmgr.get_option_list().forEach(function(v){
										if(v.value && v.value!=$p.enm.tso.folding)
											res.push(v);
									});

								else if(pmgr.class_name.indexOf("enm.")!=-1 || !pmgr.metadata().has_owners)
									res = pmgr.get_option_list();

								else
									pmgr.find_rows({owner: prop}, function(v){
										res.push({value: v.ref, text: v.presentation});
									});

							}
						}
				}
				return res;
			}
		}

	});

}
