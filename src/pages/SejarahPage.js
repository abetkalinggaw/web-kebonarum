import React, { useEffect, useRef, useState, useCallback } from "react";
import "./SejarahPage.css";
import Navbar from "../components/menu/Navbar";
import Footer from "../components/menu/Footer";
import Lenis from "lenis";
import img1 from "../assets/sejarah/1.jpg";
import img2 from "../assets/sejarah/2.jpg";
import img3 from "../assets/sejarah/3.jpg";
import img4 from "../assets/sejarah/4.jpg";
import img5 from "../assets/sejarah/5.jpg";
import sejarahHeroBg from "../assets/gkj-bg.png";

const SEJARAH_IMAGES = [img1, img2, img3, img4, img5];

const timelineData = [
  {
    year: "1970",
    era: "Awal Berdiri",
    title: "Pendirian GKJ Kebonarum",
    description:
      "GKJ Kebonarum resmi berdiri sebagai jemaat gereja yang mandiri. Persekutuan yang berakar dari kelompok-kelompok ibadah kecil di daerah Kebonarum, Klaten, akhirnya berkembang menjadi sebuah jemaat gereja yang terorganisir dengan penuh berkat dan harapan.",
    quote:
      '"Sebab di mana dua atau tiga orang berkumpul dalam nama-Ku, di situ Aku ada di tengah-tengah mereka." — Matius 18:20',
    bg: "#0f1e16",
    accent: "#5a9272",
    image: SEJARAH_IMAGES[0],
  },
  {
    year: "1975",
    era: "Pembangunan",
    title: "Pembangunan Gedung Gereja Pertama",
    description:
      "Dengan semangat gotong royong seluruh jemaat, dibangun gedung gereja pertama yang menjadi pusat ibadah dan kegiatan rohani. Setiap bata yang diletakkan adalah simbol iman dan persatuan jemaat yang tidak tergoyahkan.",
    quote:
      '"Kalau bukan Tuhan yang membangun rumah, sia-sialah usaha orang yang membangunnya." — Mazmur 127:1',
    bg: "#112019",
    accent: "#6aa882",
    image: SEJARAH_IMAGES[1],
  },
  {
    year: "1980",
    era: "Pertumbuhan",
    title: "Pentahbisan Pendeta Pertama",
    description:
      "GKJ Kebonarum menyambut pendeta pertamanya yang resmi ditahbiskan untuk melayani jemaat. Hadirnya pemimpin rohani yang tetap semakin memperkokoh fondasi spiritual dan organisasi gereja dalam melangkah maju.",
    quote:
      '"Gembalakanlah kawanan domba Allah yang ada padamu, jangan dengan paksa, tetapi dengan sukarela sesuai dengan kehendak Allah." — 1 Petrus 5:2',
    bg: "#132218",
    accent: "#7abd96",
    image: SEJARAH_IMAGES[2],
  },
  {
    year: "1985",
    era: "Organisasi",
    title: "Pembentukan Majelis Gereja",
    description:
      "Tata organisasi gereja diperkuat dengan pembentukan majelis gereja yang lengkap. Para penatua dan diaken dipilih dan dilantik untuk bersama-sama memimpin dan melayani jemaat dengan penuh tanggung jawab kepada Tuhan.",
    quote:
      '"Dan Ia-lah yang memberikan baik rasul-rasul maupun nabi-nabi, baik pemberita-pemberita Injil maupun gembala-gembala dan pengajar-pengajar." — Efesus 4:11',
    bg: "#15251c",
    accent: "#88c9a6",
    image: SEJARAH_IMAGES[3],
  },
  {
    year: "1990",
    era: "Perayaan",
    title: "Perayaan 20 Tahun GKJ Kebonarum",
    description:
      "Dengan penuh syukur, seluruh jemaat merayakan 20 tahun perjalanan GKJ Kebonarum. Sebuah momen refleksi atas segala berkat dan pertumbuhan yang telah dialami, sekaligus meneguhkan komitmen bersama untuk masa depan yang lebih cerah.",
    quote:
      '"Bersyukurlah kepada Tuhan, sebab Ia baik! Bahwasanya untuk selama-lamanya kasih setia-Nya." — Mazmur 107:1',
    bg: "#162820",
    accent: "#95d4b0",
    image: SEJARAH_IMAGES[4],
  },
  {
    year: "1995",
    era: "Pembaruan",
    title: "Renovasi dan Perluasan Gedung Gereja",
    description:
      "Merespons pertumbuhan jemaat yang terus bertambah, dilakukan renovasi besar-besaran dan perluasan gedung gereja. Fasilitas yang diperbaharui ini mencerminkan visi gereja yang terus berkembang dan menatap masa depan dengan penuh keyakinan.",
    quote:
      '"Rancangan Tuhan tetap selama-lamanya, rancangan hati-Nya turun-temurun." — Mazmur 33:11',
    bg: "#182a22",
    accent: "#a0dbb8",
    image: SEJARAH_IMAGES[0],
  },
  {
    year: "2000",
    era: "Milenium Baru",
    title: "Memasuki Milenium Baru",
    description:
      "GKJ Kebonarum memasuki milenium baru dengan penuh harapan dan semangat pembaruan. Program-program inovatif diluncurkan untuk menjawab tantangan zaman dan memenuhi kebutuhan jemaat yang semakin beragam di era global.",
    quote: '"Lihat, Aku membuat semuanya baru!" — Wahyu 21:5',
    bg: "#162820",
    accent: "#a8e0be",
    image: SEJARAH_IMAGES[1],
  },
  {
    year: "2005",
    era: "Pelayanan",
    title: "Program Pelayanan Komunitas",
    description:
      "Memperluas jangkauan pelayanan ke luar tembok gereja, GKJ Kebonarum meluncurkan berbagai program sosial dan pemberdayaan komunitas. Pelayanan kepada masyarakat sekitar menjadi wujud nyata kasih yang hidup dan nyata.",
    quote:
      '"Dan kamu akan menjadi saksi-Ku di Yerusalem dan di seluruh Yudea dan Samaria dan sampai ke ujung bumi." — Kisah Para Rasul 1:8',
    bg: "#142518",
    accent: "#b0e4c4",
    image: SEJARAH_IMAGES[2],
  },
  {
    year: "2010",
    era: "Jubileum",
    title: "Perayaan 40 Tahun GKJ Kebonarum",
    description:
      "Merayakan empat dekade perjalanan iman yang penuh berkat. Perayaan jubileum ini mempererat persatuan jemaat sekaligus menjadi titik awal untuk melangkah ke babak baru dengan visi yang lebih besar dan hati yang lebih bersyukur.",
    quote:
      '"Sesungguhnya Tuhan adalah baik bagi orang yang berharap kepada-Nya, bagi jiwa yang mencari Dia." — Ratapan 3:25',
    bg: "#122216",
    accent: "#b8e8ca",
    image: SEJARAH_IMAGES[3],
  },
  {
    year: "2015",
    era: "Era Digital",
    title: "Memasuki Era Pelayanan Digital",
    description:
      "Mengikuti perkembangan zaman, GKJ Kebonarum mulai memanfaatkan media digital untuk memperluas jangkauan pelayanan. Ibadah daring, media sosial, dan platform digital menjadi sarana baru untuk menyentuh lebih banyak jiwa.",
    quote: '"Pergilah, jadikanlah semua bangsa murid-Ku." — Matius 28:19',
    bg: "#112018",
    accent: "#c2ecce",
    image: SEJARAH_IMAGES[4],
  },
  {
    year: "2020",
    era: "Ketahanan",
    title: "Ketahanan di Masa Pandemi",
    description:
      "Menghadapi tantangan pandemi global, GKJ Kebonarum membuktikan ketangguhannya. Dengan kreativitas dan adaptasi penuh kasih, pelayanan terus berjalan meski dalam keterbatasan, memperkuat solidaritas dan iman di antara jemaat.",
    quote:
      '"Janganlah kita jemu berbuat baik, karena apabila sudah datang waktunya, kita akan menuai, jika kita tidak menjadi lemah." — Galatia 6:9',
    bg: "#0f1e16",
    accent: "#caf0d4",
    image: SEJARAH_IMAGES[0],
  },
];

const ScrollArrow = () => (
  <svg
    className="scroll-arrow-svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 5v14M5 12l7 7 7-7" />
  </svg>
);

const SejarahPage = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [heroVisible, setHeroVisible] = useState(true);
  const [closingVisible, setClosingVisible] = useState(false);
  const lenisRef = useRef(null);
  const sectionRefs = useRef([]);
  const imgRefs = useRef([]);
  const heroRef = useRef(null);
  const closingRef = useRef(null);
  const observerRef = useRef(null);

  /* ── Assign image ref ── */
  const setImgRef = useCallback((el, index) => {
    imgRefs.current[index] = el;
  }, []);

  /* ── Assign section ref ── */
  const setSectionRef = useCallback((el, index) => {
    sectionRefs.current[index] = el;
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    const updateParallax = () => {
      const vh = window.innerHeight;
      imgRefs.current.forEach((img) => {
        if (!img) return;
        const wrap = img.parentElement;
        if (!wrap) return;
        const rect = wrap.getBoundingClientRect();
        const progress = (vh - rect.top) / (vh + rect.height);
        const clampedProgress = Math.min(1, Math.max(0, progress));
        const offset = (clampedProgress - 0.5) * 90; // ±45 px travel
        img.style.transform = `translateY(${offset}px) scale(1.14)`;
      });
    };

    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      updateParallax();
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    const heroObs = new IntersectionObserver(
      ([entry]) => setHeroVisible(entry.isIntersecting),
      { threshold: 0.1 },
    );
    if (heroRef.current) heroObs.observe(heroRef.current);

    const closingObs = new IntersectionObserver(
      ([entry]) => setClosingVisible(entry.isIntersecting),
      { threshold: 0.1 },
    );
    if (closingRef.current) closingObs.observe(closingRef.current);

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target;
          if (entry.isIntersecting) {
            el.classList.add("is-visible");
            el.classList.remove("is-leaving");
            setActiveIndex(Number(el.dataset.index));
          } else {
            // Only mark as leaving if it was previously visible
            if (el.classList.contains("is-visible")) {
              el.classList.add("is-leaving");
            }
            el.classList.remove("is-visible");
          }
        });
      },
      {
        threshold: 0.45,
        rootMargin: "0px 0px -5% 0px",
      },
    );

    sectionRefs.current.forEach((el) => {
      if (el) observerRef.current.observe(el);
    });

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      heroObs.disconnect();
      closingObs.disconnect();
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, []);

  const scrollToTop = useCallback(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { duration: 1.6 });
    }
  }, []);

  const currentData = timelineData[activeIndex];

  return (
    <>
      <Navbar />

      <div
        className="sejarah-ambient-bg"
        style={{ background: currentData.bg }}
      />

      <div
        className={`sejarah-floating-year ${!heroVisible && !closingVisible ? "sejarah-floating-year--visible" : ""}`}
      >
        <span
          className="sejarah-floating-year-text"
          style={{ color: currentData.accent }}
        >
          {currentData.year}
        </span>
        <span className="sejarah-floating-era">{currentData.era}</span>
      </div>

      <main className="sejarah-page">
        <section
          className="sejarah-hero"
          ref={heroRef}
          style={{ backgroundImage: `url(${sejarahHeroBg})` }}
        >
          <div className="sejarah-hero-content">
            <p className="sejarah-hero-kicker">GKJ Kebonarum · Klaten</p>
            <h1 className="sejarah-hero-title">
              Perjalanan
              <br />
              Iman Kami
            </h1>
            <p className="sejarah-hero-sub">
              Lima dekade penuh berkat, pertumbuhan, dan ketahanan.
              <br />
              Sebuah kisah tentang iman yang tak tergoyahkan.
            </p>
            <div className="sejarah-hero-years">
              <span className="sejarah-hero-year-tag">1970</span>
              <span className="sejarah-hero-line-connector" />
              <span className="sejarah-hero-year-tag">2020</span>
            </div>
          </div>
          <div className="sejarah-scroll-hint">
            <p>Gulir untuk menjelajahi sejarah</p>
            <ScrollArrow />
          </div>
        </section>

        <div className="sejarah-timeline-wrapper">
          <div className="sejarah-spine" />

          {timelineData.map((item, index) => (
            <section
              key={item.year}
              className="sejarah-section"
              data-index={index}
              ref={(el) => setSectionRef(el, index)}
            >
              <div className="sejarah-section-year-col">
                <div className="sejarah-section-year-pill">
                  <span
                    className="sejarah-section-year-num"
                    style={{ color: item.accent }}
                  >
                    {item.year}
                  </span>
                  <span className="sejarah-section-era-label">{item.era}</span>
                </div>
              </div>

              <div className="sejarah-section-content">
                <div className="sejarah-content-inner">
                  {/* text */}
                  <div className="sejarah-content-text">
                    <h2 className="sejarah-section-title">{item.title}</h2>
                    <p className="sejarah-section-description">
                      {item.description}
                    </p>
                    <blockquote
                      className="sejarah-section-quote"
                      style={{ borderColor: item.accent + "55" }}
                    >
                      <span style={{ color: item.accent + "cc" }}>
                        {item.quote}
                      </span>
                    </blockquote>
                  </div>

                  <div className="sejarah-img-wrap">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="sejarah-img"
                      ref={(el) => setImgRef(el, index)}
                      loading="lazy"
                    />
                    <div
                      className="sejarah-img-overlay"
                      style={{
                        background: `linear-gradient(135deg, ${item.bg}88 0%, transparent 60%)`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>

        <section className="sejarah-closing" ref={closingRef}>
          <div className="sejarah-closing-inner">
            <p className="sejarah-closing-kicker">Melanjutkan Perjalanan</p>
            <h2 className="sejarah-closing-title">
              Bersama, Kita Terus
              <br />
              Bertumbuh
            </h2>
            <p className="sejarah-closing-sub">
              Lima dekade telah berlalu, namun perjalanan iman ini masih terus
              berlanjut. GKJ Kebonarum hadir untuk melayani, berkembang, dan
              menjadi berkat bagi sesama.
            </p>
            <button className="sejarah-back-top-btn" onClick={scrollToTop}>
              Kembali ke Awal
            </button>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default SejarahPage;
