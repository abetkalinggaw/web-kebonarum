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
import { Clock, MapPin, ArrowRight, ChevronLeft, ChevronRight, Calendar } from "lucide-react";

const EventCarousel = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const processEvents = (dataList) => {
    const sorted = [...dataList].sort((a, b) => {
      const dateA = new Date(a.date || 0);
      const dateB = new Date(b.date || 0);
      if (dateB - dateA !== 0) return dateB - dateA;
      return String(b.id).localeCompare(String(a.id));
    });
    return sorted.slice(0, 4);
  };

  const [events, setEvents] = useState(() => processEvents(agendaData));
  const [isHovered, setIsHovered] = useState(false);

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
            setEvents(processEvents(data));
          } else {
            setEvents(processEvents(agendaData));
          }
        } else {
          setEvents(processEvents(agendaData));
        }
      } catch {
        setEvents(processEvents(agendaData));
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

  useEffect(() => {
    if (isHovered || maxIndex <= 0) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHovered, maxIndex, currentIndex]);

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
        <div className="events-header">
          <div className="events-header-info">
            <span className="section-tag accent">AGENDA & KEGIATAN</span>
            <h2 className="section-title-minimal">Kegiatan Gereja</h2>
            <p className="section-subtitle-minimal">
              Jadwal ibadah, persekutuan doa, dan kegiatan pelayanan jemaat GKJ Kebonarum mendatang.
            </p>
          </div>

          <div className="events-header-actions">
            <button
              className="minimal-outline-btn"
              onClick={handleNavigateAll}
              type="button"
            >
              <span>Lihat Semua Agenda</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        <div 
          className="carousel-wrapper"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <button
            className="events-nav-btn prev"
            onClick={prevSlide}
            aria-label="Previous event"
            type="button"
          >
            <ChevronLeft size={20} />
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
                            {event.type || "Kegiatan"}
                          </span>

                          <div className="agenda-date-pill">
                            <Calendar size={14} className="date-icon" />
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
                          {event.time && (
                            <span className="meta-item">
                              <Clock size={15} />
                              {event.time}
                            </span>
                          )}
                          {event.location && (
                            <span className="meta-item">
                              <MapPin size={15} />
                              {event.location}
                            </span>
                          )}
                        </div>
                        <p className="agenda-card-desc">{event.description}</p>
                      </div>

                      <div className="agenda-card-footer">
                        <span className="agenda-detail-btn">
                          <span>Informasi Kegiatan</span>
                          <ArrowRight size={16} />
                        </span>
                      </div>
                    </article>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            className="events-nav-btn next"
            onClick={nextSlide}
            aria-label="Next event"
            type="button"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="events-bottom-bar">
          <div className="events-dots-wrapper">
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={`events-dot ${currentIndex === idx ? "active" : ""}`}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventCarousel;

