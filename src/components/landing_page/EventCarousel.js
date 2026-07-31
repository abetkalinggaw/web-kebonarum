import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./EventCarousel.css";
import event1 from "../../assets/events/event1.jpg";
import event2 from "../../assets/events/event2.jpg";
import event3 from "../../assets/events/event3.jpg";
import event4 from "../../assets/events/event4.jpg";
import event5 from "../../assets/events/event5.jpg";

import { agendaData } from "../../data/agendaData";
import { createApiUrl } from "../../utils/apiConfig";

const EventCarousel = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [events, setEvents] = useState(agendaData);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 640) {
        setItemsPerView(1);
      } else if (window.innerWidth <= 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchAgenda = async () => {
      try {
        const response = await fetch(createApiUrl("/api/agenda"));
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setEvents(data);
          }
        }
      } catch {
        // Fallback already set
      }
    };
    fetchAgenda();
  }, []);

  const maxIndex = Math.max(0, events.length - itemsPerView);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex >= maxIndex ? 0 : prevIndex + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? maxIndex : prevIndex - 1));
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].screenX;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 40) {
      nextSlide();
    } else if (diff < -40) {
      prevSlide();
    }
  };

  const handleNavigateAll = () => {
    window.scrollTo(0, 0);
    navigate("/pengumuman/events");
  };

  return (
    <section className="events-section">
      <div className="events-container">
        <div className="section-header-minimal">
          <span className="section-tag">AGENDA & KEGIATAN</span>
          <h2 className="section-title-minimal">Kegiatan Gereja</h2>
          <p className="section-subtitle-minimal">
            Jadwal ibadah, persekutuan doa, dan kegiatan pelayanan jemaat GKJ Kebonarum mendatang.
          </p>
        </div>

        <div className="carousel-wrapper">
          <button
            className="carousel-button prev"
            onClick={prevSlide}
            aria-label="Previous event"
            type="button"
          >
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
              <path d="M15 18L9 12L15 6" />
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
              {events.map((event, index) => {
                const eventDate = new Date(event.date);
                const day = eventDate.getDate();
                const month = eventDate.toLocaleDateString("id-ID", {
                  month: "short",
                });
                const year = eventDate.getFullYear();
                const cardImage = event.image || [event1, event2, event3, event4, event5][index % 5];

                return (
                  <div
                    key={event.id}
                    className="carousel-item"
                    style={{ flex: `0 0 ${100 / itemsPerView}%` }}
                  >
                    <article
                      className="agenda-grid-card"
                      onClick={() => {
                        window.scrollTo(0, 0);
                        navigate(`/pengumuman/events/${event.id || index + 1}`);
                      }}
                    >
                      <div
                        className="agenda-card-image-wrap"
                        style={{ backgroundImage: `url(${cardImage})` }}
                      >
                        <div className="agenda-card-top-overlay" />
                        <div className="agenda-card-top">
                          <span
                            className={`agenda-type-tag type-${(
                              event.type || ""
                            ).toLowerCase()}`}
                          >
                            {event.type}
                          </span>

                          <div className="agenda-date-pill">
                            <span className="date-day">
                              {day < 10 ? `0${day}` : day}
                            </span>
                            <span className="date-month-year">
                              {month} {year}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="agenda-card-body">
                        <h3 className="agenda-card-title">{event.title}</h3>
                        <div className="agenda-card-meta">
                          <span className="meta-item">
                            <svg
                              width="15"
                              height="15"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <circle cx="12" cy="12" r="10" />
                              <polyline points="12 6 12 12 16 14" />
                            </svg>
                            {event.time}
                          </span>
                          <span className="meta-item">
                            <svg
                              width="15"
                              height="15"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                              <circle cx="12" cy="10" r="3" />
                            </svg>
                            {event.location}
                          </span>
                        </div>
                        <p className="agenda-card-desc">{event.description}</p>
                      </div>

                      <div className="agenda-card-footer">
                        <span className="agenda-detail-btn">
                          Informasi Kegiatan
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            width="16"
                            height="16"
                          >
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                          </svg>
                        </span>
                      </div>
                    </article>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            className="carousel-button next"
            onClick={nextSlide}
            aria-label="Next event"
            type="button"
          >
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
              <path d="M9 18L15 12L9 6" />
            </svg>
          </button>
        </div>

        <div className="carousel-dots">
          {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`carousel-dot ${currentIndex === idx ? "active" : ""}`}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        <div className="custom-button-container">
          <button
            className="minimal-outline-btn"
            onClick={handleNavigateAll}
            type="button"
          >
            Lihat Semua Agenda
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default EventCarousel;

