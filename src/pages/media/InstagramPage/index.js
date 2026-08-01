import "./InstagramPage.css";
import Navbar from "../../../components/menu/Navbar";
import Footer from "../../../components/menu/Footer";
import { useEffect } from "react";

const INSTAGRAM_ACCOUNT_URL = "https://www.instagram.com/gkj_kebonarum/";

const InstagramPage = () => {
  useEffect(() => {
    // Load Elfsight script
    const script = document.createElement("script");
    script.src = "https://elfsightcdn.com/platform.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <>
      <Navbar />
      <main className="instagram-page">
        <section className="instagram-hero">
          <div className="instagram-hero-content">
            <h1 className="instagram-title">Instagram GKJ Kebonarum</h1>
            <p className="instagram-lead">
              Ikuti update terbaru pelayanan, kegiatan jemaat, dan momen
              kebersamaan melalui feed Instagram GKJ Kebonarum.
            </p>
            <a
              className="instagram-account-link"
              href={INSTAGRAM_ACCOUNT_URL}
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>
          </div>
        </section>

        <section className="instagram-section">
          <div className="instagram-section-inner">
            <div
              className="instagram-blockquote-container"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <div
                className="elfsight-app-ab7d7f90-c03e-4fb3-b283-25594f2c6ffb"
                data-elfsight-app-lazy
              ></div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default InstagramPage;
