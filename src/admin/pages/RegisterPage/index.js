import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../../adminApi';
import '../LoginPage/LoginPage.css';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await apiCall('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      });
      alert('User created successfully');
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="admin-card login-card">
        <h1>Register New Admin</h1>
        {error && <div className="login-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            className="admin-input"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            className="admin-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="admin-btn" style={{ width: '100%', marginBottom: '16px' }} disabled={loading}>
            {loading ? 'Loading...' : 'Register'}
          </button>
          <button type="button" className="admin-btn" style={{ width: '100%', background: 'transparent', border: '1px solid var(--admin-border)' }} onClick={() => navigate('/admin')}>
            Back to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
