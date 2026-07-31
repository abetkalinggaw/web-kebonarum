const express = require('express');
const { readStore } = require('../services/jsonStore');
const router = express.Router();

router.get('/', (req, res) => {
  const data = readStore('statistik');
  res.json(data);
});

module.exports = router;
