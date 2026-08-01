import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../../adminApi';
import { AdminToastContext } from '../../components/AdminLayout';
import '../LoginPage/LoginPage.css';
import { AlertCircle, ArrowLeft, Eye, EyeOff, Loader, UserPlus } from 'lucide-react';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Admin');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { showToast } = useContext(AdminToastContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await apiCall('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, name: name || username, password, role })
      });
      showToast(`Admin "${username}" berhasil dibuat`, 'success');
      navigate('/admin/users');
    } catch (err) {
      setError(err.message || 'Gagal mendaftarkan admin baru');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <button
          onClick={() => navigate('/admin')}
          className="admin-btn secondary sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <ArrowLeft size={16} /> Kembali ke Dashboard
        </button>
      </div>

      <div className="admin-card">
        <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--admin-border)', paddingBottom: '1rem' }}>
          <h2 style={{ fontFamily: 'var(--admin-font-heading)', margin: '0 0 0.35rem', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <UserPlus size={22} style={{ color: 'var(--admin-accent)' }} /> Tambah Administrator Baru
          </h2>
          <p style={{ margin: 0, color: 'var(--admin-text-muted)', fontSize: '0.88rem' }}>
            Buat kredensial login dan tentukan hak akses peran pengguna untuk panel pengelola website.
          </p>
        </div>

        {error && (
          <div className="admin-alert error" style={{ marginBottom: '1.25rem' }}>
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          <div className="admin-input-group">
            <label className="admin-input-label">Username (ID Login)</label>
            <input
              className="admin-input"
              type="text"
              placeholder="Contoh: admin_sekretariat"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="admin-input-group">
            <label className="admin-input-label">Nama Lengkap</label>
            <input
              className="admin-input"
              type="text"
              placeholder="Contoh: Bpk. Bambang Wijaya"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="admin-input-group">
            <label className="admin-input-label">Peran Pengguna (Role Access)</label>
            <select
              className="admin-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="Admin">Admin (Kelola Jemaat, Keuangan, Agenda & Warta)</option>
              <option value="Superadmin">Superadmin (Akses Penuh + Kelola Akun Admin)</option>
              <option value="Users">Users (Akses Lihat Data / Terbatas)</option>
            </select>
          </div>

          <div className="admin-input-group">
            <label className="admin-input-label">Kata Sandi / Password</label>
            <div style={{ position: 'relative' }}>
              <input
                className="admin-input"
                type={showPassword ? 'text' : 'password'}
                placeholder="Masukkan kata sandi minimal 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingRight: '2.5rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--admin-text-muted)',
                  cursor: 'pointer',
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
            <button
              type="button"
              className="admin-btn secondary"
              style={{ flex: 1 }}
              onClick={() => navigate('/admin')}
            >
              Batal
            </button>
            <button type="submit" className="admin-btn" style={{ flex: 1 }} disabled={loading}>
              {loading ? <><Loader size={18} className="fa-spin" /> Mendaftarkan...</> : <><UserPlus size={18} /> Daftarkan Admin</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
