import React, { useState, useEffect } from 'react';
import { apiCall } from '../../adminApi';
import '../AgendaPage/AgendaPage.css'; // Reuse CSS

const WartaPage = () => {
  const [wartas, setWartas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id: '', title: '', date: '', description: '', paragraphs: [], googleDriveFiles: [] });
  // Simplified for now, just basic text areas

  const fetchWartas = async () => {
    setLoading(true);
    try {
      const data = await apiCall('/warta');
      setWartas(data);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWartas();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        paragraphs: typeof formData.paragraphs === 'string' ? formData.paragraphs.split('\n') : formData.paragraphs,
        googleDriveFiles: typeof formData.googleDriveFiles === 'string' ? formData.googleDriveFiles.split('\n') : formData.googleDriveFiles
      };

      if (formData.id) {
        await apiCall(`/warta/${formData.id}`, { method: 'PUT', body: JSON.stringify(payload) });
      } else {
        await apiCall('/warta', { method: 'POST', body: JSON.stringify(payload) });
      }
      setShowModal(false);
      fetchWartas();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await apiCall(`/warta/${id}`, { method: 'DELETE' });
        fetchWartas();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const openModal = (warta = null) => {
    if (warta) {
      setFormData({
        ...warta,
        paragraphs: warta.paragraphs?.join('\n') || '',
        googleDriveFiles: warta.googleDriveFiles?.join('\n') || ''
      });
    } else {
      setFormData({ id: '', title: '', date: '', description: '', paragraphs: '', googleDriveFiles: '' });
    }
    setShowModal(true);
  };

  return (
    <div>
      <div className="agenda-header">
        <h2>Daftar Warta Gereja</h2>
        <button className="admin-btn" onClick={() => openModal()}>
          <i className="fas fa-plus"></i> Tambah Warta
        </button>
      </div>

      <div className="admin-card">
        {loading ? <p>Loading...</p> : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Judul</th>
                <th>Tanggal</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {wartas.map(warta => (
                <tr key={warta.id}>
                  <td>{warta.title}</td>
                  <td>{warta.date}</td>
                  <td>
                    <div className="admin-action-icons">
                      <i className="fas fa-edit" onClick={() => openModal(warta)}></i>
                      <i className="fas fa-trash" onClick={() => handleDelete(warta.id)}></i>
                    </div>
                  </td>
                </tr>
              ))}
              {wartas.length === 0 && (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center' }}>Tidak ada data.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h3>{formData.id ? 'Edit Warta' : 'Tambah Warta'}</h3>
              <button className="admin-modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <input className="admin-input" placeholder="Judul" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
              <input className="admin-input" type="date" placeholder="Tanggal" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
              <textarea className="admin-input" placeholder="Deskripsi Singkat" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
              <textarea className="admin-input" placeholder="Paragraf (pisahkan dengan enter)" value={formData.paragraphs} onChange={e => setFormData({...formData, paragraphs: e.target.value})} rows="4"></textarea>
              <textarea className="admin-input" placeholder="Link Google Drive (pisahkan dengan enter)" value={formData.googleDriveFiles} onChange={e => setFormData({...formData, googleDriveFiles: e.target.value})} rows="2"></textarea>
              <button type="submit" className="admin-btn" style={{ width: '100%' }}>Simpan</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WartaPage;
