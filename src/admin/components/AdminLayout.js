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

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/admin' || path === '/admin/') return 'Dashboard';
    if (path.includes('agenda')) return 'Agenda';
    if (path.includes('warta')) return 'Warta Gereja';
    if (path.includes('statistik')) return 'Statistik';
    if (path.includes('majelis')) return 'Majelis';
    if (path.includes('pendeta')) return 'Pendeta';
    if (path.includes('register')) return 'Buat Akun Admin';
    return 'Admin';
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

          <span className="admin-nav-section-label">Konten</span>
          <NavLink to="/admin/agenda" className={({ isActive }) => isActive ? 'admin-nav-item active' : 'admin-nav-item'}>
            <i className="fas fa-calendar-alt"></i> Agenda
          </NavLink>
          <NavLink to="/admin/warta" className={({ isActive }) => isActive ? 'admin-nav-item active' : 'admin-nav-item'}>
            <i className="fas fa-newspaper"></i> Warta Gereja
          </NavLink>

          <span className="admin-nav-section-label">Data Jemaat</span>
          <NavLink to="/admin/statistik" className={({ isActive }) => isActive ? 'admin-nav-item active' : 'admin-nav-item'}>
            <i className="fas fa-chart-bar"></i> Statistik
          </NavLink>
          <NavLink to="/admin/majelis" className={({ isActive }) => isActive ? 'admin-nav-item active' : 'admin-nav-item'}>
            <i className="fas fa-users"></i> Majelis
          </NavLink>
          <NavLink to="/admin/pendeta" className={({ isActive }) => isActive ? 'admin-nav-item active' : 'admin-nav-item'}>
            <i className="fas fa-user-tie"></i> Pendeta
          </NavLink>

          <span className="admin-nav-section-label">Pengaturan</span>
          <NavLink to="/admin/register" className={({ isActive }) => isActive ? 'admin-nav-item active' : 'admin-nav-item'}>
            <i className="fas fa-user-plus"></i> Tambah Admin
          </NavLink>
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
            {user?.username || 'Admin'}
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
