/**
 *
 *
 * @module calculate
 *
 * Created by Evgeniy Malyarov on 25.11.2018.
 */

const {cat: {users}, doc: {issue}, utils} = $p;
const clrs = ['#aa0000', '#bb33ff', '#cc66cc', '#624fac', '#669933', '#cc9933', '#3300ff', '#660000'];
class Chart {
  constructor({title, description, rows, rformat}) {
    this.title = title;
    this.description = description;
    this.kind = 'line';
    this.hideLegend = false;
    this.points = [{name: 'date', presentation: 'Дата'}];
    this.series = [];
    this.rows = [];

    this.calculate(rows, rformat);
  }

  calculate(rows, rformat) {
    rows.push.apply(rows, alasql('select date, ? as executor, sum(mark) as mark from ? group by date',
      [users.predefined.together, rows]));
    rows = alasql('select * from ? order by date, executor', [rows]);

    // вычисляемые
    const _executors = alasql('select distinct executor from ? order by executor', [rows]);
    const _days = alasql('select distinct date from ?', [rows]);

    // заполним серии
    _executors.forEach(({executor}) => {
      this.series.push({
        name: executor.name,
        color: clrs[this.series.length]
      });
    });

    // заполним строки
    _days.forEach(({date}) => {
      const row = {date: moment(date).format(rformat)};
      _executors.forEach(({executor}) => {
        if(!rows.some((v) => {
          if(v.date === date && v.executor === executor) {
            row[executor.name] = v.mark;
            return true;
          }
        })){
          row[executor.name] = {value: 0};
        }
      });
      this.rows.push(row);
    });

    // добавляет пустую точку в конец
    this.series.push({
      name: '',
      color: clrs[this.series.length]
    });
    this.rows.push({
      '': {value: ''},
      date: ''
    });
    return this;
  }

}

export default function calculate() {

  // получаем даты
  const minus_6month = moment().startOf('month').subtract(6, 'month').format();
  const start = moment().startOf('month').subtract(5, 'month').format();
  const format = 'YYYY-MM-DD';

  if(!users.predefined.together) {
    users.predefined.together = users.create({ref: utils.blank.guid.replace('00000000', 'ffffffff'), name: 'Вместе'}, false, true);
  }

  const raw = issue._indexer.find({
    selector: {
      $and: [
        {date: {$gte: minus_6month}},
        {date: {$lte: moment().endOf("day").format()}},
        {completed: true},
      ]
    }
  }).docs
    .filter(({state_date}) => state_date > start)
    .map((v) => ({
      date: moment(v.state_date).format(format),
      week: moment(v.state_date).startOf('week').format(format),
      month: moment(v.state_date).startOf('month').format(format),
      executor: users.get(v.executor),
      mark: v.mark
    }));

  if(!raw.length) {
    raw.push({
      date: moment().format(format),
      week: moment().startOf('week').format(format),
      month: moment().startOf('month').format(format),
      executor: users.predefined.together,
      mark: 0
    })
  }

  return Promise.resolve()
    .then(() => {

      const chart7days = new Chart({
        title: '7 дней',
        description: 'Сколько задач мы решили за неделю',
        rows: alasql('select date, executor, sum(mark) as mark from ? where date >= ? group by date, executor',
          [raw, moment().subtract(7, 'days').format(format)]),
        rformat: 'DD.MM.YY',
      });

      const chart3month = new Chart({
        title: '3 месяца',
        description: 'Задачи за 3 месяца по неделям',
        rows: alasql('select week as date, executor, sum(mark) as mark from ? where date >= ? group by week, executor',
          [raw, moment().startOf('month').subtract(2, 'month').format()]),
        rformat: 'DD.MM.YY',
      });

      const chart6month= new Chart({
        title: '6 месяцев',
        description: 'Задачи за полгода по месяцам',
        rows: alasql('select month as date, executor, sum(mark) as mark from ? group by month, executor', [raw]),
        rformat: 'MMM YY',
      });

      return [chart7days, chart3month, chart6month];

    });
}
