import React from "react";
import "./VisiMisi.css";

const VisiMisi = () => {
  return (
    <section className="visi-misi-section">
      <div className="visi-misi-container">
        <div className="visi-misi-layout">
          {/* Left Column: Visi & Misi Cards */}
          <div className="visi-misi-cards-side">
            <div className="visi-misi-card">
              <div className="card-badge">01. VISI</div>
              <h3 className="card-title">Visi Pelayanan</h3>
              <p className="card-content">
                Mewujudkan jemaat yang berakar, bertumbuh, dan berbuah dalam kasih Kristus,
                serta menjadi berkat dan inspirasi kebaikan bagi masyarakat dan lingkungan sekitar.
              </p>
            </div>

            <div className="visi-misi-card">
              <div className="card-badge">02. MISI</div>
              <h3 className="card-title">Misi Pelayanan</h3>
              <p className="card-content">
                Menyelenggarakan ibadah yang hidup dan bermakna, membangun persekutuan jemaat yang
                erat dan inklusif, serta aktif berkontribusi dalam pelayanan sosial dan kemasyarakatan.
              </p>
            </div>
          </div>

          {/* Right Column: Header Content */}
          <div className="visi-misi-header-side">
            <span className="section-tag">ARAH & TUJUAN</span>
            <h2 className="visi-misi-title">Visi & Misi Gereja</h2>
            <p className="visi-misi-lead">
              Komitmen GKJ Kebonarum dalam membina kehidupan beriman jemaat, menghidupi kasih Kristus,
              dan melayani sesama dengan penuh kepedulian.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisiMisi;
