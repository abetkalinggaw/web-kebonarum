import React from "react";
import "./VisiMisi.css";

const VisiMisi = () => {
  return (
    <section className="visi-misi-section">
      <div className="visi-misi-wrapper">
        <h2 className="visi-misi-section-title">
          VISI & MISI GKJ KEBONARUM KLATEN
        </h2>
        <div className="visi-misi-container">
          <div className="visi-container">
            <h3 className="visi-misi-title">VISI</h3>
            <p className="visi-misi-content">
              To create a vibrant and inclusive community that celebrates
              cultural diversity, fosters personal growth, and empowers
              individuals to make a positive impact in society.
            </p>
          </div>

          <div className="misi-container">
            <h3 className="visi-misi-title">MISI</h3>
            <p className="visi-misi-content">
              To organize engaging events and activities that bring people
              together, and inspire community members to contribute meaningfully
              to the collective growth and well-being.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisiMisi;
