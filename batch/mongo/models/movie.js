const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const movieSchema = mongoose.Schema({
  duration: Number,
  happiness_count: Number,
  happiness_rating: Number,
  release_date: Date,
  title: String,
  tmdb_id: { type: Number, unique: true },
  vote_average: Number,
  vote_count: Number
});

module.exports = mongoose.model('Movie', movieSchema);
