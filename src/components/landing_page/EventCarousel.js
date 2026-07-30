import { useState, useRef, useEffect } from "react";
import "./EventCarousel.css";
import event1 from "../../assets/events/event1.jpg";
import event2 from "../../assets/events/event2.jpg";
import event3 from "../../assets/events/event3.jpg";
import event4 from "../../assets/events/event4.jpg";
import event5 from "../../assets/events/event5.jpg";

const EventCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const events = [
    {
      id: 1,
      title: "Malam Perayaan Tahunan",
      date: "15 Maret 2026",
      time: "19:00 - 23:00",
      image: event1,
    },
    {
      id: 2,
      title: "Pertemuan Jemaat",
      date: "22 Maret 2026",
      time: "18:00 - 21:00",
      image: event2,
    },
    {
      id: 3,
      title: "Lokakarya & Pelatihan",
      date: "29 Maret 2026",
      time: "10:00 - 14:00",
      image: event3,
    },
    {
      id: 4,
      title: "Penggalangan Dana",
      date: "5 April 2026",
      time: "17:00 - 22:00",
      image: event4,
    },
    {
      id: 5,
      title: "Penggalangan Dana",
      date: "5 April 2026",
      time: "17:00 - 22:00",
      image: event5,
    },
  ];

  const itemsPerView = isMobile ? 1 : 3;

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex >= events.length - itemsPerView ? 0 : prevIndex + 1,
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? events.length - itemsPerView : prevIndex - 1,
    );
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].screenX;
    handleSwipe();
  };

  const handleSwipe = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      nextSlide();
    }
    if (touchEndX.current - touchStartX.current > 50) {
      prevSlide();
    }
  };

  return (
    <section className="events-section">
      <div className="events-container">
        <div className="section-header-minimal">
          <span className="section-tag">AGENDA & KEGIATAN</span>
          <h2 className="section-title-minimal">Kegiatan Gereja</h2>
        </div>

        <div className="carousel-wrapper">
          <button className="carousel-button prev" onClick={prevSlide} aria-label="Previous event">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div
            className="carousel-track"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="carousel-slides"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
              }}
            >
              {events.map((event) => (
                <div key={event.id} className="carousel-item">
                  <div className="event-card">
                    <div className="event-image-container">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="event-image"
                      />
                      <div className="event-date-badge">
                        <span>{event.date}</span>
                      </div>
                    </div>

                    <div className="event-details">
                      <h3 className="event-title">{event.title}</h3>

                      <div className="event-info">
                        <div className="event-time">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle
                              cx="12"
                              cy="12"
                              r="9"
                              stroke="currentColor"
                              strokeWidth="1.75"
                            />
                            <path
                              d="M12 7V12L16 14"
                              stroke="currentColor"
                              strokeWidth="1.75"
                              strokeLinecap="round"
                            />
                          </svg>
                          <span>{event.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="carousel-button next" onClick={nextSlide} aria-label="Next event">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className="carousel-dots">
          {Array.from({ length: events.length - itemsPerView + 1 }).map((_, idx) => (
            <button
              key={idx}
              className={`carousel-dot ${currentIndex === idx ? "active" : ""}`}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        <div className="custom-button-container">
          <button className="minimal-outline-btn">
            Lihat Semua Agenda
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default EventCarousel;
