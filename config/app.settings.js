/**
 * ### При установке параметров сеанса
 * Процедура устанавливает параметры работы программы при старте веб-приложения
 *
 * @param prm {Object} - в свойствах этого объекта определяем параметры работы программы
 */
module.exports = function settings(prm = {}) {

  return Object.assign(prm, {

    // разделитель для localStorage
    local_storage_prefix: 'hw_',

    // гостевые пользователи для демо-режима
    guests: [{
      username: "Гость",
      password: "hQI7OhIGlVeOWi8="
    }],

    // если понадобится обратиться к 1С, будем использовать irest
    irest_enabled: true,

    // расположение rest-сервиса 1c по умолчанию
    rest_path: '',

    // расположение couchdb для сайта
    couch_path: "/couchdb/hw_",

    // расположение couchdb для nodejs
    couch_local: "http://cou200:5984/hw_",

    // фильтр для репликации с CouchDB не используем
    pouch_filter: {
      meta: 'auth/meta',
    },

    // по умолчанию, обращаемся к зоне 1
    zone: 1,

    // объявляем номер демо-зоны
    zone_demo: 1,

    // размер вложений
    attachment_max_size: 2000000,

    // разрешаем сохранение пароля
    enable_save_pwd: true,

    // используем геокодер
    use_ip_geo: true,

    // используем карты google
    use_google_geo: 'AIzaSyAO-Jca5NTE5bQ7IY7BxFCl0jgW9OsJvuM',

  });

};
