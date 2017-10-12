/**
 * ### Дополнительные методы ПВХ Предопределенные элементы
 * Предопределенные элементы - аналог констант для хранения ссылочных и списочных настроек приложения
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2017
 * @module cch_predefined_elmnts
 */

export default function ($p) {

  const {job_prm, adapters, cch, utils, md} = $p;

  // Подписываемся на событие окончания загрузки локальных данных
  adapters.pouch.once('pouch_doc_ram_loaded', () => {
    // читаем элементы из pouchdb и создаём свойства
    cch.predefined_elmnts.pouch_find_rows({_raw: true, _top: 500, _skip: 0})
      .then(function (rows) {

        var parents = {};

        rows.forEach(function (row) {
          if(row.is_folder && row.synonym) {
            var ref = row._id.split('|')[1];
            parents[ref] = row.synonym;
            job_prm.__define(row.synonym, {value: {}});
          }
        });

        rows.forEach((row) => {
          if(!row.is_folder && row.synonym && parents[row.parent] && !job_prm[parents[row.parent]][row.synonym]) {

            var _mgr, tnames;

            if(row.type.is_ref) {
              tnames = row.type.types[0].split('.');
              _mgr = $p[tnames[0]][tnames[1]];
            }

            if(row.list == -1) {

              job_prm[parents[row.parent]].__define(row.synonym, {
                value: function () {
                  var res = {};
                  row.elmnts.forEach(function (row) {
                    res[row.elm] = _mgr ? _mgr.get(row.value, false) : row.value;
                  });
                  return res;
                }()
              });

            }
            else if(row.list) {

              job_prm[parents[row.parent]].__define(row.synonym, {
                value: row.elmnts.map(function (row) {
                  return _mgr ? _mgr.get(row.value, false) : row.value;
                })
              });

            }
            else {

              if(job_prm[parents[row.parent]].hasOwnProperty(row.synonym)) {
                delete job_prm[parents[row.parent]][row.synonym];
              }

              job_prm[parents[row.parent]].__define(row.synonym, {
                value: _mgr ? _mgr.get(row.value, false) : row.value,
                configurable: true
              });
            }

          }
        });
      })
      .then(() => {
        // даём возможность завершиться другим обработчикам, подписанным на _pouch_load_data_loaded_
        setTimeout(() => {
          md.emit('predefined_elmnts_inited');
          // излучаем событие "можно открывать формы"
          adapters.pouch.emit('pouch_complete_loaded');
        }, 100);
      });
  });

  const _mgr = cch.predefined_elmnts;


  /**
   * Переопределяем геттер значения
   *
   * @property value
   * @override
   * @type {*}
   */
  delete $p.CchPredefined_elmnts.prototype.value;
  $p.CchPredefined_elmnts.prototype.__define({

    value: {
      get: function () {

        const mf = this.type;
        const res = this._obj ? this._obj.value : '';

        if(this._obj.is_folder) {
          return '';
        }
        if(typeof res == 'object') {
          return res;
        }
        else if(mf.is_ref) {
          if(mf.digits && typeof res === 'number') {
            return res;
          }
          if(mf.hasOwnProperty('str_len') && !utils.is_guid(res)) {
            return res;
          }
          const mgr = md.value_mgr(this._obj, 'value', mf);
          if(mgr) {
            if(utils.is_data_mgr(mgr)) {
              return mgr.get(res, false);
            }
            else {
              return utils.fetch_type(res, mgr);
            }
          }
          if(res) {
            $p.record_log(['value', mf, this._obj]);
            return null;
          }
        }
        else if(mf.date_part) {
          return utils.fix_date(this._obj.value, true);
        }
        else if(mf.digits) {
          return utils.fix_number(this._obj.value, !mf.hasOwnProperty('str_len'));
        }
        else if(mf.types[0] == 'boolean') {
          return utils.fix_boolean(this._obj.value);
        }
        else {
          return this._obj.value || '';
        }

        return this.characteristic.clr;
      },

      set: function (v) {

        if(this._obj.value === v) {
          return;
        }

        _mgr.emit_async('update', this, {value: this._obj.value});
        this._obj.value = v.valueOf();
        this._data._modified = true;
      }
    }
  });

  /**
   * ### Форма элемента
   *
   * @method form_obj
   * @override
   * @param pwnd
   * @param attr
   * @returns {*}
   */
  _mgr.form_obj = () => {};

}
