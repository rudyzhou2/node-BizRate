var validate = require('../config/validate');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var async = require('async');
var crypto = require('crypto');
var User = require('../models/user');
var secret = require('../secret/secret');

module.exports = (app, passport) => {

  app.get('/', function(req, res, next){
    if(req.session.cookie.originalMaxAge !== null){
      res.redirect('/home')
    }else{
      res.render('index', {title: 'Index || RateMe'});
    };
  });

  app.get('/signup', function(req, res, next){
    var errors = req.flash('error');
    console.log(errors);
    res.render('user/signup', {title: 'Sign Up || RateMe', messages: errors, hasErrors: errors.length > 0});
  });

  app.post('/signup', validate.signupValidate, passport.authenticate('local.signup', {
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash: true
  }));

  app.get('/login', function(req, res, next){
    var errors = req.flash('error');
    console.log(errors);
    res.render('user/login', {title: 'Login || RateMe', messages: errors, hasErrors: errors.length > 0});
  });

  app.post('/login', validate.loginValidate, passport.authenticate('local.login', {
//    successRedirect: '/home',
    failureRedirect: '/login',
    failureFlash: true
  }), (req, res) => {
    if(req.body.autologin){ //if remember me checkbox is checked
      req.session.cookie.maxAge = 14*24*60*60*1000; //2 weeks cookie age
    }else{
      req.session.cookie.expires = null;
    }
    res.redirect('/home');
  });

  app.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));

  app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/home',
    failureRedirect: '/login',
    failureFlash: true
  }));

  app.get('/home', function(req, res, next){
    res.render('home', {title: 'Home || RateMe', user: req.user});
  });

//forgotten pw
  app.get('/forgot', function(req, res, next){
    var errors = req.flash('error');
    var info = req.flash('info');
    res.render('user/forgot', {title: 'Request Password Reset || RateMe',  messages: errors, hasErrors: errors.length > 0, info: info, noErrors: info.length > 0});
  });

  app.post('/forgot', (req, res, next) => {
    async.waterfall([
      function(callback){
        crypto.randomBytes(20, (err, buf) => {
          var rand = buf.toString('hex');
          callback(err, rand);
        });
      },

      function(rand, callback){
        User.findOne({'email':req.body.email}, (err, user) => {
          if(!user){
            req.flash('error', 'No account with email found or email is invalid');
            return res.redirect('/forgot');
          };
          user.passwordResetToken = rand;
          user.passwordResetExpires = Date.now() + 60*60*1000;

          user.save((err) => {
            callback(err, rand, user);
          });
        });
      },

      function(rand, user, callback){
        var smtpTransport = nodemailer.createTransport({
          service: 'gmail',
          secure: false,
          ignoreTLS: true,
          auth: {
            user: secret.emailAuth.user,
            pass: secret.emailAuth.pass
          }
        });

        var mailOptions = {
          to: user.email,
          from: 'RateMe ' + '<' + secret.emailAuth.user + '>',
          subject: 'RateMe Application Password Reset Token',
          text: 'You have requested for password reset token. \n\n' +
                'Please click on the link to complete the process: \n\n' +
                'http://localhost:3000/reset/'+rand+'\n\n'
        };

        smtpTransport.sendMail(mailOptions, (err, response) => {
          req.flash('info', 'A password reset email has been sent to ' + user.email);
          return callback(err, user);
        });
      },
    ], (err) => {
      if(err){
        return next(err);
      };

      res.redirect('/forgot');
    })
  });

  app.get('/reset/:token', (req, res) => {
    //check pw reset token and pw reset time in mongo db
    User.findOne({'passwordResetToken': req.params.token, 'passwordResetExpires': {$gt: Date.now()}}, (err, user) => {
      if(!user){
        var errors = req.flash('error');
        req.flash('error','Password reset token has expired or is invalid. Enter your email to get a new token');
        return res.redirect('/forgot');
      };
      var errors = req.flash('error');
      var success = req.flash('success');
      res.render('user/reset', {title: 'Reset Your Password || RateMe', messages: errors, hasErrors: errors.length > 0, success: success, noErrors: success.length > 0});
    });

  });

  app.post('/reset/:token', (req, res) => {
    async.waterfall([
      function(callback){
        User.findOne({'passwordResetToken': req.params.token, 'passwordResetExpires': {$gt: Date.now()}}, (err, user) => {
          if(!user){
            var errors = req.flash('error');
            req.flash('error','Password reset token has expired or is invalid. Enter your email to get a new token');
            return res.redirect('/forgot');
          };
          //validate form passwords
          req.checkBody('password', 'Password is required').notEmpty();
          req.checkBody('password', 'Password must not be less than 5 chars').isLength({min:5});
          req.check("password", "Password must contain at least 1 number").matches(/^(?=.*\d)(?=.*[a-z])[0-9a-z]{5,}$/, "i");
          var errors = req.validationErrors();

          if(req.body.password == req.body.cpassword){
            if(errors){
              var messages = [];
              errors.forEach((error) => {
                messages.push(error.msg)
              });

              var errors = req.flash('error');
              res.redirect('/reset/'+req.params.token);
            }else{
              user.password = user.encryptPassword(req.body.password);
              user.passwordResetToken = undefined;
              user.passwordResetExpires  = undefined;

              user.save((err) => {
                req.flash('success', 'Your password has been successfully updated.');
                callback(err, user);
              })
            }
          }else{
            req.flash('error', 'Password and confirm password are not equal.');
            res.redirect('/reset/'+req.params.token);
          }
        });
      },
      function(user, callback){
        var smtpTransport = nodemailer.createTransport({
          service: 'gmail',
          secure: false,
          ignoreTLS: true,
          auth: {
            user: secret.emailAuth.user,
            pass: secret.emailAuth.pass
          }
        });

        var mailOptions = {
          to: user.email,
          from: 'RateMe ' + '<' + secret.emailAuth.user + '>',
          subject: 'RateMe Password has been reset',
          text: 'This is a confirmation that the password has been updated for ' + user.email +
                '\n Please ignore this email if you do not have an account with us.'
        };

        smtpTransport.sendMail(mailOptions, (err, response) => {
          callback(err, user);
          var errors = req.flash('error');
          var success = req.flash('success');
          res.render('user/reset', {title: 'Reset Your Password || RateMe', messages: errors, hasErrors: errors.length > 0, success: success, noErrors: success.length > 0});
        });
        }
    ])
  });

  app.get('/logout', (req, res) => {
    //through passport mw
    req.logout();
    req.session.destroy((err) => {
      res.redirect('/');
    })
  });
}
/*
function validate(req, res, next){
  req.checkBody('fullname', 'Full name is Required').notEmpty();
  req.checkBody('fullname', 'Full name must not be less than 5 chars').isLength({min:5});
  req.checkBody('email', 'Email is Required and not empty').notEmpty();
  req.checkBody('email', 'Email is Invalid').isEmail();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password', 'Password must not be less than 5 chars').isLength({min:5});
  req.check("password", "Password must contain at least 1 number").matches(/^(?=.*\d)(?=.*[a-z])[0-9a-z]{5,}$/, "i");
  var errors = req.validationErrors();
  if(errors){
    var messages = [];
    errors.forEach((error) => {
      messages.push(error.msg);
    });

    req.flash('error', messages);
    res.redirect('/signup');
  }else{
    return next();
  }
}
*/
