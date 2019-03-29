var formidable = require('formidable');
var path = require('path');
var fs = require('fs');

module.exports = (app) => {
  app.get('/movie/create', (req, res) => {
    res.render('movie/movie', {title: 'Movie Registration', user: req.user});
  });

  app.post('/upload', (req, res) => {
    var form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, '../public/uploads');

    form.on('file', (field, file) => {
      console.log('File' + file.name + ' being uploaded')
      fs.rename(file.path, path.join(form.uploadDir, file.name), (err) => {
        if(err){
          throw err
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
