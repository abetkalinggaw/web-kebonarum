import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../auth/authContext';
import { apiCall } from '../../adminApi';
import './LoginPage.css';
import '../../../admin/admin.css';
import logo from '../../../assets/logo.png';
import { AlertCircle, Eye, EyeOff, Loader, LogIn, Shield, ArrowLeft } from 'lucide-react';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add('admin-body');
    if (isAuthenticated) navigate('/admin');
    return () => document.body.classList.remove('admin-body');
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      login(data.token, data.user);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Username atau password salah.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div style={{ marginBottom: '1.25rem' }}>
          <a
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--admin-text-muted)',
              fontSize: '0.82rem',
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            <ArrowLeft size={15} /> Kembali ke Web Utama
          </a>
        </div>

        <div className="admin-login-brand">
          <img src={logo} alt="GKJ Kebonarum" className="admin-login-logo" />
          <h1>GKJ Kebonarum</h1>
          <p style={{ fontFamily: 'var(--admin-font-mono)', fontSize: '0.78rem', color: 'var(--admin-accent)', fontWeight: 600, letterSpacing: '0.04em' }}>
            PANEL ADMINISTRATOR GEREJA
          </p>
        </div>

        {error && (
          <div className="admin-alert error" style={{ marginBottom: '1.25rem' }}>
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-input-group">
            <label className="admin-input-label">Username / Akun Admin</label>
            <input
              className="admin-input"
              type="text"
              placeholder="Masukkan username admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="admin-input-group">
            <label className="admin-input-label">Kata Sandi / Password</label>
            <div style={{ position: 'relative' }}>
              <input
                className="admin-input"
                type={showPassword ? 'text' : 'password'}
                placeholder="Masukkan kata sandi"
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

          <button
            type="submit"
            className="admin-btn admin-login-submit"
            disabled={loading}
            style={{ width: '100%', marginTop: '0.5rem', padding: '12px' }}
          >
            {loading ? (
              <><Loader size={18} className="fa-spin" /> Verifikasi...</>
            ) : (
              <><LogIn size={18} /> Masuk Panel Admin</>
            )}
          </button>
        </form>

        <div className="admin-login-footer" style={{ borderTop: '1px solid var(--admin-border)', paddingTop: '1.25rem', marginTop: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--admin-text-muted)' }}>
            <Shield size={14} style={{ color: 'var(--admin-accent)' }} />
            <span>Sistem Terenkripsi & Protected Portal</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
