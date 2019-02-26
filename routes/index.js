var express = require('express');
var router = express.Router();
const passport = require('passport');
const bcrypt = require("bcrypt");

router.get('/', function(req, res, next) {
  res.render('index', { title: 'weclome' });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'login' });
});

router.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), function(req, res, next) {
  res.redirect('/profile');
});

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'register' });
});

module.exports = router;
