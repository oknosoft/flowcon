import React from 'react';
import IconChart from '@material-ui/icons/InsertChart';
import IconDoc from '@material-ui/icons/EventNote';
import IconInfo from '@material-ui/icons/Info';
import IconPerson from '@material-ui/icons/Person';
import IconSettings from '@material-ui/icons/Settings';
// import IconHelp from '@material-ui/icons/Help';
// import IconDrafts from '@material-ui/icons/Drafts';
// import IconList from '@material-ui/icons/List';

const items = [
  {
    text: 'Теория',
    icon: <IconDoc/>,
    open: true,
    id: 'theory',
    items: [
      {
        text: 'Flowcon - что это',
        id: 'readme',
        navigate: '/readme',
        //icon: <IconDrafts/>
      },
      {
        text: 'Концепция',
        id: 'concept',
        navigate: '/readme',
      },
      {
        text: 'История',
        id: 'history',
        navigate: '/readme',
      },
    ]
  },
  {
    text: 'Практика',
    icon: <IconChart/>,
    open: true,
    id: 'practice',
    items: [
      {
        text: 'С чего начать',
        id: 'begin',
        navigate: '/readme',
      },
      {
        text: 'Как настроить',
        id: 'tune',
        navigate: '/readme',
      },
      {
        text: 'Диаграмма эффективности',
        id: 'diagram',
        navigate: '/diagram',
        need_meta: true,
        need_user: true,
      },
      {
        text: 'Таблица',
        id: 'list',
        navigate: '/list',
        need_meta: true,
        need_user: true,
      },
    ],

  },
  {
    divider: true,
  },
  {
    text: 'Профиль',
    navigate: '/login',
    need_meta: true,
    icon: <IconPerson/>
  },
  {
    text: 'Настройки',
    navigate: '/settings',
    need_meta: true,
    icon: <IconSettings/>,
  },
  {
    text: 'О программе',
    title: 'Flowcon - о программе',
    navigate: '/about',
    icon: <IconInfo/>
  }
];

function path_ok(path, item) {
  const pos = item.navigate && item.navigate.indexOf(path);
  return pos === 0 || pos === 1;
}

function with_recursion(path, parent) {
  if(path && path != '/'){
    for(const item of parent){
      const props = item.items ? with_recursion(path, item.items) : path_ok(path, item) && item;
      if(props){
        return props;
      }
    }
  }
}

export function item_props(path) {
  if(!path){
    path = location.pathname;
  }
  // здесь можно переопределить нужность meta и авторизованности для корневой страницы
  let res = with_recursion(path, items);
  if(!res && path.match(/\/(doc|cat|ireg|cch|rep)\./)){
    res = {need_meta: true, need_user: true};
  }
  return res || {};
}

export default items;
