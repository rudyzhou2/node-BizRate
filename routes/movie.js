var formidable = require('formidable');
var path = require('path');
var fs = require('fs');
var Movie = require('../models/movie');

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

  })
}
