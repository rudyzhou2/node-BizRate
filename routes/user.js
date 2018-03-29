module.exports = (app, passport) => {

  app.get('/', function(req, res, next){
    res.render('index', {title: 'Index || RateMe'});
  });

  app.get('/signup', function(req, res, next){
    res.render('user/signup', {title: 'Sign Up || RateMe'});
  });

  app.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash: true
  }));

  app.get('/login', function(req, res, next){
    res.render('user/login', {title: 'Login || RateMe'});
  });
}
