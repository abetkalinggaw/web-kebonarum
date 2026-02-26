import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AboutPage from "./pages/AboutPage";
import SejarahPage from "./pages/SejarahPage";
import GerejaListPage from "./pages/GerejaListPage";
import MajelisListPage from "./pages/MajelisListPage";
import YoutubePage from "./pages/media/YoutubePage";
import InstagramPage from "./pages/media/InstagramPage";
import DocumentationPage from "./pages/media/DocumentationPage";
import GalleryPage from "./pages/media/GalleryPage";
import WartaGerejaPage from "./pages/pengumuman/WartaGerejaPage";

function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/sejarah" element={<SejarahPage />} />
          <Route path="/gereja" element={<GerejaListPage />} />
          <Route path="/majelis" element={<MajelisListPage />} />
          <Route path="/media/youtube" element={<YoutubePage />} />
          <Route path="/media/instagram" element={<InstagramPage />} />
          <Route path="/media/documentation" element={<DocumentationPage />} />
          <Route
            path="/media/documentation/gallery/:id"
            element={<GalleryPage />}
          />
          <Route
            path="/pengumuman/warta-gereja"
            element={<WartaGerejaPage />}
          />
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
