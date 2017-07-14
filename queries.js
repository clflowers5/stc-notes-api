'use strict';

const promise = require('bluebird');

const options = {
  promiseLib: promise
};

const pgp = require('pg-promise')(options);
const connectionString = process.env.DATABASE_URL + '?ssl=true';
const db = pgp(connectionString);

//TODO: query params with req.query
//TODO: common response sections with a function
function getAllNotes(req, res) {
  db.any('select * from notes')
    .then(function (data) {
      res.status(200)
        .json({
          data: data,
          status: 'success',
          message: ''
        });
    })
    .catch(function (err) {
      console.log(err);
      res.status(400)
        .json({
          data: {},
          status: 'error',
          message: 'Failed to retrieve notes.'
        });
    });
}

module.exports = {
  getAllNotes: getAllNotes
};
