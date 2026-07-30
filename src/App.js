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

  // If the last part is a number/id (like gallery/:id), use the second to last part
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

  // Track if this is the very first load to avoid re-triggering entering on first render
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    if (isFirstLoad) {
      setIsFirstLoad(false);
      return;
    }
    if (location.pathname !== displayLocation.pathname) {
      setTargetName(getRouteName(location.pathname));
      setTransitionState("entering");

      // Wait for it to cover the screen (1.2s animation)
      const t = setTimeout(() => {
        setDisplayLocation(location);
        setTransitionState("exiting");
      }, 1200);
      return () => clearTimeout(t);
    }
  }, [location, displayLocation.pathname, isFirstLoad]);

  return (
    <>
      <Preloader
        transitionState={transitionState}
        targetName={targetName}
        onInitialDone={() => setTransitionState("initial-exiting")}
        onExitDone={() => setTransitionState("idle")}
      />
      <Routes location={displayLocation}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/tentang" element={<AboutPage />} />
        <Route path="/gereja" element={<GerejaListPage />} />
        <Route path="/majelis" element={<MajelisListPage />} />
        <Route path="/media/youtube" element={<YoutubePage />} />
        <Route path="/media/instagram" element={<InstagramPage />} />
        <Route path="/media/documentation" element={<DocumentationPage />} />
        <Route
          path="/media/documentation/gallery/:id"
          element={<GalleryPage />}
        />
        <Route path="/sejarah" element={<SejarahPage />} />
        <Route path="/statistik" element={<StatistikPage />} />
        <Route path="/pengumuman/events" element={<AgendaPage />} />
        <Route path="/pengumuman/warta-gereja" element={<WartaListPage />} />
        <Route
          path="/admin/warta-gereja/formulir/:id?"
          element={<WartaFormPage />}
        />
        <Route
          path="/pengumuman/warta-gereja/:id"
          element={<WartaReadPage />}
        />
        <Route path="/formulir" element={<FormulirPage />} />
        <Route path="*" element={<LandingPage />} />
        <Route path="/persembahan" element={<PersembahanPage />} />
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
      <div className="App">
        <AppContent />
      </div>
    </BrowserRouter>
  );
}

export default App;
