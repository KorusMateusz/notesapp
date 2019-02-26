const express = require('express');
const router = express.Router();
const passport = require("passport");

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

module.exports = router;