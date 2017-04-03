// load environment variables
require('dotenv').config()

const async = require('async');
const tmdb = require('./tmdb');

const numberOfPage = 3;
let currentPage = 0;

/**
 *
 * @param {object} results The TMDB response body
 * @returns Promise
 */
function processMovies (results) {
  currentPage++;
  return new Promise((resolve, reject) => {
    resolve();
  });
}

/**
 *
 * @param {function} done The async callback
 */
function getMoviesIterator (done) {
  tmdb.getTopRated()
    .then(processMovies)
    .then(done)
    .catch(done);
}

async.whilst(
  () => currentPage < numberOfPage,
  getMoviesIterator,
  (err) => console.log(err ? 'error' : 'everything done')
);
