var express = require('express');
var router = express.Router();
const passport = require('passport');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'weclome', user: req.user, event: req.query.event});
});


router.post('/auth/login', passport.authenticate('local', { failureRedirect: '/login?event=failedlogin' }), function(req, res, next) {
  res.redirect('/profile');
});

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'register' });
});

module.exports = router;
