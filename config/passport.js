var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var FacebookStrategy = require('passport-facebook').Strategy;
var secret = require('../secret/secret')
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use('local.signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, (req, email, password, done) => {
  User.findOne({'email': email}, (err, user) => {
    if(err){
      return done(err);
    }

    if(user){
      return done(null, false, req.flash('error', 'User with email already exists'));
    }

    //check signup view form
    var newUser = new User();
    newUser.fullname = req.body.fullname;
    newUser.email = req.body.email;
    newUser.password = newUser.encryptPassword(req.body.password);

    newUser.save((err) => {
      return done(null, newUser);
    });
  })
}));

passport.use('local.login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, (req, email, password, done) => {
  User.findOne({'email':email}, (err, user) => {
    if(err){
      return done(err);
    }

    var messages = [];

    if(!user || !user.validPassword(password)){
      messages.push('User does not exist or password is invalid');
      return done(null, false, req.flash('error', messages));
    }
    return done(null, user);
    });
  }));

passport.use(new FacebookStrategy(secret.fbAuth, (req, token, refreshToken, profile, done) => {
  User.findOne({'facebook': profile.id}, (err, user) => {
    if(err){
      return done(error);
    }

    if(user){
      return done(null, user);
    }else{
      var newUser = new User();
      newUser.facebook = profile.id;
      newUser.fullname = profile.displayName;
      //profile._json contains all user details
      newUser.email = profile._json.email;
      newUser.token.push({token: token});

      newUser.save((err) => {
        return done(null, newUser);
      })
    }
  })
}))
