'use strict';

const YAML = require('yamljs');

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
        userDoc.name = newName;
        return userDB.put(userDoc);
      });
  };

};
