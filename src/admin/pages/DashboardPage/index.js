import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { apiCall } from '../../adminApi';
import { AuthContext } from '../../auth/authContext';
import './DashboardPage.css';
import { ArrowRight, BarChart, Calendar, CalendarCheck, CalendarDays, Clock, Contact, DollarSign, ExternalLink, FileText, Newspaper, PieChart, TrendingUp, UserPlus, Users } from 'lucide-react';

const formatRupiah = (val) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(val) || 0);

const DashboardPage = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    jemaat: 0,
    keuangan: 0,
    agenda: 0,
    warta: 0,
    majelis: 0,
    pendeta: 4,
    totalPersembahan: 0,
  });
  const [liveStatData, setLiveStatData] = useState(null);
  const [recentAgenda, setRecentAgenda] = useState([]);
  const [recentWarta, setRecentWarta] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [agendaData, wartaData, jemaatData, keuanganData, statistikData] = await Promise.all([
          apiCall('/agenda').catch(() => []),
          apiCall('/warta').catch(() => []),
          apiCall('/jemaat').catch(() => []),
          apiCall('/keuangan-administrasi').catch(() => ({})),
          apiCall('/statistik').catch(() => null),
        ]);

        const agendaList = Array.isArray(agendaData) ? agendaData : [];
        const wartaList = Array.isArray(wartaData) ? wartaData : [];
        const jemaatList = Array.isArray(jemaatData) ? jemaatData : [];
        const majelisList = jemaatList.filter(j => (j.peranGereja || '').toLowerCase() === 'majelis');
        const persembahanList = Array.isArray(keuanganData?.persembahan) ? keuanganData.persembahan : [];

        const totalPersembahanSum = persembahanList.reduce((acc, p) => acc + (Number(p.jumlah) || 0), 0);

        setStats({
          jemaat: jemaatList.length,
          keuangan: persembahanList.length,
          agenda: agendaList.length,
          warta: wartaList.length,
          majelis: majelisList.length,
          pendeta: 4,
          totalPersembahan: totalPersembahanSum,
        });

        if (statistikData) {
          setLiveStatData(statistikData);
        }

        setRecentAgenda(agendaList.slice(0, 4));
        setRecentWarta(wartaList.slice(0, 4));
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const now = new Date();
  const greeting =
    now.getHours() < 12 ? 'Selamat Pagi' :
    now.getHours() < 17 ? 'Selamat Siang' : 'Selamat Malam';

  const formattedDate = now.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const statItems = [
    {
      icon: Contact,
      label: 'Database Jemaat',
      value: stats.jemaat,
      to: '/admin/jemaat',
      desc: 'Digitalisasi data jemaat terdaftar',
      badgeClass: 'badge-gold',
    },
    {
      icon: DollarSign,
      label: 'Keuangan & Aset',
      value: stats.keuangan > 0 ? formatRupiah(stats.totalPersembahan) : '0 Record',
      to: '/admin/keuangan-administrasi',
      desc: 'Pencatatan persembahan & perpuluhan',
      badgeClass: 'badge-emerald',
      isText: stats.keuangan > 0,
    },
    {
      icon: Calendar,
      label: 'Agenda Kegiatan',
      value: stats.agenda,
      to: '/admin/agenda',
      desc: 'Kegiatan jemaat mendatang',
      badgeClass: 'badge-amber',
    },
    {
      icon: FileText,
      label: 'Warta Gereja',
      value: stats.warta,
      to: '/admin/warta',
      desc: 'Dokumen warta & pengumuman',
      badgeClass: 'badge-soga',
    },
  ];

  const quickActions = [
    { icon: UserPlus, label: 'Input Data Jemaat', desc: 'Tambah jemaat ke database', to: '/admin/jemaat' },
    { icon: DollarSign, label: 'Catat Persembahan', desc: 'Input persembahan & perpuluhan', to: '/admin/keuangan-administrasi' },
    { icon: Calendar, label: 'Tambah Agenda', desc: 'Jadwalkan kegiatan baru', to: '/admin/agenda' },
    { icon: FileText, label: 'Upload Warta', desc: 'Publikasi warta mingguan', to: '/admin/warta' },
    { icon: Users, label: 'Kelola Majelis & Jemaat', desc: 'Atur data penatua, diaken & jemaat', to: '/admin/jemaat' },
    { icon: TrendingUp, label: 'Statistik Live (Auto-Sync)', desc: 'Metrik & demografi otomatis', to: '/admin/statistik' },
  ];

  return (
    <div className="admin-dashboard">
      {/* Welcome Banner */}
      <div className="admin-dashboard-hero">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="live-dot"></span> System Online &bull; GKJ Kebonarum Admin
          </div>
          <h2>{greeting}, {user?.username || 'Admin'}! 👋</h2>
          <p>
            Selamat datang di Dashboard Admin GKJ Kebonarum. Platform terintegrasi untuk pengelolaan
            database jemaat, keuangan, agenda kegiatan, warta gereja, dan statistik live.
          </p>
          <div className="hero-actions">
            <a href="/" target="_blank" rel="noopener noreferrer" className="hero-btn-primary">
              <ExternalLink size={18}  /> Lihat Website Publik
            </a>
            <Link to="/admin/statistik" className="hero-btn-secondary" style={{ textDecoration: 'none', color: '#fff', background: 'rgba(255,255,255,0.15)', padding: '0.6rem 1.1rem', borderRadius: '50px', fontSize: '0.88rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <BarChart size={18}  /> Lihat Statistik Live
            </Link>
            <span className="hero-date"><Calendar size={18}  /> {formattedDate}</span>
          </div>
        </div>
      </div>

      {/* Metrics Stats Grid */}
      <div className="admin-section-title-group">
        <h3>Ringkasan Data System</h3>
        <p>Metrik utama konten dan struktur organisasi GKJ Kebonarum</p>
      </div>

      <div className="admin-stats-grid">
        {statItems.map((item) => {
          const IconComp = item.icon;
          return (
            <Link to={item.to} key={item.label} className="admin-stat-card" style={{ textDecoration: 'none' }}>
              <div className="stat-card-header">
                <div className={`admin-stat-icon ${item.badgeClass}`}>
                  <IconComp size={22} />
                </div>
                <span className="stat-arrow"><ArrowRight size={18} /></span>
              </div>
              <div className="admin-stat-info">
                <div className={`admin-stat-value ${item.isText ? 'stat-value-text' : ''}`}>
                  {loading ? <span className="stat-spinner"></span> : item.value}
                </div>
                <div className="admin-stat-label">{item.label}</div>
                <div className="admin-stat-desc">{item.desc}</div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Live Statistik Preview Card */}
      {liveStatData && liveStatData.demographics && (
        <div className="dashboard-live-stats-card" style={{ background: '#ffffff', border: '1px solid rgba(196, 136, 74, 0.22)', borderRadius: '20px', padding: '1.5rem', marginTop: '1rem', boxShadow: '0 4px 14px rgba(28, 22, 18, 0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.1rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading, "Clash Display", sans-serif)', fontSize: '1.25rem', fontWeight: 600, color: '#1c1612', margin: 0 }}>
                <PieChart size={18} style={{ color: '#c4884a', marginRight: '0.5rem' }} /> Pratinjau Demografi Jemaat (Live)
              </h3>
              <p style={{ fontFamily: 'var(--font-body, sans-serif)', fontSize: '0.85rem', color: '#8a7a6a', margin: '0.2rem 0 0' }}>
                Perhitungan persentase komisi jemaat langsung dari Database Jemaat
              </p>
            </div>
            <Link to="/admin/statistik" style={{ color: '#c4884a', fontWeight: 600, fontSize: '0.88rem', textDecoration: 'none' }}>
              Detail Statistik Live &rarr;
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {liveStatData.demographics.map((demo) => (
              <div key={demo.id} style={{ background: '#f7f2ec', borderRadius: '12px', padding: '0.85rem 1.1rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, color: '#1c1612' }}>
                  <span>{demo.label}</span>
                  <span style={{ color: demo.color, fontFamily: 'monospace', fontWeight: 700 }}>{demo.value}%</span>
                </div>
                <div style={{ height: '6px', borderRadius: '50px', background: 'rgba(28, 22, 18, 0.08)', overflow: 'hidden' }}>
                  <div style={{ width: `${demo.value}%`, height: '100%', background: demo.color, borderRadius: '50px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity Grid */}
      <div className="dashboard-two-col">
        {/* Recent Agenda */}
        <div className="dashboard-card-panel">
          <div className="panel-header">
            <div>
              <h3><CalendarDays size={18} className="header-icon" /> Agenda Mendatang</h3>
              <p className="panel-sub">Daftar kegiatan gereja yang telah dijadwalkan</p>
            </div>
            <Link to="/admin/agenda" className="panel-link">Lihat Semua &rarr;</Link>
          </div>
          <div className="panel-body">
            {loading ? (
              <p className="panel-empty">Memuat data agenda...</p>
            ) : recentAgenda.length > 0 ? (
              <ul className="activity-list">
                {recentAgenda.map((item) => (
                  <li key={item.id} className="activity-item">
                    <div className="activity-icon-wrap">
                      <CalendarCheck size={18} />
                    </div>
                    <div className="activity-info">
                      <span className="activity-title">{item.title}</span>
                      <span className="activity-meta">
                        <Clock size={18} /> {item.date || item.waktu || 'Terjadwal'} &bull; {item.location || 'GKJ Kebonarum'}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="panel-empty">Belum ada agenda kegiatan yang ditambahkan.</p>
            )}
          </div>
        </div>

        {/* Recent Warta */}
        <div className="dashboard-card-panel">
          <div className="panel-header">
            <div>
              <h3><Newspaper size={18} className="header-icon" /> Warta Gereja Terbaru</h3>
              <p className="panel-sub">Publikasi warta mingguan terbaru</p>
            </div>
            <Link to="/admin/warta" className="panel-link">Lihat Semua &rarr;</Link>
          </div>
          <div className="panel-body">
            {loading ? (
              <p className="panel-empty">Memuat data warta...</p>
            ) : recentWarta.length > 0 ? (
              <ul className="activity-list">
                {recentWarta.map((item) => (
                  <li key={item.id} className="activity-item">
                    <div className="activity-icon-wrap warta-theme">
                      <FileText size={18} />
                    </div>
                    <div className="activity-info">
                      <span className="activity-title">{item.title}</span>
                      <span className="activity-meta">
                        <CalendarDays size={18} /> {item.tanggal || item.date || 'Warta Minggu'}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="panel-empty">Belum ada dokumen warta gereja yang dipublikasikan.</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="admin-quick-actions">
        <div className="admin-section-title-group">
          <h3>Pintas Pengelolaan (Quick Actions)</h3>
          <p>Navigasi cepat untuk memperbarui data dan mengelola platform</p>
        </div>
        <div className="admin-quick-grid">
          {quickActions.map((action) => {
            const ActionIcon = action.icon;
            return (
              <Link to={action.to} key={action.label} className="admin-quick-item">
                <div className="quick-item-top">
                  <div className="quick-icon-badge">
                    <ActionIcon size={20} />
                  </div>
                  <ExternalLink size={18} className="quick-arrow" />
                </div>
                <span className="quick-title">{action.label}</span>
                <span className="quick-desc">{action.desc}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
