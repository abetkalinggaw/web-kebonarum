import React, { useState, useEffect, useContext } from 'react';
import { apiCall } from '../../adminApi';
import { AuthContext } from '../../auth/authContext';
import { AdminToastContext } from '../../components/AdminLayout';
import './KeuanganAdminPage.css';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Coins,
  Edit,
  FileSpreadsheet,
  HandCoins,
  Loader,
  MailOpen,
  Package,
  PlusCircle,
  Save,
  Search,
  Trash2,
} from 'lucide-react';

const KeuanganAdminPage = () => {
  const { user } = useContext(AuthContext);
  const { showToast } = useContext(AdminToastContext);
  const [dataStore, setDataStore] = useState({
    persembahan: [],
    perpuluhan: [],
    asetGereja: [],
    suratMenyurat: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');

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
    setFormPersembahan({ tanggal: new Date().toISOString().split('T')[0], jenis: 'Mingguan', jumlah: '', keterangan: '' });
    setFormPerpuluhan({ tanggal: new Date().toISOString().split('T')[0], namaJemaat: '', jumlah: '', bulan: 'Januari' });
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
        const msg = `Data ${activeTab} berhasil diperbarui.`;
        setSuccess(msg);
        showToast(msg, 'success');
      } else {
        await apiCall(`/keuangan-administrasi/${activeTab}`, {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        const msg = `Data ${activeTab} berhasil ditambahkan.`;
        setSuccess(msg);
        showToast(msg, 'success');
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
      const msg = `Data berhasil dihapus.`;
      setSuccess(msg);
      showToast(msg, 'success');
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

  // Export CSV for active tab
  const exportActiveTabCSV = () => {
    const currentList = dataStore[activeTab] || [];
    if (currentList.length === 0) {
      showToast('Tidak ada data untuk diekspor', 'danger');
      return;
    }

    let headers = [];
    let rows = [];

    if (activeTab === 'persembahan') {
      headers = ['ID', 'Tanggal', 'Jenis Persembahan', 'Jumlah (IDR)', 'Keterangan'];
      rows = currentList.map(item => [item.id, `"${item.tanggal || ''}"`, `"${item.jenis || ''}"`, item.jumlah || 0, `"${(item.keterangan || '').replace(/"/g, '""')}"`]);
    } else if (activeTab === 'perpuluhan') {
      headers = ['ID', 'Tanggal', 'Nama Jemaat', 'Jumlah (IDR)', 'Bulan'];
      rows = currentList.map(item => [item.id, `"${item.tanggal || ''}"`, `"${item.namaJemaat || ''}"`, item.jumlah || 0, `"${item.bulan || ''}"`]);
    } else if (activeTab === 'asetGereja') {
      headers = ['ID', 'Kode Aset', 'Nama Aset', 'Jumlah', 'Kondisi', 'Lokasi'];
      rows = currentList.map(item => [item.id, `"${item.kodeAset || ''}"`, `"${item.namaAset || ''}"`, item.jumlah || 1, `"${item.kondisi || ''}"`, `"${item.lokasi || ''}"`]);
    } else if (activeTab === 'suratMenyurat') {
      headers = ['ID', 'Nomor Surat', 'Jenis Surat', 'Perihal', 'Tanggal', 'Status'];
      rows = currentList.map(item => [item.id, `"${item.nomorSurat || ''}"`, `"${item.jenisSurat || ''}"`, `"${(item.perihal || '').replace(/"/g, '""')}"`, `"${item.tanggal || ''}"`, `"${item.status || ''}"`]);
    }

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_${activeTab}_GKJ_Kebonarum_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Berhasil mengekspor data ${activeTab} ke CSV`, 'success');
  };

  const isReadOnly = (user?.role || '').toLowerCase() === 'users';

  // Calculate totals
  const totalPersembahan = dataStore.persembahan.reduce((acc, p) => acc + (Number(p.jumlah) || 0), 0);
  const totalPerpuluhan = dataStore.perpuluhan.reduce((acc, p) => acc + (Number(p.jumlah) || 0), 0);

  // Filtered List based on Search
  const currentList = (dataStore[activeTab] || []).filter(item => {
    if (!search) return true;
    const q = search.toLowerCase();
    return Object.values(item).some(v => String(v).toLowerCase().includes(q));
  });

  return (
    <div className="keuangan-admin-page">
      {/* Header */}
      <div className="keuangan-header">
        <div className="header-title-group">
          <h2>Keuangan & Administrasi Gereja</h2>
          <p>Pencatatan persembahan, perpuluhan jemaat, inventaris aset, dan arsip surat menyurat.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="admin-btn secondary" onClick={exportActiveTabCSV}>
            <FileSpreadsheet size={16} /> Ekspor CSV
          </button>
          {!isReadOnly && (
            <button className="admin-btn" onClick={openAddModal}>
              <PlusCircle size={18} /> Tambah Data {activeTab === 'persembahan' ? 'Persembahan' : activeTab === 'perpuluhan' ? 'Perpuluhan' : activeTab === 'asetGereja' ? 'Aset' : 'Surat'}
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="admin-alert error">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {success && (
        <div className="admin-alert success">
          <CheckCircle size={18} /> {success}
        </div>
      )}

      {/* Summary KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        <div className="admin-card" style={{ background: '#ffffff', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(34, 197, 94, 0.12)', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <HandCoins size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)', fontFamily: 'var(--admin-font-mono)' }}>TOTAL PERSEMBAHAN</span>
            <div style={{ fontSize: '1.35rem', fontWeight: 700, fontFamily: 'var(--admin-font-heading)', color: '#16a34a' }}>{formatRupiah(totalPersembahan)}</div>
          </div>
        </div>

        <div className="admin-card" style={{ background: '#ffffff', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(196, 136, 74, 0.14)', color: 'var(--admin-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Coins size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)', fontFamily: 'var(--admin-font-mono)' }}>TOTAL PERPULUHAN</span>
            <div style={{ fontSize: '1.35rem', fontWeight: 700, fontFamily: 'var(--admin-font-heading)', color: 'var(--admin-accent)' }}>{formatRupiah(totalPerpuluhan)}</div>
          </div>
        </div>

        <div className="admin-card" style={{ background: '#ffffff', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.12)', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Package size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)', fontFamily: 'var(--admin-font-mono)' }}>TOTAL INVENTARIS ASET</span>
            <div style={{ fontSize: '1.35rem', fontWeight: 700, fontFamily: 'var(--admin-font-heading)', color: 'var(--admin-text-primary)' }}>{dataStore.asetGereja.length} Item</div>
          </div>
        </div>

        <div className="admin-card" style={{ background: '#ffffff', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(139, 69, 19, 0.12)', color: '#8b4513', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MailOpen size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)', fontFamily: 'var(--admin-font-mono)' }}>SURAT MENYURAT</span>
            <div style={{ fontSize: '1.35rem', fontWeight: 700, fontFamily: 'var(--admin-font-heading)', color: 'var(--admin-text-primary)' }}>{dataStore.suratMenyurat.length} Surat</div>
          </div>
        </div>
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
              placeholder={`Cari pencatatan ${activeTab}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button type="submit" className="admin-btn search-btn">
            <Search size={16} /> Cari
          </button>
        </form>

        {/* Row 2: Module Filters & Tabs */}
        <div className="admin-filter-row-2">
          <div className="module-tabs">
            <button
              className={`module-tab-btn ${activeTab === 'persembahan' ? 'active' : ''}`}
              onClick={() => setActiveTab('persembahan')}
            >
              <HandCoins size={16} /> Persembahan ({dataStore.persembahan.length})
            </button>
            <button
              className={`module-tab-btn ${activeTab === 'perpuluhan' ? 'active' : ''}`}
              onClick={() => setActiveTab('perpuluhan')}
            >
              <Coins size={16} /> Perpuluhan ({dataStore.perpuluhan.length})
            </button>
            <button
              className={`module-tab-btn ${activeTab === 'asetGereja' ? 'active' : ''}`}
              onClick={() => setActiveTab('asetGereja')}
            >
              <Package size={16} /> Aset Gereja ({dataStore.asetGereja.length})
            </button>
            <button
              className={`module-tab-btn ${activeTab === 'suratMenyurat' ? 'active' : ''}`}
              onClick={() => setActiveTab('suratMenyurat')}
            >
              <MailOpen size={16} /> Surat Menyurat ({dataStore.suratMenyurat.length})
            </button>
          </div>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="keuangan-table-card">
        {loading ? (
          <div className="table-loading">
            <Loader size={20} className="fa-spin" style={{ color: 'var(--admin-accent)', marginRight: '8px' }} />
            Memuat data {activeTab}...
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-data-table">
              {/* Table Header per Active Tab */}
              {activeTab === 'persembahan' && (
                <thead>
                  <tr>
                    <th>Tanggal</th>
                    <th>Jenis Persembahan</th>
                    <th>Jumlah (Nominal)</th>
                    <th>Keterangan / Ibadah</th>
                    {!isReadOnly && <th style={{ textAlign: 'right' }}>Aksi</th>}
                  </tr>
                </thead>
              )}
              {activeTab === 'perpuluhan' && (
                <thead>
                  <tr>
                    <th>Tanggal</th>
                    <th>Nama Jemaat</th>
                    <th>Bulan Perpuluhan</th>
                    <th>Jumlah (Nominal)</th>
                    {!isReadOnly && <th style={{ textAlign: 'right' }}>Aksi</th>}
                  </tr>
                </thead>
              )}
              {activeTab === 'asetGereja' && (
                <thead>
                  <tr>
                    <th>Kode Aset</th>
                    <th>Nama Barang / Aset</th>
                    <th>Jumlah</th>
                    <th>Kondisi</th>
                    <th>Lokasi Penyimpanan</th>
                    {!isReadOnly && <th style={{ textAlign: 'right' }}>Aksi</th>}
                  </tr>
                </thead>
              )}
              {activeTab === 'suratMenyurat' && (
                <thead>
                  <tr>
                    <th>No. Surat</th>
                    <th>Jenis</th>
                    <th>Perihal</th>
                    <th>Tanggal</th>
                    <th>Status</th>
                    {!isReadOnly && <th style={{ textAlign: 'right' }}>Aksi</th>}
                  </tr>
                </thead>
              )}

              {/* Table Body */}
              <tbody>
                {currentList.length > 0 ? (
                  currentList.map((item) => (
                    <tr key={item.id}>
                      {activeTab === 'persembahan' && (
                        <>
                          <td className="mono-date">{item.tanggal || '-'}</td>
                          <td className="bold-title">{item.jenis}</td>
                          <td className="rupiah-val">{formatRupiah(item.jumlah)}</td>
                          <td>{item.keterangan || '-'}</td>
                        </>
                      )}
                      {activeTab === 'perpuluhan' && (
                        <>
                          <td className="mono-date">{item.tanggal || '-'}</td>
                          <td className="bold-title">{item.namaJemaat}</td>
                          <td><span className="bulan-badge">{item.bulan}</span></td>
                          <td className="rupiah-val">{formatRupiah(item.jumlah)}</td>
                        </>
                      )}
                      {activeTab === 'asetGereja' && (
                        <>
                          <td><span className="kode-badge">{item.kodeAset || 'AST-01'}</span></td>
                          <td className="bold-title">{item.namaAset}</td>
                          <td>{item.jumlah} Unit</td>
                          <td><span className="kondisi-badge">{item.kondisi}</span></td>
                          <td>{item.lokasi || '-'}</td>
                        </>
                      )}
                      {activeTab === 'suratMenyurat' && (
                        <>
                          <td className="mono-date">{item.nomorSurat}</td>
                          <td>
                            <span className={`surat-type-tag ${item.jenisSurat?.toLowerCase().includes('masuk') ? 'masuk' : 'keluar'}`}>
                              {item.jenisSurat}
                            </span>
                          </td>
                          <td className="bold-title">{item.perihal}</td>
                          <td className="mono-date">{item.tanggal}</td>
                          <td><span className="surat-status">{item.status}</span></td>
                        </>
                      )}

                      {!isReadOnly && (
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}>
                            <button className="admin-btn secondary sm" onClick={() => openEditModal(item)} title="Edit">
                              <Edit size={14} />
                            </button>
                            <button className="admin-btn danger sm" onClick={() => setDeletingItem(item)} title="Hapus">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--admin-text-muted)', fontStyle: 'italic' }}>
                      Belum ada data {activeTab} yang dicatat.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Form Modal */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontFamily: 'var(--admin-font-heading)' }}>
                {editingItem ? 'Edit Data' : 'Tambah Data'} {activeTab === 'persembahan' ? 'Persembahan' : activeTab === 'perpuluhan' ? 'Perpuluhan' : activeTab === 'asetGereja' ? 'Aset' : 'Surat'}
              </h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer' }}>
                &times;
              </button>
            </div>

            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {activeTab === 'persembahan' && (
                <>
                  <div className="admin-input-group">
                    <label className="admin-input-label">Tanggal Persembahan</label>
                    <input type="date" className="admin-input" value={formPersembahan.tanggal} onChange={(e) => setFormPersembahan({ ...formPersembahan, tanggal: e.target.value })} required />
                  </div>
                  <div className="admin-input-group">
                    <label className="admin-input-label">Jenis Persembahan</label>
                    <select className="admin-select" value={formPersembahan.jenis} onChange={(e) => setFormPersembahan({ ...formPersembahan, jenis: e.target.value })}>
                      <option value="Mingguan">Persembahan Mingguan</option>
                      <option value="Perpuluhan">Perpuluhan Jemaat</option>
                      <option value="Pembangunan">Persembahan Pembangunan</option>
                      <option value="Kasih">Persembahan Kasih</option>
                      <option value="Khusus">Persembahan Khusus / Hari Raya</option>
                    </select>
                  </div>
                  <div className="admin-input-group">
                    <label className="admin-input-label">Jumlah Nominal (IDR)</label>
                    <input type="number" className="admin-input" placeholder="100000" value={formPersembahan.jumlah} onChange={(e) => setFormPersembahan({ ...formPersembahan, jumlah: e.target.value })} required />
                  </div>
                  <div className="admin-input-group">
                    <label className="admin-input-label">Keterangan / Ibadah</label>
                    <input type="text" className="admin-input" placeholder="Ibadah Minggu Pagi" value={formPersembahan.keterangan} onChange={(e) => setFormPersembahan({ ...formPersembahan, keterangan: e.target.value })} />
                  </div>
                </>
              )}

              {activeTab === 'perpuluhan' && (
                <>
                  <div className="admin-input-group">
                    <label className="admin-input-label">Tanggal Penyerahan</label>
                    <input type="date" className="admin-input" value={formPerpuluhan.tanggal} onChange={(e) => setFormPerpuluhan({ ...formPerpuluhan, tanggal: e.target.value })} required />
                  </div>
                  <div className="admin-input-group">
                    <label className="admin-input-label">Nama Jemaat</label>
                    <input type="text" className="admin-input" placeholder="Nama Jemaat" value={formPerpuluhan.namaJemaat} onChange={(e) => setFormPerpuluhan({ ...formPerpuluhan, namaJemaat: e.target.value })} required />
                  </div>
                  <div className="admin-input-group">
                    <label className="admin-input-label">Bulan Perpuluhan</label>
                    <input type="text" className="admin-input" placeholder="Januari 2026" value={formPerpuluhan.bulan} onChange={(e) => setFormPerpuluhan({ ...formPerpuluhan, bulan: e.target.value })} required />
                  </div>
                  <div className="admin-input-group">
                    <label className="admin-input-label">Jumlah Nominal (IDR)</label>
                    <input type="number" className="admin-input" placeholder="500000" value={formPerpuluhan.jumlah} onChange={(e) => setFormPerpuluhan({ ...formPerpuluhan, jumlah: e.target.value })} required />
                  </div>
                </>
              )}

              {activeTab === 'asetGereja' && (
                <>
                  <div className="admin-input-group">
                    <label className="admin-input-label">Kode Aset / Inventaris</label>
                    <input type="text" className="admin-input" placeholder="AST-SND-01" value={formAset.kodeAset} onChange={(e) => setFormAset({ ...formAset, kodeAset: e.target.value })} required />
                  </div>
                  <div className="admin-input-group">
                    <label className="admin-input-label">Nama Barang / Aset</label>
                    <input type="text" className="admin-input" placeholder="Mixer Audio Soundcraft" value={formAset.namaAset} onChange={(e) => setFormAset({ ...formAset, namaAset: e.target.value })} required />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="admin-input-group">
                      <label className="admin-input-label">Jumlah (Unit)</label>
                      <input type="number" className="admin-input" value={formAset.jumlah} onChange={(e) => setFormAset({ ...formAset, jumlah: e.target.value })} required />
                    </div>
                    <div className="admin-input-group">
                      <label className="admin-input-label">Kondisi Barang</label>
                      <select className="admin-select" value={formAset.kondisi} onChange={(e) => setFormAset({ ...formAset, kondisi: e.target.value })}>
                        <option value="Baik">Baik / Layak</option>
                        <option value="Perlu Perbaikan">Perlu Perbaikan</option>
                        <option value="Rusak">Rusak</option>
                      </select>
                    </div>
                  </div>
                  <div className="admin-input-group">
                    <label className="admin-input-label">Lokasi Penyimpanan</label>
                    <input type="text" className="admin-input" placeholder="Ruang Sound System Utama" value={formAset.lokasi} onChange={(e) => setFormAset({ ...formAset, lokasi: e.target.value })} />
                  </div>
                </>
              )}

              {activeTab === 'suratMenyurat' && (
                <>
                  <div className="admin-input-group">
                    <label className="admin-input-label">Nomor Surat</label>
                    <input type="text" className="admin-input" placeholder="012/GKJ-KB/III/2026" value={formSurat.nomorSurat} onChange={(e) => setFormSurat({ ...formSurat, nomorSurat: e.target.value })} required />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="admin-input-group">
                      <label className="admin-input-label">Jenis Surat</label>
                      <select className="admin-select" value={formSurat.jenisSurat} onChange={(e) => setFormSurat({ ...formSurat, jenisSurat: e.target.value })}>
                        <option value="Surat Masuk">Surat Masuk</option>
                        <option value="Surat Keluar">Surat Keluar</option>
                      </select>
                    </div>
                    <div className="admin-input-group">
                      <label className="admin-input-label">Tanggal Surat</label>
                      <input type="date" className="admin-input" value={formSurat.tanggal} onChange={(e) => setFormSurat({ ...formSurat, tanggal: e.target.value })} required />
                    </div>
                  </div>
                  <div className="admin-input-group">
                    <label className="admin-input-label">Perihal Surat</label>
                    <input type="text" className="admin-input" placeholder="Permohonan Pelayanan..." value={formSurat.perihal} onChange={(e) => setFormSurat({ ...formSurat, perihal: e.target.value })} required />
                  </div>
                  <div className="admin-input-group">
                    <label className="admin-input-label">Status Disposisi / Keterangan</label>
                    <input type="text" className="admin-input" placeholder="Diterima Sekretariat" value={formSurat.status} onChange={(e) => setFormSurat({ ...formSurat, status: e.target.value })} />
                  </div>
                </>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" className="admin-btn secondary" onClick={() => setShowModal(false)} disabled={submitting}>
                  Batal
                </button>
                <button type="submit" className="admin-btn" disabled={submitting}>
                  {submitting ? <Loader size={18} className="fa-spin" /> : <Save size={18} />} Simpan Data
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
              <AlertTriangle size={20} /> Konfirmasi Hapus Data
            </h3>
            <p style={{ margin: '0 0 1.25rem', fontSize: '0.92rem', color: 'var(--admin-text-secondary)' }}>
              Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button className="admin-btn secondary" onClick={() => setDeletingItem(null)} disabled={submitting}>
                Batal
              </button>
              <button className="admin-btn danger" onClick={handleDeleteItem} disabled={submitting}>
                {submitting ? <Loader size={18} className="fa-spin" /> : <Trash2 size={18} />} Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KeuanganAdminPage;
