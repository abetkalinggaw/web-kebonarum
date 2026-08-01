import React, { useContext, useEffect, useState, createContext } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../auth/authContext";
import "./AdminLayout.css";
import "../admin.css";
import logo from "../../assets/logo.png";
import {
  BarChart,
  CalendarDays,
  ExternalLink,
  FileText,
  Gauge,
  IdCard,
  LogOut,
  Menu,
  Newspaper,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  UserCircle,
  Users,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

// Create Toast Context
export const AdminToastContext = createContext({
  showToast: (message, type) => {},
});

const AdminLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem("admin_sidebar_collapsed") === "true";
  });
  const [cmdOpen, setCmdOpen] = useState(false);
  const [cmdQuery, setCmdQuery] = useState("");
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Dashboard GKJ Kebonarum";
    document.body.classList.add("admin-body");
    return () => {
      document.title = prevTitle;
      document.body.classList.remove("admin-body");
    };
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed((prev) => {
      const nextState = !prev;
      localStorage.setItem("admin_sidebar_collapsed", String(nextState));
      return nextState;
    });
  };

  // Global Keyboard listener for Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setCmdOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const showToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const isSuperadmin = user?.role?.toLowerCase() === "superadmin";

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/admin" || path === "/admin/")
      return "Dashboard Control Center";
    if (path.includes("jemaat")) return "Database Digital Jemaat";
    if (path.includes("keuangan-administrasi")) return "Keuangan & Cashflow";
    if (path.includes("agenda")) return "Agenda & Kegiatan";
    if (path.includes("warta")) return "Warta Gereja & Dokumen";
    if (path.includes("statistik")) return "Statistik Live — Auto Sync";
    if (path.includes("users")) return "Kelola User Administrator";
    if (path.includes("register")) return "Tambah Admin Baru";
    return "Admin Panel";
  };

  const navigationItems = [
    {
      section: "Utama",
      items: [{ to: "/admin", end: true, icon: Gauge, label: "Dashboard" }],
    },
    {
      section: "Digitalisasi & Keuangan",
      items: [
        { to: "/admin/jemaat", icon: IdCard, label: "Database Jemaat" },
        {
          to: "/admin/keuangan-administrasi",
          icon: FileText,
          label: "Keuangan & Kas",
        },
      ],
    },
    {
      section: "Konten & Publikasi",
      items: [
        { to: "/admin/agenda", icon: CalendarDays, label: "Agenda & Event" },
        { to: "/admin/warta", icon: Newspaper, label: "Warta Gereja" },
      ],
    },
    {
      section: "Analitik Jemaat",
      items: [
        { to: "/admin/statistik", icon: BarChart, label: "Statistik Live" },
      ],
    },
  ];

  if (isSuperadmin) {
    navigationItems.push({
      section: "Superadmin Access",
      items: [{ to: "/admin/users", icon: Users, label: "Kelola User List" }],
    });
  }

  const allCmdItems = [
    {
      label: "Dashboard Control Center",
      path: "/admin",
      icon: Gauge,
      category: "Navigasi",
    },
    {
      label: "Database Digital Jemaat",
      path: "/admin/jemaat",
      icon: IdCard,
      category: "Navigasi",
    },
    {
      label: "Keuangan & Cashflow Gereja",
      path: "/admin/keuangan-administrasi",
      icon: FileText,
      category: "Navigasi",
    },
    {
      label: "Agenda & Jadwal Kegiatan",
      path: "/admin/agenda",
      icon: CalendarDays,
      category: "Navigasi",
    },
    {
      label: "Publikasi Warta Gereja",
      path: "/admin/warta",
      icon: Newspaper,
      category: "Navigasi",
    },
    {
      label: "Statistik Live & Demografi",
      path: "/admin/statistik",
      icon: BarChart,
      category: "Navigasi",
    },
    {
      label: "Lihat Website Publik GKJ Kebonarum",
      path: "/",
      icon: ExternalLink,
      external: true,
      category: "Aksi Cepat",
    },
  ];

  const filteredCmdItems = allCmdItems.filter((item) =>
    item.label.toLowerCase().includes(cmdQuery.toLowerCase()),
  );

  return (
    <AdminToastContext.Provider value={{ showToast }}>
      <div className="admin-layout">
        {/* Mobile Drawer Backdrop */}
        {sidebarOpen && (
          <div
            className="admin-sidebar-backdrop"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar Navigation */}
        <aside
          className={`admin-sidebar ${sidebarOpen ? "open" : ""} ${sidebarCollapsed ? "collapsed" : ""}`}
        >
          <div className="admin-logo">
            <img src={logo} alt="GKJ Kebonarum Logo" />
            <div className="admin-logo-text">
              <span className="admin-logo-title">GKJ Kebonarum</span>
              <span className="admin-logo-sub">Panel Administrasi</span>
            </div>

            <button
              className="admin-sidebar-close"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close Sidebar"
            >
              <X size={18} />
            </button>
          </div>

          <nav className="admin-nav">
            {navigationItems.map((sec) => (
              <React.Fragment key={sec.section}>
                <span className="admin-nav-section-label">{sec.section}</span>
                {sec.items.map((item) => {
                  const IconComp = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      title={sidebarCollapsed ? item.label : undefined}
                      className={({ isActive }) =>
                        isActive ? "admin-nav-item active" : "admin-nav-item"
                      }
                    >
                      <IconComp size={19} />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </React.Fragment>
            ))}
          </nav>

          <div className="admin-logout">
            <button
              onClick={handleLogout}
              title={sidebarCollapsed ? "Keluar Sistem" : undefined}
            >
              <LogOut size={19} />
              <span>Keluar Sistem</span>
            </button>
          </div>
        </aside>

        {/* Main Content Viewport */}
        <div
          className={`admin-main ${sidebarCollapsed ? "collapsed-sidebar" : ""}`}
        >
          <header className="admin-header">
            <div className="admin-header-left">
              <button
                className="admin-menu-toggle"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="Toggle Sidebar"
              >
                <Menu size={18} />
              </button>
              <button
                className="admin-desktop-toggle-btn"
                onClick={toggleSidebarCollapse}
                style={{
                  background: "transparent",
                  border: "1px solid var(--admin-border-gold)",
                  borderRadius: "8px",
                  padding: "6px 10px",
                  cursor: "pointer",
                  color: "var(--admin-text-secondary)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "0.8rem",
                }}
                title={
                  sidebarCollapsed ? "Perbesar Sidebar" : "Minimalkan Sidebar"
                }
              >
                {sidebarCollapsed ? (
                  <PanelLeftOpen size={18} />
                ) : (
                  <PanelLeftClose size={18} />
                )}
              </button>
              <div>
                <h1>{getPageTitle()}</h1>
                <div className="admin-header-breadcrumb">
                  GKJ Kebonarum &rsaquo; Panel Admin &rsaquo; {getPageTitle()}
                </div>
              </div>
            </div>

            <div
              style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
            >
              {/* Command Palette Trigger */}
              <button
                onClick={() => setCmdOpen(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "var(--admin-surface-2)",
                  border: "1px solid var(--admin-border-gold)",
                  padding: "6px 14px",
                  borderRadius: "100px",
                  color: "var(--admin-text-secondary)",
                  fontSize: "0.82rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "var(--admin-transition)",
                }}
                className="admin-cmd-trigger-btn"
                title="Tekan Cmd + K atau Ctrl + K"
              >
                <Search size={15} style={{ color: "var(--admin-accent)" }} />
                <span className="cmd-text">Cari fitur / menu...</span>
                <span
                  style={{
                    background: "var(--admin-surface-3)",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    fontSize: "0.72rem",
                    fontFamily: "var(--admin-font-mono)",
                    color: "var(--admin-text-muted)",
                  }}
                >
                  ⌘K
                </span>
              </button>

              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "rgba(61, 82, 71, 0.1)",
                  color: "#3D5247",
                  border: "1px solid rgba(61, 82, 71, 0.25)",
                  padding: "6px 12px",
                  borderRadius: "100px",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                <ExternalLink size={14} /> Web Utama
              </a>

              <div className="admin-user-info">
                <UserCircle size={18} />
                <span>{user?.name || user?.username || "Admin"}</span>
                <span style={{ opacity: 0.5 }}>&bull;</span>
                <span
                  style={{
                    color: "var(--admin-accent)",
                    textTransform: "capitalize",
                  }}
                >
                  {user?.role || "User"}
                </span>
              </div>
            </div>
          </header>

          <main className="admin-content">
            <Outlet />
          </main>
        </div>

        {/* Global Toast Container */}
        <div className="admin-toast-container">
          {toasts.map((t) => (
            <div key={t.id} className={`admin-toast ${t.type}`}>
              {t.type === "success" ? (
                <CheckCircle size={18} />
              ) : (
                <AlertCircle size={18} />
              )}
              <span>{t.message}</span>
            </div>
          ))}
        </div>

        {/* Command Palette Modal */}
        {cmdOpen && (
          <div className="admin-cmd-modal" onClick={() => setCmdOpen(false)}>
            <div className="admin-cmd-box" onClick={(e) => e.stopPropagation()}>
              <div className="admin-cmd-header">
                <Search size={18} style={{ color: "var(--admin-accent)" }} />
                <input
                  type="text"
                  className="admin-cmd-input"
                  placeholder="Ketik nama menu, fitur, atau aksi..."
                  autoFocus
                  value={cmdQuery}
                  onChange={(e) => setCmdQuery(e.target.value)}
                />
                <button
                  onClick={() => setCmdOpen(false)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  <X size={18} />
                </button>
              </div>
              <div className="admin-cmd-list">
                {filteredCmdItems.length > 0 ? (
                  filteredCmdItems.map((item) => {
                    const IconComp = item.icon;
                    return (
                      <div
                        key={item.label}
                        className="admin-cmd-item"
                        onClick={() => {
                          setCmdOpen(false);
                          if (item.external) {
                            window.open(item.path, "_blank");
                          } else {
                            navigate(item.path);
                          }
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <IconComp
                            size={18}
                            style={{ color: "var(--admin-accent)" }}
                          />
                          <span>{item.label}</span>
                        </div>
                        <span
                          style={{
                            fontSize: "0.75rem",
                            opacity: 0.6,
                            background: "rgba(255,255,255,0.1)",
                            padding: "2px 8px",
                            borderRadius: "4px",
                          }}
                        >
                          {item.category}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div
                    style={{
                      padding: "20px",
                      textAlign: "center",
                      opacity: 0.6,
                      fontSize: "0.9rem",
                    }}
                  >
                    Tidak ada fitur yang cocok dengan "{cmdQuery}".
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminToastContext.Provider>
  );
};

export default AdminLayout;
