const passport = require("passport");
const GitHubStrategy = require("passport-github").Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require("./mongoose-models").User;

passport.serializeUser((user, done)=>{
  done(null, user.id);
});

passport.deserializeUser((id, done)=>{
  User.findById(id).then((user)=>{
    done(null, user);
  })
});

function createCallbackFunction(strategy){
  return (accessToken, refreshToken, profile, done) => {
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
}

const createCallbackURL = (strategy) => `/auth/${strategy}/redirect`;

passport.use(new GitHubStrategy(
  {
    callbackURL: createCallbackURL("github"),
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET
  },
  createCallbackFunction("github")
));

passport.use(new GoogleStrategy(
  {
    callbackURL: createCallbackURL("google"),
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
  },
  createCallbackFunction("google")
));

passport.use(new FacebookStrategy(
  {
    callbackURL: createCallbackURL("facebook"),
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET
  },
  createCallbackFunction("facebook")
));

passport.use(new LocalStrategy({
    usernameField: 'email',
  },
  function(username, password, done) {
  console.log(username, password);
    User.findOne({ authId: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user.password) { return done(null, false)}
      if (!bcrypt.compareSync(password, user.password)) { return done(null, false); }
      return done(null, user);
    });
  }
));
