const superagent = require('superagent');

const tmdb = {};

const TMDB_API = 'https://api.themoviedb.org/3';
const TMDB_KEY = 'YOU_API_KEY_HERE';

/**
 *
 * @returns Promise
 */
tmdb.getTopRated = function () {
  return new Promise((resolve, reject) => {
    const path = '/movie/top_rated';
    console.log(`GET ${path}`);
    superagent
      .get(`${TMDB_API}${path}`)
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
};

module.exports = tmdb;
