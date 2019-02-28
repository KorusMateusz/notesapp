const express = require('express');
const router = express.Router();
const passport = require("passport");
const localHandlers = require("../config/local-strategy-handlers");

const ensureUnauthenticated = (req, res, next) => {
  if(req.user){ // if logged in
    return res.redirect("/?event=loggedin")
  }
  next()
};

router.get("/login", ensureUnauthenticated, (req, res) =>{
  res.render("login", {title: "login"})
});

router.get("/logout", (req, res) =>{
  req.logout();
  res.redirect("/?event=loggedout")
});

//auth with GitHub
router.get("/github", passport.authenticate("github"));

//callback for GitHub
router.get("/github/redirect",
  passport.authenticate('github', { failureRedirect: '/' }), (req, res)=>{
    res.redirect("/profile")
});

//auth with Google+
router.get('/google', passport.authenticate('google', {
  scope: ['profile']
}));

//callback for Google
router.get("/google/redirect",
  passport.authenticate('google', { failureRedirect: '/' }), (req, res)=>{
    res.redirect("/profile")
  });

//auth with Facebook
router.get('/facebook', passport.authenticate('facebook'));

//callback for Facebook
router.get("/facebook/redirect",
  passport.authenticate('facebook', { failureRedirect: '/' }), (req, res)=>{
    res.redirect("/profile")
  });

//registration view for local strategy
router.get('/signup', function(req, res) {
  res.render('registration-form', { title: 'Sign up' });
});

//send a token to set up a password for a local strategy
router.post('/signup', function(req, res) {
  localHandlers.createUserAndSendToken(req.body.email, req.body.username,(status)=>{
    res.send(status);
  })
});

//view for setting/reseting password
router.get('/passwordsetup', function(req, res) {
  res.render('password-setup-form', { title: 'Set up your password', token: req.query.token });
});

router.post('/passwordsetup', function(req, res) {
  localHandlers.createNewPassword(req.body.token, req.body.password, (err, result)=>{
    console.log(req.body.token, req.body.password, err, result);
    res.send(result)
  })
});

router.get('/passwordresettest', function(req, res) {
  localHandlers.createAndSendNewToken((req.query.email), (d)=>res.send(d));
});


module.exports = router;