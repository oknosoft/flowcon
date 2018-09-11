/**
 * ### Вычисляет параметры из url
 *
 * @module queryString
 *
 * Created by Evgeniy Malyarov on 07.09.2018.
 */

import qs from 'qs';

export function fromQuery() {
  const prm = qs.parse(location.search.replace('?',''));
  if(prm.page) {
    prm.page = parseInt(prm.page, 10);
    if(prm.page > 0) {
      prm.page--;
    }
    else {
      prm.page = 0;
    }
  }
  else {
    prm.page = 0;
  }
  return prm;
}

export function path(newPrm) {
  const prm = fromQuery();
  let path = location.pathname;
  if(newPrm.hasOwnProperty('page')) {
    prm.page = newPrm.page;
  }
  if(newPrm.hasOwnProperty('view')) {
    prm.view = newPrm.view;
  }
  if(!prm.view) {
    delete prm.view;
  }
  if(prm.page <= 1) {
    delete prm.page;
  }
  if(Object.keys(prm).length) {
    if(path.endsWith('/')) {
      path = path.replace(/\/$/, '');
    }
    return `${path}?${qs.stringify(prm)}`;
  }

  if(!path.endsWith('/')) {
    path += '/';
  }
  return path;

}
