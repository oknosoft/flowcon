/**
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2018
 *
 * Created 17.04.2016
 *
 * @module cat_formulas
 *
 */

exports.CatFormulasManager = class CatFormulasManager extends Object {

  constructor(owner, class_name) {
    super(owner, class_name);
    this._owner.$p.adapters.pouch.once('pouch_data_loaded', () => this.load_formulas());
  }

  load_formulas() {
    const {md} = this._owner.$p;
    const parents = [this.predefined('printing_plates'), this.predefined('modifiers')];
    const filtered = [];
    this.forEach((v) => {
      !v.disabled && parents.indexOf(v.parent) !== -1 && filtered.push(v)
    });
    filtered.sort((a, b) => a.sorting_field - b.sorting_field).forEach((formula) => {
      // формируем списки печатных форм и внешних обработок
      if(formula.parent == parents[0]) {
        formula.params.find_rows({param: 'destination'}, (dest) => {
          const dmgr = md.mgr_by_class_name(dest.value);
          if(dmgr) {
            if(!dmgr._printing_plates) {
              dmgr._printing_plates = {};
            }
            dmgr._printing_plates[`prn_${formula.ref}`] = formula;
          }
        });
      }
      else {
        // выполняем модификаторы
        try {
          formula.execute();
        }
        catch (err) {
        }
      }
    });
  }

  // переопределяем load_array - не грузим неактивные формулы
  load_array(aattr, forse) {
    super.load_array(aattr.filter((v) => {
      return !v.disabled || v.is_folder;
    }), forse);
  }

};

exports.CatFormulas = class CatFormulas extends Object {

  execute(obj, attr) {

    const {_manager, _data} = this;
    const {$p} = _manager._owner;

    // создаём функцию из текста формулы
    if(!_data._formula && this.formula){
      try {
        if(this.async) {
          const AsyncFunction = Object.getPrototypeOf(eval('(async function(){})')).constructor;
          _data._formula = (new AsyncFunction('obj,$p,attr', this.formula)).bind(this);
        }
        else {
          _data._formula = (new Function('obj,$p,attr', this.formula)).bind(this);
        }
      }
      catch(err){
        _data._formula = () => false;
        $p.record_log(err);
      }
    }

    const {_formula} = _data;

    if(this.parent == _manager.predefined('printing_plates')) {

      if(!_formula) {
        $p.msg.show_msg({
          title: $p.msg.bld_title,
          type: 'alert-error',
          text: `Ошибка в формуле<br /><b>${this.name}</b>`
        });
        return Promise.resolve();
      }

      // получаем HTMLDivElement с отчетом
      return _formula(obj, $p, attr)

      // показываем отчет в отдельном окне
        .then((doc) => doc instanceof $p.SpreadsheetDocument && doc.print());

    }
    else{
      return _formula && _formula(obj, $p, attr)
    }

  }

  get _template() {
    const {_data} = this;
    if(!_data._template){
      _data._template = new this._manager._owner.$p.SpreadsheetDocument(this.template);
    }
    return _data._template;
  }

};
