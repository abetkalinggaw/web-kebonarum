const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { readStore, writeStore } = require('../services/jsonStore');
const { authMiddleware, requireRole, JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// Allowed Database Roles
const VALID_ROLES = ['Superadmin', 'Admin', 'Users'];

// LOGIN
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username dan password wajib diisi.' });
  }

  const users = readStore('admin-users');
  const user = users.find(u => (u.username || '').toLowerCase() === username.trim().toLowerCase());

  if (!user) {
    return res.status(401).json({ message: 'Username atau password salah.' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Username atau password salah.' });
  }

  const token = jwt.sign(
    { id: user.id || user.username, username: user.username, role: user.role || 'Users' },
    JWT_SECRET,
    { expiresIn: '1d' }
  );

  res.json({
    token,
    user: {
      id: user.id || user.username,
      username: user.username,
      name: user.name || user.username,
      role: user.role || 'Users',
    },
  });
});

// USER LIST (Get all users - Superadmin Only)
router.get('/users', authMiddleware, requireRole('Superadmin'), (req, res) => {
  const users = readStore('admin-users');
  const safeUsers = users.map(u => ({
    id: u.id || u.username,
    username: u.username,
    name: u.name || u.username,
    role: u.role || 'Users',
    createdAt: u.createdAt || new Date().toISOString(),
  }));
  res.json(safeUsers);
});

// CREATE USER (Superadmin Only)
router.post('/users', authMiddleware, requireRole('Superadmin'), async (req, res) => {
  const { username, password, name, role } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username dan password wajib diisi.' });
  }

  const formattedRole = VALID_ROLES.find(r => r.toLowerCase() === (role || 'Users').toLowerCase()) || 'Users';
  const users = readStore('admin-users');

  if (users.find(u => (u.username || '').toLowerCase() === username.trim().toLowerCase())) {
    return res.status(400).json({ message: 'Username sudah terdaftar.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: `usr_${Date.now()}`,
    username: username.trim(),
    name: (name || username).trim(),
    password: hashedPassword,
    role: formattedRole,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  writeStore('admin-users', users);

  res.status(201).json({
    message: 'User berhasil dibuat',
    user: {
      id: newUser.id,
      username: newUser.username,
      name: newUser.name,
      role: newUser.role,
      createdAt: newUser.createdAt,
    },
  });
});

// UPDATE USER (Superadmin Only)
router.put('/users/:id', authMiddleware, requireRole('Superadmin'), async (req, res) => {
  const { id } = req.params;
  const { name, role, password } = req.body;

  const users = readStore('admin-users');
  const userIndex = users.findIndex(u => (u.id === id || u.username === id));

  if (userIndex === -1) {
    return res.status(404).json({ message: 'User tidak ditemukan.' });
  }

  const targetUser = users[userIndex];

  if (name) targetUser.name = name.trim();
  if (role) {
    const formattedRole = VALID_ROLES.find(r => r.toLowerCase() === role.toLowerCase());
    if (formattedRole) targetUser.role = formattedRole;
  }
  if (password && password.trim().length > 0) {
    targetUser.password = await bcrypt.hash(password.trim(), 10);
  }

  users[userIndex] = targetUser;
  writeStore('admin-users', users);

  res.json({
    message: 'User berhasil diperbarui',
    user: {
      id: targetUser.id || targetUser.username,
      username: targetUser.username,
      name: targetUser.name,
      role: targetUser.role,
    },
  });
});

// DELETE USER (Superadmin Only)
router.delete('/users/:id', authMiddleware, requireRole('Superadmin'), (req, res) => {
  const { id } = req.params;
  let users = readStore('admin-users');

  const targetUser = users.find(u => (u.id === id || u.username === id));
  if (!targetUser) {
    return res.status(404).json({ message: 'User tidak ditemukan.' });
  }

  // Prevent Superadmin from deleting their own account
  if (targetUser.username === req.user.username) {
    return res.status(400).json({ message: 'Anda tidak dapat menghapus akun Anda sendiri.' });
  }

  users = users.filter(u => !(u.id === id || u.username === id));
  writeStore('admin-users', users);

  res.json({ message: 'User berhasil dihapus' });
});

module.exports = router;
