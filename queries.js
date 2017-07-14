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
    .then(data => {
      res.status(200)
        .json({
          data: data,
          status: 'success',
          message: ''
        });
    })
    .catch(err => {
      console.log(err);
      res.status(400)
        .json({
          data: {},
          status: 'error',
          message: 'Failed to retrieve notes.'
        });
    });
}

function createNote(req, res) {
  db.none('insert into notes(user_id, title, content) values(${userId}, ${title}, ${content})', req.body)
    .then(() => {
      res.status(201)
        .json({
          status: 'success',
          message: ''
        });
    })
    .catch(err => {
      res.status(400)
        .json({
          status: 'error',
          message: 'Failed to create note.'
        })
    });
}

function parseQueryString(req) {
  const queryString = req.query;
  //TODO: more
}

module.exports = {
  getAllNotes: getAllNotes
};
