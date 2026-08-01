import React, { useEffect, useRef, useState, useCallback } from "react";
import "./SejarahPage.css";
import Navbar from "../../components/menu/Navbar";
import Footer from "../../components/menu/Footer";
import Lenis from "lenis";
import img1 from "../../assets/sejarah/1.jpg";
import img2 from "../../assets/sejarah/2.jpg";
import img3 from "../../assets/sejarah/3.jpg";
import img4 from "../../assets/sejarah/4.jpg";
import img5 from "../../assets/sejarah/5.jpg";
import sejarahHeroBg from "../../assets/gkj-bg.png";

const SEJARAH_IMAGES = [img1, img2, img3, img4, img5];

const timelineData = [
  {
    year: "1910",
    era: "Awal Pemberitaan Injil",
    title: "Izin Pekabaran Injil Hindia Belanda",
    description:
      "Pemerintah Hindia Belanda mulai memberikan izin resmi untuk pemberitaan Injil di wilayah Surakarta dan sekitarnya. Pemerintah mengutus Van Andel sebagai pekabar Injil awal yang merintis benih-benih iman di tanah Klaten dan sekitarnya.",
    quote:
      '"Betapa indahnya kedatangan mereka yang membawa kabar baik!" — Roma 10:15',
    bg: "#1A2821",
    accent: "#C5A059",
    image: SEJARAH_IMAGES[0],
  },
  {
    year: "1916",
    era: "Perintisan Bendogantungan",
    title: "Pengutusan Guru Injil Stefanus Arun",
    description:
      "Van Andel mengutus Guru Injil Stefanus Arun ke wilayah Klaten. Beliau menjadi orang pertama yang menetap dan mengajarkan Injil di daerah Bendogantungan — tempat yang kelak menjadi cikal bakal persekutuan GKJ Kebonarum.",
    quote:
      '"Seorang menanam, yang lain menyiram, tetapi Allah yang memberi pertumbuhan." — 1 Korintus 3:6',
    bg: "#22342B",
    accent: "#D4A373",
    image: SEJARAH_IMAGES[1],
  },
  {
    year: "1927",
    era: "Pelayanan Kesehatan & Injil",
    title: "Berdirinya RS Tegalyoso & Benih Iman di Mayungan",
    description:
      "Berdirinya Dr. Scheurer Hospitaal (RS Tegalyoso) oleh Klatenche Cultuur Maatschappij menjadi momentum penting. Salah satu pasien, Ibu Ngadikem Wangsa Taruna, menerima Injil dan membawanya pulang ke wilayah Mayungan.",
    quote:
      '"Ia menyembuhkan orang-orang yang patah hati dan membalut luka-luka mereka." — Mazmur 147:3',
    bg: "#1E2D25",
    accent: "#A3B18A",
    image: SEJARAH_IMAGES[2],
  },
  {
    year: "9 Jul 1971",
    era: "Pendewasaan Gereja",
    title: "Peresmian Pendewasaan GKJ Kebonarum",
    description:
      "Bertempat di SD Kristen 2 Gudang, persekutuan jemaat di Kebonarum resmi didewasakan menjadi institusi gereja yang mandiri. Ibadah bersejarah ini dipimpin oleh Pdt. S. Notodiryo sebagai Pendeta Konsulen dari GKJ Klaten.",
    quote:
      '"Di atas batu karang ini Aku akan mendirikan jemaat-Ku dan alam maut tidak akan menguasainya." — Matius 16:18',
    bg: "#26392F",
    accent: "#C5A059",
    image: SEJARAH_IMAGES[3],
  },
  {
    year: "9 Nov 1971",
    era: "Pemanggilan Pemimpin",
    title: "Utusan Majelis Menuju Pati",
    description:
      "Majelis GKJ Kebonarum bersama Pdt. S. Notodiryo berangkat ke Pati untuk menemui Bp. Christian Sutopo. Kedatangan majelis bertujuan menyampaikan pemanggilan resmi beliau sebagai calon pendeta jemaat definitif pertama.",
    quote:
      '"Aku akan melepaskan domba-domba-Ku dan memberi mereka seorang gembala." — Yehezkiel 34:22-23',
    bg: "#213229",
    accent: "#D4A373",
    image: SEJARAH_IMAGES[4],
  },
  {
    year: "16 Feb 1972",
    era: "Keputusan Jemaat",
    title: "Pemilihan Pemimpin Rohani",
    description:
      "Setelah melewati proses saling mengenal dan perumusan visi persekutuan, jemaat GKJ Kebonarum secara resmi memilih Bp. Christian Sutopo sebagai calon pendeta pertama gereja.",
    quote:
      '"Pilihlah di antara kamu orang-orang yang bijaksana, berakal budi dan berpengalaman." — Ulangan 1:13',
    bg: "#283C32",
    accent: "#A3B18A",
    image: SEJARAH_IMAGES[0],
  },
  {
    year: "30-31 Mei 1972",
    era: "Sidang Klasis",
    title: "Penerimaan dalam Klasis Surakarta Barat",
    description:
      "Calon pendeta Bp. Christian Sutopo secara resmi diterima dalam Sidang Klasis Surakarta Barat untuk memasuki proses ujian dan pembimbingan gerejawi.",
    quote:
      '"Segala sesuatu harus dilakukan dengan sopan dan teratur." — 1 Korintus 14:40',
    bg: "#213229",
    accent: "#C5A059",
    image: SEJARAH_IMAGES[1],
  },
  {
    year: "13-14 Nov 1972",
    era: "Kelulusan Ujian",
    title: "Kelulusan Ujian Peremptoir",
    description:
      "Bp. Christian Sutopo dinyatakan lulus ujian peremptoir (ujian akhir calon pendeta) di hadapan persidangan gerejawi dan dinyatakan layak untuk ditahbiskan melayani jemaat.",
    quote:
      '"Usahakanlah supaya engkau layak di hadapan Allah sebagai seorang pekerja yang tidak usah malu." — 2 Timotius 2:15',
    bg: "#1F2F27",
    accent: "#D4A373",
    image: SEJARAH_IMAGES[2],
  },
  {
    year: "1 Des 1972",
    era: "Penahbisan Pertama",
    title: "Penahbisan Pdt. Christian Sutopo, DPS",
    description:
      "Ibadah penahbisan Pdt. Christian Sutopo, DPS diselenggarakan dengan penuh syukur. Beliau resmi ditahbiskan sebagai pendeta definitif pertama yang menggembalakan jemaat GKJ Kebonarum secara penuh.",
    quote:
      '"Gembalakanlah kawanan domba Allah yang ada padamu dengan sukarela sesuai dengan kehendak Allah." — 1 Petrus 5:2',
    bg: "#24362C",
    accent: "#A3B18A",
    image: SEJARAH_IMAGES[3],
  },
  {
    year: "Era Pelayanan",
    era: "Estafet Kepemimpinan",
    title: "Penahbisan & Pelayanan Pdt. Djimanto Setiadi",
    description:
      "GKJ Kebonarum menyambut penahbisan Pdt. Djimanto Setiadi. Beliau melayani jemaat dengan penuh kesetiaan dan kasih hingga memasuki masa purna tugas (emeritasi).",
    quote:
      '"Aku telah mengakhiri pertandingan yang baik, aku telah mencapai garis akhir dan aku telah memelihara iman." — 2 Timotius 4:7',
    bg: "#1E2D25",
    accent: "#C5A059",
    image: SEJARAH_IMAGES[4],
  },
  {
    year: "Era Suksesi",
    era: "Pembaruan Pelayanan",
    title: "Penahbisan Pdt. Dr. Tri Ratno Wahono, M.Si",
    description:
      "Setelah melalui masa orientasi, pembimbingan, dan vikariat dari 7 bakal calon pendeta, Pdt. Dr. Tri Ratno Wahono, M.Si secara resmi ditahbiskan meneruskan kepemimpinan spiritual jemaat.",
    quote:
      '"Bukan kamu yang memilih Aku, tetapi Akulah yang memilih kamu dan menetapkan kamu." — Yohanes 15:16',
    bg: "#26392F",
    accent: "#D4A373",
    image: SEJARAH_IMAGES[0],
  },
  {
    year: "Era Modern",
    era: "Pelayanan Masa Kini",
    title: "Penahbisan Pdt. Debora Dwioktabriani, S.Si",
    description:
      "Pdt. Debora Dwioktabriani, S.Si resmi ditahbiskan melayani jemaat GKJ Kebonarum. Beliau aktif memimpin peribadatan dan menggembalakan jemaat di era gereja modern (tercatat aktif hingga era 2020-an).",
    quote:
      '"Jadilah teladan bagi orang-orang percaya, dalam perkataanmu, dalam tingkah lakumu, dalam kasihmu..." — 1 Timotius 4:12',
    bg: "#213229",
    accent: "#A3B18A",
    image: SEJARAH_IMAGES[1],
  },
  {
    year: "9 Jul 2026",
    era: "Jubileum 55 Tahun",
    title: "Perayaan Syukur HUT ke-55 Kemandirian Gereja",
    description:
      "GKJ Kebonarum merayakan Ibadah Syukur 55 Tahun berdiri sebagai gereja mandiri. Perjalanan lima dekade lebih yang membuktikan kesetiaan dan kasih Tuhan dalam persekutuan jemaat.",
    quote:
      '"Sampai masa tuamu Aku tetap Dia dan sampai masa putih rambutmu Aku menggendong kamu." — Yesaya 46:4',
    bg: "#1A2821",
    accent: "#C5A059",
    image: SEJARAH_IMAGES[2],
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
        threshold: 0.2,
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
            <span className="section-tag light">SEJARAH GEREJA</span>
            <h1 className="sejarah-hero-title">
              Perjalanan Iman Kami
            </h1>
            <p className="sejarah-hero-sub">
              Lima dekade penuh berkat, pertumbuhan, dan ketahanan dalam kasih Kristus.
            </p>
            <div className="sejarah-hero-years">
              <span className="sejarah-hero-year-tag">1910</span>
              <span className="sejarah-hero-line-connector" />
              <span className="sejarah-hero-year-tag">2026</span>
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

        {/* SECTION: DAFTAR PENDETA YANG MELAYANI */}
        <section className="sejarah-pendeta-section">
          <div className="sejarah-pendeta-container">
            <div className="sejarah-pendeta-header">
              <span className="section-tag accent">BIMBINGAN ROHANI</span>
              <h2 className="sejarah-pendeta-title">Daftar Pendeta yang Diangkat & Melayani</h2>
              <p className="sejarah-pendeta-sub">
                Dalam perjalanan sejarahnya, proses kependetaan di GKJ Kebonarum sangat dihargai sebagai wujud kepemimpinan spiritual yang setia menggembalakan jemaat.
              </p>
            </div>

            <div className="sejarah-pendeta-grid">
              <div className="pendeta-history-card">
                <span className="pendeta-badge">Pendeta Konsulen</span>
                <h3 className="pendeta-name">Pdt. S. Notodiryo</h3>
                <p className="pendeta-role">Pendeta Konsulen dari GKJ Klaten</p>
                <p className="pendeta-desc">
                  Beliau membidani dan memimpin ibadah peresmian pendewasaan GKJ Kebonarum pada 9 Juli 1971, serta mendampingi majelis dalam pencarian calon pendeta definitif pertama.
                </p>
                <blockquote className="pendeta-verse">
                  "Sebab Ia adalah gembala kita, dan kitalah umat gembalaan-Nya." — Mazmur 95:7
                </blockquote>
              </div>

              <div className="pendeta-history-card highlight-card">
                <span className="pendeta-badge gold">Pendeta Pertama</span>
                <h3 className="pendeta-name">Pdt. Christian Sutopo, DPS</h3>
                <p className="pendeta-role">Ditahbiskan 1 Desember 1972</p>
                <p className="pendeta-desc">
                  Pendeta pertama yang menggembalakan jemaat secara penuh setelah GKJ Kebonarum berdiri mandiri, meletakkan fondasi persekutuan yang kokoh.
                </p>
                <blockquote className="pendeta-verse">
                  "Gembalakanlah kawanan domba Allah yang ada padamu..." — 1 Petrus 5:2
                </blockquote>
              </div>

              <div className="pendeta-history-card">
                <span className="pendeta-badge">Pendeta Jemaat</span>
                <h3 className="pendeta-name">Pdt. Djimanto Setiadi</h3>
                <p className="pendeta-role">Setia Melayani hingga Emeritasi</p>
                <p className="pendeta-desc">
                  Melayani jemaat dengan penuh dedikasi hingga memasuki masa purna tugas (emeritus), membimbing pertumbuhan rohani jemaat lintas generasi.
                </p>
                <blockquote className="pendeta-verse">
                  "Aku telah mengakhiri pertandingan yang baik, aku telah mencapai garis akhir..." — 2 Timotius 4:7
                </blockquote>
              </div>

              <div className="pendeta-history-card">
                <span className="pendeta-badge">Pendeta Jemaat</span>
                <h3 className="pendeta-name">Pdt. Dr. Tri Ratno Wahono, M.Si</h3>
                <p className="pendeta-role">Penerus Masa Emeritasi</p>
                <p className="pendeta-desc">
                  Terpilih setelah melewati proses seleksi 7 bakal calon pendeta. Beliau menjalani masa orientasi, pembimbingan, dan vikariat hingga ditahbiskan melayani jemaat.
                </p>
                <blockquote className="pendeta-verse">
                  "Bukan kamu yang memilih Aku, tetapi Akulah yang memilih kamu." — Yohanes 15:16
                </blockquote>
              </div>

              <div className="pendeta-history-card highlight-card">
                <span className="pendeta-badge green">Pendeta Aktif Masa Kini</span>
                <h3 className="pendeta-name">Pdt. Debora Dwioktabriani, S.Si</h3>
                <p className="pendeta-role">Pendeta Jemaat Modern (Era 2020-an)</p>
                <p className="pendeta-desc">
                  Aktif menggembalakan jemaat GKJ Kebonarum dan memimpin peribadatan modern dengan semangat pembaruan dan kasih di era pelayanan modern.
                </p>
                <blockquote className="pendeta-verse">
                  "Jadilah teladan bagi orang-orang percaya, dalam perkataanmu, dalam tingkah lakumu..." — 1 Timotius 4:12
                </blockquote>
              </div>
            </div>
          </div>
        </section>

        <section className="sejarah-closing" ref={closingRef}>
          <div className="sejarah-closing-inner">
            <p className="sejarah-closing-kicker">Melanjutkan Perjalanan</p>
            <h2 className="sejarah-closing-title">
              Bersama, Kita Terus
              <br />
              Bertumbuh
            </h2>
            <p className="sejarah-closing-sub">
              Lima dekade lebih perjalanan iman telah kita lalui. GKJ Kebonarum terus berdiri teguh dalam bimbingan Tuhan, hadir untuk melayani, berkembang, dan menjadi berkat bagi sesama.
            </p>
            <button className="sejarah-back-top-btn" onClick={scrollToTop}>
              Kembali ke Awal
            </button>
          </div>
        </section>
      </main>

      <Footer isStatic={true} />
    </>
  );
};

export default SejarahPage;
