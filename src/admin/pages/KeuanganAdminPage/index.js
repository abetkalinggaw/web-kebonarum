import React, { useState, useEffect, useContext } from 'react';
import { apiCall } from '../../adminApi';
import { AuthContext } from '../../auth/authContext';
import './KeuanganAdminPage.css';

const KeuanganAdminPage = () => {
  const { user } = useContext(AuthContext);
  const [dataStore, setDataStore] = useState({
    persembahan: [],
    perpuluhan: [],
    asetGereja: [],
    suratMenyurat: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Active Tab: 'persembahan' | 'perpuluhan' | 'asetGereja' | 'suratMenyurat'
  const [activeTab, setActiveTab] = useState('persembahan');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Modal Forms for each tab
  const [formPersembahan, setFormPersembahan] = useState({ tanggal: '', jenis: '', jumlah: '', keterangan: '' });
  const [formPerpuluhan, setFormPerpuluhan] = useState({ tanggal: '', namaJemaat: '', jumlah: '', bulan: '' });
  const [formAset, setFormAset] = useState({ namaAset: '', kodeAset: '', jumlah: 1, kondisi: 'Baik', lokasi: '' });
  const [formSurat, setFormSurat] = useState({ nomorSurat: '', jenisSurat: 'Surat Masuk', perihal: '', tanggal: '', status: 'Diterima' });

  // Delete State
  const [deletingItem, setDeletingItem] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiCall('/keuangan-administrasi');
      setDataStore({
        persembahan: Array.isArray(data?.persembahan) ? data.persembahan : [],
        perpuluhan: Array.isArray(data?.perpuluhan) ? data.perpuluhan : [],
        asetGereja: Array.isArray(data?.asetGereja) ? data.asetGereja : [],
        suratMenyurat: Array.isArray(data?.suratMenyurat) ? data.suratMenyurat : [],
      });
    } catch (err) {
      setError(err.message || 'Gagal memuat data keuangan & administrasi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setFormPersembahan({ tanggal: new Date().toISOString().split('T')[0], jenis: '', jumlah: '', keterangan: '' });
    setFormPerpuluhan({ tanggal: new Date().toISOString().split('T')[0], namaJemaat: '', jumlah: '', bulan: '' });
    setFormAset({ namaAset: '', kodeAset: '', jumlah: 1, kondisi: 'Baik', lokasi: '' });
    setFormSurat({ nomorSurat: '', jenisSurat: 'Surat Masuk', perihal: '', tanggal: new Date().toISOString().split('T')[0], status: 'Diterima' });
    setError('');
    setSuccess('');
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setError('');
    setSuccess('');

    if (activeTab === 'persembahan') {
      setFormPersembahan({ tanggal: item.tanggal || '', jenis: item.jenis || '', jumlah: item.jumlah || '', keterangan: item.keterangan || '' });
    } else if (activeTab === 'perpuluhan') {
      setFormPerpuluhan({ tanggal: item.tanggal || '', namaJemaat: item.namaJemaat || '', jumlah: item.jumlah || '', bulan: item.bulan || '' });
    } else if (activeTab === 'asetGereja') {
      setFormAset({ namaAset: item.namaAset || '', kodeAset: item.kodeAset || '', jumlah: item.jumlah || 1, kondisi: item.kondisi || 'Baik', lokasi: item.lokasi || '' });
    } else if (activeTab === 'suratMenyurat') {
      setFormSurat({ nomorSurat: item.nomorSurat || '', jenisSurat: item.jenisSurat || 'Surat Masuk', perihal: item.perihal || '', tanggal: item.tanggal || '', status: item.status || 'Diterima' });
    }

    setShowModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    let payload = {};
    if (activeTab === 'persembahan') payload = formPersembahan;
    else if (activeTab === 'perpuluhan') payload = formPerpuluhan;
    else if (activeTab === 'asetGereja') payload = formAset;
    else if (activeTab === 'suratMenyurat') payload = formSurat;

    try {
      if (editingItem) {
        await apiCall(`/keuangan-administrasi/${activeTab}/${editingItem.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        setSuccess(`Data ${activeTab} berhasil diperbarui.`);
      } else {
        await apiCall(`/keuangan-administrasi/${activeTab}`, {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        setSuccess(`Data ${activeTab} berhasil ditambahkan.`);
      }

      setShowModal(false);
      fetchData();
    } catch (err) {
      setError(err.message || 'Gagal menyimpan data.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteItem = async () => {
    if (!deletingItem) return;
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await apiCall(`/keuangan-administrasi/${activeTab}/${deletingItem.id}`, {
        method: 'DELETE',
      });
      setSuccess(`Data berhasil dihapus.`);
      setDeletingItem(null);
      fetchData();
    } catch (err) {
      setError(err.message || 'Gagal menghapus data.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatRupiah = (val) => {
    const num = Number(val) || 0;
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
  };

  const isReadOnly = (user?.role || '').toLowerCase() === 'users';

  return (
    <div className="keuangan-admin-page">
      <div className="keuangan-header">
        <div className="header-title-group">
          <h2>Data Keuangan & Administrasi Gereja</h2>
          <p>Pencatatan Persembahan, Perpuluhan, Aset Inventaris Gereja, dan Arsip Surat Menyurat.</p>
        </div>
        {!isReadOnly && (
          <button className="admin-btn" onClick={openAddModal}>
            <i className="fas fa-plus-circle"></i> Tambah Data Baru
          </button>
        )}
      </div>

      {error && (
        <div className="admin-alert error">
          <i className="fas fa-exclamation-circle"></i> {error}
        </div>
      )}

      {success && (
        <div className="admin-alert success">
          <i className="fas fa-check-circle"></i> {success}
        </div>
      )}

      {/* Main Module Tabs */}
      <div className="module-tabs">
        <button
          className={`module-tab-btn ${activeTab === 'persembahan' ? 'active' : ''}`}
          onClick={() => setActiveTab('persembahan')}
        >
          <i className="fas fa-hand-holding-usd"></i> Persembahan ({dataStore.persembahan.length})
        </button>
        <button
          className={`module-tab-btn ${activeTab === 'perpuluhan' ? 'active' : ''}`}
          onClick={() => setActiveTab('perpuluhan')}
        >
          <i className="fas fa-coins"></i> Perpuluhan ({dataStore.perpuluhan.length})
        </button>
        <button
          className={`module-tab-btn ${activeTab === 'asetGereja' ? 'active' : ''}`}
          onClick={() => setActiveTab('asetGereja')}
        >
          <i className="fas fa-boxes"></i> Aset Gereja ({dataStore.asetGereja.length})
        </button>
        <button
          className={`module-tab-btn ${activeTab === 'suratMenyurat' ? 'active' : ''}`}
          onClick={() => setActiveTab('suratMenyurat')}
        >
          <i className="fas fa-envelope-open-text"></i> Surat Menyurat ({dataStore.suratMenyurat.length})
        </button>
      </div>

      {/* Module Content Table */}
      <div className="keuangan-table-card">
        {loading ? (
          <div className="table-loading"><i className="fas fa-spinner fa-spin"></i> Memuat data...</div>
        ) : activeTab === 'persembahan' ? (
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Jenis Persembahan</th>
                <th>Jumlah</th>
                <th>Keterangan</th>
                {!isReadOnly && <th style={{ textAlign: 'right' }}>Aksi</th>}
              </tr>
            </thead>
            <tbody>
              {dataStore.persembahan.length > 0 ? (
                dataStore.persembahan.map((item) => (
                  <tr key={item.id}>
                    <td className="mono-date">{item.tanggal}</td>
                    <td className="bold-title">{item.jenis}</td>
                    <td className="rupiah-val">{formatRupiah(item.jumlah)}</td>
                    <td className="muted-desc">{item.keterangan || '—'}</td>
                    {!isReadOnly && (
                      <td className="actions-cell">
                        <button className="action-btn edit-btn" onClick={() => openEditModal(item)}>Edit</button>
                        <button className="action-btn delete-btn" onClick={() => setDeletingItem(item)}>Hapus</button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr><td colSpan={5} className="table-empty">Belum ada pencatatan persembahan.</td></tr>
              )}
            </tbody>
          </table>
        ) : activeTab === 'perpuluhan' ? (
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Nama Jemaat / Persembah</th>
                <th>Bulan</th>
                <th>Jumlah</th>
                {!isReadOnly && <th style={{ textAlign: 'right' }}>Aksi</th>}
              </tr>
            </thead>
            <tbody>
              {dataStore.perpuluhan.length > 0 ? (
                dataStore.perpuluhan.map((item) => (
                  <tr key={item.id}>
                    <td className="mono-date">{item.tanggal}</td>
                    <td className="bold-title">{item.namaJemaat}</td>
                    <td><span className="bulan-badge">{item.bulan || '—'}</span></td>
                    <td className="rupiah-val">{formatRupiah(item.jumlah)}</td>
                    {!isReadOnly && (
                      <td className="actions-cell">
                        <button className="action-btn edit-btn" onClick={() => openEditModal(item)}>Edit</button>
                        <button className="action-btn delete-btn" onClick={() => setDeletingItem(item)}>Hapus</button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr><td colSpan={5} className="table-empty">Belum ada pencatatan perpuluhan.</td></tr>
              )}
            </tbody>
          </table>
        ) : activeTab === 'asetGereja' ? (
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>Kode Aset</th>
                <th>Nama Aset Inventaris</th>
                <th>Jumlah</th>
                <th>Kondisi</th>
                <th>Lokasi</th>
                {!isReadOnly && <th style={{ textAlign: 'right' }}>Aksi</th>}
              </tr>
            </thead>
            <tbody>
              {dataStore.asetGereja.length > 0 ? (
                dataStore.asetGereja.map((item) => (
                  <tr key={item.id}>
                    <td><span className="kode-badge">{item.kodeAset}</span></td>
                    <td className="bold-title">{item.namaAset}</td>
                    <td>{item.jumlah} Unit</td>
                    <td><span className="kondisi-badge">{item.kondisi}</span></td>
                    <td className="muted-desc">{item.lokasi}</td>
                    {!isReadOnly && (
                      <td className="actions-cell">
                        <button className="action-btn edit-btn" onClick={() => openEditModal(item)}>Edit</button>
                        <button className="action-btn delete-btn" onClick={() => setDeletingItem(item)}>Hapus</button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr><td colSpan={6} className="table-empty">Belum ada pencatatan aset gereja.</td></tr>
              )}
            </tbody>
          </table>
        ) : (
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>Nomor Surat</th>
                <th>Jenis Surat</th>
                <th>Perihal</th>
                <th>Tanggal</th>
                <th>Status</th>
                {!isReadOnly && <th style={{ textAlign: 'right' }}>Aksi</th>}
              </tr>
            </thead>
            <tbody>
              {dataStore.suratMenyurat.length > 0 ? (
                dataStore.suratMenyurat.map((item) => (
                  <tr key={item.id}>
                    <td><span className="kode-badge">{item.nomorSurat}</span></td>
                    <td><span className={`surat-type-tag ${item.jenisSurat === 'Surat Masuk' ? 'masuk' : 'keluar'}`}>{item.jenisSurat}</span></td>
                    <td className="bold-title">{item.perihal}</td>
                    <td className="mono-date">{item.tanggal}</td>
                    <td><span className="surat-status">{item.status}</span></td>
                    {!isReadOnly && (
                      <td className="actions-cell">
                        <button className="action-btn edit-btn" onClick={() => openEditModal(item)}>Edit</button>
                        <button className="action-btn delete-btn" onClick={() => setDeletingItem(item)}>Hapus</button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr><td colSpan={6} className="table-empty">Belum ada pencatatan surat menyurat.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Dynamic Form Modal */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal-panel" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>
                <i className="fas fa-edit modal-icon"></i>
                {editingItem ? `Edit Data ${activeTab}` : `Tambah ${activeTab} Baru`}
              </h3>
              <button className="admin-modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleFormSubmit} className="admin-modal-body">
              {activeTab === 'persembahan' && (
                <>
                  <div className="form-group">
                    <label>Tanggal Persembahan</label>
                    <input type="date" className="admin-input" value={formPersembahan.tanggal} onChange={(e) => setFormPersembahan({ ...formPersembahan, tanggal: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Jenis Persembahan</label>
                    <input type="text" className="admin-input" placeholder="Contoh: Persembahan Minggu Pagi" value={formPersembahan.jenis} onChange={(e) => setFormPersembahan({ ...formPersembahan, jenis: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Jumlah Nominal (Rp)</label>
                    <input type="number" className="admin-input" placeholder="Contoh: 1500000" value={formPersembahan.jumlah} onChange={(e) => setFormPersembahan({ ...formPersembahan, jumlah: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Keterangan</label>
                    <input type="text" className="admin-input" placeholder="Catatan tambahan" value={formPersembahan.keterangan} onChange={(e) => setFormPersembahan({ ...formPersembahan, keterangan: e.target.value })} />
                  </div>
                </>
              )}

              {activeTab === 'perpuluhan' && (
                <>
                  <div className="form-group">
                    <label>Tanggal</label>
                    <input type="date" className="admin-input" value={formPerpuluhan.tanggal} onChange={(e) => setFormPerpuluhan({ ...formPerpuluhan, tanggal: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Nama Jemaat / Persembah</label>
                    <input type="text" className="admin-input" placeholder="Nama jemaat / NN" value={formPerpuluhan.namaJemaat} onChange={(e) => setFormPerpuluhan({ ...formPerpuluhan, namaJemaat: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Perpuluhan Bulan</label>
                    <input type="text" className="admin-input" placeholder="Contoh: Juli 2026" value={formPerpuluhan.bulan} onChange={(e) => setFormPerpuluhan({ ...formPerpuluhan, bulan: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Jumlah Nominal (Rp)</label>
                    <input type="number" className="admin-input" placeholder="Nominal perpuluhan" value={formPerpuluhan.jumlah} onChange={(e) => setFormPerpuluhan({ ...formPerpuluhan, jumlah: e.target.value })} required />
                  </div>
                </>
              )}

              {activeTab === 'asetGereja' && (
                <>
                  <div className="form-group">
                    <label>Kode Aset</label>
                    <input type="text" className="admin-input" placeholder="Contoh: AST-MUS-001" value={formAset.kodeAset} onChange={(e) => setFormAset({ ...formAset, kodeAset: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Nama Aset Inventaris</label>
                    <input type="text" className="admin-input" placeholder="Nama barang / peralatan" value={formAset.namaAset} onChange={(e) => setFormAset({ ...formAset, namaAset: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Jumlah Unit</label>
                    <input type="number" className="admin-input" value={formAset.jumlah} onChange={(e) => setFormAset({ ...formAset, jumlah: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Kondisi Barang</label>
                    <select className="admin-select" value={formAset.kondisi} onChange={(e) => setFormAset({ ...formAset, kondisi: e.target.value })}>
                      <option value="Baik">Baik</option>
                      <option value="Perlu Perbaikan">Perlu Perbaikan</option>
                      <option value="Rusak">Rusak</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Lokasi Penempatan</label>
                    <input type="text" className="admin-input" placeholder="Lokasi penyimpanan" value={formAset.lokasi} onChange={(e) => setFormAset({ ...formAset, lokasi: e.target.value })} required />
                  </div>
                </>
              )}

              {activeTab === 'suratMenyurat' && (
                <>
                  <div className="form-group">
                    <label>Nomor Surat</label>
                    <input type="text" className="admin-input" placeholder="Contoh: 042/GKJ-KBN/VII/2026" value={formSurat.nomorSurat} onChange={(e) => setFormSurat({ ...formSurat, nomorSurat: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Jenis Surat</label>
                    <select className="admin-select" value={formSurat.jenisSurat} onChange={(e) => setFormSurat({ ...formSurat, jenisSurat: e.target.value })}>
                      <option value="Surat Masuk">Surat Masuk</option>
                      <option value="Surat Keluar">Surat Keluar</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Perihal Surat</label>
                    <input type="text" className="admin-input" placeholder="Perihal surat" value={formSurat.perihal} onChange={(e) => setFormSurat({ ...formSurat, perihal: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Tanggal Surat</label>
                    <input type="date" className="admin-input" value={formSurat.tanggal} onChange={(e) => setFormSurat({ ...formSurat, tanggal: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Status Surat</label>
                    <input type="text" className="admin-input" placeholder="Diterima / Terkirim / Diproses" value={formSurat.status} onChange={(e) => setFormSurat({ ...formSurat, status: e.target.value })} required />
                  </div>
                </>
              )}

              <div className="admin-modal-footer">
                <button type="button" className="admin-btn secondary" onClick={() => setShowModal(false)} disabled={submitting}>Batal</button>
                <button type="submit" className="admin-btn" disabled={submitting}>{submitting ? 'Menyimpan...' : 'Simpan Data'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deletingItem && (
        <div className="admin-modal-overlay" onClick={() => setDeletingItem(null)}>
          <div className="admin-modal-panel confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header danger-header">
              <h3>Konfirmasi Hapus</h3>
              <button className="admin-modal-close" onClick={() => setDeletingItem(null)}>&times;</button>
            </div>
            <div className="admin-modal-body">
              <p>Apakah Anda yakin ingin menghapus data ini?</p>
              <div className="admin-modal-footer">
                <button type="button" className="admin-btn secondary" onClick={() => setDeletingItem(null)} disabled={submitting}>Batal</button>
                <button type="button" className="admin-btn danger" onClick={handleDeleteItem} disabled={submitting}>{submitting ? 'Menghapus...' : 'Hapus'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KeuanganAdminPage;
