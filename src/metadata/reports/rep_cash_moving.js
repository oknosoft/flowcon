/**
 * ### Отчет _Движение денег_ (невизуальная часть)
 *
 * @module rep_cash_moving
 *
 * Created 07.11.2016
 */

import RepParams from '../../components/RepCashMoving/RepParams';

export default function ($p) {

  $p.RepCash_moving = class RepCash_moving extends $p.RepCash_moving {

    // ресурсы по умолчанию
    // TODO: сделать признак в метаданных
    get resources() {
      return ['debit', 'credit', 'initial_balance', 'final_balance'];
    }

    /**
     * пересчитывает данные в табличной части - запрос к серверу с фильтром по параметрам
     * @param scheme
     */
    prepare(scheme) {
      const {moment} = $p.utils;
      const {pouch} = $p.adapters;
      const {date_from, date_till, query} = scheme;
      const {data} = this;
      const date_sub = moment(date_from).subtract(1, 'day').toDate();
      const query_options = {
        reduce: true,
        limit: 100000,
        group: true,
        group_level: 4,
        startkey: [],
        endkey: [date_sub.getFullYear(), date_sub.getMonth() + 1, date_sub.getDate(), '\ufff0']
      };
      const start_total = {};
      const default_query = 'rep/cash_moving_date_cashbox';

      // признак варианта
      const by_cashboxes = query == default_query;

      // массив гвидов касс
      const cashboxes = [];
      this.cashboxes.forEach((row) => cashboxes.push(row.cashbox.ref));

      // массив гвидов статей ддс
      const cash_flow_articles = [];
      this.cash_flow_articles.forEach((row) => cash_flow_articles.push(row.cash_flow_article.ref));


      // фильтр для отбрасывания лишних строк
      function discard(key) {
        return by_cashboxes ?
          cashboxes.length && cashboxes.indexOf(key[3]) == -1
          :
          cash_flow_articles.length && cash_flow_articles.indexOf(key[2]) == -1;
      }

      if(by_cashboxes) {
        // получаем начальные остатки
        return pouch.local.doc.query(scheme.query || default_query, query_options)
          .then((res) => {
            if(res.rows) {
              res.rows.forEach(({key, value}) => {
                if(discard(key)) {
                  return;
                }
                if(!start_total.hasOwnProperty(key[3])) {
                  start_total[key[3]] = [0, 0, 0, 0];
                }
                start_total[key[3]][0] += value.total;
                start_total[key[3]][3] = start_total[key[3]][0];
              });
            }

            query_options.startkey = [date_from.getFullYear(), date_from.getMonth() + 1, date_from.getDate(), ''];
            query_options.endkey = [date_till.getFullYear(), date_till.getMonth() + 1, date_till.getDate(), '\ufff0'];

            return pouch.local.doc.query(scheme.query || default_query, query_options);
          })
          // получаем обороты
          .then((res) => {
            if(res.rows) {
              res.rows.forEach(({key, value}) => {
                if(discard(key)) {
                  return;
                }
                if(!start_total.hasOwnProperty(key[3])) {
                  start_total[key[3]] = [0, value.debit, value.credit, value.total];
                }
                else {
                  start_total[key[3]][1] += value.debit;
                  start_total[key[3]][2] += value.credit;
                  start_total[key[3]][3] += value.debit - value.credit;
                }
              });
              for (const key in start_total) {
                const row = start_total[key];
                data.add({
                  cashbox: key,
                  initial_balance: row[0],
                  debit: row[1],
                  credit: row[2],
                  final_balance: row[3]
                });
              }
            }
            return res;
          });
      }

      // если нужны только обороты, результат получаем "в лоб" - прямым запросом к couchdb
      query_options.startkey = [date_from.getFullYear(), date_from.getMonth() + 1, ''];
      query_options.endkey = [date_till.getFullYear(), date_till.getMonth() + 1, '\ufff0'];
      return pouch.local.doc.query(query, query_options)
        .then((res) => {
          if(res.rows) {
            res.rows.forEach(({key, value}) => {
              if(discard(key)) {
                return;
              }
              data.add({
                period: new Date(`${key[0].pad(4)}-${key[1].pad(2)}-01`),
                cash_flow_article: key[2],
                debit: value,
              });
            });
            return res;
          }
        });
    }

    /**
     * Фильтр по отбору схемы + свёртка по измерениям + группировка по схеме
     */
    calculate() {
      const {data, scheme, resources, _manager} = this;
      const _columns = scheme.rx_columns({
        mode: 'ts',
        fields: _manager.metadata('data').fields,
        _obj: this
      });

      // чистим таблицу результата
      data.clear();
      if(!data._rows) {
        data._rows = [];
      }
      else {
        data._rows.length = 0;
      }

      return this.prepare(scheme)
        .then(() => {

          // TODO фильтруем по отбору с учетом разыменования и видов сравнения
          // TODO не забываем про методы $p.utils._find_rows и $p.CchProperties.check_compare, $p.CchProperties.check_condition (из windowbuilder)

          // сворачиваем результат и сохраняем его в data._rows
          const dims = scheme.dims();
          const ress = [];
          _columns.forEach(({key}) => {
            if(dims.indexOf(key) == -1 && resources.indexOf(key) != -1) {
              ress.push(key);
            }
            else {
              // для базовой группировки, подмешиваем в измерения всё, что не ресурс
              dims.indexOf(key) == -1 && dims.push(key);
            }
          });

          // группируем по схеме

          // TODO сейчас поддержана только первая запись иерархии

          // TODO сейчас нет понятия детальных записей - всё сворачивается по измерениям

          // TODO сейчас набор полей не поддержан в интерфейсе, но решаем сразу для группировки по нескольким полям
          const grouping = scheme.dims();
          if(grouping.length) {
            // строка полей группировки без пустых полей
            const dflds = dims.filter(v => v).join(', ');

            // TODO в группировке может потребоваться разыменовать поля

            // TODO итоги надо считать не по всем русурсам

            // TODO итоги надо считать с учетом формулы

            const sql = `select ${ress.map(res => `sum(${res}) as ${res}`).join(', ')
              } ${dflds ? ((ress.length ? ', ' : '') + dflds) : ''} from ? ${dflds ? 'group by ROLLUP(' + dflds + ')' : ''}`;

            // TODO еще, в alasql есть ROLLUP, CUBE и GROUPING SETS (аналог 1С-ного ИТОГИ) - можно задействовать
            const res = $p.wsql.alasql(sql, [data._obj]);

            // складываем результат в иерархическую структуру
            const levels = [];
            let index = 0;
            for (const row of res) {

              row.row = (index++).toString();

              // является ли строка группировкой?
              const is_group = dims.some(v => row[v] === null);
              const parent_group = {};
              const parent_dims = [];
              is_group && dims.forEach(v => {
                if(row[v] !== null) {
                  parent_dims.push(v);
                  parent_group[v] = row[v];
                }
              });

              // ищем подходящего родителя
              let parent;
              for (const level of levels) {
                if(is_group) {
                  const lim = parent_dims.length - 1;
                  if(parent_dims.every((v, i) => (level[v] instanceof Date && row[v] instanceof Date ?
                      level[v].valueOf() === row[v].valueOf() : level[v] === row[v]) || i === lim)) {
                    parent = level;
                  }
                  // если мы группировка, добавляем себя в levels
                  row.children = [];
                  levels.push(row);
                  break;
                }
                else {
                  const lim = dims.length - 1;
                  if(dims.every((v, i) => level[v] === row[v] || i === lim)) {
                    parent = level;
                    break;
                  }
                }
              }
              if(parent) {
                parent.children.push(row);
              }
              else {
                if(!levels.length) {
                  row.children = [];
                  levels.push(row);
                }
              }
            }

            data._rows.push(levels[0]);
            data._rows._count = index;

            // TODO для ссылочных полей надо выполнить приведение типов, т.к в alasql возвращает guid`s вместо объектов
            this.cast(data._rows, 0, dims);

          }
          else {
            // или заполняем без группировки
            data.group_by(dims, ress);
            data.forEach((row) => {
              data._rows.push(row);
            });
            data._rows._count = data._rows.length;
          }

        });
    }

    /**
     * Выполняет приведение типов в группировках и ссылочных полях после alasql
     */
    cast(rows, level, dims, dim, meta) {
      if(!meta){
        meta = this._metadata(this._manager._tabular || 'data').fields;
        dim = dims[dims.length - 1];
      }
      const {utils} = $p;
      for(const row of rows) {
        if(row.children){
          // если это группировка верхнего уровня
          if(level == 0){
            row[dim] = meta[dim].type.is_ref ? {presentation: 'Σ'} : 'Σ';
          }
          else{
            const gdim = dims[level - 1];
            const mgr = this._manager.value_mgr(row, gdim, meta[gdim].type);
            const val = utils.is_data_mgr(mgr) ? mgr.get(row[gdim]) : row[gdim];
            row[dim] = this._manager.value_mgr(row, dim, meta[dim].type) ?
              (
                utils.is_data_obj(val) ? val : {presentation: val instanceof Date ? utils.moment(val).format(utils.moment._masks[meta[gdim].type.date_part]) : val }
              )
              :
              (
                utils.is_data_obj(val) ? val.toString() : val
              );
          }
          this.cast(row.children, level + 1, dims, dim, meta);
        }
        else{
          const mgr = this._manager.value_mgr(row, dim, meta[dim].type);
          if(utils.is_data_mgr(mgr)) {
            row[dim] =  mgr.get(row[dim]);
          }
        }
      }
    }

  };

  /**
   * Класс-компонент панели параметров отчета
   * @type {RepParams}
   */
  $p.rep.cash_moving.RepParams = RepParams;

}



