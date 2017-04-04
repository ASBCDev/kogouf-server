const EventEmitter = require('events');
const mongoose = require('mongoose');
const Movie = require('./models/movie');
const db = mongoose.connection;
const mongo = {
  emitter: new EventEmitter()
};

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/kogouf');

db.on('error', (err) => console.error('connection error', err));
db.once('open', () => mongo.emitter.emit('db_connected'));

/**
 * Insert movie in db
 * @param {object} movie
 * @returns Promise
 */
mongo.insertMovie = function (movie) {
  return new Promise((resolve, reject) => {
    Movie.findOne({ tmdb_id: movie.tmdb_id }, (err, movieDAO) => {
      if (err) {
        return reject(err);
      }
      if (!movieDAO) {
        movieDAO = new Movie(movie);
      } else {
        movieDAO.set({
          duration    : movie.duration,
          release_date: movie.release_date,
          title       : movie.title
        });
      }
      movieDAO.save((err, movieDAO) => {
        if (err) {
          reject(err);
        } else {
          resolve(null, movieDAO);
        }
      });
    });

  });
};

module.exports = mongo;
