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
const fetch = require('node-fetch');

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

// основной роутер superlogin
app.use('/auth', superlogin.router);

// смешанный рендеринг для поисковых машин и соцсетей
app.get(/^\/(articles|files|news|sitemap\.xml)/, require('./articles')(superlogin));

const Profile = require('./profile');
const profile = new Profile(superlogin);

// прокси к couchdb
app.post('/user/proxy', (req, res, next) => {

  const server = superlogin.config.getItem('dbServer');
  const url = `${server.protocol}${server.host}${req.query.url.startsWith('/') ? '' : '/'}${req.query.url}`;

  fetch(url, {
    method: 'POST',
    headers: req.headers,
    body: JSON.stringify(req.body),
  })
    .then((qreq) => {
      qreq.json()
        .then((json) => {
          res.status(qreq.status).json(json);
        });
    })
    .catch((err) => {
      res.status(err.status || 500).json(json);
    });

});

app.get('/user/profile', superlogin.requireAuth, (req, res, next) => {
  profile.get(req.user._id)
    .then((userProfile) => {
      res.status(200).json(userProfile);
    }, (err) => next(err));
});

// смена имени пользователя
app.post('/user/change-name', superlogin.requireAuth, (req, res, next) => {
  if(!req.body.newName) {
    return next({
      error: "Field 'newName' is required",
      status: 400
    });
  }
  profile.changeName(req.user._id, req.body.newName)
    .then((userProfile) => {
      res.status(200).json(userProfile);
    }, (err) => next(err));
});

// смена подписки на рассылку
app.post('/user/change-subscription', superlogin.requireAuth, (req, res, next) => {
  if(!req.body.hasOwnProperty('subscription')) {
    return next({
      error: "Field 'subscription' is required",
      status: 400
    });
  }
  profile.changeSubscription(req.user._id, req.body.subscription)
    .then((userProfile) => {
      res.status(200).json(userProfile);
    }, (err) => next(err));
});

// создание общей базы
app.post('/user/create-db', superlogin.requireAuth, (req, res, next) => {
  if(!req.body.hasOwnProperty('name')) {
    return next({
      error: "Field 'name' is required",
      status: 400
    });
  }
  profile.createSharedDB(req.user._id, req.body.name)
    .then((result) => {
      res.status(200).json(result);
    }, (err) => {
      return next(err);
    });
});

app.post('/user/destroy', superlogin.requireAuth, (req, res, next) => {
  superlogin.removeUser(req.user._id, true)
    .then(() => {
      console.log('User destroyed!');
      res.status(200).json({ok: true, success: 'User: ' + req.user._id + ' destroyed.'});
    }, (err) => next(err));
});


// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    error: {}
  });
});

// создаём недостающие поля в профиле
superlogin.onCreate((userDoc, provider) => {
  return profile.onCreate(userDoc, provider);
});

module.exports = app;
