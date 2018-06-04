/**
 * ### Дополнительные методы плана видов характеристик _Свойства объектов_
 * аналог подсистемы _Свойства_ БСП
 *
 * @module cch_properties
 */

exports.CchPropertiesManager = class CchPropertiesManager extends Object {

  /**
   * ### Проверяет заполненность обязательных полей
   *
   * @method check_mandatory
   * @override
   * @param prms {Array}
   * @param title {String}
   * @return {Boolean}
   */
  check_mandatory(prms, title) {
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

  /**
   * ### Возвращает массив доступных для данного свойства значений
   *
   * @method slist
   * @override
   * @param prop {CatObj} - планвидовхарактеристик ссылка или объект
   * @param ret_mgr {Object} - установить в этом объекте указатель на менеджера объекта
   * @return {Array}
   */
  slist(prop, ret_mgr) {

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

            if(pmgr.class_name == 'enm.open_directions') {
              pmgr.get_option_list().forEach((v) => v.value && v.value != $p.enm.tso.folding && res.push(v));
            }
            else if(pmgr.class_name.indexOf('enm.') != -1 || !pmgr.metadata().has_owners) {
              res = pmgr.get_option_list();
            }
            else {
              pmgr.find_rows({owner: prop}, (v) => res.push({value: v.ref, text: v.presentation}));
            }
          }
        }
    }
    return res;
  }

}

exports.CchProperties = class CchProperties extends Object {

  /**
   * ### Является ли значение параметра вычисляемым
   *
   * @property is_calculated
   * @type Boolean
   */
  get is_calculated() {
    return ($p.job_prm.properties.calculated || []).indexOf(this) != -1;
  }

  get show_calculated() {
    return ($p.job_prm.properties.show_calculated || []).indexOf(this) != -1;
  }

  /**
   * ### Рассчитывает значение вычисляемого параметра
   * @param obj {Object}
   * @param [obj.row]
   * @param [obj.elm]
   * @param [obj.ox]
   */
  calculated_value(obj) {
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

  /**
   * ### Проверяет условие в строке отбора
   */
  check_condition({row_spec, prm_row, elm, cnstr, origin, ox, calc_order}) {

    const {is_calculated} = this;
    const {utils, enm: {comparison_types}} = $p;

    // значение параметра
    const val = is_calculated ? this.calculated_value({
      row: row_spec,
      cnstr: cnstr || 0,
      elm,
      ox,
      calc_order
    }) : this.extract_value(prm_row);

    let ok = false;

    // если сравнение на равенство - решаем в лоб, если вычисляемый параметр типа массив - выясняем вхождение значения в параметр
    if(ox && !Array.isArray(val) && (prm_row.comparison_type.empty() || prm_row.comparison_type == comparison_types.eq)) {
      if(is_calculated) {
        ok = val == prm_row.value;
      }
      else {
        ox.params.find_rows({
          cnstr: cnstr || 0,
          inset: (typeof origin !== 'number' && origin) || utils.blank.guid,
          param: this,
          value: val
        }, () => {
          ok = true;
          return false;
        });
      }
    }
    // вычисляемый параметр - его значение уже рассчитано формулой (val) - сравниваем со значением в строке ограничений
    else if(is_calculated) {
      const value = this.extract_value(prm_row);
      ok = utils.check_compare(val, value, prm_row.comparison_type, comparison_types);
    }
    // параметр явно указан в табчасти параметров изделия
    else {
      ox.params.find_rows({
        cnstr: cnstr || 0,
        inset: (typeof origin !== 'number' && origin) || utils.blank.guid,
        param: this
      }, ({value}) => {
        // value - значение из строки параметра текущей продукции, val - знаяение из параметров отбора
        ok = utils.check_compare(value, val, prm_row.comparison_type, comparison_types);
        return false;
      });
    }
    return ok;
  }

  /**
   * Извлекает значение параметра с учетом вычисляемости
   */
  extract_value({comparison_type, txt_row, value}) {

    switch (comparison_type) {

    case $p.enm.comparison_types.in:
    case $p.enm.comparison_types.nin:

      if(!txt_row) {
        return value;
      }
      try {
        const arr = JSON.parse(txt_row);
        const {types} = this.type;
        if(types && types.length == 1) {
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

  /**
   * Проверяет и при необходимости перезаполняет или устанваливает умолчание value в prow
   */
  linked_values(links, prow) {
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

}

