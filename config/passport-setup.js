const passport = require("passport");
const GitHubStrategy = require("passport-github").Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require("./mongoose-models");

passport.serializeUser((user, done)=>{
  done(null, user.id);
});

passport.deserializeUser((id, done)=>{
  User.findById(id).then((user)=>{
    done(null, user);
  })
});


passport.use(new GitHubStrategy({
  callbackURL: "/auth/github/redirect",
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET
}, (accessToken, refreshToken, profile, done) => {
  User.findOne({strategy: "google", authId: profile.id}).then((currentUser)=>{
    if(currentUser){
      return done(null, currentUser);
    }
    new User({
      strategy: "google",
      username: profile.displayName,
      authId: profile.id,
      registered: new Date()
    }).save().then((newUser)=>{
      console.log("new user created: " + newUser);
      return done(null, newUser)
    });
  });
  })
);

passport.use(new GoogleStrategy({
    callbackURL: "/auth/google/redirect",
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
  }, (accessToken, refreshToken, profile, done) => {
  User.findOne({strategy: "google", authId: profile.id}).then((currentUser)=>{
    if(currentUser){
      return done(null, currentUser);
    }
    new User({
      strategy: "google",
      username: profile.displayName,
      authId: profile.id,
      registered: new Date()
    }).save().then((newUser)=>{
      console.log("new user created: " + newUser);
      return done(null, newUser)
    });
  });
  })
);

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: "/auth/facebook/redirect"
  }, (accessToken, refreshToken, profile, done) => {
  console.log(profile);
    User.findOne({strategy: "facebook", authId: profile.id}).then((currentUser)=>{
      if(currentUser){
        return done(null, currentUser);
      }
      new User({
        strategy: "facebook",
        username: profile.displayName,
        authId: profile.id,
        registered: new Date()
      }).save().then((newUser)=>{
        console.log("new user created: " + newUser);
        return done(null, newUser)
      });
    });
  })
);