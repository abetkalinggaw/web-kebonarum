import { useState, useEffect, useRef } from "react";
import "./GerejaListPage.css";
import Navbar from "../../components/menu/Navbar";
import Footer from "../../components/menu/Footer";
import sejarah1 from "../../assets/sejarah/1.jpg";
import sejarah2 from "../../assets/sejarah/2.jpg";
import sejarah3 from "../../assets/sejarah/3.jpg";
import sejarah4 from "../../assets/sejarah/4.jpg";
import sejarah5 from "../../assets/sejarah/5.jpg";
import {
  Camera,
  Clock,
  Contact,
  Mail,
  Map,
  MapPin,
  MessageCircle,
  Phone,
  Sun,
  Sunset,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const ImageCarousel = ({ images, name }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef(null);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length, isHovered]);

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length,
    );
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
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
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      } else {
        setCurrentIndex(
          (prevIndex) => (prevIndex - 1 + images.length) % images.length,
        );
      }
    }
    touchStartX.current = null;
  };

  return (
    <div
      className="gereja-carousel-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="gereja-carousel-slides">
        {images.map((imgSrc, idx) => (
          <div
            key={idx}
            className={`gereja-carousel-slide ${idx === currentIndex ? "active" : ""}`}
          >
            <img src={imgSrc} alt={`${name} - foto ${idx + 1}`} />
          </div>
        ))}
      </div>

      <button
        type="button"
        className="carousel-btn carousel-btn--prev"
        onClick={handlePrev}
        aria-label="Previous image"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        type="button"
        className="carousel-btn carousel-btn--next"
        onClick={handleNext}
        aria-label="Next image"
      >
        <ChevronRight size={20} />
      </button>

      <div className="carousel-dots">
        {images.map((_, idx) => (
          <button
            key={idx}
            type="button"
            className={`carousel-dot ${idx === currentIndex ? "active" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(idx);
            }}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

const GerejaListPage = () => {
  const gerejaList = [
    {
      id: 1,
      name: "Induk Sumberejo",
      address:
        "Dk. Bendogantungan II No. 001/007, Desa Sumberejo, Kec. Klaten Selatan, Kabupaten Klaten, Jawa Tengah 57426",
      schedule: ["07.00 WIB", "17.00 WIB"],
      ibadahLabel: "Jadwal Ibadah",
      contact: {
        phone: "+62 812 345 678",
        whatsappNumber: "+62 812 345 778",
        email: "sumberejo@gkjkebonarum.com",
        instagram: "@gkj_sumberejo",
      },
      images: [sejarah1, sejarah2, sejarah3, sejarah4, sejarah5],
    },
    {
      id: 2,
      name: "Pepanthan Krosok",
      address:
        "Dk. Krosok, Desa Ngrundul, Kec. Kebonarum, Kabupaten Klaten, Jawa Tengah 57486",
      schedule: ["07.00 WIB"],
      ibadahLabel: "Jadwal Ibadah",
      contact: {
        phone: "+62 812 345 679",
        whatsappNumber: "+62 812 345 779",
        email: "krosok@gkjkebonarum.com",
        instagram: "@gkj_krosok",
      },
      images: [sejarah2, sejarah3, sejarah4, sejarah5, sejarah1],
    },
    {
      id: 3,
      name: "Pepanthan Pluneng",
      address:
        "Desa Pluneng, Kec. Kebonarum, Kabupaten Klaten, Jawa Tengah 57486",
      schedule: ["07.00 WIB"],
      ibadahLabel: "Jadwal Ibadah",
      contact: {
        phone: "+62 812 345 680",
        whatsappNumber: "+62 812 345 780",
        email: "pluneng@gkjkebonarum.com",
        instagram: "@gkj_pluneng",
      },
      images: [sejarah3, sejarah4, sejarah5, sejarah1, sejarah2],
    },
    {
      id: 4,
      name: "Pepanthan Ngrundul",
      address:
        "Desa Ngrundul, Kec. Kebonarum, Kabupaten Klaten, Jawa Tengah 57486",
      schedule: ["07.00 WIB"],
      ibadahLabel: "Jadwal Ibadah",
      contact: {
        phone: "+62 812 345 681",
        whatsappNumber: "+62 812 345 781",
        email: "ngrundul@gkjkebonarum.com",
        instagram: "@gkj_ngrundul",
      },
      images: [sejarah4, sejarah5, sejarah1, sejarah2, sejarah3],
    },
    {
      id: 5,
      name: "Pepanthan Prayan",
      address:
        "Dk. Prayan, Desa Kebonarum, Kec. Kebonarum, Kabupaten Klaten, Jawa Tengah 57486",
      schedule: ["07.00 WIB"],
      ibadahLabel: "Jadwal Ibadah",
      contact: {
        phone: "+62 812 345 682",
        whatsappNumber: "+62 812 345 782",
        email: "prayan@gkjkebonarum.com",
        instagram: "@gkj_prayan",
      },
      images: [sejarah5, sejarah1, sejarah2, sejarah3, sejarah4],
    },
  ];

  return (
    <>
      <Navbar />
      <main className="gereja-list-page">
        <section className="gereja-list-hero">
          <div className="gereja-list-hero-content">
            <span className="section-tag light">WILAYAH PELAYANAN</span>
            <h1 className="gereja-list-title">Gereja GKJ Kebonarum</h1>
            <p className="gereja-list-lead">
              Gereja-gereja wilayah GKJ Kebonarum yang tersebar di Kabupaten
              Klaten, siap melayani ibadah dan persekutuan jemaat.
            </p>
          </div>
        </section>

        <section className="gereja-list-section">
          <div className="gereja-list-inner">
            <div className="gereja-list-grid">
              {gerejaList.map((gereja, index) => (
                <article
                  key={gereja.id}
                  className={`gereja-item${index % 2 === 1 ? " gereja-item--reverse" : ""}`}
                >
                  <div className="gereja-item-image">
                    <ImageCarousel images={gereja.images} name={gereja.name} />
                    <div className="gereja-item-overlay" />
                  </div>
                  <div className="gereja-item-content">
                    <h2 className="gereja-item-title">{gereja.name}</h2>
                    <p className="gereja-item-address">
                      <MapPin size={18} className="address-icon" />
                      {gereja.address}
                    </p>
                    <div className="gereja-item-action">
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(`GKJ Kebonarum ${gereja.name}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="gereja-maps-btn"
                      >
                        <Map size={18}></Map>
                        <span>Petunjuk Arah (Maps)</span>
                      </a>
                    </div>

                    <div className="gereja-item-details">
                      <div className="gereja-item-schedule">
                        <h4 className="schedule-label">
                          <Clock size={18} /> {gereja.ibadahLabel}
                        </h4>
                        <div className="schedule-pill-group">
                          {gereja.schedule.map((jadwal, idx) => (
                            <span key={idx} className="schedule-pill">
                              {jadwal.includes("17.00") ? (
                                <Sunset size={18} />
                              ) : (
                                <Sun size={18} />
                              )}
                              {jadwal}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="gereja-item-contact">
                        <h4 className="schedule-label">
                          <Contact size={18} /> Kontak & Informasi
                        </h4>
                        <ul className="contact-list">
                          <li>
                            <Phone size={18} className="contact-icon" />
                            <span>Telepon:</span> {gereja.contact.phone}
                          </li>
                          <li>
                            <MessageCircle size={18} className="contact-icon" />
                            <span>WhatsApp:</span>{" "}
                            <a
                              href={`https://wa.me/${gereja.contact.whatsappNumber.replace(/\D/g, "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {gereja.contact.whatsappNumber}
                            </a>
                          </li>
                          <li>
                            <Mail size={18} className="contact-icon" />
                            <span>Email:</span>{" "}
                            <a href={`mailto:${gereja.contact.email}`}>
                              {gereja.contact.email}
                            </a>
                          </li>
                          <li>
                            <Camera size={18} className="contact-icon" />
                            <span>Instagram:</span>{" "}
                            <a
                              href={`https://instagram.com/${gereja.contact.instagram.replace("@", "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {gereja.contact.instagram}
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default GerejaListPage;
