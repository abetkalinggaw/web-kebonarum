import React, { useState, useEffect } from "react";
import Navbar from "../../../components/menu/Navbar";
import Footer from "../../../components/menu/Footer";
import "./AgendaPage.css";

const AgendaPage = () => {
  const [filter, setFilter] = useState("Semua");
  const [agenda, setAgenda] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const types = ["Semua", "Ibadah", "Persekutuan", "Rapat", "Kegiatan"];

  useEffect(() => {
    const fetchAgenda = async () => {
      try {
        const response = await fetch("http://localhost:5050/api/agenda");
        if (response.ok) {
          const data = await response.json();
          // Sort by date closest first (optional)
          data.sort((a, b) => new Date(a.date) - new Date(b.date));
          setAgenda(data);
        }
      } catch (error) {
        console.error("Error fetching agenda:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAgenda();
  }, []);

  const filteredAgenda =
    filter === "Semua"
      ? agenda
      : agenda.filter((event) => event.type === filter);

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

          {loading ? (
            <div className="agenda-empty"><p>Loading...</p></div>
          ) : (
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
          )}
        </section>
      </main>
      <Footer />
    </>
  );
};

export default AgendaPage;
