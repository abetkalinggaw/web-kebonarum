import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../auth/authContext';
import { apiCall } from '../../adminApi';
import './LoginPage.css';
import '../../../admin/admin.css';
import logo from '../../../assets/logo.png';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
        <div className="admin-login-brand">
          <img src={logo} alt="GKJ Kebonarum" className="admin-login-logo" />
          <h1>Admin GKJ Kebonarum</h1>
          <p>Masuk ke panel pengelolaan website</p>
        </div>

        {error && (
          <div className="admin-alert error">
            <i className="fas fa-exclamation-circle"></i> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-form-group">
            <label className="admin-label">Username</label>
            <input
              className="admin-input"
              type="text"
              placeholder="Masukkan username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">Password</label>
            <input
              className="admin-input"
              type="password"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="admin-btn admin-login-submit"
            disabled={loading}
          >
            {loading ? <><i className="fas fa-spinner fa-spin"></i> Memuat...</> : <><i className="fas fa-sign-in-alt"></i> Masuk</>}
          </button>
        </form>

        <div className="admin-login-footer">
          Belum punya akun? <Link to="/admin/register">Daftar di sini</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
