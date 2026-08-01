const express = require('express');
const { readStore, writeStore } = require('../services/jsonStore');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();
const STORE_NAME = 'warta';

router.get('/', (req, res) => {
  res.json(readStore(STORE_NAME));
});

router.get('/:id', (req, res) => {
  const items = readStore(STORE_NAME);
  const item = items.find((w) => String(w.id) === String(req.params.id));
  if (!item) return res.status(404).json({ message: 'Warta not found' });
  res.json(item);
});

router.post('/', authMiddleware, requireRole('Superadmin', 'Admin'), (req, res) => {
  const items = readStore(STORE_NAME);
  const newItem = { id: Date.now().toString(), ...req.body };
  items.push(newItem);
  writeStore(STORE_NAME, items);
  res.status(201).json(newItem);
});

router.put('/:id', authMiddleware, requireRole('Superadmin', 'Admin'), (req, res) => {
  const items = readStore(STORE_NAME);
  const index = items.findIndex(item => item.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Not found' });
  
  items[index] = { ...items[index], ...req.body };
  writeStore(STORE_NAME, items);
  res.json(items[index]);
});

router.delete('/:id', authMiddleware, requireRole('Superadmin', 'Admin'), (req, res) => {
  const items = readStore(STORE_NAME);
  const filtered = items.filter(item => item.id !== req.params.id);
  if (items.length === filtered.length) return res.status(404).json({ message: 'Not found' });
  
  writeStore(STORE_NAME, filtered);
  res.json({ message: 'Deleted' });
});

module.exports = router;
