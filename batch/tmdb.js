const superagent = require('superagent');

const tmdb = {};

const TMDB_API = 'https://api.themoviedb.org/3';
const TMDB_KEY = process.env.TMDB_API_KEY;

/**
 * Helper to make a request to the TMDB API.
 * @param {string} method The request method: get, post, put or delete
 * @param {string} path The relative TMDB request path
 * @returns Promise
 */
const _request = function (method, path) {
  return new Promise((resolve, reject) => {
    console.log(`${method} ${path}`);
    superagent[method](`${TMDB_API}${path}`)
      .query({
        api_key: TMDB_KEY,
        language: 'fr-FR'
      })
      .end((err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response.body);
        }
      });
  });
}

/**
 * Simple helper to make a get request
 * @param {string} path The relative TMDB request path
 * @returns Promise
 */
const _get = function (path) {
  return _request('get', path);
}

/**
 * Get movie details by its id
 * @param {string} id The movie id
 * @returns Promise
 */
tmdb.getMovie = function (id) {
  return _get(`/movie/${id}`);
};

/**
 * Get the most top rated movies
 * @returns Promise
 */
tmdb.getTopRated = function () {
  return _get('/movie/top_rated');
};

module.exports = tmdb;
