'use strict';

/*
express middlware имеет сигнатуру (req, res, next), у koa middlware сигнатура (ctx, next)
мы хотим использовать superlogin.router внутри koa-better-router. поэтому, обернём вызовы superlogin.router в прокси
 */

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const SuperLogin = require('superlogin');
const PouchDB = require('pouchdb');
const uuidv1 = require('uuid/v1');

const FacebookStrategy  = require('passport-facebook').Strategy;
const GitHubStrategy    = require('passport-github').Strategy;
const GoogleStrategy    = require('passport-google-oauth').OAuth2Strategy;
const YandexStrategy    = require('passport-yandex').Strategy;
const VKontakteStrategy = require('passport-vkontakte').Strategy;
//var WindowsliveStrategy = require('passport-windowslive').Strategy;
//var LinkedinStrategy = require('passport-linkedin-oauth2').Strategy;

const superloginConfig = require('../config/superlogin.config.server.js');


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// load SuperLogin routes
const superlogin = new SuperLogin(superloginConfig);
superlogin.config.getItem('providers.facebook.credentials.clientID') && superlogin.registerOAuth2('facebook', FacebookStrategy);
superlogin.config.getItem('providers.github.credentials.clientID') && superlogin.registerOAuth2('github', GitHubStrategy);
superlogin.config.getItem('providers.google.credentials.clientID') && superlogin.registerOAuth2('google', GoogleStrategy);
superlogin.config.getItem('providers.yandex.credentials.clientID') && superlogin.registerOAuth2('yandex', YandexStrategy);
superlogin.config.getItem('providers.vkontakte.credentials.clientID') && superlogin.registerOAuth2('vkontakte', VKontakteStrategy);


app.use('/auth', superlogin.router);

const Profile = require('./profile');
const profile = new Profile(superlogin);

app.get('/user/profile', superlogin.requireAuth, function(req, res, next) {
  profile.get(req.user._id)
    .then(function(userProfile) {
      res.status(200).json(userProfile);
    }, function(err) {
      return next(err);
    });
});

// смена имени пользователя
app.post('/user/change-name', superlogin.requireAuth, function(req, res, next) {
  if(!req.body.newName) {
    return next({
      error: "Field 'newName' is required",
      status: 400
    });
  }
  profile.changeName(req.user._id, req.body.newName)
    .then(function(userProfile) {
      res.status(200).json(userProfile);
    }, function(err) {
      return next(err);
    });
});

// смена подписки на рассылку
app.post('/user/change-subscription', superlogin.requireAuth, function(req, res, next) {
  if(!req.body.hasOwnProperty('subscription')) {
    return next({
      error: "Field 'subscription' is required",
      status: 400
    });
  }
  profile.changeSubscription(req.user._id, req.body.subscription)
    .then(function(userProfile) {
      res.status(200).json(userProfile);
    }, function(err) {
      return next(err);
    });
});

app.post('/user/destroy', superlogin.requireAuth, function(req, res, next) {
  superlogin.removeUser(req.user._id, true)
    .then(function() {
      console.log('User destroyed!');
      res.status(200).json({ok: true, success: 'User: ' + req.user._id + ' destroyed.'});
    }, function(err) {
      return next(err);
    });
});

// подключаем прокси
//zd_proxy(app, superloginConfig);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500).json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500).json({
    message: err.message,
    error: {}
  });
});

// дополним роли и design-документы
superlogin.on('signup', function(userDoc, provider){
  const {couchAuthDB} = superlogin;
  const res = []
  for(const name in userDoc.personalDBs) {
    if(userDoc.personalDBs[name].type !== 'private') {
      continue;
    }
    const db = new PouchDB(couchAuthDB._db_name.replace(/_users$/, name), {skip_setup: true});
    res.push(db.info()
      .then((info) => {
        info = null;
      })
      .catch((err) => {
        err = null;
      }));
  }
  return Promise.all(res);
});

// создаём недостающие поля в профиле
superlogin.onCreate(function (userDoc, provider) {
  if(!userDoc.profile) {
    userDoc.profile = {};
  }
  if(provider !== 'local' && !userDoc.profile.name) {
    const displayName = userDoc[provider].profile.displayName;
    if(displayName) {
      userDoc.profile.name = displayName;
    }
  }
  if(!userDoc.profile.ref) {
    userDoc.profile.ref = uuidv1();
    userDoc.profile.subscription = true;
  }
  return Promise.resolve(userDoc);
});

module.exports = app;
