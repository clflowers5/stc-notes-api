'use strict';

const express = require('express');
const router = express.Router();
const db = require('../queries');

router.get('/api/notes', db.getAllNotes);

module.exports = router;
