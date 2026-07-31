import React, { useState, useRef, useEffect } from "react";
import "./PendetaGKJ.css";
import pendeta1 from "../../assets/pdt/pendeta1.jpeg";

import { createApiUrl } from "../../utils/apiConfig";
import { pendetaDataList } from "../../data/pendetaData";

const PendetaGKJ = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);
  const [pendeta, setPendeta] = useState(pendetaDataList);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    const fetchPendeta = async () => {
      try {
        const response = await fetch(createApiUrl("/api/pendeta"));
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setPendeta(data);
          }
        }
      } catch {
        // Fallback already set
      }
    };
    fetchPendeta();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 640) {
        setItemsPerView(1);
      } else if (window.innerWidth <= 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(4);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, pendeta.length - itemsPerView);
  const isCarousel = itemsPerView < 4;

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex >= maxIndex ? 0 : prevIndex + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? maxIndex : prevIndex - 1,
    );
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

  return (
    <section className="pendeta-gkj-kebonarum">
      <div className="pendeta-gkj-container">
        <div className="section-header-minimal">
          <span className="section-tag">PELAYAN FIRMAN</span>
          <h2 className="section-title-minimal">Pendeta GKJ Kebonarum</h2>
          <p className="section-subtitle-minimal">
            Pemimpin rohani yang membimbing jemaat dalam kehidupan iman,
            pengajaran Alkitab, dan dukungan pastoral.
          </p>
        </div>

        {isCarousel ? (
          <div className="pendeta-carousel-wrapper">
            <button
              className="carousel-button prev"
              onClick={prevSlide}
              aria-label="Previous pendeta"
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
                {pendeta.map((item) => (
                  <div
                    key={item.id}
                    className="carousel-item"
                    style={{ flex: `0 0 ${100 / itemsPerView}%` }}
                  >
                    <div className="pendeta-gkj-card">
                      <div
                        className="pendeta-gkj-image"
                        style={{
                          backgroundImage: `url(${item.image || pendeta1})`,
                        }}
                      >
                        <div className="pendeta-gkj-overlay"></div>
                      </div>
                      <div className="pendeta-gkj-info">
                        <span className="pendeta-role-badge">
                          {item.title || "Pendeta Jemaat"}
                        </span>
                        <h3 className="pendeta-gkj-name">{item.name}</h3>
                        <p className="pendeta-gkj-subtitle">
                          {item.subtitle || item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              className="carousel-button next"
              onClick={nextSlide}
              aria-label="Next pendeta"
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
        ) : (
          <div className="pendeta-gkj-grid">
            {pendeta.map((item) => (
              <div key={item.id} className="pendeta-gkj-card">
                <div
                  className="pendeta-gkj-image"
                  style={{ backgroundImage: `url(${item.image || pendeta1})` }}
                >
                  <div className="pendeta-gkj-overlay"></div>
                </div>
                <div className="pendeta-gkj-info">
                  <span className="pendeta-role-badge">
                    {item.title || "Pendeta Jemaat"}
                  </span>
                  <h3 className="pendeta-gkj-name">{item.name}</h3>
                  <p className="pendeta-gkj-subtitle">
                    {item.subtitle || item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {isCarousel && maxIndex > 0 && (
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
        )}
      </div>
    </section>
  );
};

export default PendetaGKJ;
