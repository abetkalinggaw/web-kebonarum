import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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

function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
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
      </div>
    </BrowserRouter>
  );
}

export default App;
