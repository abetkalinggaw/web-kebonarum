const express = require('express');
const { readStore, writeStore } = require('../services/jsonStore');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();
const STORE_NAME = 'keuangan-administrasi';

const DEFAULT_STORE = {
  persembahan: [],
  perpuluhan: [],
  asetGereja: [],
  suratMenyurat: [],
};

const getStore = () => {
  const data = readStore(STORE_NAME);
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return DEFAULT_STORE;
  }
  return {
    persembahan: data.persembahan || [],
    perpuluhan: data.perpuluhan || [],
    asetGereja: data.asetGereja || [],
    suratMenyurat: data.suratMenyurat || [],
  };
};

// GET ALL KEUANGAN & ADMINISTRASI DATA
router.get('/', (req, res) => {
  res.json(getStore());
});

// ADD ENTRY TO MODULE (persembahan | perpuluhan | asetGereja | suratMenyurat)
router.post('/:module', authMiddleware, requireRole('Superadmin', 'Admin'), (req, res) => {
  const { module } = req.params;
  const store = getStore();

  if (!store[module]) {
    return res.status(400).json({ message: `Modul ${module} tidak valid.` });
  }

  const prefix = module.slice(0, 3).toLowerCase();
  const newItem = {
    id: `${prefix}_${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString(),
  };

  store[module].unshift(newItem);
  writeStore(STORE_NAME, store);

  res.status(201).json(newItem);
});

// UPDATE ENTRY IN MODULE
router.put('/:module/:id', authMiddleware, requireRole('Superadmin', 'Admin'), (req, res) => {
  const { module, id } = req.params;
  const store = getStore();

  if (!store[module]) {
    return res.status(400).json({ message: `Modul ${module} tidak valid.` });
  }

  const index = store[module].findIndex(item => item.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Data tidak ditemukan.' });
  }

  store[module][index] = {
    ...store[module][index],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  writeStore(STORE_NAME, store);
  res.json(store[module][index]);
});

// DELETE ENTRY IN MODULE
router.delete('/:module/:id', authMiddleware, requireRole('Superadmin', 'Admin'), (req, res) => {
  const { module, id } = req.params;
  const store = getStore();

  if (!store[module]) {
    return res.status(400).json({ message: `Modul ${module} tidak valid.` });
  }

  const filtered = store[module].filter(item => item.id !== id);
  if (store[module].length === filtered.length) {
    return res.status(404).json({ message: 'Data tidak ditemukan.' });
  }

  store[module] = filtered;
  writeStore(STORE_NAME, store);

  res.json({ message: 'Data berhasil dihapus.' });
});

module.exports = router;
