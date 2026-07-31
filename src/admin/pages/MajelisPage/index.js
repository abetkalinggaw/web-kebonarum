import React, { useState, useEffect } from 'react';
import { apiCall } from '../../adminApi';

const MajelisPage = () => {
  const [majelis, setMajelis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id: '', name: '', role: '', period: '', imageUrl: '' });

  const fetchMajelis = async () => {
    setLoading(true);
    try {
      const data = await apiCall('/majelis');
      setMajelis(data);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMajelis();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await apiCall(`/majelis/${formData.id}`, { method: 'PUT', body: JSON.stringify(formData) });
      } else {
        await apiCall('/majelis', { method: 'POST', body: JSON.stringify(formData) });
      }
      setShowModal(false);
      fetchMajelis();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await apiCall(`/majelis/${id}`, { method: 'DELETE' });
        fetchMajelis();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const openModal = (item = null) => {
    setFormData(item || { id: '', name: '', role: '', period: '', imageUrl: '' });
    setShowModal(true);
  };

  return (
    <div>
      <div className="agenda-header">
        <h2>Daftar Majelis</h2>
        <button className="admin-btn" onClick={() => openModal()}>
          <i className="fas fa-plus"></i> Tambah Majelis
        </button>
      </div>
      <div className="admin-card">
        {loading ? <p>Loading...</p> : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nama</th>
                <th>Peran</th>
                <th>Periode</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {majelis.map(m => (
                <tr key={m.id}>
                  <td>{m.name}</td>
                  <td>{m.role}</td>
                  <td>{m.period}</td>
                  <td>
                    <div className="admin-action-icons">
                      <i className="fas fa-edit" onClick={() => openModal(m)}></i>
                      <i className="fas fa-trash" onClick={() => handleDelete(m.id)}></i>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h3>{formData.id ? 'Edit' : 'Tambah'} Majelis</h3>
              <button className="admin-modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <input className="admin-input" placeholder="Nama" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              <input className="admin-input" placeholder="Peran" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} required />
              <input className="admin-input" placeholder="Periode (cth: 2023-2026)" value={formData.period} onChange={e => setFormData({...formData, period: e.target.value})} required />
              <input className="admin-input" placeholder="URL Foto" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
              <button type="submit" className="admin-btn" style={{ width: '100%' }}>Simpan</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default MajelisPage;
