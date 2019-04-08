module.exports = (app) => {
  app.get('/review/:id', (req, res) => {
    res.render('movie/review', {
      title: 'Write Review',
      user: req.user
    });
  });
}
