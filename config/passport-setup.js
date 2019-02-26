const passport = require("passport");
const GitHubStrategy = require("passport-github");
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GitHubStrategy({
  callbackURL: "/auth/github/redirect",
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET
}, (accessToken, refreshToken, profile, done) => {
  console.log("cb fired");
  console.log(profile);
  return done(null, profile)
  })
);

passport.use(new GoogleStrategy({
    callbackURL: "/auth/google/redirect",
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
  }, (accessToken, refreshToken, profile, done) => {
    console.log("cb fired");
    console.log(profile);
    done(null, profile)
  })
);
