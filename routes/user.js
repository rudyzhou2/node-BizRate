var validate = require('../config/validate');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var async = require('async');
var crypto = require('crypto');
var User = require('../models/user');
var secret = require('../secret/secret');

module.exports = (app, passport) => {

  app.get('/', function(req, res, next){
    res.render('index', {title: 'Index || RateMe'});
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
    successRedirect: '/home',
    failureRedirect: '/login',
    failureFlash: true
  }));

  app.get('/home', function(req, res, next){
    res.render('home', {title: 'Home || RateMe'});
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
          service: 'Gmail',
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
