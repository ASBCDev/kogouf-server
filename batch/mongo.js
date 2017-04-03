const EventEmitter = require('events');
const mongoose = require('mongoose');
const db = mongoose.connection;
const mongo = {
  emitter: new EventEmitter()
};

mongoose.connect('mongodb://localhost/kogouf');
mongoose.Promise = global.Promise;

db.on('error', () => console.error('connection error'));
db.once('open', () => mongo.emitter.emit('db_connected'));


/**
 * Insert movie in db
 * @param {object} movie
 * @returns Promise
 */
mongo.insertMovie = function (movie) {
  return new Promise((resolve, reject) => {
    Movie.findOne({ tmdb_id: movie.tmdb_id }, function (err, movieDAO) {
      if (err) {
        return reject(err);
      }
      if (!movieDAO) {
        movieDAO = new Movie(movie);
      }
      else {
        movieDAO.set({
          duration    : movie.duration,
          release_date: movie.release_date,
          title       : movie.title
        })
      }
      movieDAO.save(function (err, movieDAO) {
        if (err) {
          reject(err);
        }
        else {
          resolve(null, movieDAO);
        }
      });
    });

  })
}

const movieSchema = mongoose.Schema({
  duration: Number,
  happiness_count: Number,
  happiness_rating: Number,
  release_date: Date,
  title: String,
  tmdb_id: { type: Number, unique: true },
  vote_average: Number,
  vote_count: Number
})

const Movie = mongoose.model('Movie', movieSchema);

module.exports = mongo;
