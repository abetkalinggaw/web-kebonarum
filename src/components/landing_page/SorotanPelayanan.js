import React, { useEffect, useState, useRef } from "react";
import "./SorotanPelayanan.css";
import {
  FileText,
  Users,
  HeartPulse,
  GraduationCap,
  Sparkles,
  MessageSquareHeart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import sejarah1 from "../../assets/sejarah/1.jpg";
import sejarah2 from "../../assets/sejarah/2.jpg";
import sejarah3 from "../../assets/sejarah/3.jpg";
import sejarah4 from "../../assets/sejarah/4.jpg";
import sejarah5 from "../../assets/sejarah/5.jpg";

const pelayananData = [
  {
    id: 1,
    category: "Sekretariat",
    title: "Administrasi Sekretariat",
    description:
      "Pengelolaan data jemaat yang teratur melalui pembagian Klaper Warga Blok I hingga Blok VII.",
    icon: FileText,
    badge: "Klaper Warga",
    tag: "Blok I - VII",
    img: sejarah1,
  },
  {
    id: 2,
    category: "Generasi Muda",
    title: "Pelayanan Anak & Pemuda",
    description:
      "Kegiatan Sekolah Minggu (termasuk lomba Cerdas Cermat Alkitab) serta ibadah pemuda/remaja dengan tim musik modern.",
    icon: Users,
    badge: "Sekolah Minggu & Pemuda",
    tag: "CCA & Musik Modern",
    img: sejarah2,
  },
  {
    id: 3,
    category: "Sosial & Kesehatan",
    title: "Pelayanan Sosial & Kesehatan",
    description:
      "Program pemeriksaan kesehatan dan pengobatan gratis bagi jemaat dan masyarakat sekitar.",
    icon: HeartPulse,
    badge: "Bakti Kesehatan",
    tag: "Pengobatan Gratis",
    img: sejarah3,
  },
  {
    id: 4,
    category: "Pendidikan",
    title: "Pelayanan Pendidikan",
    description:
      "Pengelolaan/pendampingan sekolah Kristen (TK dan SD) di lingkungan kompleks gereja.",
    icon: GraduationCap,
    badge: "Sekolah Kristen",
    tag: "TK & SD Kristen",
    img: sejarah4,
  },
  {
    id: 5,
    category: "Budaya & Kebersamaan",
    title: "Ibadah Budaya & Kebersamaan",
    description:
      "Pelayan firman dan pembawa acara mengenakan pakaian adat Jawa (pakaian tradisional/surjan dan selendang batik).",
    icon: Sparkles,
    badge: "Nuansa Jawa",
    tag: "Surjan & Batik",
    img: sejarah5,
  },
  {
    id: 6,
    category: "Kesaksian Jemaat",
    title: "Kesaksian Jemaat",
    description:
      "Ucapan syukur dan harapan dari berbagai generasi—mulai dari jemaat lansia, dewasa, pemuda, hingga anak-anak.",
    icon: MessageSquareHeart,
    badge: "Lintas Generasi",
    tag: "Syukur & Harapan",
    img: sejarah1,
  },
];

const SorotanPelayanan = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef(null);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % pelayananData.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isHovered]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + pelayananData.length) % pelayananData.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % pelayananData.length);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX.current - touchEndX;
    if (Math.abs(diffX) > 40) {
      if (diffX > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
  };

  const currentItem = pelayananData[activeIndex];
  const IconComponent = currentItem.icon;

  return (
    <section
      className="sorotan-pelayanan"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Left side background image slides */}
      <div className="sorotan-bg-left">
        {pelayananData.map((item, idx) => (
          <div
            key={item.id}
            className={`sorotan-bg-slide ${idx === activeIndex ? "active" : ""}`}
            style={{ backgroundImage: `url(${item.img})` }}
          />
        ))}
        {/* Seamless gradient overlay fading left image into solid white right */}
        <div className="sorotan-gradient-overlay" />
      </div>

      <div className="sorotan-container">
        <div className="sorotan-2col-layout">
          {/* Left Column: Visual Spacer */}
          <div className="sorotan-col-left-spacer" />

          {/* Right Column: Title and Content */}
          <div className="sorotan-col-right-content">
            <div className="sorotan-header-text">
              <span className="section-tag accent">SOROTAN PELAYANAN</span>
              <h2 className="section-title-minimal">
                Gereja yang Berdampak & Melayani
              </h2>
            </div>

            <div className="sorotan-card-active">
              <div className="sorotan-card-top">
                <div className="sorotan-icon-box">
                  <IconComponent size={24} />
                </div>
                <div className="sorotan-meta-tags">
                  <span className="sorotan-cat-badge">{currentItem.category}</span>
                  <span className="sorotan-tag-badge">{currentItem.tag}</span>
                </div>
              </div>

              <h3 className="sorotan-active-title">{currentItem.title}</h3>
              <p className="sorotan-active-desc">{currentItem.description}</p>

              <div className="sorotan-footer-bar">
                <span className="sorotan-badge-pill">{currentItem.badge}</span>
              </div>
            </div>

            {/* Navigation & Indicators */}
            <div className="sorotan-controls-row">
              <div className="sorotan-dots-group">
                {pelayananData.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`sorotan-dot ${idx === activeIndex ? "active" : ""}`}
                    onClick={() => setActiveIndex(idx)}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>

              <div className="sorotan-nav-group">
                <button
                  type="button"
                  className="sorotan-arrow-btn"
                  onClick={handlePrev}
                  aria-label="Pelayanan sebelumnya"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  className="sorotan-arrow-btn"
                  onClick={handleNext}
                  aria-label="Pelayanan selanjutnya"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SorotanPelayanan;
