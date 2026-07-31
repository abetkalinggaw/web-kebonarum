import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../../components/menu/Navbar";
import Footer from "../../../components/menu/Footer";
import "./EventDetailPage.css";

import event1 from "../../../assets/events/event1.jpg";
import { agendaData } from "../../../data/agendaData";
import { createApiUrl } from "../../../utils/apiConfig";

const MONTHS_FULL_ID = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

function formatFullDate(dateStr) {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-").map(Number);
  return `${day} ${MONTHS_FULL_ID[month - 1]} ${year}`;
}

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const defaultIndex = Math.max(0, (Number(id) || 1) - 1) % agendaData.length;
    const matched = agendaData.find((e) => e.id === Number(id)) || agendaData[defaultIndex];
    setEvent(matched);

    const fetchDetail = async () => {
      try {
        const response = await fetch(createApiUrl(`/api/agenda/${id}`));
        if (response.ok) {
          const data = await response.json();
          if (data && data.title) {
            setEvent({
              ...data,
              image: data.image || matched.image,
              content: data.content || matched.content,
            });
          }
        }
      } catch {
        // Fallback matched event already set
      }
    };

    fetchDetail();
  }, [id]);

  const handleBackClick = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate("/pengumuman/events");
  };

  const heroBg = event?.image || event1;

  // Determine if the event date has passed
  const eventDateObj = event?.date ? new Date(event.date) : null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isPastEvent = eventDateObj && !isNaN(eventDateObj.getTime()) && eventDateObj < today;

  return (
    <>
      <Navbar />
      <main className="event-detail-page">
        {/* HERO SECTION WITH EVENT THUMBNAIL AS BACKGROUND */}
        <section
          className="event-detail-hero"
          style={{ backgroundImage: `url(${heroBg})` }}
        >
          <div className="event-detail-hero-overlay" />
          <div className="event-detail-hero-content">
            <button className="back-button" onClick={handleBackClick} type="button">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M12.5 15L7.5 10L12.5 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Kembali ke Agenda
            </button>

            {event ? (
              <>
                <div className="event-detail-hero-tags">
                  <span
                    className={`agenda-type-tag type-${(
                      event.type || ""
                    ).toLowerCase()}`}
                  >
                    {event.type}
                  </span>
                  <span className="event-detail-hero-date">
                    {formatFullDate(event.date)}
                  </span>
                </div>

                <h1 className="event-detail-hero-title">{event.title}</h1>
                <p className="event-detail-hero-lead">{event.description}</p>
              </>
            ) : (
              <h1 className="event-detail-hero-title">Kegiatan Tidak Ditemukan</h1>
            )}
          </div>
        </section>

        {/* DETAIL CONTENT & SIDEBAR */}
        {event ? (
          <section className="event-detail-section">
            <div className="event-detail-container">
              <div className="event-detail-grid">
                {/* Main Article Body */}
                <article className="event-detail-article">
                  <div className="event-article-body">
                    <h2 className="event-article-heading">Tentang Kegiatan Ini</h2>
                    {event.content && event.content.length > 0 ? (
                      event.content.map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))
                    ) : (
                      <p>{event.description}</p>
                    )}

                    {/* Check if event date is past/completed */}
                    {isPastEvent && (
                      <div className="past-event-doc-banner">
                        <div className="past-event-doc-content">
                          <div className="past-event-badge">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            <span>Kegiatan Telah Terlaksana</span>
                          </div>
                          <h3>Lihat Dokumentasi Kegiatan</h3>
                          <p>
                            Kegiatan ini telah selesai dilaksanakan. Anda dapat melihat foto, video, dan ringkasan dokumentasi kegiatan jemaat melalui galeri media kami.
                          </p>
                        </div>
                        <button
                          type="button"
                          className="doc-nav-btn"
                          onClick={() => {
                            window.scrollTo(0, 0);
                            navigate("/media/documentation");
                          }}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                          </svg>
                          <span>Galeri Dokumentasi</span>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </article>

                {/* Event Info Sidebar */}
                <aside className="event-detail-sidebar">
                  <div className="event-info-card">
                    <h3 className="info-card-title">Informasi Pelaksanaan</h3>
                    <div className="info-card-divider" />

                    <div className="info-item">
                      <div className="info-icon">
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
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                      </div>
                      <div className="info-text">
                        <span className="info-label">Tanggal Hari</span>
                        <span className="info-value">{formatFullDate(event.date)}</span>
                      </div>
                    </div>

                    <div className="info-item">
                      <div className="info-icon">
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
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                      </div>
                      <div className="info-text">
                        <span className="info-label">Waktu</span>
                        <span className="info-value">{event.time}</span>
                      </div>
                    </div>

                    <div className="info-item">
                      <div className="info-icon">
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
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                      </div>
                      <div className="info-text">
                        <span className="info-label">Lokasi</span>
                        <span className="info-value">{event.location}</span>
                      </div>
                    </div>

                    {event.organizer && (
                      <div className="info-item">
                        <div className="info-icon">
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
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                          </svg>
                        </div>
                        <div className="info-text">
                          <span className="info-label">Penyelenggara</span>
                          <span className="info-value">{event.organizer}</span>
                        </div>
                      </div>
                    )}

                    <div className="info-card-actions">
                      <button
                        type="button"
                        className="sidebar-action-btn"
                        onClick={handleBackClick}
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
                </aside>
              </div>
            </div>
          </section>
        ) : (
          <section className="event-detail-not-found">
            <h2>Kegiatan Tidak Ditemukan</h2>
            <p>Agenda kegiatan yang Anda cari tidak tersedia.</p>
            <button
              className="minimal-outline-btn"
              onClick={() => navigate("/pengumuman/events")}
            >
              Kembali ke Daftar Agenda
            </button>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
};

export default EventDetailPage;
