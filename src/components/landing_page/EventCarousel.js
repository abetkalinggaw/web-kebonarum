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
      title: "Annual Gala Night",
      date: "March 15, 2026",
      time: "7:00 PM - 11:00 PM",
      image: event1,
    },
    {
      id: 2,
      title: "Community Meetup",
      date: "March 22, 2026",
      time: "6:00 PM - 9:00 PM",
      image: event2,
    },
    {
      id: 3,
      title: "Workshop & Training",
      date: "March 29, 2026",
      time: "10:00 AM - 2:00 PM",
      image: event3,
    },
    {
      id: 4,
      title: "Charity Fundraiser",
      date: "April 5, 2026",
      time: "5:00 PM - 10:00 PM",
      image: event4,
    },
    {
      id: 5,
      title: "Charity Fundraiser",
      date: "April 5, 2026",
      time: "5:00 PM - 10:00 PM",
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
        <h2 className="section-title">EVENTS</h2>

        <div className="carousel-wrapper">
          <button className="carousel-button prev" onClick={prevSlide}>
            <svg
              width="24"
              height="24"
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
                    </div>

                    <div className="event-details">
                      <h3 className="event-title">{event.title}</h3>

                      <div className="event-info">
                        <div className="event-date">
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect
                              x="3"
                              y="4"
                              width="18"
                              height="18"
                              rx="2"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                            <path
                              d="M16 2V6"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                            <path
                              d="M8 2V6"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                            <path
                              d="M3 10H21"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                          </svg>
                          <span>{event.date}</span>
                        </div>

                        <div className="event-time">
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle
                              cx="12"
                              cy="12"
                              r="9"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                            <path
                              d="M12 7V12L16 14"
                              stroke="currentColor"
                              strokeWidth="2"
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

          <button className="carousel-button next" onClick={nextSlide}>
            <svg
              width="24"
              height="24"
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

        <div className="custom-button-container">
          <button className="custom-button">View All Events</button>
        </div>
      </div>
    </section>
  );
};

export default EventCarousel;
