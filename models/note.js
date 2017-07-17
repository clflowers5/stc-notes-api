'use strict';

const promise = require('bluebird');

const options = {
  promiseLib: promise
};

const pgp = require('pg-promise')(options);
const connectionString = process.env.DATABASE_URL + '?ssl=true';
const db = pgp(connectionString);

function getAllNotes(req, res) {
  const defaults = {
    limit: 'all',
    order: 'desc',
    start: 0
  };

  const limit = req.query.limit || defaults.limit;
  const order = req.query.order || defaults.order;
  const offset = req.query.start - 1 || defaults.start;

  db.any('select * from notes order by created_date $1:raw limit $2:raw offset $3', [order, limit, offset])
    .then(data => {
      res.status(200)
        .json(success('Retrieved notes.', data));
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
        .json(success('Retrieved note.', data));
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
        .json(success('Updated note.'));
    })
    .catch(err => {
      console.log(err);
      res.status(400)
        .json(error('Failed to update note.'));
    });
}

function createNote(req, res) {
  db.one('insert into notes(user_id, title, content) values(${userId}, ${title}, ${content}) returning *', req.body)
    .then(data => {
      res.status(201)
        .json(success('Created note.', data));
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
        .json(success('Deleted note.'));
    })
    .catch(err => {
      console.log(err);
      res.status(400)
        .json(error('Failed to delete note.'));
    });
}

/**
 * Success json response formatter
 * @param message
 * @param data
 * @returns {{data: {}, status: string, message: string}}
 */
function success(message = '', data = {}) {
  return {
    data: data,
    status: 'success',
    message: message
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
