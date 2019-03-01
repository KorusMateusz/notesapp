var express = require('express');
var router = express.Router();

const ensureAuthenticated = (req, res, next) => {
  if(!req.user){ // if not logged in
    return res.redirect("/auth/login")
  }
  next()
};

router.get('/', ensureAuthenticated, function(req, res) {
  res.render('profile', {user: req.user});
});

module.exports = router;
