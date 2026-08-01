import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/menu/Navbar";
import Footer from "../../../components/menu/Footer";
import "./AgendaPage.css";
import event1 from "../../../assets/events/event1.jpg";
import event2 from "../../../assets/events/event2.jpg";
import event3 from "../../../assets/events/event3.jpg";
import event4 from "../../../assets/events/event4.jpg";
import event5 from "../../../assets/events/event5.jpg";
import { createApiUrl } from "../../../utils/apiConfig";
import { agendaData } from "../../../data/agendaData";

const AgendaPage = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [agenda, setAgenda] = useState(agendaData);
  const [loading, setLoading] = useState(true);

  const types = ["Semua", "Ibadah", "Persekutuan", "Rapat", "Kegiatan"];

  useEffect(() => {
    const fetchAgenda = async () => {
      try {
        const response = await fetch(createApiUrl("/api/agenda"));
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            data.sort((a, b) => {
              const dateA = new Date(a.date || 0);
              const dateB = new Date(b.date || 0);
              if (dateB - dateA !== 0) return dateB - dateA;
              return String(b.id).localeCompare(String(a.id));
            });
            setAgenda(data);
          }
        }
      } catch (error) {
        console.error("Error fetching agenda, using fallback:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAgenda();
  }, []);

  const filteredAgenda = agenda.filter((event) => {
    const matchesType = filter === "Semua" || event.type === filter;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !query ||
      event.title.toLowerCase().includes(query) ||
      event.location.toLowerCase().includes(query) ||
      event.description.toLowerCase().includes(query);
    return matchesType && matchesSearch;
  });

  return (
    <>
      <Navbar />
      <main className="agenda-page">
        {/* HERO SECTION */}
        <section className="agenda-hero">
          <div className="agenda-hero-content">
            <h1 className="agenda-title">Agenda & Kegiatan Gereja</h1>
            <p className="agenda-lead">
              Ikuti terus jadwal ibadah, persekutuan, dan kegiatan pelayanan GKJ
              Kebonarum agar dapat turut serta dalam persekutuan kasih Kristus.
            </p>
          </div>
        </section>

        {/* CONTENT & TOOLBAR SECTION */}
        <section className="agenda-content">
          <div className="agenda-toolbar">
            <div className="agenda-filter">
              {types.map((type) => (
                <button
                  key={type}
                  type="button"
                  className={`filter-btn ${filter === type ? "active" : ""}`}
                  onClick={() => setFilter(type)}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="agenda-search-box">
              <svg
                className="search-icon"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Cari kegiatan atau lokasi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="agenda-search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="clear-search-btn"
                  onClick={() => setSearchQuery("")}
                  aria-label="Bersihkan pencarian"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="agenda-empty">
              <p>Memuat agenda kegiatan...</p>
            </div>
          ) : (
            <div className="agenda-grid">
              {filteredAgenda.map((event, index) => {
                const eventDate = new Date(event.date);
                const day = eventDate.getDate();
                const month = eventDate.toLocaleDateString("id-ID", {
                  month: "short",
                });
                const year = eventDate.getFullYear();
                const cardImage =
                  event.image ||
                  [event1, event2, event3, event4, event5][index % 5];

                return (
                  <article
                    key={event.id || index}
                    className="agenda-grid-card"
                    onClick={() => {
                      window.scrollTo(0, 0);
                      navigate(`/pengumuman/events/${event.id || index + 1}`);
                    }}
                    style={{ animationDelay: `${index * 0.08}s` }}
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
                );
              })}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
};

export default AgendaPage;
