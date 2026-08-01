import React, { useState, useEffect, useContext } from 'react';
import { apiCall } from '../../adminApi';
import { AuthContext } from '../../auth/authContext';
import { AdminToastContext } from '../../components/AdminLayout';
import './WartaPage.css';
import {
  AlertTriangle,
  Calendar,
  Edit,
  ExternalLink,
  Grid,
  List,
  Loader,
  Plus,
  Save,
  Search,
  Trash2,
  Eye,
} from 'lucide-react';

const WartaPage = () => {
  const { user } = useContext(AuthContext);
  const { showToast } = useContext(AdminToastContext);
  const [wartas, setWartas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('date-desc'); // 'date-desc' | 'date-asc' | 'title-asc' | 'title-desc'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  const [showModal, setShowModal] = useState(false);
  const [previewWarta, setPreviewWarta] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    id: '',
    title: '',
    date: '',
    description: '',
    paragraphs: '',
    googleDriveFiles: '',
  });

  const fetchWartas = async () => {
    setLoading(true);
    try {
      const data = await apiCall('/warta');
      setWartas(Array.isArray(data) ? data : []);
    } catch (err) {
      showToast(err.message || 'Gagal memuat warta gereja', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWartas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        paragraphs: typeof formData.paragraphs === 'string'
          ? formData.paragraphs.split('\n').filter(Boolean)
          : formData.paragraphs,
        googleDriveFiles: typeof formData.googleDriveFiles === 'string'
          ? formData.googleDriveFiles.split('\n').filter(Boolean)
          : formData.googleDriveFiles,
      };

      if (formData.id) {
        await apiCall(`/warta/${formData.id}`, { method: 'PUT', body: JSON.stringify(payload) });
        showToast(`Dokumen warta "${formData.title}" diperbarui`, 'success');
      } else {
        delete payload.id;
        await apiCall('/warta', { method: 'POST', body: JSON.stringify(payload) });
        showToast(`Dokumen warta "${formData.title}" berhasil dipublikasikan`, 'success');
      }
      setShowModal(false);
      fetchWartas();
    } catch (err) {
      showToast(err.message || 'Gagal menyimpan warta', 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    setSubmitting(true);
    try {
      await apiCall(`/warta/${deletingItem.id}`, { method: 'DELETE' });
      showToast(`Warta "${deletingItem.title}" berhasil dihapus`, 'success');
      setDeletingItem(null);
      fetchWartas();
    } catch (err) {
      showToast(err.message || 'Gagal menghapus warta', 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  const openModal = (warta = null) => {
    if (warta) {
      setFormData({
        id: warta.id,
        title: warta.title || '',
        date: warta.date || warta.tanggal || new Date().toISOString().split('T')[0],
        description: warta.description || '',
        paragraphs: Array.isArray(warta.paragraphs) ? warta.paragraphs.join('\n') : (warta.paragraphs || ''),
        googleDriveFiles: Array.isArray(warta.googleDriveFiles) ? warta.googleDriveFiles.join('\n') : (warta.googleDriveFiles || ''),
      });
    } else {
      setFormData({
        id: '',
        title: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        paragraphs: '',
        googleDriveFiles: '',
      });
    }
    setShowModal(true);
  };

  const isReadOnly = (user?.role || '').toLowerCase() === 'users';

  const filteredWartas = wartas
    .filter((item) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        item.title?.toLowerCase().includes(q) ||
        item.date?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const dateA = new Date(a.date || a.tanggal || 0);
      const dateB = new Date(b.date || b.tanggal || 0);
      const titleA = (a.title || '').toLowerCase();
      const titleB = (b.title || '').toLowerCase();

      if (sortBy === 'date-desc') return dateB - dateA;
      if (sortBy === 'date-asc') return dateA - dateB;
      if (sortBy === 'title-asc') return titleA.localeCompare(titleB);
      if (sortBy === 'title-desc') return titleB.localeCompare(titleA);
      return 0;
    });

  return (
    <div className="warta-admin-page">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--admin-font-heading)', margin: '0 0 0.2rem', fontSize: '1.75rem' }}>Warta Gereja & Dokumen Mingguan</h2>
          <p style={{ margin: 0, color: 'var(--admin-text-muted)', fontSize: '0.9rem' }}>
            Publikasi dokumen warta jemaat, pengumuman ibadah minggu, dan berkas lampiran PDF.
          </p>
        </div>
        {!isReadOnly && (
          <button className="admin-btn" onClick={() => openModal()}>
            <Plus size={18} /> Tambah Warta Baru
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
              placeholder="Cari judul warta atau tanggal publikasi..."
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
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date-desc">Terbaru (Tanggal)</option>
              <option value="date-asc">Terlama (Tanggal)</option>
              <option value="title-asc">Judul (A - Z)</option>
              <option value="title-desc">Judul (Z - A)</option>
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

      {/* Main List */}
      {loading ? (
        <div style={{ padding: '3.5rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
          <Loader size={20} className="fa-spin" style={{ color: 'var(--admin-accent)', marginRight: '8px' }} />
          Memuat warta gereja...
        </div>
      ) : viewMode === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.35rem' }}>
          {filteredWartas.length > 0 ? (
            filteredWartas.map((item) => (
              <div key={item.id} className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontFamily: 'var(--admin-font-mono)', padding: '3px 10px', borderRadius: '50px', background: 'rgba(139, 69, 19, 0.12)', color: '#8b4513', border: '1px solid rgba(139, 69, 19, 0.25)', fontWeight: 600 }}>
                    <Calendar size={12} style={{ marginRight: '4px' }} /> {item.date || item.tanggal || 'Minggu'}
                  </span>
                  <span className="admin-badge badge-success">Terbit</span>
                </div>

                <div>
                  <h3 style={{ margin: '0 0 0.35rem', fontSize: '1.15rem', fontFamily: 'var(--admin-font-heading)' }}>{item.title}</h3>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--admin-text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {item.description || (Array.isArray(item.paragraphs) ? item.paragraphs[0] : 'Dokumen warta resmi GKJ Kebonarum.')}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--admin-border)' }}>
                  <button className="admin-btn secondary sm" style={{ flex: 1 }} onClick={() => setPreviewWarta(item)}>
                    <Eye size={14} /> Baca
                  </button>
                  {!isReadOnly && (
                    <>
                      <button className="admin-btn secondary sm" onClick={() => openModal(item)}>
                        <Edit size={14} />
                      </button>
                      <button className="admin-btn danger sm" onClick={() => setDeletingItem(item)}>
                        <Trash2 size={14} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', color: 'var(--admin-text-muted)', fontStyle: 'italic', background: '#fff', borderRadius: '16px' }}>
              Belum ada warta gereja yang dipublikasikan.
            </div>
          )}
        </div>
      ) : (
        /* Table View */
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Judul Warta</th>
                <th>Tanggal Minggu</th>
                <th>Deskripsi</th>
                <th style={{ textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredWartas.map((item) => (
                <tr key={item.id}>
                  <td style={{ fontWeight: 600 }}>{item.title}</td>
                  <td style={{ fontFamily: 'var(--admin-font-mono)', fontSize: '0.85rem' }}>{item.date || item.tanggal}</td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--admin-text-secondary)', maxWidth: '300px' }}>{item.description || '-'}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}>
                      <button className="admin-btn secondary sm" onClick={() => setPreviewWarta(item)}>
                        <Eye size={14} />
                      </button>
                      {!isReadOnly && (
                        <>
                          <button className="admin-btn secondary sm" onClick={() => openModal(item)}>
                            <Edit size={14} />
                          </button>
                          <button className="admin-btn danger sm" onClick={() => setDeletingItem(item)}>
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Read Preview Modal */}
      {previewWarta && (
        <div className="admin-modal-overlay" onClick={() => setPreviewWarta(null)}>
          <div className="admin-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '650px', padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--admin-border)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <span className="admin-badge badge-gold" style={{ marginBottom: '0.35rem' }}>
                  <Calendar size={13} /> {previewWarta.date || previewWarta.tanggal}
                </span>
                <h2 style={{ margin: 0, fontSize: '1.35rem', fontFamily: 'var(--admin-font-heading)' }}>{previewWarta.title}</h2>
              </div>
              <button onClick={() => setPreviewWarta(null)} style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer' }}>
                &times;
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', lineHeight: '1.6', color: 'var(--admin-text-primary)' }}>
              {previewWarta.description && (
                <p style={{ fontStyle: 'italic', color: 'var(--admin-text-secondary)', background: 'var(--admin-surface-2)', padding: '0.85rem', borderRadius: '10px', margin: 0 }}>
                  "{previewWarta.description}"
                </p>
              )}

              {Array.isArray(previewWarta.paragraphs) ? (
                previewWarta.paragraphs.map((p, idx) => (
                  <p key={idx} style={{ margin: 0 }}>{p}</p>
                ))
              ) : (
                <p style={{ margin: 0 }}>{previewWarta.paragraphs || 'Tidak ada isi paragraf.'}</p>
              )}

              {previewWarta.googleDriveFiles && previewWarta.googleDriveFiles.length > 0 && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px dashed var(--admin-border)' }}>
                  <h4 style={{ margin: '0 0 0.5rem', fontSize: '0.92rem' }}>Berkas Lampiran PDF / Google Drive:</h4>
                  {(Array.isArray(previewWarta.googleDriveFiles) ? previewWarta.googleDriveFiles : [previewWarta.googleDriveFiles]).map((link, idx) => (
                    <a key={idx} href={link} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--admin-accent)', textDecoration: 'underline', fontSize: '0.88rem' }}>
                      <ExternalLink size={14} /> Berkas Lampiran #{idx + 1}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Form Modal */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontFamily: 'var(--admin-font-heading)' }}>
                {formData.id ? 'Edit Warta Gereja' : 'Publikasi Warta Baru'}
              </h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer' }}>
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="admin-input-group">
                <label className="admin-input-label">
                  Judul Warta Gereja <span style={{ color: 'var(--admin-danger)' }}>*</span>
                </label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="Contoh: Warta Gereja Minggu, 1 Maret 2026..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="admin-input-group">
                <label className="admin-input-label">
                  Tanggal Pelaksanaan / Terbit <span style={{ color: 'var(--admin-danger)' }}>*</span>
                </label>
                <input
                  type="date"
                  className="admin-input"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              <div className="admin-input-group">
                <label className="admin-input-label">Ringkasan Hero (Lead Header)</label>
                <textarea
                  className="admin-textarea"
                  rows="2"
                  placeholder="Ringkasan singkat warta untuk bagian header..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>

              <div className="admin-input-group">
                <label className="admin-input-label">Deskripsi Lengkap (2 Paragraf - Pisahkan dengan Enter)</label>
                <textarea
                  className="admin-textarea"
                  rows="4"
                  placeholder="Paragraf 1: Pengantar ibadah & persekutuan...&#10;Paragraf 2: Informasi pengumuman & pendampingan..."
                  value={formData.paragraphs}
                  onChange={(e) => setFormData({ ...formData, paragraphs: e.target.value })}
                ></textarea>
              </div>

              <div className="admin-input-group">
                <label className="admin-input-label">Link File PDF Warta (Untuk Pratinjau & Tombol Unduh)</label>
                <input
                  type="url"
                  className="admin-input"
                  placeholder="https://example.com/warta-1-maret-2026.pdf"
                  value={formData.googleDriveFiles}
                  onChange={(e) => setFormData({ ...formData, googleDriveFiles: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" className="admin-btn secondary" onClick={() => setShowModal(false)} disabled={submitting}>
                  Batal
                </button>
                <div
                  onClick={(e) => {
                    if (!formData.title?.trim() || !formData.date?.trim()) {
                      e.preventDefault();
                      showToast('Harap lengkapi judul warta dan tanggal publikasi', 'warning');
                    }
                  }}
                  style={{ display: 'inline-block' }}
                >
                  <button
                    type="submit"
                    className="admin-btn"
                    disabled={submitting || !formData.title?.trim() || !formData.date?.trim()}
                    style={{
                      opacity: (!formData.title?.trim() || !formData.date?.trim()) ? 0.5 : 1,
                      cursor: (!formData.title?.trim() || !formData.date?.trim()) ? 'not-allowed' : 'pointer',
                      background: (!formData.title?.trim() || !formData.date?.trim()) ? '#9ca3af' : undefined,
                      borderColor: (!formData.title?.trim() || !formData.date?.trim()) ? '#9ca3af' : undefined,
                    }}
                  >
                    {submitting ? <Loader size={18} className="fa-spin" /> : <Save size={18} />} Simpan Warta
                  </button>
                </div>
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
              <AlertTriangle size={20} /> Hapus Warta
            </h3>
            <p style={{ margin: '0 0 1.25rem', fontSize: '0.92rem', color: 'var(--admin-text-secondary)' }}>
              Apakah Anda yakin ingin menghapus warta <strong>"{deletingItem.title}"</strong>?
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

export default WartaPage;
