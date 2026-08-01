import React, { useState, useEffect, useContext } from 'react';
import { apiCall } from '../../adminApi';
import { AuthContext } from '../../auth/authContext';
import { AdminToastContext } from '../../components/AdminLayout';
import './UserListPage.css';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Edit,
  Loader,
  Save,
  Search,
  ShieldCheck,
  Trash2,
  User,
  UserCheck,
  UserCircle,
  UserMinus,
  UserPlus,
} from 'lucide-react';

const UserListPage = () => {
  const { user: currentUser } = useContext(AuthContext);
  const { showToast } = useContext(AdminToastContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');

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
      password: '',
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

        const msg = `Akun "${editingUser.username}" berhasil diperbarui.`;
        setSuccess(msg);
        showToast(msg, 'success');
      } else {
        await apiCall('/auth/users', {
          method: 'POST',
          body: JSON.stringify({
            username: formData.username,
            name: formData.name,
            password: formData.password,
            role: formData.role,
          }),
        });

        const msg = `User baru "${formData.username}" berhasil dibuat.`;
        setSuccess(msg);
        showToast(msg, 'success');
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
      const msg = `User "${deletingUser.username}" berhasil dihapus.`;
      setSuccess(msg);
      showToast(msg, 'success');
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
          <UserMinus size={36} className="forbidden-icon" />
          <h2>Akses Terbatas</h2>
          <p>
            Halaman Kelola User (User List) hanya dapat diakses oleh peran <strong>Superadmin</strong>.
          </p>
          <span className="current-role-tag">Peran Anda: {currentUser?.role || 'Users'}</span>
        </div>
      </div>
    );
  }

  const filteredUsers = users.filter((u) => {
    const matchesSearch = !search || u.username?.toLowerCase().includes(search.toLowerCase()) || u.name?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = !filterRole || (u.role || '').toLowerCase() === filterRole.toLowerCase();
    return matchesSearch && matchesRole;
  });

  return (
    <div className="user-list-page">
      <div className="user-list-header">
        <div className="header-text">
          <h2>Daftar Pengguna & Peran (User List)</h2>
          <p>Superadmin Control Center &bull; Tambah, edit, dan atur peran akun pengelola website.</p>
        </div>
        <button className="admin-btn add-user-btn" onClick={openAddModal}>
          <UserPlus size={18} /> Tambah User Baru
        </button>
      </div>

      {error && (
        <div className="admin-alert error">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {success && (
        <div className="admin-alert success">
          <CheckCircle size={18} /> {success}
        </div>
      )}

      {/* 2-Row Filter Card */}
      <div className="admin-filter-card">
        {/* Row 1: Search Bar & Search Button */}
        <form onSubmit={(e) => e.preventDefault()} className="admin-filter-row-1">
          <div className="search-input-wrap">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="admin-input search-input"
              placeholder="Cari username atau nama pengelola..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button type="submit" className="admin-btn search-btn">
            <Search size={16} /> Cari
          </button>
        </form>

        {/* Row 2: Role Filter */}
        <div className="admin-filter-row-2">
          <div className="admin-filter-dropdowns">
            <select
              className="admin-select admin-filter-select"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="">Semua Peran (Role)</option>
              <option value="superadmin">Superadmin</option>
              <option value="admin">Admin</option>
              <option value="users">Users</option>
            </select>
          </div>

          <div style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)', fontFamily: 'var(--admin-font-mono)' }}>
            Menampilkan {filteredUsers.length} dari {users.length} pengguna
          </div>
        </div>
      </div>

      {/* User Table Card */}
      <div className="user-table-card">
        {loading ? (
          <div className="user-table-loading">
            <Loader size={20} className="fa-spin" style={{ color: 'var(--admin-accent)', marginRight: '8px' }} />
            Memuat daftar pengguna...
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
                {filteredUsers.map((u) => {
                  const roleLower = (u.role || '').toLowerCase();
                  const isSelf = u.username === currentUser?.username;

                  return (
                    <tr key={u.id}>
                      <td className="user-cell-main">
                        <div className="user-avatar-wrap">
                          <UserCircle size={22} />
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
                            <ShieldCheck size={14} /> Superadmin
                          </span>
                        ) : roleLower === 'admin' ? (
                          <span className="role-pill role-admin">
                            <UserCheck size={14} /> Admin
                          </span>
                        ) : (
                          <span className="role-pill role-users">
                            <User size={14} /> Users
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
                          <Edit size={14} /> Edit
                        </button>
                        {!isSelf && (
                          <button
                            className="action-btn delete-btn"
                            onClick={() => setDeletingUser(u)}
                            title="Hapus Pengguna"
                          >
                            <Trash2 size={14} /> Hapus
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
          <div className="admin-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontFamily: 'var(--admin-font-heading)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {editingUser ? <Edit size={18} /> : <UserPlus size={18} />}
                {editingUser ? `Edit User @${editingUser.username}` : 'Tambah User Baru'}
              </h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer' }}>
                &times;
              </button>
            </div>

            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="admin-input-group">
                <label className="admin-input-label">Username</label>
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

              <div className="admin-input-group">
                <label className="admin-input-label">Nama Lengkap</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="Masukkan nama lengkap"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="admin-input-group">
                <label className="admin-input-label">Peran (Database Role)</label>
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

              <div className="admin-input-group">
                <label className="admin-input-label">
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

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  className="admin-btn secondary"
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                >
                  Batal
                </button>
                <button type="submit" className="admin-btn" disabled={submitting}>
                  {submitting ? <Loader size={18} className="fa-spin" /> : <Save size={18} />} Simpan User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingUser && (
        <div className="admin-modal-overlay" onClick={() => setDeletingUser(null)}>
          <div className="admin-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '450px', padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 0.75rem', color: 'var(--admin-danger)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={20} /> Konfirmasi Hapus User
            </h3>
            <p style={{ margin: '0 0 1.25rem', fontSize: '0.92rem', color: 'var(--admin-text-secondary)' }}>
              Apakah Anda yakin ingin menghapus akun user <strong>@{deletingUser.username}</strong> ({deletingUser.name})?
            </p>
            <p className="danger-note">Tindakan ini tidak dapat dibatalkan.</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
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
                {submitting ? <Loader size={18} className="fa-spin" /> : <Trash2 size={18} />} Hapus Akun
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserListPage;
