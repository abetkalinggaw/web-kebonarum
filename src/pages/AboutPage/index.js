import { useEffect, useState } from "react";
import "./AboutPage.css";
import Navbar from "../../components/menu/Navbar";
import Footer from "../../components/menu/Footer";
import VisiMisi from "../../components/landing_page/VisiMisi";
import PendetaGKJ from "../../components/about_page/PendetaGKJ";
import MajelisGKJ from "../../components/about_page/MajelisGKJ";
import Separator from "../../components/landing_page/Separator";
import backgroundVideo from "../../assets/videos/background-video.mp4";

const ABOUT_PROFILE_VIDEO_ID = "sYPtPdGbB78";

const AboutPage = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  useEffect(() => {
    if (!isVideoOpen) {
      return;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsVideoOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isVideoOpen]);

  return (
    <>
      <Navbar />
      <main className="about-page">
        <section className="about-hero">
          <video className="about-hero-video" autoPlay muted loop playsInline>
            <source src={backgroundVideo} type="video/mp4" />
            Browser Anda tidak mendukung tag video.
          </video>

          <div className="about-hero-overlay"></div>

          <div className="about-hero-content">
            <span className="section-tag light">PROFIL GEREJA</span>
            <h1 className="about-title">
              Tentang GKJ Kebonarum
            </h1>
            <p className="about-lead">
              GKJ Kebonarum adalah gereja yang melayani jemaat dan masyarakat
              dengan kasih, pengajaran firman, dan pelayanan yang berdampak.
            </p>
            <div className="custom-button-container">
              <button
                className="minimal-glass-btn"
                onClick={() => setIsVideoOpen(true)}
                type="button"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                Video Profil GKJ Kebonarum
              </button>
            </div>
          </div>
        </section>
        <Separator />
        <VisiMisi />
        <PendetaGKJ />
        <MajelisGKJ />
      </main>
      {isVideoOpen && (
        <div
          className="about-video-modal-backdrop"
          onClick={() => setIsVideoOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Video profil GKJ Kebonarum"
        >
          <div
            className="about-video-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="about-video-modal-bar">
              <div className="modal-title-group">
                <span className="modal-badge">PROFIL GEREJA</span>
                <h3 className="modal-title">Video Profil GKJ Kebonarum</h3>
              </div>
              <button
                className="about-video-modal-close"
                onClick={() => setIsVideoOpen(false)}
                aria-label="Tutup video"
                type="button"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="about-video-modal-frame">
              <iframe
                src={`https://www.youtube.com/embed/${ABOUT_PROFILE_VIDEO_ID}?autoplay=1&rel=0`}
                title="Video profil GKJ Kebonarum"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default AboutPage;
