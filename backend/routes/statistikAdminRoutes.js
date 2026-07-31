const express = require('express');
const { readStore, writeStore } = require('../services/jsonStore');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
const STORE_NAME = 'statistik';

router.get('/', (req, res) => {
  // Can just reuse the readStore
  res.json(readStore(STORE_NAME));
});

router.put('/', authMiddleware, (req, res) => {
  // Full replace
  writeStore(STORE_NAME, req.body);
  res.json({ message: 'Statistik updated successfully' });
});

module.exports = router;
