/**
 *
 *
 * @module scheme_settings
 *
 * Created by Evgeniy Malyarov on 17.01.2019.
 */

//Назначить исполнителя
{
  "_id": "cat.scheme_settings|101d32ee-6b5d-4e7b-cb74-392b4deeb63b",
  "_rev": "1-0063fcffefb7cee3eba706059d992d03",
  "fields": [
  {
    "use": true,
    "field": "quickly",
    "width": 60,
    "caption": "Срочно",
    "ctrl_type": "toggle"
  },
  {
    "use": true,
    "field": "important",
    "width": 60,
    "caption": "Важно",
    "ctrl_type": "toggle"
  },
  {
    "use": true,
    "field": "mark",
    "width": 60,
    "caption": "Баллы",
    "ctrl_type": ""
  },
  {
    "use": true,
    "field": "_area",
    "width": 80,
    "caption": "Область",
    "ctrl_type": ""
  },
  {
    "use": true,
    "field": "caption",
    "width": "*",
    "caption": "Задача",
    "tooltip": "Заголовок",
    "ctrl_type": ""
  },
  {
    "use": true,
    "field": "initiator",
    "width": "",
    "caption": "Инициатор",
    "ctrl_type": ""
  },
  {
    "use": true,
    "field": "executor",
    "width": "",
    "caption": "Исполнитель",
    "ctrl_type": "",
    "row": 6
  }
],
  "selection": [
  {
    "use": true,
    "left_value": "executor_accepted",
    "left_value_type": "path",
    "comparison_type": "eq",
    "right_value": "1",
    "right_value_type": "boolean"
  },
  {
    "use": true,
    "left_value": "executor",
    "left_value_type": "path",
    "comparison_type": "nfilled",
    "right_value": "",
    "right_value_type": "cat.users"
  }
],
  "obj": "doc.issue",
  "name": "Назначить исполнителя",
  "standard_period": "last3Month",
  "date_from": "2018-01-01T05:00:00",
  "date_till": "2018-04-20T22:40:29",
  "user": "",
  "params": [],
  "sorting": []
}

//Проставить срочность
{
  "_id": "cat.scheme_settings|1053bb02-d248-4e8e-8bc4-46b320ccfb5a",
  "_rev": "1-90e0c04db968d7185476a66244c38cf8",
  "fields": [
  {
    "use": true,
    "field": "quickly",
    "width": 60,
    "caption": "Срочно",
    "ctrl_type": "toggle"
  },
  {
    "use": true,
    "field": "important",
    "width": 60,
    "caption": "Важно",
    "ctrl_type": "toggle"
  },
  {
    "use": true,
    "field": "mark",
    "width": 60,
    "caption": "Баллы",
    "ctrl_type": ""
  },
  {
    "use": true,
    "field": "_area",
    "width": 80,
    "caption": "Область",
    "ctrl_type": ""
  },
  {
    "use": true,
    "field": "caption",
    "width": "*",
    "caption": "Задача",
    "tooltip": "Заголовок",
    "ctrl_type": ""
  },
  {
    "use": true,
    "field": "initiator",
    "width": "",
    "caption": "Инициатор",
    "ctrl_type": ""
  },
  {
    "use": true,
    "field": "executor",
    "width": "",
    "caption": "Исполнитель",
    "ctrl_type": "",
    "row": 6
  }
],
  "selection": [
  {
    "use": true,
    "left_value": "executor_accepted",
    "left_value_type": "path",
    "comparison_type": "eq",
    "right_value": "1",
    "right_value_type": "boolean"
  },
  {
    "use": true,
    "left_value": "quickly",
    "left_value_type": "path",
    "comparison_type": "nfilled",
    "right_value": "",
    "right_value_type": "number"
  },
  {
    "use": true,
    "left_value": "important",
    "left_value_type": "path",
    "comparison_type": "nfilled",
    "right_value": "",
    "right_value_type": "number"
  }
],
  "obj": "doc.issue",
  "name": "Проставить срочность",
  "standard_period": "last3Month",
  "date_from": "2018-01-01T05:00:00",
  "date_till": "2018-04-20T22:40:29",
  "user": "",
  "params": [],
  "sorting": []
}

//Принять в работу
{
  "_id": "cat.scheme_settings|1102a882-88ce-4d60-9dbb-c5aa873e19f9",
  "_rev": "1-7b949a1641d2ef59cd16186b56b4cc77",
  "fields": [
  {
    "use": true,
    "field": "quickly",
    "width": 60,
    "caption": "Срочно",
    "ctrl_type": "toggle"
  },
  {
    "use": true,
    "field": "important",
    "width": 60,
    "caption": "Важно",
    "ctrl_type": "toggle"
  },
  {
    "use": true,
    "field": "mark",
    "width": 60,
    "caption": "Баллы",
    "ctrl_type": ""
  },
  {
    "use": true,
    "field": "_area",
    "width": 80,
    "caption": "Область",
    "ctrl_type": ""
  },
  {
    "use": true,
    "field": "caption",
    "width": "*",
    "caption": "Задача",
    "tooltip": "Заголовок",
    "ctrl_type": ""
  },
  {
    "use": true,
    "field": "initiator",
    "width": "",
    "caption": "Инициатор",
    "ctrl_type": ""
  },
  {
    "use": true,
    "field": "executor",
    "width": "",
    "caption": "Исполнитель",
    "ctrl_type": "",
    "row": 6
  }
],
  "selection": [
  {
    "parent": "",
    "use": true,
    "left_value": "executor_accepted",
    "left_value_type": "path",
    "comparison_type": "ne",
    "right_value": "1",
    "right_value_type": "boolean"
  },
  {
    "parent": "",
    "use": true,
    "left_value": "canceled",
    "left_value_type": "path",
    "comparison_type": "ne",
    "right_value": "1",
    "right_value_type": "boolean"
  },
  {
    "parent": "",
    "use": true,
    "left_value": "specify",
    "left_value_type": "path",
    "comparison_type": "ne",
    "right_value": "1",
    "right_value_type": "boolean"
  }
],
  "obj": "doc.issue",
  "name": "Принять в работу",
  "standard_period": "last3Month",
  "date_from": "2018-01-01T05:00:00",
  "date_till": "2018-04-20T22:40:29",
  "user": "",
  "params": [],
  "sorting": []
}

//Проверить
{
  "_id": "cat.scheme_settings|61d1e3e5-9d5b-40c9-81bb-bedd0b78797c",
  "_rev": "3-a4bebc3905fcbdf76c545740f08d359e",
  "fields": [
  {
    "use": true,
    "field": "quickly",
    "width": 60,
    "caption": "Срочно",
    "ctrl_type": "toggle"
  },
  {
    "use": true,
    "field": "important",
    "width": 60,
    "caption": "Важно",
    "ctrl_type": "toggle"
  },
  {
    "use": true,
    "field": "mark",
    "width": 60,
    "caption": "Баллы",
    "ctrl_type": ""
  },
  {
    "use": true,
    "field": "_area",
    "width": 80,
    "caption": "Область",
    "ctrl_type": ""
  },
  {
    "use": true,
    "field": "caption",
    "width": "*",
    "caption": "Задача",
    "tooltip": "Заголовок",
    "ctrl_type": ""
  },
  {
    "use": true,
    "field": "initiator",
    "width": "",
    "caption": "Инициатор",
    "ctrl_type": ""
  },
  {
    "use": true,
    "field": "executor",
    "width": "",
    "caption": "Исполнитель",
    "ctrl_type": "",
    "row": 6
  }
],
  "selection": [
  {
    "use": true,
    "left_value": "completed",
    "left_value_type": "path",
    "comparison_type": "eq",
    "right_value": "1",
    "right_value_type": "boolean"
  },
  {
    "use": true,
    "left_value": "initiator_accepted",
    "left_value_type": "path",
    "comparison_type": "ne",
    "right_value": "1",
    "right_value_type": "boolean"
  }
],
  "obj": "doc.issue",
  "name": "Проверить",
  "standard_period": "last3Month",
  "date_from": "2018-01-01T05:00:00",
  "date_till": "2018-04-20T22:40:29",
  "user": "",
  "params": [],
  "sorting": []
}

//Доработать
{
  "_id": "cat.scheme_settings|87caead0-9fd3-47ba-87ec-a38ba63cf29d",
  "_rev": "3-ed69fe734d9ed6bdac5ba4dbfb1b94b8",
  "fields": [
  {
    "use": true,
    "field": "quickly",
    "width": 60,
    "caption": "Срочно",
    "ctrl_type": "toggle"
  },
  {
    "use": true,
    "field": "important",
    "width": 60,
    "caption": "Важно",
    "ctrl_type": "toggle"
  },
  {
    "use": true,
    "field": "mark",
    "width": 60,
    "caption": "Баллы",
    "ctrl_type": ""
  },
  {
    "use": true,
    "field": "_area",
    "width": 80,
    "caption": "Область",
    "ctrl_type": ""
  },
  {
    "use": true,
    "field": "caption",
    "width": "*",
    "caption": "Задача",
    "tooltip": "Заголовок",
    "ctrl_type": ""
  },
  {
    "use": true,
    "field": "initiator",
    "width": "",
    "caption": "Инициатор",
    "ctrl_type": ""
  },
  {
    "use": true,
    "field": "executor",
    "width": "",
    "caption": "Исполнитель",
    "ctrl_type": "",
    "row": 6
  }
],
  "selection": [
  {
    "parent": "",
    "use": true,
    "left_value": "specify",
    "left_value_type": "path",
    "comparison_type": "eq",
    "right_value": "1",
    "right_value_type": "boolean"
  }
],
  "obj": "doc.issue",
  "name": "Доработать",
  "standard_period": "last3Month",
  "date_from": "2018-01-01T05:00:00",
  "date_till": "2018-04-20T22:40:29",
  "user": "",
  "params": [],
  "sorting": []
}

//Исполнено
{
  "_id": "cat.scheme_settings|f0ae706b-1760-4cad-940c-ae067d71ba07",
  "_rev": "2-407db94ae33685d3a21500ca39e3ba8c",
  "fields": [
  {
    "use": true,
    "field": "quickly",
    "width": 60,
    "caption": "Срочно",
    "ctrl_type": "toggle"
  },
  {
    "use": true,
    "field": "important",
    "width": 60,
    "caption": "Важно",
    "ctrl_type": "toggle"
  },
  {
    "use": true,
    "field": "mark",
    "width": 60,
    "caption": "Баллы",
    "ctrl_type": ""
  },
  {
    "use": true,
    "field": "_area",
    "width": 80,
    "caption": "Область",
    "ctrl_type": ""
  },
  {
    "use": true,
    "field": "caption",
    "width": "*",
    "caption": "Задача",
    "tooltip": "Заголовок",
    "ctrl_type": ""
  },
  {
    "use": true,
    "field": "initiator",
    "width": "",
    "caption": "Инициатор",
    "ctrl_type": ""
  },
  {
    "use": true,
    "field": "executor",
    "width": "",
    "caption": "Исполнитель",
    "ctrl_type": ""
  }
],
  "selection": [
  {
    "parent": "",
    "use": true,
    "left_value": "completed",
    "left_value_type": "path",
    "comparison_type": "eq",
    "right_value": 1,
    "right_value_type": "boolean"
  },
  {
    "parent": "",
    "use": true,
    "left_value": "canceled",
    "left_value_type": "path",
    "comparison_type": "ne",
    "right_value": 1,
    "right_value_type": "boolean"
  }
],
  "obj": "doc.issue",
  "name": "Исполнено",
  "standard_period": "last3Month",
  "user": "",
  "params": [],
  "sorting": []
}

//Отменено
{
  "_id": "cat.scheme_settings|f4ae706b-1960-4cad-940c-ae067d71ba07",
  "_rev": "1-94fc7d0786f74c2e5cd3f0cfd2e09ff6",
  "fields": [
  {
    "use": true,
    "field": "quickly",
    "width": 60,
    "caption": "Срочно",
    "ctrl_type": "toggle"
  },
  {
    "use": true,
    "field": "important",
    "width": 60,
    "caption": "Важно",
    "ctrl_type": "toggle"
  },
  {
    "use": true,
    "field": "mark",
    "width": 60,
    "caption": "Баллы",
    "ctrl_type": ""
  },
  {
    "use": true,
    "field": "_area",
    "width": 80,
    "caption": "Область",
    "ctrl_type": ""
  },
  {
    "use": true,
    "field": "caption",
    "width": "*",
    "caption": "Задача",
    "tooltip": "Заголовок",
    "ctrl_type": ""
  },
  {
    "use": true,
    "field": "initiator",
    "width": "",
    "caption": "Инициатор",
    "ctrl_type": ""
  },
  {
    "use": true,
    "field": "executor",
    "width": "",
    "caption": "Исполнитель",
    "ctrl_type": ""
  }
],
  "selection": [
  {
    "parent": "",
    "use": true,
    "left_value": "canceled",
    "left_value_type": "path",
    "comparison_type": "eq",
    "right_value": 1,
    "right_value_type": "boolean"
  }
],
  "obj": "doc.issue",
  "name": "Отменено",
  "standard_period": "last3Month",
  "user": "",
  "params": [],
  "sorting": []
}
