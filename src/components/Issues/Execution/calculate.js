/**
 *
 *
 * @module calculate
 *
 * Created by Evgeniy Malyarov on 25.11.2018.
 */

export default function calculate() {

  // получаем даты
  const minus_3month = moment().startOf('month').subtract(2, 'month').format();
  const minus_6month = moment().startOf('month').subtract(6, 'month').format();
  const start = moment().startOf('month').subtract(5, 'month').format();
  const format = 'YYYY-MM-DD';

  const raw = $p.doc.issue._indexer.find({
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
      executor: v.executor,
      mark: v.mark
    }));

  const d7days = alasql('select date, executor, sum(mark) as mark from ? where date >= ? group by date, executor',
    [raw, moment().subtract(7, 'days').format(format)]);

  return [
    {
      "title": "7 дней",
      "description": "Сколько задач мы решили за неделю",
      "kind": "line",
      "hideLegend": false,
      "acl": [
        "_anonymous"
      ],
      "points": [
        {
          "name": "ПредставлениеДаты",
          "presentation": "ПредставлениеДаты"
        }
      ],
      "series": [
        {
          "name": "Белокаменцев И.Е.",
          "presentation": "Белокаменцев И.Е.",
          "color": "#FF0000",
          "opacity": 1
        },
        {
          "name": "Маляров Е.С.",
          "presentation": "Маляров Е.С.",
          "color": "#624FAC",
          "opacity": 1
        },
        {
          "name": "",
          "presentation": "",
          "color": "#D02A35",
          "opacity": 1
        }
      ],
      "rows": [
        {
          "Маляров Е.С.": {
            "value": 23,
            "presentation": "23",
            "color": "#000000"
          },
          "Белокаменцев И.Е.": {
            "value": 27,
            "presentation": "27",
            "color": "#000000"
          },
          "ПредставлениеДаты": "16.11.2018"
        },
        {
          "Маляров Е.С.": {
            "value": 13,
            "presentation": "13",
            "color": "#000000"
          },
          "Белокаменцев И.Е.": {
            "value": 0,
            "presentation": "",
            "color": "#000000"
          },
          "ПредставлениеДаты": "17.11.2018"
        },
        {
          "Маляров Е.С.": {
            "value": 30,
            "presentation": "30",
            "color": "#000000"
          },
          "Белокаменцев И.Е.": {
            "value": 53,
            "presentation": "53",
            "color": "#000000"
          },
          "ПредставлениеДаты": "19.11.2018"
        },
        {
          "Маляров Е.С.": {
            "value": 29,
            "presentation": "29",
            "color": "#000000"
          },
          "Белокаменцев И.Е.": {
            "value": 52,
            "presentation": "52",
            "color": "#000000"
          },
          "ПредставлениеДаты": "20.11.2018"
        },
        {
          "Маляров Е.С.": {
            "value": 42,
            "presentation": "42",
            "color": "#000000"
          },
          "Белокаменцев И.Е.": {
            "value": 25,
            "presentation": "25",
            "color": "#000000"
          },
          "ПредставлениеДаты": "21.11.2018"
        },
        {
          "Маляров Е.С.": {
            "value": 3,
            "presentation": "3",
            "color": "#000000"
          },
          "Белокаменцев И.Е.": {
            "value": 42,
            "presentation": "42",
            "color": "#000000"
          },
          "ПредставлениеДаты": "22.11.2018"
        },
        {
          "Маляров Е.С.": {
            "value": 5,
            "presentation": "5",
            "color": "#000000"
          },
          "Белокаменцев И.Е.": {
            "value": 5,
            "presentation": "5",
            "color": "#000000"
          },
          "ПредставлениеДаты": "23.11.2018"
        },
        {
          "": {
            "value": 0,
            "presentation": "",
            "color": "#000000"
          },
          "ПредставлениеДаты": ""
        }
      ]
    }
  ];
}
