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
     * @return {Boolean}
     */
    check_mandatory: {
      value: function (prms, title) {
        // проверяем заполненность полей
        for (const t in prms) {
          const row = prms[t];
          if(row.param.mandatory && (!row.value || row.value.empty())) {
            $p.msg.show_msg({
              type: 'alert-error',
              text: $p.msg.bld_empty_param + row.param.presentation,
              title: title || $p.msg.bld_title
            });
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
      value: function (prop, ret_mgr) {

        var res = [], rt, at, pmgr, op = this.get(prop);

        if(op && op.type.is_ref) {
          // параметры получаем из локального кеша
          for (rt in op.type.types)
            if(op.type.types[rt].indexOf('.') > -1) {
              at = op.type.types[rt].split('.');
              pmgr = $p[at[0]][at[1]];
              if(pmgr) {

                if(ret_mgr) {
                  ret_mgr.mgr = pmgr;
                }

                if(pmgr.class_name.indexOf('enm.') != -1 || !pmgr.metadata().has_owners) {
                  res = pmgr.get_option_list();
                }
                else {
                  pmgr.find_rows({owner: prop}, ({ref, presentation}) => res.push({value: ref, text: presentation}));
                }
              }
            }
        }
        return res;
      }
    }

  });

  $p.CchProperties.prototype.__define({

    /**
     * ### Является ли значение параметра вычисляемым
     *
     * @property is_calculated
     * @type Boolean
     */
    is_calculated: {
      get: function () {
        return ($p.job_prm.properties.calculated || []).indexOf(this) != -1;
      }
    },

    /**
     * ### Рассчитывает значение вычисляемого параметра
     * @param obj {Object}
     * @param [obj.row]
     * @param [obj.elm]
     * @param [obj.ox]
     */
    calculated_value: {
      value: function (obj) {
        if(!this._calculated_value) {
          if(this._formula) {
            this._calculated_value = $p.cat.formulas.get(this._formula);
          }
          else {
            return;
          }
        }
        return this._calculated_value.execute(obj);
      }
    },

    /**
     * Извлекает значение параметра с учетом вычисляемости
     */
    extract_value: {
      value: function ({comparison_type, txt_row, value}) {

        switch (comparison_type) {

        case $p.enm.comparison_types.in:
        case $p.enm.comparison_types.nin:

          if(!txt_row) {
            return value;
          }
          try {
            const arr = JSON.parse(txt_row);
            const {types} = this.type;
            if(types.length == 1) {
              const mgr = $p.md.mgr_by_class_name(types[0]);
              return arr.map((ref) => mgr.get(ref, false));
            }
            return arr;
          }
          catch (err) {
            return value;
          }

        default:
          return value;
        }
      }
    },

    /**
     * Возвращает массив связей текущего параметра
     */
    params_links: {
      value: function (attr) {

        // первым делом, выясняем, есть ли ограничитель на текущий параметр
        if(!this.hasOwnProperty('_params_links')) {
          this._params_links = $p.cat.params_links.find_rows({slave: this});
        }

        return this._params_links.filter((link) => {
          let ok = true;
          // для всех записей ключа параметров
          link.master.params.forEach((row) => {
            // выполнение условия рассчитывает объект CchProperties
            ok = row.property.check_condition({
              cnstr: attr.grid.selection.cnstr,
              ox: attr.obj._owner._owner,
              prm_row: row,
              elm: attr.obj,
            });
            if(!ok) {
              return false;
            }
          });
          return ok;
        });
      }
    },

    /**
     * Проверяет и при необходимости перезаполняет или устанваливает умолчание value в prow
     */
    linked_values: {
      value: function (links, prow) {
        const values = [];
        let changed;
        // собираем все доступные значения в одном массиве
        links.forEach((link) => link.values.forEach((row) => values.push(row)));
        // если значение доступно в списке - спокойно уходим
        if(values.some((row) => row._obj.value == prow.value)) {
          return;
        }
        // если есть явный default - устанавливаем
        if(values.some((row) => {
            if(row.forcibly) {
              prow.value = row._obj.value;
              return true;
            }
            if(row.by_default && (!prow.value || prow.value.empty && prow.value.empty())) {
              prow.value = row._obj.value;
              changed = true;
            }
          })) {
          return true;
        }
        // если не нашли лучшего, установим первый попавшийся
        if(changed) {
          return true;
        }
        if(values.length) {
          prow.value = values[0]._obj.value;
          return true;
        }
      }
    },

    /**
     * ### Дополняет отбор фильтром по параметрам выбора
     * Используется в полях ввода экранных форм
     * @param filter {Object} - дополняемый фильтр
     * @param attr {Object} - атрибуты OCombo
     */
    filter_params_links: {
      value: function (filter, attr) {
        // для всех отфильтрованных связей параметров
        this.params_links(attr).forEach((link) => {
          // если ключ найден в параметрах, добавляем фильтр
          if(!filter.ref) {
            filter.ref = {in: []};
          }
          if(filter.ref.in) {
            link.values._obj.forEach((row) => {
              if(filter.ref.in.indexOf(row.value) == -1) {
                filter.ref.in.push(row.value);
              }
            });
          }
        });
      }
    }

  });

}
