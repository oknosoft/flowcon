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

  this.changeName = function(user_id, newName) {
    return userDB.get(user_id)
      .then((userDoc) => {
        userDoc.profile.name = newName;
        return userDB.put(userDoc);
      });
  };

  this.changeSubscription = function(user_id, subscription) {
    return userDB.get(user_id)
      .then((userDoc) => {
        userDoc.profile.subscription = subscription;
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

  // создаёт общую базу и добавляет её в профиль подписчика
  this.createSharedDB = function(user_id, dbName) {
    return userDB.get(user_id)
      .then((userDoc) => {

        // генерируем ошибку, если нет роли r_subscribers
        if(!userDoc.roles.includes('r_subscribers') && !userDoc.roles.includes('doc_full')) {
          throw new Error('Недостаточно прав. В профиле пользователя отсутствует роль "r_subscribers"');
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
          });
      });
  };

};
