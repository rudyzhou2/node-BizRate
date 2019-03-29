module.exports = (app) => {
  app.get('/movie/create', (req, res) => {
    res.render('movie/movie', {title: 'Movie Registration', user: req.user});
  });
}
