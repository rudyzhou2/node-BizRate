var mongoose = require('mongoose');

var movieSchema = mongoose.Schema({
  name: {type: String},
  director: {type: String},
  writers: {type: String},
  country: {type: String},
  type: {type: String},
  cast: {type: String},
  image: {type: String},
  rater: [{
    raterEmail: {type: String, default: ''},
    rateFullName: {type: String, default: ''}
  }],

  owners: [{
    ownerID: {type: String, default: ''},
    ownerFullName: {type: String, default: ''},
    ownerRole: {type: String, default: ''}
  }],

  movieRating: [{
    movieName: {type: String, default: ''},
    userFullName: {type: String, default: ''},
    movieImage: {type: String, default: ''},
    userRating: {type: Number, default: 0},
    userReview: {type: String, default: 0}
  }],

  ratingNumber: [Number],
  ratingSum: {type: Number, default: 0}
});

module.exports = mongoose.model('Movie', movieSchema);
