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

function getNote(req, res) {
  db.one('select * from notes where id = ${id}', req.params)
    .then(data => {
      res.status(200)
        .json({
          data: data,
          status: 'success',
          message: ''
        });
    })
    .catch(err => {
      res.status(404)
        .json({
          data: {},
          status: 'error',
          message: 'Note does not exist.'
        });
    });
}

function updateNote(req, res) {
  //TODO: updated at time column?
  db.none('update notes set title = $1, content = $2 where id = $3', [req.body.title, req.body.content, req.params.id])
    .then(() => {
      res.status(200)
        .json();
    })
    .catch(err => {
      console.log(err);
      res.status(400)
        .json({
          data: {},
          status: 'error',
          message: 'Failed to update note.'
        });
    });
}

function createNote(req, res) {
  //TODO: need to do validation on the req body
  db.none('insert into notes(user_id, title, content) values(${userId}, ${title}, ${content})', req.body)
    .then(() => {
      res.status(201)
        .json({
          status: 'success',
          message: ''
        });
    })
    .catch(err => {
      console.log(err);
      res.status(400)
        .json({
          status: 'error',
          message: 'Failed to create note.'
        });
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
        .json({
          status: 'error',
          message: 'Failed to delete note.'
        });
    });
}

function parseQueryString(req) {
  const queryString = req.query;
  //TODO: more
}

module.exports = {
  getAllNotes: getAllNotes,
  getNote: getNote,
  createNote: createNote,
  updateNote: updateNote,
  deleteNote: deleteNote
};
