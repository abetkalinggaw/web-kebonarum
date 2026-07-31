import React, { useState, useEffect, useContext } from 'react';
import { apiCall } from '../../adminApi';
import { AuthContext } from '../../auth/authContext';
import './UserListPage.css';

const UserListPage = () => {
  const { user: currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    password: '',
    role: 'Admin',
  });
  const [submitting, setSubmitting] = useState(false);

  // Delete State
  const [deletingUser, setDeletingUser] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiCall('/auth/users');
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Gagal memuat daftar pengguna.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.role?.toLowerCase() === 'superadmin') {
      fetchUsers();
    }
  }, [currentUser]);

  const openAddModal = () => {
    setEditingUser(null);
    setFormData({ username: '', name: '', password: '', role: 'Admin' });
    setError('');
    setSuccess('');
    setShowModal(true);
  };

  const openEditModal = (userItem) => {
    setEditingUser(userItem);
    setFormData({
      username: userItem.username,
      name: userItem.name || userItem.username,
      password: '', // Leave blank to keep existing password
      role: userItem.role || 'Users',
    });
    setError('');
    setSuccess('');
    setShowModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      if (editingUser) {
        // Update user
        const payload = {
          name: formData.name,
          role: formData.role,
        };
        if (formData.password.trim()) {
          payload.password = formData.password.trim();
        }

        await apiCall(`/auth/users/${editingUser.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });

        setSuccess(`Akun "${editingUser.username}" berhasil diperbarui.`);
      } else {
        // Create user
        await apiCall('/auth/users', {
          method: 'POST',
          body: JSON.stringify({
            username: formData.username,
            name: formData.name,
            password: formData.password,
            role: formData.role,
          }),
        });

        setSuccess(`User baru "${formData.username}" berhasil dibuat.`);
      }

      setShowModal(false);
      fetchUsers();
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat menyimpan data.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deletingUser) return;
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await apiCall(`/auth/users/${deletingUser.id}`, {
        method: 'DELETE',
      });
      setSuccess(`User "${deletingUser.username}" berhasil dihapus.`);
      setDeletingUser(null);
      fetchUsers();
    } catch (err) {
      setError(err.message || 'Gagal menghapus pengguna.');
    } finally {
      setSubmitting(false);
    }
  };

  if (currentUser?.role?.toLowerCase() !== 'superadmin') {
    return (
      <div className="user-list-forbidden">
        <div className="forbidden-card">
          <i className="fas fa-user-lock forbidden-icon"></i>
          <h2>Akses Terbatas</h2>
          <p>
            Halaman Kelola User (User List) hanya dapat diakses oleh peran <strong>Superadmin</strong>.
          </p>
          <span className="current-role-tag">Peran Anda: {currentUser?.role || 'Users'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="user-list-page">
      <div className="user-list-header">
        <div className="header-text">
          <h2>Daftar Pengguna & Peran (User List)</h2>
          <p>Superadmin Control Center &bull; Tambah, edit, dan atur peran akun pengelola website.</p>
        </div>
        <button className="admin-btn add-user-btn" onClick={openAddModal}>
          <i className="fas fa-user-plus"></i> Tambah User Baru
        </button>
      </div>

      {error && (
        <div className="admin-alert error">
          <i className="fas fa-exclamation-circle"></i> {error}
        </div>
      )}

      {success && (
        <div className="admin-alert success">
          <i className="fas fa-check-circle"></i> {success}
        </div>
      )}

      {/* User Table Card */}
      <div className="user-table-card">
        {loading ? (
          <div className="user-table-loading">
            <i className="fas fa-spinner fa-spin"></i> Memuat daftar pengguna...
          </div>
        ) : (
          <div className="table-responsive">
            <table className="user-table">
              <thead>
                <tr>
                  <th>Pengguna</th>
                  <th>Nama Lengkap</th>
                  <th>Peran (Role)</th>
                  <th>Tanggal Dibuat</th>
                  <th style={{ textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const roleLower = (u.role || '').toLowerCase();
                  const isSelf = u.username === currentUser?.username;

                  return (
                    <tr key={u.id}>
                      <td className="user-cell-main">
                        <div className="user-avatar-wrap">
                          <i className="fas fa-user-circle"></i>
                        </div>
                        <div className="user-name-group">
                          <span className="user-username">@{u.username}</span>
                          {isSelf && <span className="self-badge">Akun Anda</span>}
                        </div>
                      </td>
                      <td className="user-cell-name">{u.name || u.username}</td>
                      <td>
                        {roleLower === 'superadmin' ? (
                          <span className="role-pill role-superadmin">
                            <i className="fas fa-user-shield"></i> Superadmin
                          </span>
                        ) : roleLower === 'admin' ? (
                          <span className="role-pill role-admin">
                            <i className="fas fa-user-tie"></i> Admin
                          </span>
                        ) : (
                          <span className="role-pill role-users">
                            <i className="fas fa-user"></i> Users
                          </span>
                        )}
                      </td>
                      <td className="user-cell-date">
                        {new Date(u.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="user-cell-actions">
                        <button
                          className="action-btn edit-btn"
                          onClick={() => openEditModal(u)}
                          title="Edit Pengguna"
                        >
                          <i className="fas fa-edit"></i> Edit
                        </button>
                        {!isSelf && (
                          <button
                            className="action-btn delete-btn"
                            onClick={() => setDeletingUser(u)}
                            title="Hapus Pengguna"
                          >
                            <i className="fas fa-trash-alt"></i> Hapus
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal-panel" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>
                <i className={`fas ${editingUser ? 'fa-user-edit' : 'fa-user-plus'} modal-icon`}></i>
                {editingUser ? `Edit User @${editingUser.username}` : 'Tambah User Baru'}
              </h3>
              <button className="admin-modal-close" onClick={() => setShowModal(false)}>
                &times;
              </button>
            </div>
            <form onSubmit={handleFormSubmit} className="admin-modal-body">
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="Masukkan username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  disabled={Boolean(editingUser)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Nama Lengkap</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="Masukkan nama lengkap"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Peran (Database Role)</label>
                <select
                  className="admin-select"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="Superadmin">1. Superadmin (Akses Penuh + Kelola User)</option>
                  <option value="Admin">2. Admin (Kelola Konten & Data)</option>
                  <option value="Users">3. Users (Akses Lihat / Terbatas)</option>
                </select>
              </div>

              <div className="form-group">
                <label>
                  {editingUser ? 'Password Baru (Biarkan kosong jika tidak diubah)' : 'Password'}
                </label>
                <input
                  type="password"
                  className="admin-input"
                  placeholder={editingUser ? '••••••••' : 'Masukkan password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!editingUser}
                />
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-btn secondary"
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                >
                  Batal
                </button>
                <button type="submit" className="admin-btn" disabled={submitting}>
                  {submitting ? (
                    <><i className="fas fa-spinner fa-spin"></i> Menyimpan...</>
                  ) : (
                    <><i className="fas fa-save"></i> Simpan User</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingUser && (
        <div className="admin-modal-overlay" onClick={() => setDeletingUser(null)}>
          <div className="admin-modal-panel confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header danger-header">
              <h3><i className="fas fa-exclamation-triangle"></i> Konfirmasi Hapus User</h3>
              <button className="admin-modal-close" onClick={() => setDeletingUser(null)}>&times;</button>
            </div>
            <div className="admin-modal-body">
              <p>
                Apakah Anda yakin ingin menghapus akun user <strong>@{deletingUser.username}</strong> ({deletingUser.name})?
              </p>
              <p className="danger-note">Tindakan ini tidak dapat dibatalkan.</p>
              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-btn secondary"
                  onClick={() => setDeletingUser(null)}
                  disabled={submitting}
                >
                  Batal
                </button>
                <button
                  type="button"
                  className="admin-btn danger"
                  onClick={handleDeleteUser}
                  disabled={submitting}
                >
                  {submitting ? <><i className="fas fa-spinner fa-spin"></i> Menghapus...</> : <><i className="fas fa-trash-alt"></i> Hapus Akun</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserListPage;
