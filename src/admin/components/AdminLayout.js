import React, { useContext, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../auth/authContext';
import './AdminLayout.css';
import '../admin.css';
import logo from '../../assets/logo.png';

const AdminLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.body.classList.add('admin-body');
    return () => document.body.classList.remove('admin-body');
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const isSuperadmin = user?.role?.toLowerCase() === 'superadmin';

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/admin' || path === '/admin/') return 'Dashboard';
    if (path.includes('jemaat')) return 'Database Digital Jemaat';
    if (path.includes('keuangan-administrasi')) return 'Keuangan & Administrasi Gereja';
    if (path.includes('agenda')) return 'Agenda';
    if (path.includes('warta')) return 'Warta Gereja';
    if (path.includes('statistik')) return 'Statistik Live — Auto-Sync';
    if (path.includes('users')) return 'Kelola User (User List)';
    if (path.includes('register')) return 'Tambah Admin';
    return 'Admin Panel';
  };

  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        <div className="admin-logo">
          <img src={logo} alt="GKJ Kebonarum" />
          <div className="admin-logo-text">
            <span className="admin-logo-title">GKJ Kebonarum</span>
            <span className="admin-logo-sub">Admin Panel</span>
          </div>
        </div>

        <nav className="admin-nav">
          <span className="admin-nav-section-label">Utama</span>
          <NavLink to="/admin" end className={({ isActive }) => isActive ? 'admin-nav-item active' : 'admin-nav-item'}>
            <i className="fas fa-tachometer-alt"></i> Dashboard
          </NavLink>

          <span className="admin-nav-section-label">Digitalisasi Gereja</span>
          <NavLink to="/admin/jemaat" className={({ isActive }) => isActive ? 'admin-nav-item active' : 'admin-nav-item'}>
            <i className="fas fa-id-card"></i> Database Jemaat
          </NavLink>
          <NavLink to="/admin/keuangan-administrasi" className={({ isActive }) => isActive ? 'admin-nav-item active' : 'admin-nav-item'}>
            <i className="fas fa-file-invoice-dollar"></i> Keuangan & Aset
          </NavLink>

          <span className="admin-nav-section-label">Konten</span>
          <NavLink to="/admin/agenda" className={({ isActive }) => isActive ? 'admin-nav-item active' : 'admin-nav-item'}>
            <i className="fas fa-calendar-alt"></i> Agenda
          </NavLink>
          <NavLink to="/admin/warta" className={({ isActive }) => isActive ? 'admin-nav-item active' : 'admin-nav-item'}>
            <i className="fas fa-newspaper"></i> Warta Gereja
          </NavLink>

          <span className="admin-nav-section-label">Data Jemaat</span>
          <NavLink to="/admin/statistik" className={({ isActive }) => isActive ? 'admin-nav-item active' : 'admin-nav-item'}>
            <i className="fas fa-chart-bar"></i> Statistik Live
          </NavLink>

          {isSuperadmin && (
            <>
              <span className="admin-nav-section-label">Superadmin</span>
              <NavLink to="/admin/users" className={({ isActive }) => isActive ? 'admin-nav-item active' : 'admin-nav-item'}>
                <i className="fas fa-users-cog"></i> Kelola User List
              </NavLink>
            </>
          )}
        </nav>

        <div className="admin-logout">
          <button onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i> Keluar
          </button>
        </div>
      </div>

      <div className="admin-main">
        <header className="admin-header">
          <div className="admin-header-left">
            <h1>{getPageTitle()}</h1>
            <div className="admin-header-breadcrumb">GKJ Kebonarum &rsaquo; {getPageTitle()}</div>
          </div>
          <div className="admin-user-info">
            <i className="fas fa-user-circle"></i>
            <span>{user?.name || user?.username || 'Admin'}</span>
            <span style={{ opacity: 0.6 }}>&bull;</span>
            <span style={{ color: 'var(--color-kunyit)', textTransform: 'capitalize' }}>
              {user?.role || 'Users'}
            </span>
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
