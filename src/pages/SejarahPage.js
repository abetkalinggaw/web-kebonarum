import "./SejarahPage.css";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import Navbar from "../components/menu/Navbar";
import Footer from "../components/menu/Footer";
import backgroundVideo from "../assets/videos/background-video.mp4";
import event1 from "../assets/sejarah/1.jpg";
import event2 from "../assets/sejarah/2.jpg";
import event3 from "../assets/sejarah/3.jpg";
import event4 from "../assets/sejarah/4.jpg";
import event5 from "../assets/sejarah/5.jpg";

const SmoothSection = ({ children, className, delay = 0 }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 48 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.12 }}
    transition={{
      duration: 0.9,
      delay,
      ease: [0.22, 0.61, 0.36, 1],
    }}
  >
    {children}
  </motion.div>
);

const ParallaxImage = ({ src, alt, strength = 60 }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const rawY = useTransform(scrollYProgress, [0, 1.5], [-strength, strength]);
  const y = useSpring(rawY, { stiffness: 60, damping: 20, mass: 0.8 });

  return (
    <div ref={ref} className="timeline-image-wrap">
      <motion.img src={src} alt={alt} style={{ y }} />
    </div>
  );
};

const HeroParallax = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const rawY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const y = useSpring(rawY, { stiffness: 40, damping: 18, mass: 1 });
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    <section ref={ref} className="sejarah-hero">
      <motion.video
        className="sejarah-hero-video"
        style={{ y, scale }}
        autoPlay
        muted
        loop
        playsInline
      >
        <source src={backgroundVideo} type="video/mp4" />
      </motion.video>

      <div className="sejarah-hero-overlay" />

      <motion.div
        className="sejarah-hero-content"
        style={{ opacity }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: [0.22, 0.61, 0.36, 1] }}
      >
        <motion.p
          className="sejarah-kicker"
          initial={{ opacity: 0, letterSpacing: "8px" }}
          animate={{ opacity: 1, letterSpacing: "3px" }}
          transition={{ duration: 1.4, delay: 0.2, ease: "easeOut" }}
        >
          GKJ Kebonarum Klaten
        </motion.p>

        <motion.h1
          className="sejarah-title"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
        >
          Sejarah
          <br />
          GKJ Kebonarum
        </motion.h1>

        <motion.p
          className="sejarah-lead"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.65, ease: [0.22, 0.61, 0.36, 1] }}
        >
          Perjalanan iman GKJ Kebonarum dibangun melalui kesetiaan jemaat dalam
          pelayanan, persekutuan, dan kesaksian di tengah masyarakat.
        </motion.p>
      </motion.div>
    </section>
  );
};

const TimelineItemComponent = ({ item, index, isDouble, isReverse }) => {
  const fromLeft = isReverse ? 50 : -50;

  return (
    <div
      className={`timeline-item${isReverse ? " timeline-item--reverse" : ""}${isDouble ? " timeline-item--double" : ""}`}
    >
      {/* Primary image */}
      <SmoothSection className="timeline-image" delay={0.05}>
        <ParallaxImage src={item.image} alt={item.title} strength={50} />
      </SmoothSection>

      {/* Text content */}
      <motion.div
        className="timeline-content"
        initial={{ opacity: 0, x: fromLeft }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{
          duration: 0.85,
          delay: 0.1,
          ease: [0.22, 0.61, 0.36, 1],
        }}
      >
        <div
          className={`timeline-year timeline-year--in-content${isReverse ? " timeline-year--in-content-reverse" : ""}`}
        >
          {item.year}
        </div>
        <motion.h3
          className="timeline-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.7,
            delay: 0.2,
            ease: [0.22, 0.61, 0.36, 1],
          }}
        >
          {item.title}
        </motion.h3>
        <motion.p
          className="timeline-description"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.7,
            delay: 0.32,
            ease: [0.22, 0.61, 0.36, 1],
          }}
        >
          {item.description}
        </motion.p>
      </motion.div>

      {/* Secondary image (double layout) */}
      {item.secondaryImage && (
        <SmoothSection
          className="timeline-image timeline-image--secondary"
          delay={0.15}
        >
          <ParallaxImage
            src={item.secondaryImage}
            alt={`${item.title} tambahan`}
            strength={40}
          />
        </SmoothSection>
      )}
    </div>
  );
};

const SejarahPage = () => {
  const timelineItems = [
    {
      year: "1930",
      title: "Awal Pelayanan",
      description:
        "Pelayanan GKJ Kebonarum dimulai dari persekutuan sederhana yang tumbuh bersama keluarga-keluarga di sekitar Kebonarum.",
      image: event1,
    },
    {
      year: "1955",
      title: "Perintisan Jemaat",
      description:
        "Jemaat bertumbuh dan membangun struktur pelayanan yang lebih rapi untuk pembinaan iman dan pelayanan sosial.",
      image: event2,
    },
    {
      year: "1978",
      title: "Pembangunan Gedung Gereja",
      description:
        "Gedung gereja pertama dibangun sebagai pusat ibadah, pembinaan, dan penggembalaan jemaat.",
      image: event3,
    },
    {
      year: "2005",
      title: "Penguatan Pelayanan",
      description:
        "Pelayanan kategorial diperkuat, termasuk pembinaan anak, remaja, pemuda, dan pelayanan keluarga.",
      image: event4,
      secondaryImage: event2,
    },
    {
      year: "2020",
      title: "Pelayanan Digital",
      description:
        "GKJ Kebonarum mulai mengembangkan pelayanan digital agar penggembalaan tetap berjalan di era baru.",
      image: event5,
      secondaryImage: event3,
    },
  ];

  const doubleRowIndexes = new Set([3, timelineItems.length - 1]);

  return (
    <>
      <Navbar />
      <main className="sejarah-page">
        <HeroParallax />

        <motion.section
          className="sejarah-section"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="sejarah-section-inner">
            <motion.h2
              className="sejarah-section-title"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, ease: [0.22, 0.61, 0.36, 1] }}
            >
              Lintasan Waktu
            </motion.h2>

            <div className="sejarah-timeline">
              {timelineItems.map((item, index) => {
                const isDouble =
                  doubleRowIndexes.has(index) && Boolean(item.secondaryImage);
                const isReverse = !isDouble && index % 2 === 1;

                return (
                  <TimelineItemComponent
                    key={item.year}
                    item={item}
                    index={index}
                    isDouble={isDouble}
                    isReverse={isReverse}
                  />
                );
              })}
            </div>
          </div>
        </motion.section>
      </main>
      <Footer />
    </>
  );
};

export default SejarahPage;
