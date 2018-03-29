module.exports = (app) => {

  app.get('/', function(req, res, next){
    res.render('index', {title: 'Index || RateMe'});
  });

  app.get('/signup', function(req, res, next){
    res.render('user/signup', {title: 'Sign Up || RateMe'});
  });

  app.get('/login', function(req, res, next){
    res.render('user/login', {title: 'Login || RateMe'});
  });
}
