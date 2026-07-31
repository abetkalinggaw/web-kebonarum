import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { apiCall } from '../../adminApi';
import { AuthContext } from '../../auth/authContext';
import './DashboardPage.css';

const DashboardPage = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ agenda: 0, warta: 0, majelis: 0, pendeta: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [agenda, warta, majelis, pendeta] = await Promise.all([
          apiCall('/agenda'),
          apiCall('/warta'),
          apiCall('/majelis'),
          apiCall('/pendeta'),
        ]);
        setStats({
          agenda: agenda.length,
          warta: warta.length,
          majelis: majelis.length,
          pendeta: pendeta.length,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const now = new Date();
  const greeting =
    now.getHours() < 12 ? 'Selamat Pagi' :
    now.getHours() < 17 ? 'Selamat Siang' : 'Selamat Malam';

  const statItems = [
    { icon: 'fas fa-calendar-alt', label: 'Agenda', value: stats.agenda, to: '/admin/agenda' },
    { icon: 'fas fa-newspaper',   label: 'Warta Gereja', value: stats.warta,  to: '/admin/warta'   },
    { icon: 'fas fa-users',        label: 'Majelis',  value: stats.majelis, to: '/admin/majelis'  },
    { icon: 'fas fa-user-tie',     label: 'Pendeta',  value: stats.pendeta, to: '/admin/pendeta'  },
  ];

  const quickActions = [
    { icon: 'fas fa-calendar-plus', label: 'Tambah Agenda',     to: '/admin/agenda'    },
    { icon: 'fas fa-file-alt',      label: 'Tambah Warta',      to: '/admin/warta'     },
    { icon: 'fas fa-chart-pie',     label: 'Ubah Statistik',    to: '/admin/statistik' },
    { icon: 'fas fa-users',         label: 'Kelola Majelis',    to: '/admin/majelis'   },
    { icon: 'fas fa-user-tie',      label: 'Kelola Pendeta',    to: '/admin/pendeta'   },
    { icon: 'fas fa-user-plus',     label: 'Tambah Admin',      to: '/admin/register'  },
  ];

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-welcome">
        <h2>{greeting}, {user?.username}! 👋</h2>
        <p>Kelola semua konten dan data website GKJ Kebonarum dari sini.</p>
      </div>

      {/* Stats */}
      <div className="admin-stats-grid">
        {statItems.map((item) => (
          <Link to={item.to} key={item.label} className="admin-stat-card" style={{ textDecoration: 'none' }}>
            <div className="admin-stat-icon">
              <i className={item.icon}></i>
            </div>
            <div className="admin-stat-info">
              <div className="admin-stat-value">
                {loading ? '—' : item.value}
              </div>
              <div className="admin-stat-label">{item.label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="admin-quick-actions">
        <h3>Akses Cepat</h3>
        <div className="admin-quick-grid">
          {quickActions.map((action) => (
            <Link to={action.to} key={action.label} className="admin-quick-item">
              <i className={action.icon}></i>
              <span>{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
