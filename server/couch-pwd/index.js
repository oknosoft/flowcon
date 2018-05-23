
var crypto = require('crypto');

var iterations = 10;
var keylen = 20;
var size = 16;
var encoding = 'hex';
var digest = 'SHA1';

// set iterations to `n`
exports.iterations = function(n){
  if (0 === arguments.length) return iterations;
  iterations = n;
};

// set keylen to `n`
exports.keylen = function(n){
  if (0 === arguments.length) return keylen;
  keylen = n;
};

// set size to `n`
exports.size = function(n){
  if (0 === arguments.length) return size;
  size = n;
};

// set encoding to `str`
exports.encoding = function(str){
  if (0 === arguments.length) return encoding;
  encoding = str;
};

exports.hash = function(pwd, salt, cb) {

  if (arguments.length === 3) {

    // create hash from plain text password and salt
    // hash('secret', 'salt', function(err, hash) {})
    if (!pwd) return cb(new Error('password missing'));
    if (!salt) return cb(new Error('salt missing'));
    crypto.pbkdf2(pwd, salt, iterations, keylen, digest, function(err, hash) {
      if (err) return cb(err);
      cb(null, hash.toString(encoding));
    });

  } else {

    // generate salt and password hash from plain text password
    // hash('secret', function(err, salt, hash) {})
    cb = salt;
    if (!pwd) return cb(new Error('password missing'));
    crypto.randomBytes(size, function(err, salt) {
      if (err) return cb(err);
      salt = salt.toString('hex');
      crypto.pbkdf2(pwd, salt, iterations, keylen, digest, function(err, hash){
        if (err) return cb(err);
        cb(null, salt, hash.toString(encoding));
      });
    });

  }

};
