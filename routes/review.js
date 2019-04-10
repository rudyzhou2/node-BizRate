var Movie = require('../models/movie');
var async = require('async');

module.exports = (app) => {
  app.get('/review/:id', (req, res) => {
    var msg = req.flash('success');
    Movie.findOne({
      '_id': req.params.id
    }, (err, data) => {
      res.render('movie/review', {
        title: 'Write Review',
        user: req.user,
        data: data,
        msg: msg,
        hasMsg: msg.length > 0
      });
    });
  });

  app.post('/review/:id', (req, res) => {
    async.waterfall([
      function(callback){
        Movie.findOne({
          '_id': req.params.id
        }, (err, result) => {
          callback(err, result);
        });
      },

      function(result, callback){
        Movie.update({
          '_id': req.params.id
        },
        {
          $push: {
            movieRating: {
              movieName: req.body.movie,
              userFullName: req.user.fullname,
              movieImage: req.user.movie.image,
              userRating: req.body.clickedVal,
              userReview: req.body.review
            },
            ratingNumber: req.body.clickedVal,
          },
          $inc: {
            ratingSum: req.body.clickedVal
          }}, (err) => {
            req.flash('success', 'Your review has been added.');
            res.redirect('/review/' + req.params.id);
          })
      }
    ])
  });
}
