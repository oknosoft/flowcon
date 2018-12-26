'use strict';

const YAML = require('yamljs');
const uuidv1 = require('uuid/v1');

module.exports = function(superlogin) {
  const {userDB, config} = superlogin;

  this.get = function(user_id) {
    const profile = {};
    return userDB.get(user_id)
      .then(function(userDoc) {
        profile._id = userDoc._id;
        profile.name = userDoc.name;
        profile.email = userDoc.email;
        profile.providers = userDoc.providers;
        userDoc.providers.forEach((provider) => {
          if(provider !== 'local') {
            const info = YAML.stringify(userDoc[provider].profile._json);
            profile[provider] = info;
          }
        });
        // Make a list
        const providerConfig = config.getItem('providers');
        const allProviders = [];
        if(providerConfig) {
          Object.keys(providerConfig).forEach((key) => allProviders.push(key));
        }
        profile.allProviders = allProviders;
        profile.sessions = 0;
        if(userDoc.session) {
          profile.sessions = Object.keys(userDoc.session).length;
        }
        return Promise.resolve(profile);
      });
  };

  // изменяет полное имя в профиле пользователя
  this.changeName = function(user_id, newName) {
    return userDB.get(user_id)
      .then((userDoc) => {
        userDoc.profile.name = newName;
        return userDB.put(userDoc);
      });
  };

  // создаёт недостающие поля в профиле
  this.onCreate = function (userDoc, provider)  {
    if(!userDoc.profile) {
      userDoc.profile = {};
    }
    const {profile} = userDoc;
    if(provider !== 'local' && !profile.name) {
      const displayName = userDoc[provider].profile.displayName;
      if(displayName) {
        profile.name = displayName;
      }
    }
    if(!profile.ref) {
      profile.ref = uuidv1();
      profile.subscription = true;
    }
    if(!profile.myDBs) {
      profile.myDBs = [];
    }
    if(!profile.myUsers) {
      profile.myUsers = [];
    }
    return Promise.resolve(userDoc);
  };

  // изменяет признак "подписан на рассылку"
  this.changeSubscription = function(user_id, subscription) {
    return userDB.get(user_id)
      .then((userDoc) => {
        userDoc.profile.subscription = subscription;
        return userDB.put(userDoc);
      });
  };

  // добавляет пользователя в список администрирования
  this.addUser = function(user_id, sub_id) {
    if(user_id === sub_id) {
      return Promise.reject(new Error('Нельзя добавить в список администрирования самого себя'));
    }
    return userDB.get(user_id)
      .then((userDoc) => {
        return userDB.get(sub_id)
          .then((subDoc) => {
            return {userDoc, subDoc};
          });
      })
      .then(({userDoc, subDoc}) => {
        const {profile} = userDoc;
        if(!profile.myUsers) {
          profile.myUsers = [];
        }
        if(profile.myUsers.some((v) => v.name === sub_id)) {
          return profile;
        }
        profile.myUsers.push({name: sub_id, value: []});
        return userDB.put(userDoc)
          .then(() => profile);
      });
  };

  // удаляет пользователя из списка администрирования
  this.rmUser = function(user_id, sub_id) {
    if(user_id === sub_id) {
      return Promise.reject(new Error('Нельзя удалить самого себя из списка администрирования'));
    }
    if(!sub_id) {
      return Promise.reject(new Error('Пустое имя пользователя для удаления'));
    }
    return userDB.get(user_id)
      .then((userDoc) => {
        return userDB.get(sub_id)
          .then((subDoc) => {
            return {userDoc, subDoc};
          });
      })
      .then(({userDoc, subDoc}) => {
        const {profile} = userDoc;

        // удаляем из наших пользователей
        if(!profile.myUsers || !profile.myUsers.some((v, index) => {
          if(v.name === sub_id) {
            profile.myUsers.splice(index, 1);
            return true;
          }
        })) {
          return profile;
        }

        // отнимаем у стороннего пользователя наши базы
        let changed;
        profile.myDBs.forEach((db) => {
          if(subDoc.personalDBs[db]) {
            changed = true;
            delete subDoc.personalDBs[db];
          }
        });
        const sub = changed ?
          userDB.put(subDoc)
            .then(() => superlogin.logoutUser(sub_id))
          :
          Promise.resolve();

        return sub.then(() => userDB.put(userDoc))
          .then(() => profile);
      });
  };

  // получает список пользователей общих баз текущего пользователя
  this.sharedUsers = function(user_id) {
    return userDB.get(user_id)
      .then((userDoc) => {
        const {personalDBs} = userDoc;
        const keys = [];
        for(const name in personalDBs) {
          if(personalDBs[name].type === 'shared') {
            keys.push(name);
          }
        }
        return userDB.query('doc/users', {keys});
      })
      .then(({rows}) => {
        return userDB.allDocs({keys: rows.map((v) => v.id), include_docs: true});
      })
      .then(({rows}) => {
        return rows.filter((v) => v.doc && v.doc.profile)
          .map(({doc, id}) => {
            return {
              id,
              ref: doc.profile.ref,
              name: doc.profile.name,
              email: doc.email,
            };
          });
      });
  };

  // создаёт общую базу и добавляет её в профиль подписчика
  this.createSharedDB = function(user_id, dbName) {
    return userDB.get(user_id)
      .then((userDoc) => {

        // генерируем ошибку, если нет роли subscribers
        if(!userDoc.roles.includes('subscribers') && !userDoc.roles.includes('doc_full')) {
          throw new Error('Недостаточно прав. В профиле пользователя отсутствует роль "subscribers"');
        }

        // проверяем название базы
        if (!dbName.match(/^[a-z0-9_-]{4,20}$/)) {
          throw new Error('Ошибка в имени базы. Разрешены строчные буквы латинскгого алфавита и цифры, длина от 4 до 20 символов');
        }

        // если есть такая база
        if(userDoc.personalDBs[dbName]) {
          throw new Error(`База ${dbName} уже назначена пользователю ${user_id}`);
        }

        return superlogin.uniqueDbName(dbName)
          .then((finalName) => {
            if(finalName !== dbName) {
              throw new Error(`Имя '${dbName}' занято. Вместо него можно использовать '${finalName}'`);
            }
            return superlogin.addUserDB(user_id, dbName, 'shared', superlogin.config.getItem('userDBs.model.fl_0_doc.designDocs'))
              .then(() => userDB.get(user_id))
              .then((userDoc) => userDoc.profile);
          });
      });
  };

  // добавляет общую базу пользователю
  this.shareDB = function(user_id, sub_id, dbName) {
    if(user_id === sub_id) {
      return Promise.reject(new Error('Нельзя добавить базу самому себе'));
    }
    if(!sub_id) {
      return Promise.reject(new Error('Не указан пользователь'));
    }
    if(!dbName) {
      return Promise.reject(new Error('Не указано имя базы'));
    }
    return userDB.get(user_id)
      .then((userDoc) => {
        return userDB.get(sub_id)
          .then((subDoc) => {
            return {userDoc, subDoc};
          });
      })
      .then(({userDoc, subDoc}) => {
        const {profile} = userDoc;
        // есть ли пользователь в myUsers
        let user;
        if(!profile.myUsers || !profile.myUsers.some((v) => {
          if(v.name === sub_id) {
            user = v;
            return true;
          }
        })) {
          return Promise.reject(new Error(`Пользователя '${sub_id}' нет в списке администрирования`));
        }
        // есть ли у нас права шарить эту базу
        if(!profile.myDBs.includes(dbName)) {
          return Promise.reject(new Error(`У пользователя '${user_id}' нет прав на базу '${dbName}'`));
        }

        // добавляем разрешение пользователю
        let sub;
        if(!subDoc.personalDBs[dbName]) {
          subDoc.personalDBs[dbName] = userDoc.personalDBs[dbName];
          sub = userDB.put(subDoc);
        }
        else {
          sub = Promise.resolve();
        }

        // добавляем инфо в запись пользователя
        if(!user.value.includes(dbName)){
          user.value.push(dbName);
          sub = sub.then(() => userDB.put(userDoc));
        }

        return sub.then(() => profile);
      });
  };

  // отнимает общую базу у пользователя
  this.unshareDB = function(user_id, sub_id, dbName) {
    if(user_id === sub_id) {
      return Promise.reject(new Error('Нельзя отнять базу у самомого себя'));
    }
    if(!sub_id) {
      return Promise.reject(new Error('Не указан пользователь'));
    }
    if(!dbName) {
      return Promise.reject(new Error('Не указано имя базы'));
    }
    return userDB.get(user_id)
      .then((userDoc) => {
        return userDB.get(sub_id)
          .then((subDoc) => {
            return {userDoc, subDoc};
          });
      })
      .then(({userDoc, subDoc}) => {
        const {profile} = userDoc;
        // есть ли пользователь в myUsers
        let user;
        if(!profile.myUsers || !profile.myUsers.some((v) => {
          if(v.name === sub_id) {
            user = v;
            return true;
          }
        })) {
          return Promise.reject(new Error(`Пользователя '${sub_id}' нет в списке администрирования`));
        }
        // есть ли у нас права шарить эту базу
        if(!profile.myDBs.includes(dbName)) {
          return Promise.reject(new Error(`У пользователя '${user_id}' нет прав на базу '${dbName}'`));
        }

        // удаляем разрешение
        let sub;
        if(subDoc.personalDBs[dbName]) {
          delete subDoc.personalDBs[dbName];
          sub = userDB.put(subDoc)
            .then(() => superlogin.logoutUser(sub_id));
        }
        else {
          sub = Promise.resolve();
        }

        // изменяем инфо в записи пользователя
        const index = user.value.indexOf(dbName);
        if(index !== -1){
          user.value.splice(index, 1);
          sub = sub.then(() => userDB.put(userDoc));
        }

        return sub.then(() => profile);
      });
  };

};
