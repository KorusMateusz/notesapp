const passport = require("passport");
const GitHubStrategy = require("passport-github").Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require("./mongoose-models").User;

passport.serializeUser((user, done)=>{
  done(null, user.id);
});

passport.deserializeUser((id, done)=>{
  User.findById(id).then((user)=>{
    done(null, user);
  })
});

function strategySetup(strategy, clientID, clientSecret){
  // returns a list of parameters needed for strategy setup that is later deconstructed
  const callbackURL = `/auth/${strategy}/redirect`;
  return[{
    callbackURL: callbackURL,
    clientID: clientID,
    clientSecret: clientSecret
  },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({strategy: strategy, authId: profile.id}).then((currentUser)=>{
        if(currentUser){
          return done(null, currentUser);
        }
        new User({
          strategy: strategy,
          username: profile.displayName,
          authId: profile.id,
          registered: new Date()
        }).save().then((newUser)=>{
          return done(null, newUser)
        });
      });
    }
  ]
}

passport.use(new GitHubStrategy(
  ...strategySetup("github", process.env.GITHUB_CLIENT_ID, process.env.GITHUB_CLIENT_SECRET)
));

passport.use(new GoogleStrategy(
  ...strategySetup("google", process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET)
));

passport.use(new FacebookStrategy(
  ...strategySetup("facebook", process.env.FACEBOOK_APP_ID, process.env.FACEBOOK_APP_SECRET)
));
