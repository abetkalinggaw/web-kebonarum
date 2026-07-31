const express = require('express');
const { readStore, writeStore } = require('../services/jsonStore');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();
const STORE_NAME = 'jemaat';

// GET ALL JEMAAT (with search & filter options)
router.get('/', (req, res) => {
  const items = readStore(STORE_NAME);
  const { search, wilayah, status, peranGereja, subPeran } = req.query;

  let filtered = Array.isArray(items) ? items : [];

  if (peranGereja) {
    filtered = filtered.filter(item =>
      (item.peranGereja || 'Jemaat').toLowerCase() === peranGereja.toLowerCase()
    );
  }

  if (subPeran) {
    filtered = filtered.filter(item =>
      (item.subPeran || '').toLowerCase() === subPeran.toLowerCase()
    );
  }

  if (wilayah) {
    filtered = filtered.filter(item => (item.wilayah || '').toLowerCase() === wilayah.toLowerCase());
  }

  if (status) {
    filtered = filtered.filter(item => (item.statusKeanggotaan || '').toLowerCase() === status.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(item =>
      (item.namaLengkap || '').toLowerCase().includes(q) ||
      (item.nik || '').includes(q) ||
      (item.alamat || '').toLowerCase().includes(q) ||
      (item.noHp || '').includes(q) ||
      (item.komisi || '').toLowerCase().includes(q) ||
      (item.jabatanPelayanan || '').toLowerCase().includes(q) ||
      (item.peranGereja || '').toLowerCase().includes(q) ||
      (item.pekerjaan || '').toLowerCase().includes(q) ||
      (item.statusPerkawinan || '').toLowerCase().includes(q) ||
      (item.kewarganegaraan || '').toLowerCase().includes(q)
    );
  }

  res.json(filtered);
});

// GET SINGLE JEMAAT BY ID
router.get('/:id', (req, res) => {
  const items = readStore(STORE_NAME);
  const item = (items || []).find(i => i.id === req.params.id);
  if (!item) return res.status(404).json({ message: 'Data jemaat tidak ditemukan.' });
  res.json(item);
});

// CREATE JEMAAT (Superadmin & Admin)
router.post('/', authMiddleware, requireRole('Superadmin', 'Admin'), (req, res) => {
  const items = readStore(STORE_NAME) || [];
  const newItem = {
    id: `jmt_${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString(),
  };

  items.unshift(newItem);
  writeStore(STORE_NAME, items);
  res.status(201).json(newItem);
});

// UPDATE JEMAAT (Superadmin & Admin)
router.put('/:id', authMiddleware, requireRole('Superadmin', 'Admin'), (req, res) => {
  const items = readStore(STORE_NAME) || [];
  const index = items.findIndex(item => item.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: 'Data jemaat tidak ditemukan.' });
  }

  items[index] = {
    ...items[index],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  writeStore(STORE_NAME, items);
  res.json(items[index]);
});

// DELETE JEMAAT (Superadmin & Admin)
router.delete('/:id', authMiddleware, requireRole('Superadmin', 'Admin'), (req, res) => {
  const items = readStore(STORE_NAME) || [];
  const filtered = items.filter(item => item.id !== req.params.id);

  if (items.length === filtered.length) {
    return res.status(404).json({ message: 'Data jemaat tidak ditemukan.' });
  }

  writeStore(STORE_NAME, filtered);
  res.json({ message: 'Data jemaat berhasil dihapus.' });
});

module.exports = router;
