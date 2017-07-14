'use strict';

const promise = require('bluebird');

const options = {
  promiseLib: promise
};

// const pgp = require('pg-promise')(options);
// const connectionString = process.env.DATABASE_URL;
// const db = pgp(connectionString);

function getAllNotes(req, res) {
  console.log(req.query);
  res.status(200)
    .json(
      [
        {"id": 123, "title": "title here", "text": "text here"}
      ]
    );
}

module.exports = {
  getAllNotes: getAllNotes
};
