import React from "react";
import "./KemitraanSection.css";

const KEMITRAAN_LOGOS = [
  {
    id: 1,
    name: "Sinode GKJ",
    category: "Sinode",
    icon: "fas fa-church",
  },
  {
    id: 2,
    name: "Klasis Klaten Barat",
    category: "Klasis",
    icon: "fas fa-monument",
  },
  {
    id: 3,
    name: "YAKKUM",
    category: "Kesehatan",
    icon: "fas fa-hospital",
  },
  {
    id: 4,
    name: "RS Bethesda / Panti Rapih",
    category: "RS Mitra",
    icon: "fas fa-user-md",
  },
  {
    id: 5,
    name: "Yayasan Pendidikan Kristen",
    category: "Pendidikan",
    icon: "fas fa-graduation-cap",
  },
  {
    id: 6,
    name: "Panti Asuhan Kristen",
    category: "Diakonia",
    icon: "fas fa-hands-helping",
  },
  {
    id: 7,
    name: "PMI Klaten",
    category: "Kemanusiaan",
    icon: "fas fa-heartbeat",
  },
  {
    id: 8,
    name: "LAI (Lembaga Alkitab)",
    category: "Mitra Alkitab",
    icon: "fas fa-book-bible",
  },
];

const KemitraanSection = () => {
  // Duplicate array to enable seamless infinite horizontal scrolling track
  const duplicatedLogos = [...KEMITRAAN_LOGOS, ...KEMITRAAN_LOGOS];

  return (
    <section className="kemitraan-section">
      <div className="kemitraan-container">
        <div className="kemitraan-header">
          <span className="section-tag light">MITRA & JARINGAN PELAYANAN</span>
          <h2 className="kemitraan-title">Kemitraan & Persekutuan</h2>
        </div>

        <div className="kemitraan-carousel-wrapper">
          <div className="kemitraan-track">
            {duplicatedLogos.map((mitra, index) => (
              <div key={`${mitra.id}-${index}`} className="kemitraan-logo-item" title={`${mitra.name} (${mitra.category})`}>
                <div className="kemitraan-logo-icon">
                  <i className={mitra.icon}></i>
                </div>
                <span className="kemitraan-logo-name">{mitra.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default KemitraanSection;
