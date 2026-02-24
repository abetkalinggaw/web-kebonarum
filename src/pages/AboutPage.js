import "./AboutPage.css";
import Navbar from "../components/menu/Navbar";
import Footer from "../components/menu/Footer";
import VisiMisi from "../components/landing_page/VisiMisi";
import PendetaGKJ from "../components/about_page/PendetaGKJ";
import MajelisGKJ from "../components/about_page/MajelisGKJ";
import Separator from "../components/landing_page/Separator";

const AboutPage = () => {
  return (
    <>
      <Navbar />
      <main className="about-page">
        <section className="about-hero">
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
          </div>
        </section>

        <section className="about-video">
          <h2 className="about-video-title">
            Video Profil
            <br />
            GKJ Kebonarum
          </h2>
          <div className="about-video-inner">
            <iframe
              className="about-video-frame"
              src="https://www.youtube.com/embed/mKzJw6wcnoI"
              title="GKJ Kebonarum"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </section>
        <Separator />
        <VisiMisi />
        <PendetaGKJ />
        <MajelisGKJ />
      </main>
      <Footer />
    </>
  );
};

export default AboutPage;
