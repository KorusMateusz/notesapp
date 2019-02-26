const express = require('express');
const router = express.Router();
const passport = require("passport");

//auth login
router.get("/login", (req, res) =>{
  res.render("login")
});

//auth logout
router.get("/logout", (req, res) =>{
  res.send("logging out")
});

//auth with GitHub
router.get("/github", passport.authenticate("github"));

//callback for GitHub
router.get("/github/redirect",
  passport.authenticate('github', { failureRedirect: '/' }), (req, res)=>{
    res.send("you reached the callback URI")
});

//auth with Google+
router.get('/google', passport.authenticate('google', {
  scope: ['profile']
}));

//callback for Google
router.get("/google/redirect",
  passport.authenticate('google', { failureRedirect: '/' }), (req, res)=>{
    res.send("you reached the Google callback URI")
  });

module.exports = router;