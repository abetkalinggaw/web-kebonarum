import "./LandingPage.css";
import Navbar from "../../components/menu/Navbar";
import EventCarousel from "../../components/landing_page/EventCarousel";
import StatistikSection from "../../components/landing_page/StatistikSection";
import PendetaCarousel from "../../components/landing_page/PendetaCarousel";
import Separator from "../../components/landing_page/Separator";
import KebonarumInfo from "../../components/landing_page/KebonarumInfo";
import VisiMisi from "../../components/landing_page/VisiMisi";
import LandingFooterStack from "../../components/landing_page/LandingFooterStack";
import backgroundVideo from "../../assets/videos/background-video.mp4";
import sugenRawuhBig from "../../assets/sugeng-rawuh-big.svg";
import sugenRawuhSmall from "../../assets/sugeng-rawuh-small.svg";

const LandingPage = () => {
  return (
    <>
      <Navbar />
      <main
        style={{ position: "relative", zIndex: 1, backgroundColor: "#fbfcfb" }}
      >
        <div className="landing-page">
          <video className="video-background" autoPlay muted loop playsInline>
            <source src={backgroundVideo} type="video/mp4" />
            Browser Anda tidak mendukung tag video.
          </video>

          <div className="video-overlay"></div>

          <div className="landing-content">
            <div className="welcome-badge">GKJ KEBONARUM KLATEN</div>
            <picture className="welcome-title">
              <source media="(max-width: 768px)" srcSet={sugenRawuhSmall} />
              <img
                src={sugenRawuhBig}
                alt="Sugeng Rawuh"
                className="welcome-image"
              />
            </picture>
            <div
              className="hero-scroll-indicator"
              onClick={() =>
                window.scrollTo({
                  top: window.innerHeight - 80,
                  behavior: "smooth",
                })
              }
            >
              <span className="scroll-text">Gulir ke bawah</span>
              <div className="scroll-arrow">
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
                  <path d="M12 5v14M19 12l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <Separator />
        <EventCarousel />
        <KebonarumInfo />
        <VisiMisi />
        <PendetaCarousel />
        <StatistikSection />
      </main>
      <LandingFooterStack />
    </>
  );
};

export default LandingPage;
