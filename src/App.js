import "./App.css";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import Preloader from "./components/Preloader";

import LandingPage from "./pages/LandingPage";
import AboutPage from "./pages/AboutPage";
import GerejaListPage from "./pages/GerejaListPage";
import MajelisListPage from "./pages/MajelisListPage";
import YoutubePage from "./pages/media/YoutubePage";
import InstagramPage from "./pages/media/InstagramPage";
import DocumentationPage from "./pages/media/DocumentationPage";
import GalleryPage from "./pages/media/GalleryPage";
import WartaListPage from "./pages/pengumuman/WartaListPage";
import WartaReadPage from "./pages/pengumuman/WartaReadPage";
import FormulirPage from "./pages/FormulirPage";
import SejarahPage from "./pages/SejarahPage";
import PersembahanPage from "./pages/PersembahanPage";
import StatistikPage from "./pages/StatistikPage";
import WartaFormPage from "./admin/warta/WartaFormPage";
import AgendaPage from "./pages/pengumuman/AgendaPage";

// Admin Imports
import { AuthProvider } from './admin/auth/authContext';
import ProtectedRoute from './admin/auth/ProtectedRoute';
import AdminLayout from './admin/components/AdminLayout';
import AdminLoginPage from './admin/pages/LoginPage';
import AdminRegisterPage from './admin/pages/RegisterPage';
import AdminDashboard from './admin/pages/DashboardPage';
import AgendaAdminPage from './admin/pages/AgendaPage';
import WartaAdminPage from './admin/pages/WartaPage';
import StatistikAdminPage from './admin/pages/StatistikPage';
import MajelisAdminPage from './admin/pages/MajelisPage';
import PendetaAdminPage from './admin/pages/PendetaPage';

const routeNameOverrides = {
  tentang: "Tentang",
  youtube: "YouTube",
  instagram: "Instagram",
  documentation: "Dokumentasi",
  gallery: "Galeri",
  events: "Agenda",
  "warta-gereja": "Warta Gereja",
  "diaken-ibadah": "Diaken & Ibadah",
  penatalayanan: "Penatalayanan",
  pwg: "PWG",
};

const getRouteName = (pathname) => {
  if (pathname === "/") return "Beranda";
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return "Beranda";

  let targetPart = parts[parts.length - 1];
  if (!isNaN(targetPart) && parts.length > 1) {
    targetPart = parts[parts.length - 2];
  }

  if (routeNameOverrides[targetPart]) {
    return routeNameOverrides[targetPart];
  }

  let name = targetPart
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
  return name;
};

function AppContent() {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionState, setTransitionState] = useState("initial");
  const [targetName, setTargetName] = useState("");
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const isAdminRoute = location.pathname.startsWith('/admin');
  const isDisplayAdminRoute = displayLocation.pathname.startsWith('/admin');

  useEffect(() => {
    if (isFirstLoad) {
      setIsFirstLoad(false);
      return;
    }
    
    if (location.pathname !== displayLocation.pathname) {
      if (isAdminRoute || isDisplayAdminRoute) {
        setDisplayLocation(location);
        setTransitionState("idle");
        return;
      }

      setTargetName(getRouteName(location.pathname));
      setTransitionState("entering");

      const t = setTimeout(() => {
        setDisplayLocation(location);
        setTransitionState("exiting");
      }, 1200);
      return () => clearTimeout(t);
    }
  }, [location, displayLocation.pathname, isFirstLoad, isAdminRoute, isDisplayAdminRoute]);

  const showPreloader = !isAdminRoute && !isDisplayAdminRoute;

  return (
    <>
      {showPreloader && (
        <Preloader
          transitionState={transitionState}
          targetName={targetName}
          onInitialDone={() => setTransitionState("initial-exiting")}
          onExitDone={() => setTransitionState("idle")}
        />
      )}
      <Routes location={displayLocation}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/tentang" element={<AboutPage />} />
        <Route path="/gereja" element={<GerejaListPage />} />
        <Route path="/majelis" element={<MajelisListPage />} />
        <Route path="/media/youtube" element={<YoutubePage />} />
        <Route path="/media/instagram" element={<InstagramPage />} />
        <Route path="/media/documentation" element={<DocumentationPage />} />
        <Route path="/media/documentation/gallery/:id" element={<GalleryPage />} />
        <Route path="/sejarah" element={<SejarahPage />} />
        <Route path="/statistik" element={<StatistikPage />} />
        <Route path="/pengumuman/events" element={<AgendaPage />} />
        <Route path="/pengumuman/warta-gereja" element={<WartaListPage />} />
        <Route path="/pengumuman/warta-gereja/:id" element={<WartaReadPage />} />
        <Route path="/formulir" element={<FormulirPage />} />
        <Route path="/persembahan" element={<PersembahanPage />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/warta-gereja/formulir/:id?" element={<WartaFormPage />} />
        
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="register" element={<AdminRegisterPage />} />
          <Route path="agenda" element={<AgendaAdminPage />} />
          <Route path="warta" element={<WartaAdminPage />} />
          <Route path="statistik" element={<StatistikAdminPage />} />
          <Route path="majelis" element={<MajelisAdminPage />} />
          <Route path="pendeta" element={<PendetaAdminPage />} />
        </Route>

        <Route path="*" element={<LandingPage />} />
      </Routes>
    </>
  );
}

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: "vertical",
      gestureDirection: "vertical",
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <AuthProvider>
        <div className="App">
          <AppContent />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
