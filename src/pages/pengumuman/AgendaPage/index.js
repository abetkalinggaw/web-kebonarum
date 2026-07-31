import React, { useState } from "react";
import Navbar from "../../../components/menu/Navbar";
import Footer from "../../../components/menu/Footer";
import "./AgendaPage.css";

const mockAgenda = [
  {
    id: 1,
    title: "Ibadah Raya Minggu",
    date: "2026-08-02",
    time: "07:00 & 17:00 WIB",
    location: "Gedung Gereja Utama",
    description: "Ibadah raya minggu rutin. Tema: 'Bertumbuh dalam Iman'.",
    type: "Ibadah",
  },
  {
    id: 2,
    title: "Persekutuan Doa",
    date: "2026-08-05",
    time: "18:00 WIB",
    location: "Ruang Doa",
    description: "Persekutuan doa tengah minggu bersama majelis dan jemaat.",
    type: "Persekutuan",
  },
  {
    id: 3,
    title: "Rapat Majelis Pleno",
    date: "2026-08-08",
    time: "19:00 WIB",
    location: "Ruang Majelis",
    description: "Rapat koordinasi pelayanan bulan Agustus.",
    type: "Rapat",
  },
  {
    id: 4,
    title: "Latihan Paduan Suara",
    date: "2026-08-09",
    time: "16:00 WIB",
    location: "Gedung Gereja Utama",
    description: "Latihan rutin paduan suara GKJ Kebonarum.",
    type: "Kegiatan",
  },
];

const AgendaPage = () => {
  const [filter, setFilter] = useState("Semua");
  const types = ["Semua", "Ibadah", "Persekutuan", "Rapat", "Kegiatan"];

  const filteredAgenda =
    filter === "Semua"
      ? mockAgenda
      : mockAgenda.filter((event) => event.type === filter);

  return (
    <>
      <Navbar />
      <main className="agenda-page">
        <section className="agenda-hero">
          <div className="agenda-hero-content">
            <span className="section-tag light">GKJ KEBONARUM KLATEN</span>
            <h1 className="agenda-title">Agenda & Kegiatan</h1>
            <p className="agenda-lead">
              Ikuti terus jadwal ibadah, persekutuan, dan kegiatan gereja agar
              dapat turut serta dalam pelayanan dan persekutuan bersama.
            </p>
          </div>
        </section>

        <section className="agenda-content">
          <div className="agenda-filter">
            {types.map((type) => (
              <button
                key={type}
                className={`filter-btn ${filter === type ? "active" : ""}`}
                onClick={() => setFilter(type)}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="agenda-list">
            {filteredAgenda.map((event, index) => (
              <div
                key={event.id}
                className="agenda-card"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="agenda-card-date">
                  <div className="date-day">
                    {new Date(event.date).getDate()}
                  </div>
                  <div className="date-month">
                    {new Date(event.date).toLocaleDateString("id-ID", {
                      month: "short",
                    })}
                  </div>
                </div>

                <div className="agenda-card-info">
                  <div className="agenda-tags">
                    <span className="agenda-type-tag">{event.type}</span>
                  </div>
                  <h3 className="agenda-card-title">{event.title}</h3>
                  <div className="agenda-card-meta">
                    <span className="meta-item">
                      <i className="far fa-clock"></i> {event.time}
                    </span>
                    <span className="meta-item">
                      <i className="fas fa-map-marker-alt"></i> {event.location}
                    </span>
                  </div>
                  <p className="agenda-card-desc">{event.description}</p>
                </div>
              </div>
            ))}

            {filteredAgenda.length === 0 && (
              <div className="agenda-empty">
                <p>Belum ada kegiatan untuk kategori ini.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default AgendaPage;
