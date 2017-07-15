'use strict';

const express = require('express');
const router = express.Router();
const db = require('../queries');

router.get('/api/notes', db.getAllNotes);
router.get('/api/notes/:id', db.getNote);
router.post('/api/notes', db.createNote);
router.put('/api/notes/:id', db.updateNote);
router.delete('/api/notes/:id', db.deleteNote);

module.exports = router;
