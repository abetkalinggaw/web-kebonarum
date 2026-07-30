import { useEffect, useState } from "react";
import "./AboutPage.css";
import Navbar from "../components/menu/Navbar";
import Footer from "../components/menu/Footer";
import VisiMisi from "../components/landing_page/VisiMisi";
import PendetaGKJ from "../components/about_page/PendetaGKJ";
import MajelisGKJ from "../components/about_page/MajelisGKJ";
import Separator from "../components/landing_page/Separator";
import backgroundVideo from "../assets/videos/background-video.mp4";

const ABOUT_PROFILE_VIDEO_ID = "sYPtPdGbB78";

const AboutPage = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  useEffect(() => {
    if (!isVideoOpen) {
      return undefined;
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
            Your browser does not support the video tag.
          </video>

          <div className="about-hero-overlay"></div>

          <div className="about-hero-content">
            <p className="about-kicker">GKJ Kebonarum Klaten</p>
            <h1 className="about-title">
              Tentang
              <br />
              GKJ Kebonarum
            </h1>
            <p className="about-lead">
              GKJ Kebonarum adalah gereja yang melayani jemaat dan masyarakat
              dengan kasih, pengajaran firman, dan pelayanan yang berdampak.
            </p>
            <div className="custom-button-container">
              <button
                className="custom-button"
                onClick={() => setIsVideoOpen(true)}
                type="button"
              >
                VIDEO PROFIL GKJ KEBONARUM
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
            <button
              className="about-video-modal-close"
              onClick={() => setIsVideoOpen(false)}
              aria-label="Tutup video"
              type="button"
            >
              ×
            </button>
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
