var formidable = require('formidable');
var path = require('path');
var fs = require('fs');
var async = require('async');
var Movie = require('../models/movie');
var User = require('../models/user');

module.exports = (app) => {
  app.get('/movie/create', (req, res) => {
    var success = req.flash('success');
    res.render('movie/movie', {
      title: 'Movie Registration',
      user: req.user,
      success: success,
      noErrors: success.length > 0
    });
  });

  app.post('/movie/create', (req, res) => {
    // add server side validation
    var newMovie = new Movie();
    newMovie.name = req.body.name;
    newMovie.director = req.body.director;
    newMovie.writers = req.body.writers;
    newMovie.country = req.body.country;
    newMovie.type = req.body.type;
    newMovie.cast = req.body.cast;
    newMovie.image = req.body.upload;

    newMovie.save((err) => {
      if (err) {
        console.log(err);
      }
      console.log(newMovie);
      req.flash('success', 'Movie' + newMovie.name + ' has been successfully added');
      res.redirect('/movie/create');
    })
  });

  app.post('/upload', (req, res) => {
    var form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, '../public/uploads');

    form.on('file', (field, file) => {
      console.log('File' + file.name + ' being uploaded')
      fs.rename(file.path, path.join(form.uploadDir, file.name), (err) => {
        if (err) {
          throw err;
        }
        console.log('File has been renamed');
      });
    });

    form.on('error', (err) => {
      console.log('An error occured during file upload', err);
    });

    form.on('end', () => {
      console.log('File upload successful')
    });

    form.parse(req);

  });

  app.get('/movies', (req, res) => {
    Movie.find({}, (err, result) => {
      console.log(result);
      res.render('movie/movies', {
        title: 'All Movies || RateMe',
        user: req.user,
        data: result
      });
      if (err) {
        throw err;
      }

    });
  });

  app.get('/movie-profile/:id', (req, res) => {
    Movie.findOne({'_id': req.params.id}, (err, data) => {
      res.render('movie/movie-profile', {
        title: 'All Movies || RateMe',
        user: req.user,
        id: req.params.id,
        data: data
      });
    });
  });

  app.get('/movie/register-owner/:id', (req, res) => {
    Movie.findOne({'_id': req.params.id}, (err, data) => {
      res.render('movie/register-owner', {
        title: 'Register Owner',
        user: req.user,
        data: data
      });
    });
  });

  app.post('/movie/register-owner/:id', (req, res, next) => {
// parallel async result do not need to pass in result from prev function
    async.parallel([
      function(callback){
        Movie.update({
          '_id': req.params.id,
          'owners.ownerID': {$ne: req.user._id},
        },
        {
          $push: {owners: {ownerID: req.user._id,
          ownerFullName: req.user.fullname,
          ownerRole: req.body.owner}
        }
      }, (err, count) => {
          if(err){
            return next(err);
          }
          callback(err, count);
        });
      },

      function(callback){
        async.waterfall([
          function(callback){
            Movie.findOne({'_id': req.params.id}, (err,data) => {
              callback(err,data);
            });
          },

          function(data, callback){
            User.findOne({'_id': req.user._id}, (err, result) => {
              result.owner = req.body.owner;
              result.movie.name = data.name;
              result.movie.image = data.image;

              result.save((err) => {
                res.redirect("/home");
              });
            })
          }
        ]);
      }
    ]);
  });
}
