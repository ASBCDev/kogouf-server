// load environment variables
require('dotenv').config()

const async = require('async');
const tmdb = require('./tmdb');
const mongo = require('./mongo');

const numberOfPage = 3;
let currentPage = 1;

/**
 * Map the TMDB movie to fit the Mongo database
 * @param {object} movie The TMDB movie details
 * @returns Promise
 */
function mapMovie (movie) {
  return new Promise((resolve) => {
    resolve({
      duration: movie.runtime,
      happiness_count: 0,
      happiness_rating: 5, // TODO: compute depending on the genres
      release_date: movie.release_date,
      title: movie.title,
      tmdb_id: movie.id,
      vote_average: movie.vote_average,
      vote_count: 0
    });
  });
}

/**
 * Save the movie to the Mongo database
 * @param {object} movie The mapped movie to be saved
 * @returns Promise
 */
function saveMovie (movie) {
  return mongo.insertMovie(movie);
}

/**
 * Map and save a movie to the Mongo database
 * @param {object} movie The top_rated movie
 * @param {function} done The callback when it's done
 */
function processMovie (movie, done) {
  tmdb.getMovie(movie.id)
    .then(mapMovie)
    .then(saveMovie)
    .then(done)
    .catch(done);
}

/**
 *
 * @param {object} results The TMDB response body
 * @returns Promise
 */
function processMovies (results) {
  currentPage++;
  return new Promise((resolve, reject) => {
    async.eachSeries(results.results,
      processMovie,
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
  });
}

/**
 *
 * @param {function} done The async callback
 */
function getMoviesIterator (done) {
  tmdb.getTopRated(currentPage)
    .then(processMovies)
    .then(done)
    .catch(done);
}

mongo.emitter.on('db_connected', () =>
  async.whilst(
    () => currentPage <= numberOfPage,
    getMoviesIterator,
    (err) => console.log(err ? err : 'everything done')
  )
);
