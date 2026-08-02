import React from "react";
import "./KemitraanSection.css";

const KEMITRAAN_LOGOS = [
  { id: 1, name: "Sinode GKJ" },
  { id: 2, name: "Klasis Klaten Barat" },
  { id: 3, name: "YAKKUM" },
  { id: 4, name: "RS Bethesda" },
  { id: 5, name: "Yayasan Pendidikan Kristen Klaten" },
  { id: 6, name: "Panti Asuhan Kristen" },
  { id: 7, name: "PMI Kabupaten Klaten" },
  { id: 8, name: "Lembaga Alkitab Indonesia" },
];

const KemitraanSection = () => {
  // Duplicate array to enable seamless infinite horizontal scrolling
  const duplicatedLogos = [...KEMITRAAN_LOGOS, ...KEMITRAAN_LOGOS];

  return (
    <section className="kemitraan-section">
      <div className="kemitraan-container">
        <div className="kemitraan-carousel-wrapper">
          <div className="kemitraan-track">
            {duplicatedLogos.map((mitra, index) => (
              <span
                key={`${mitra.id}-${index}`}
                className="kemitraan-text-item"
              >
                {mitra.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default KemitraanSection;
