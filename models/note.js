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
  const defaults = {
    limit: 'all',
    order: 'desc',
    start: 0
  };

  const limit = req.query.limit || defaults.limit;
  const order = req.query.order || defaults.order;
  const offset = req.query.start - 1 || defaults.start;
  //TODO: finish the order by, was getting weird errors last night
  db.any('select * from notes order by created_date $1 limit $2 offset $3', [order, limit, offset])
    .then(data => {
      res.status(200)
        .json(success(data));
    })
    .catch(err => {
      console.log(err);
      res.status(400)
        .json(error('Failed to retrieve notes.'));
    });
}

function getNote(req, res) {
  db.one('select * from notes where id = ${id}', req.params)
    .then(data => {
      res.status(200)
        .json(success(data));
    })
    .catch(err => {
      res.status(404)
        .json(error('Note does not exist.'));
    });
}

function updateNote(req, res) {
  //TODO: updated at time column?
  db.none('update notes set title = $1, content = $2 where id = $3', [req.body.title, req.body.content, req.params.id])
    .then(() => {
      res.status(200)
        .json(success());
    })
    .catch(err => {
      console.log(err);
      res.status(400)
        .json(error('Failed to update note.'));
    });
}

function createNote(req, res) {
  db.none('insert into notes(user_id, title, content) values(${userId}, ${title}, ${content})', req.body)
    .then(() => {
      res.status(201)
        .json(success());
    })
    .catch(err => {
      console.log(err);
      res.status(400)
        .json(error('Failed to create note.'));
    });
}

function deleteNote(req, res) {
  db.none('delete from notes where id = ${id}', req.params)
    .then(() => {
      res.status(200)
        .json();
    })
    .catch(err => {
      console.log(err);
      res.status(400)
        .json(error('Failed to delete note.'));
    });
}

/**
 * Success json response formatter
 * @param data
 * @returns {{data: {}, status: string, message: string}}
 */
function success(data = {}) {
  return {
    data: data,
    status: 'success',
    message: ''
  };
}

/**
 * Error json response formatter
 * @param message
 * @returns {{status: string, message: *}}
 */
function error(message) {
  return {
    status: 'error',
    message: message
  };
}

module.exports = {
  getAllNotes: getAllNotes,
  getNote: getNote,
  createNote: createNote,
  updateNote: updateNote,
  deleteNote: deleteNote
};
