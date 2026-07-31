import React, { useState, useEffect } from 'react';
import { apiCall } from '../../adminApi';

const PendetaPage = () => {
  const [pendeta, setPendeta] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id: '', name: '', title: '', description: '', imageUrl: '' });

  const fetchPendeta = async () => {
    setLoading(true);
    try {
      const data = await apiCall('/pendeta');
      setPendeta(data);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendeta();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await apiCall(`/pendeta/${formData.id}`, { method: 'PUT', body: JSON.stringify(formData) });
      } else {
        await apiCall('/pendeta', { method: 'POST', body: JSON.stringify(formData) });
      }
      setShowModal(false);
      fetchPendeta();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await apiCall(`/pendeta/${id}`, { method: 'DELETE' });
        fetchPendeta();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const openModal = (item = null) => {
    setFormData(item || { id: '', name: '', title: '', description: '', imageUrl: '' });
    setShowModal(true);
  };

  return (
    <div>
      <div className="agenda-header">
        <h2>Daftar Pendeta</h2>
        <button className="admin-btn" onClick={() => openModal()}>
          <i className="fas fa-plus"></i> Tambah Pendeta
        </button>
      </div>
      <div className="admin-card">
        {loading ? <p>Loading...</p> : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nama</th>
                <th>Gelar/Title</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {pendeta.map(p => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.title}</td>
                  <td>
                    <div className="admin-action-icons">
                      <i className="fas fa-edit" onClick={() => openModal(p)}></i>
                      <i className="fas fa-trash" onClick={() => handleDelete(p.id)}></i>
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
              <h3>{formData.id ? 'Edit' : 'Tambah'} Pendeta</h3>
              <button className="admin-modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <input className="admin-input" placeholder="Nama" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              <input className="admin-input" placeholder="Gelar/Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
              <textarea className="admin-input" placeholder="Deskripsi" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows="3"></textarea>
              <input className="admin-input" placeholder="URL Foto" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
              <button type="submit" className="admin-btn" style={{ width: '100%' }}>Simpan</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default PendetaPage;
