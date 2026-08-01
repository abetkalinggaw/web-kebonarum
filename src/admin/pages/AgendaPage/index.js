import React, { useState, useEffect, useContext } from 'react';
import { apiCall } from '../../adminApi';
import { AuthContext } from '../../auth/authContext';
import { AdminToastContext } from '../../components/AdminLayout';
import './AgendaPage.css';
import {
  AlertTriangle,
  Calendar,
  Clock,
  Edit,
  Grid,
  List,
  Loader,
  MapPin,
  Plus,
  Save,
  Search,
  Tag,
  Trash2,
} from 'lucide-react';

const AgendaPage = () => {
  const { user } = useContext(AuthContext);
  const { showToast } = useContext(AdminToastContext);
  const [agendas, setAgendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  const [showModal, setShowModal] = useState(false);
  const [deletingItem, setDeletingItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    id: '',
    title: '',
    date: '',
    time: '',
    location: '',
    type: 'Ibadah',
    description: '',
  });

  const fetchAgendas = async () => {
    setLoading(true);
    try {
      const data = await apiCall('/agenda');
      setAgendas(Array.isArray(data) ? data : []);
    } catch (err) {
      showToast(err.message || 'Gagal memuat agenda', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgendas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (formData.id) {
        await apiCall(`/agenda/${formData.id}`, { method: 'PUT', body: JSON.stringify(formData) });
        showToast(`Agenda "${formData.title}" diperbarui`, 'success');
      } else {
        await apiCall('/agenda', { method: 'POST', body: JSON.stringify(formData) });
        showToast(`Agenda "${formData.title}" berhasil ditambahkan`, 'success');
      }
      setShowModal(false);
      fetchAgendas();
    } catch (err) {
      showToast(err.message || 'Gagal menyimpan agenda', 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    setSubmitting(true);
    try {
      await apiCall(`/agenda/${deletingItem.id}`, { method: 'DELETE' });
      showToast(`Agenda "${deletingItem.title}" berhasil dihapus`, 'success');
      setDeletingItem(null);
      fetchAgendas();
    } catch (err) {
      showToast(err.message || 'Gagal menghapus agenda', 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  const openModal = (agenda = null) => {
    if (agenda) {
      setFormData(agenda);
    } else {
      setFormData({ id: '', title: '', date: new Date().toISOString().split('T')[0], time: '07:00', location: 'Gereja Induk Kebonarum', type: 'Ibadah', description: '' });
    }
    setShowModal(true);
  };

  const isReadOnly = (user?.role || '').toLowerCase() === 'users';

  const filteredAgendas = agendas.filter(item => {
    const matchesSearch = !search || item.title?.toLowerCase().includes(search.toLowerCase()) || item.location?.toLowerCase().includes(search.toLowerCase());
    const matchesType = !filterType || item.type === filterType;
    return matchesSearch && matchesType;
  });

  const getAgendaStatus = (dateStr) => {
    if (!dateStr) return { label: 'Terjadwal', class: 'upcoming' };
    const todayStr = new Date().toISOString().split('T')[0];
    if (dateStr === todayStr) return { label: 'Hari Ini', class: 'today' };
    if (dateStr < todayStr) return { label: 'Selesai', class: 'passed' };
    return { label: 'Mendatang', class: 'upcoming' };
  };

  return (
    <div className="agenda-admin-page">
      {/* Header */}
      <div className="agenda-header">
        <div>
          <h2 style={{ fontFamily: 'var(--admin-font-heading)', margin: '0 0 0.2rem', fontSize: '1.75rem' }}>Agenda & Jadwal Kegiatan</h2>
          <p style={{ margin: 0, color: 'var(--admin-text-muted)', fontSize: '0.9rem' }}>
            Pengelolaan jadwal ibadah, persekutuan doa, rapat majelis, dan kegiatan jemaat GKJ Kebonarum.
          </p>
        </div>
        {!isReadOnly && (
          <button className="admin-btn" onClick={() => openModal()}>
            <Plus size={18} /> Tambah Agenda Baru
          </button>
        )}
      </div>

      {/* 2-Row Filter Card */}
      <div className="admin-filter-card">
        {/* Row 1: Search Bar & Search Button */}
        <form onSubmit={(e) => e.preventDefault()} className="admin-filter-row-1">
          <div className="search-input-wrap">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="admin-input search-input"
              placeholder="Cari judul agenda kegiatan atau lokasi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button type="submit" className="admin-btn search-btn">
            <Search size={16} /> Cari
          </button>
        </form>

        {/* Row 2: Filters & View Mode Toggle */}
        <div className="admin-filter-row-2">
          <div className="admin-filter-dropdowns">
            <select
              className="admin-select admin-filter-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">Semua Kategori</option>
              <option value="Ibadah">Ibadah</option>
              <option value="Persekutuan">Persekutuan</option>
              <option value="Rapat">Rapat</option>
              <option value="Kegiatan">Kegiatan</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          <div className="admin-view-toggle">
            <button
              type="button"
              className={`admin-view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Tampilan Grid"
            >
              <Grid size={15} /> <span>Grid</span>
            </button>
            <button
              type="button"
              className={`admin-view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Tampilan Tabel"
            >
              <List size={15} /> <span>Tabel</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div style={{ padding: '3.5rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
          <Loader size={20} className="fa-spin" style={{ color: 'var(--admin-accent)', marginRight: '8px' }} />
          Memuat agenda kegiatan...
        </div>
      ) : viewMode === 'grid' ? (
        <div className="agenda-grid">
          {filteredAgendas.length > 0 ? (
            filteredAgendas.map((item) => {
              const status = getAgendaStatus(item.date);
              return (
                <div key={item.id} className="agenda-card-item">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="agenda-type-pill">
                      <Tag size={13} /> {item.type || 'Kegiatan'}
                    </span>
                    <span className={`agenda-status-pill ${status.class}`}>
                      {status.label}
                    </span>
                  </div>

                  <div>
                    <h3 style={{ margin: '0 0 0.35rem', fontSize: '1.15rem', fontFamily: 'var(--admin-font-heading)' }}>{item.title}</h3>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--admin-text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {item.description || 'Tidak ada deskripsi tambahan.'}
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.84rem', color: 'var(--admin-text-muted)', background: 'var(--admin-surface-2)', padding: '0.75rem', borderRadius: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={14} style={{ color: 'var(--admin-accent)' }} />
                      <strong>{item.date}</strong> &bull; <Clock size={14} style={{ color: 'var(--admin-accent)' }} /> {item.time || 'Waktu WIB'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={14} style={{ color: 'var(--admin-accent)' }} />
                      <span>{item.location || 'GKJ Kebonarum'}</span>
                    </div>
                  </div>

                  {!isReadOnly && (
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid var(--admin-border)' }}>
                      <button className="admin-btn secondary sm" style={{ flex: 1 }} onClick={() => openModal(item)}>
                        <Edit size={14} /> Edit
                      </button>
                      <button className="admin-btn danger sm" onClick={() => setDeletingItem(item)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', color: 'var(--admin-text-muted)', fontStyle: 'italic', background: '#fff', borderRadius: '16px' }}>
              Belum ada agenda yang sesuai dengan pencarian.
            </div>
          )}
        </div>
      ) : (
        /* Table View */
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Judul Agenda</th>
                <th>Kategori</th>
                <th>Tanggal & Waktu</th>
                <th>Lokasi</th>
                <th>Status</th>
                {!isReadOnly && <th style={{ textAlign: 'right' }}>Aksi</th>}
              </tr>
            </thead>
            <tbody>
              {filteredAgendas.map((item) => {
                const status = getAgendaStatus(item.date);
                return (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 600 }}>{item.title}</td>
                    <td><span className="agenda-type-pill">{item.type}</span></td>
                    <td style={{ fontFamily: 'var(--admin-font-mono)', fontSize: '0.85rem' }}>{item.date} &bull; {item.time}</td>
                    <td>{item.location}</td>
                    <td><span className={`agenda-status-pill ${status.class}`}>{status.label}</span></td>
                    {!isReadOnly && (
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}>
                          <button className="admin-btn secondary sm" onClick={() => openModal(item)}>
                            <Edit size={14} />
                          </button>
                          <button className="admin-btn danger sm" onClick={() => setDeletingItem(item)}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Form Modal */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontFamily: 'var(--admin-font-heading)' }}>
                {formData.id ? 'Edit Agenda' : 'Tambah Agenda Baru'}
              </h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer' }}>
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="admin-input-group">
                <label className="admin-input-label">Judul Agenda Kegiatan</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="Contoh: Ibadah Minggu Pagi, Persekutuan Doa..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="admin-input-group">
                  <label className="admin-input-label">Tanggal</label>
                  <input
                    type="date"
                    className="admin-input"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-input-group">
                  <label className="admin-input-label">Waktu (WIB)</label>
                  <input
                    type="time"
                    className="admin-input"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="admin-input-group">
                  <label className="admin-input-label">Kategori Agenda</label>
                  <select
                    className="admin-select"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="Ibadah">Ibadah</option>
                    <option value="Persekutuan">Persekutuan</option>
                    <option value="Rapat">Rapat Majelis</option>
                    <option value="Kegiatan">Kegiatan Jemaat</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                <div className="admin-input-group">
                  <label className="admin-input-label">Lokasi</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="Gereja Induk / Gedung..."
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="admin-input-group">
                <label className="admin-input-label">Deskripsi Lengkap / Pengkhotbah</label>
                <textarea
                  className="admin-textarea"
                  rows="3"
                  placeholder="Penjelasan ringkas acara, pelayan firman, atau catatan jemaat..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" className="admin-btn secondary" onClick={() => setShowModal(false)} disabled={submitting}>
                  Batal
                </button>
                <button type="submit" className="admin-btn" disabled={submitting}>
                  {submitting ? <Loader size={18} className="fa-spin" /> : <Save size={18} />} Simpan Agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingItem && (
        <div className="admin-modal-overlay" onClick={() => setDeletingItem(null)}>
          <div className="admin-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '450px', padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 0.75rem', color: 'var(--admin-danger)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={20} /> Hapus Agenda
            </h3>
            <p style={{ margin: '0 0 1.25rem', fontSize: '0.92rem', color: 'var(--admin-text-secondary)' }}>
              Apakah Anda yakin ingin menghapus agenda <strong>"{deletingItem.title}"</strong>?
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button className="admin-btn secondary" onClick={() => setDeletingItem(null)} disabled={submitting}>
                Batal
              </button>
              <button className="admin-btn danger" onClick={handleDelete} disabled={submitting}>
                {submitting ? <Loader size={18} className="fa-spin" /> : <Trash2 size={18} />} Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgendaPage;
