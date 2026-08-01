import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SejarahBriefGKJ.css";
import img1 from "../../assets/sejarah/1.jpg";
import img2 from "../../assets/sejarah/2.jpg";
import img3 from "../../assets/sejarah/3.jpg";
import img4 from "../../assets/sejarah/4.jpg";
import img5 from "../../assets/sejarah/5.jpg";

const SEJARAH_PHOTOS = [
  {
    img: img1,
    caption: "Awal Perintisan Injil di Bendogantungan & Klaten (1910-1916)",
  },
  {
    img: img2,
    caption:
      "Dr. Scheurer Hospitaal RS Tegalyoso & Benih Iman di Mayungan (1927)",
  },
  {
    img: img3,
    caption: "Ibadah Pendewasaan GKJ Kebonarum di SD Kristen 2 Gudang (1971)",
  },
  {
    img: img4,
    caption: "Penahbisan Pendeta Pertama Pdt. Christian Sutopo, DPS (1972)",
  },
  {
    img: img5,
    caption:
      "Perjalanan Iman & Syukur HUT ke-55 Kemandirian Gereja (1971-2026)",
  },
];

const SejarahBriefGKJ = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SEJARAH_PHOTOS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="about-sejarah-brief-section">
      {/* Right side background image slides */}
      <div className="about-sejarah-bg-right">
        {SEJARAH_PHOTOS.map((item, idx) => (
          <div
            key={idx}
            className={`sejarah-section-bg-slide ${idx === currentSlide ? "active" : ""}`}
            style={{ backgroundImage: `url(${item.img})` }}
          />
        ))}
        {/* Seamless gradient overlay fading right image into solid green left */}
        <div className="about-sejarah-gradient-overlay" />
      </div>

      <div className="about-sejarah-brief-inner">
        <div className="about-sejarah-2col-layout">
          {/* Left Column: Clean Text Only */}
          <div className="about-sejarah-brief-text">
            <span className="section-tag accent">REKAM JEJAK IMAN</span>
            <h2 className="about-sejarah-brief-title">
              Sejarah Singkat GKJ Kebonarum
            </h2>
            <p className="about-sejarah-brief-lead">
              Perjalanan iman GKJ Kebonarum berakar dari pekabaran Injil awal di
              wilayah Surakarta dan Klaten pada tahun 1910, hingga bertumbuh
              menjadi persekutuan yang mandiri dan diberkati.
            </p>
            <p className="about-sejarah-brief-desc">
              Dari perintisan di Bendogantungan oleh Guru Injil Stefanus Arun
              (1916), momentum pelayanan di RS Tegalyoso (1927), hingga
              peresmian pendewasaan gereja pada 9 Juli 1971 di SD Kristen 2
              Gudang, Tuhan senantiasa memelihara persekutuan jemaat ini
              menapaki masa demi masa.
            </p>

            <div className="about-sejarah-btn-wrap">
              <button
                className="majelis-cta-btn"
                onClick={() => {
                  window.scrollTo(0, 0);
                  navigate("/sejarah");
                }}
                type="button"
              >
                Baca Selengkapnya
              </button>
            </div>

            {/* Minimal Caption & Dots Bar (Aligned Right) */}
            <div className="about-sejarah-caption-bar">
              <div className="sejarah-caption-info">
                <span className="sejarah-caption-tag">
                  ARSIP FOTO BERSEJARAH
                </span>
                <p className="sejarah-caption-text">
                  {SEJARAH_PHOTOS[currentSlide].caption}
                </p>
              </div>

              <div className="sejarah-carousel-dots">
                {SEJARAH_PHOTOS.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`carousel-dot ${idx === currentSlide ? "active" : ""}`}
                    onClick={() => setCurrentSlide(idx)}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SejarahBriefGKJ;
