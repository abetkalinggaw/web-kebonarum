import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./SorotanPelayanan.css";
import { agendaData } from "../../data/agendaData";
import { createApiUrl } from "../../utils/apiConfig";

const SorotanPelayanan = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(createApiUrl("/api/agenda"));
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            const kegiatanList = data.filter((item) => item.type === "Kegiatan");
            setItems(kegiatanList.length > 0 ? kegiatanList : data.slice(0, 4));
            return;
          }
        }
      } catch {
        // Fallback below
      }
      const defaultKegiatan = agendaData.filter((item) => item.type === "Kegiatan");
      setItems(defaultKegiatan);
    };

    fetchEvents();
  }, []);

  return (
    <section className="sorotan-pelayanan">
      <div className="sorotan-container">
        <div className="sorotan-header">
          <span className="section-tag accent">SOROTAN PELAYANAN</span>
          <h2 className="section-title-minimal">Gereja yang Berdampak & Melayani</h2>
          <p className="section-subtitle-minimal">
            Wujud kepedulian dan perwujudan kasih Kristus bagi jemaat serta masyarakat sekitar Kebonarum dan Klaten.
          </p>
        </div>

        <div className="sorotan-grid">
          {items.map((item, index) => {
            const eventDate = new Date(item.date);
            const dateFormatted = isNaN(eventDate.getTime())
              ? item.date
              : eventDate.toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                });

            const badgeText = item.badge || item.type || "Kegiatan";
            const iconClass = item.iconClass || "fas fa-hand-holding-heart";
            const eventId = item.id || index + 1;

            return (
              <div key={eventId} className="sorotan-card">
                <div className="sorotan-card-badge">
                  <i className={iconClass}></i>
                  <span>{badgeText}</span>
                </div>
                <div className="sorotan-card-body">
                  <div className="sorotan-meta">
                    <span className="sorotan-category">{item.type || "Kegiatan"}</span>
                    <span className="sorotan-bullet">•</span>
                    <span className="sorotan-date">{dateFormatted}</span>
                  </div>
                  <h3 className="sorotan-card-title">{item.title}</h3>
                  <p className="sorotan-card-desc">{item.description}</p>
                </div>
                <div className="sorotan-card-footer">
                  <Link
                    to={`/pengumuman/events/${eventId}`}
                    className="sorotan-link"
                    onClick={() => window.scrollTo(0, 0)}
                  >
                    <span>Baca Selengkapnya</span>
                    <i className="fas fa-arrow-right"></i>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SorotanPelayanan;
