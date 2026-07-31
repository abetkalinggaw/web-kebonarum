import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiCall } from '../../adminApi';
import './StatistikAdminPage.css';

const formatRupiah = (val) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(val) || 0);

const StatistikPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastRefreshed, setLastRefreshed] = useState(null);

  const loadStats = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await apiCall('/statistik');
      setData(result);
      setLastRefreshed(new Date());
    } catch (err) {
      console.error('Failed fetching live stats:', err);
      setError(err.message || 'Gagal memuat statistik live.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="statistik-admin-page">
        <div className="stats-loading">
          <i className="fas fa-sync-alt fa-spin"></i>
          <span>Menghitung statistik otomatis dari seluruh database...</span>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="statistik-admin-page">
        <div className="admin-alert error">
          <i className="fas fa-exclamation-circle"></i> {error || 'Data statistik tidak tersedia.'}
        </div>
        <button className="admin-btn secondary" onClick={loadStats} style={{ marginTop: '1rem' }}>
          <i className="fas fa-sync-alt"></i> Coba Lagi
        </button>
      </div>
    );
  }

  const { metrics = [], demographics = [], growth = [], summary = {} } = data;

  return (
    <div className="statistik-admin-page">
      {/* Header */}
      <div className="stats-header">
        <div className="header-title-group">
          <h2>Statistik Jemaat — Live & Auto-Sync</h2>
          <p>
            Semua data dihitung otomatis dari database jemaat, majelis, pendeta, keuangan, agenda, dan warta.{' '}
            <span className="auto-sync-badge">
              <i className="fas fa-circle-notch"></i> Auto-Sync
            </span>
          </p>
        </div>
        <div className="stats-header-actions">
          <button className="admin-btn secondary refresh-btn" onClick={loadStats}>
            <i className="fas fa-sync-alt"></i> Refresh Data
          </button>
          {lastRefreshed && (
            <span className="last-refreshed">
              Diperbarui: {lastRefreshed.toLocaleTimeString('id-ID')}
            </span>
          )}
        </div>
      </div>

      {/* Auto-sync notice */}
      <div className="sync-notice-card">
        <i className="fas fa-info-circle notice-icon"></i>
        <div>
          <strong>Statistik Otomatis</strong> — Data di halaman ini dan website publik dihitung langsung dari{' '}
          <Link to="/admin/jemaat">Database Jemaat</Link> dan{' '}
          <Link to="/admin/keuangan-administrasi">Keuangan & Aset</Link>.
          Tidak perlu input manual — cukup perbarui datanya, statistik ikut berubah otomatis.
        </div>
      </div>

      {/* Core Metrics */}
      <div className="stats-section-label">
        <i className="fas fa-chart-bar"></i> Metrik Utama Jemaat
      </div>
      <div className="stats-metrics-grid">
        {metrics.map((m) => (
          <div key={m.id} className="stat-live-card">
            <div className="stat-icon-wrap">
              <i className={m.icon}></i>
            </div>
            <div className="stat-live-info">
              <div className="stat-live-value">{m.value}</div>
              <div className="stat-live-label">{m.label}</div>
              {m.trend && m.trend !== '0' && (
                <div className="stat-live-trend">
                  <i className="fas fa-arrow-up"></i> {m.trend} tahun ini
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Extended Summary */}
      {summary && (
        <>
          <div className="stats-section-label">
            <i className="fas fa-database"></i> Ringkasan Seluruh Database
          </div>
          <div className="extended-summary-grid">
            <SummaryItem icon="fas fa-id-card" label="Total Jemaat Terdaftar" value={summary.totalJemaat} to="/admin/jemaat" color="gold" />
            <SummaryItem icon="fas fa-home" label="Kepala Keluarga (KK)" value={summary.totalKK} to="/admin/jemaat" color="gold" />
            <SummaryItem icon="fas fa-users" label="Majelis Aktif" value={summary.totalMajelis} to="/admin/jemaat" color="emerald" />
            <SummaryItem icon="fas fa-user-tie" label="Pendeta Jemaat" value={summary.totalPendeta} to="/admin/jemaat" color="emerald" />
            <SummaryItem icon="fas fa-map-marker-alt" label="Wilayah / Sektor" value={summary.totalWilayah} to="/admin/jemaat" color="amber" />
            <SummaryItem icon="fas fa-calendar-alt" label="Agenda Kegiatan" value={summary.totalAgenda} to="/admin/agenda" color="amber" />
            <SummaryItem icon="fas fa-newspaper" label="Warta Gereja" value={summary.totalWarta} to="/admin/warta" color="soga" />
            <SummaryItem icon="fas fa-boxes" label="Inventaris Aset" value={summary.totalAset} to="/admin/keuangan-administrasi" color="soga" />
            <SummaryItem icon="fas fa-hand-holding-usd" label="Total Persembahan" value={formatRupiah(summary.totalPersembahan)} to="/admin/keuangan-administrasi" color="green" isText />
            <SummaryItem icon="fas fa-coins" label="Total Perpuluhan" value={formatRupiah(summary.totalPerpuluhan)} to="/admin/keuangan-administrasi" color="green" isText />
            <SummaryItem icon="fas fa-envelope-open-text" label="Arsip Surat Menyurat" value={summary.totalSuratMenyurat} to="/admin/keuangan-administrasi" color="blue" />
          </div>
        </>
      )}

      {/* Demographics */}
      <div className="stats-section-label">
        <i className="fas fa-users"></i> Demografi Usia Jemaat (Berdasarkan Komisi)
      </div>
      <div className="demo-chart-card">
        {demographics.map((item) => (
          <div key={item.id} className="demo-bar-item">
            <div className="demo-bar-meta">
              <span className="demo-bar-label">{item.label}</span>
              <span className="demo-bar-pct" style={{ color: item.color }}>{item.value}%</span>
            </div>
            <div className="demo-bar-track">
              <div
                className="demo-bar-fill"
                style={{ width: `${item.value}%`, background: item.color }}
              />
            </div>
          </div>
        ))}
        <p className="demo-note">
          <i className="fas fa-info-circle"></i> Persentase dihitung otomatis dari kolom Komisi di Database Jemaat.
        </p>
      </div>

      {/* Growth Chart */}
      <div className="stats-section-label">
        <i className="fas fa-chart-line"></i> Tren Pertumbuhan (Proxy Warta per Tahun)
      </div>
      <div className="growth-chart-card">
        <div className="growth-bars">
          {growth.map((g, idx) => {
            const isLast = idx === growth.length - 1;
            return (
              <div key={g.year} className="growth-bar-wrap">
                <div className="growth-pct-label">{g.percentage}%</div>
                <div
                  className="growth-bar"
                  style={{
                    height: `${g.percentage}%`,
                    background: isLast
                      ? 'linear-gradient(180deg, #c4884a, #a26c34)'
                      : 'linear-gradient(180deg, #d9c5ad, #b8a48a)',
                    boxShadow: isLast ? '0 6px 20px rgba(196, 136, 74, 0.4)' : 'none',
                  }}
                />
                <div className="growth-year" style={{ color: isLast ? '#c4884a' : undefined, fontWeight: isLast ? 700 : undefined }}>
                  {g.year}
                </div>
              </div>
            );
          })}
        </div>
        <p className="demo-note">
          <i className="fas fa-info-circle"></i> Grafik pertumbuhan berdasarkan jumlah Warta Gereja yang dipublikasikan per tahun.
        </p>
      </div>
    </div>
  );
};

const SummaryItem = ({ icon, label, value, to, color, isText }) => (
  <Link to={to} className={`summary-item summary-item-${color}`} style={{ textDecoration: 'none' }}>
    <i className={`${icon} summary-item-icon`}></i>
    <div className="summary-item-info">
      <div className={`summary-item-value ${isText ? 'summary-text-val' : ''}`}>{isText ? value : (value || 0)}</div>
      <div className="summary-item-label">{label}</div>
    </div>
    <i className="fas fa-arrow-right summary-arrow"></i>
  </Link>
);

export default StatistikPage;
