import React, { useState, useEffect } from 'react';
import { apiCall } from '../../adminApi';
import './AgendaPage.css';

const AgendaPage = () => {
  const [agendas, setAgendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id: '', title: '', date: '', time: '', location: '', type: 'Ibadah', description: '' });

  const fetchAgendas = async () => {
    setLoading(true);
    try {
      const data = await apiCall('/agenda');
      setAgendas(data);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgendas();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await apiCall(`/agenda/${formData.id}`, { method: 'PUT', body: JSON.stringify(formData) });
      } else {
        await apiCall('/agenda', { method: 'POST', body: JSON.stringify(formData) });
      }
      setShowModal(false);
      fetchAgendas();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this agenda?')) {
      try {
        await apiCall(`/agenda/${id}`, { method: 'DELETE' });
        fetchAgendas();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const openModal = (agenda = null) => {
    if (agenda) {
      setFormData(agenda);
    } else {
      setFormData({ id: '', title: '', date: '', time: '', location: '', type: 'Ibadah', description: '' });
    }
    setShowModal(true);
  };

  return (
    <div>
      <div className="agenda-header">
        <h2>Daftar Agenda</h2>
        <button className="admin-btn" onClick={() => openModal()}>
          <i className="fas fa-plus"></i> Tambah Agenda
        </button>
      </div>

      <div className="admin-card">
        {loading ? <p>Loading...</p> : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Judul</th>
                <th>Tanggal</th>
                <th>Waktu</th>
                <th>Tipe</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {agendas.map(agenda => (
                <tr key={agenda.id}>
                  <td>{agenda.title}</td>
                  <td>{agenda.date}</td>
                  <td>{agenda.time}</td>
                  <td>{agenda.type}</td>
                  <td>
                    <div className="admin-action-icons">
                      <i className="fas fa-edit" onClick={() => openModal(agenda)}></i>
                      <i className="fas fa-trash" onClick={() => handleDelete(agenda.id)}></i>
                    </div>
                  </td>
                </tr>
              ))}
              {agendas.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>Tidak ada data.</td>
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
              <h3>{formData.id ? 'Edit Agenda' : 'Tambah Agenda'}</h3>
              <button className="admin-modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <input className="admin-input" placeholder="Judul" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
              <input className="admin-input" type="date" placeholder="Tanggal" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
              <input className="admin-input" type="time" placeholder="Waktu" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} required />
              <input className="admin-input" placeholder="Lokasi" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required />
              <select className="admin-input" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                <option value="Ibadah">Ibadah</option>
                <option value="Persekutuan">Persekutuan</option>
                <option value="Rapat">Rapat</option>
                <option value="Kegiatan">Kegiatan</option>
                <option value="Lainnya">Lainnya</option>
              </select>
              <textarea className="admin-input" placeholder="Deskripsi" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows="4"></textarea>
              <button type="submit" className="admin-btn" style={{ width: '100%' }}>Simpan</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgendaPage;
