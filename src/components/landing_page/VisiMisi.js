import React from "react";
import "./VisiMisi.css";

const VisiMisi = () => {
  return (
    <section className="visi-misi-section">
      <div className="visi-misi-wrapper">
        <div className="section-header-minimal">
          <span className="section-tag">ARAH & TUJUAN</span>
          <h2 className="section-title-minimal">Visi & Misi Gereja</h2>
        </div>

        <div className="visi-misi-grid">
          <div className="visi-misi-card">
            <div className="card-badge">01. VISI</div>
            <h3 className="card-title">Visi Pelayanan</h3>
            <p className="card-content">
              Mewujudkan jemaat yang berakar, bertumbuh, dan berbuah dalam kasih Kristus, serta menjadi berkat dan inspirasi kebaikan bagi masyarakat dan lingkungan sekitar.
            </p>
          </div>

          <div className="visi-misi-card">
            <div className="card-badge">02. MISI</div>
            <h3 className="card-title">Misi Pelayanan</h3>
            <p className="card-content">
              Menyelenggarakan ibadah yang hidup dan bermakna, membangun persekutuan jemaat yang erat dan inklusif, serta aktif berkontribusi dalam pelayanan sosial dan kemasyarakatan.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisiMisi;
