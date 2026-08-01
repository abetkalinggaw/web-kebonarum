import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MajelisGKJ.css";
import { getMajelisData } from "../../services/majelisApi";
import majelis1 from "../../assets/majelis/majelis1.jpg";
import majelis2 from "../../assets/majelis/majelis2.jpg";
import majelis3 from "../../assets/majelis/majelis3.jpg";
import majelis4 from "../../assets/majelis/majelis4.jpg";
import majelis5 from "../../assets/majelis/majelis5.jpg";
import majelis6 from "../../assets/majelis/majelis6.jpg";

const MAJELIS_IMAGES = [majelis1, majelis2, majelis3, majelis4, majelis5, majelis6];

// Initial fallback data synced with DB Jemaat
// Initial fallback data synced with DB Jemaat
const FALLBACK_PENATUA = [
  { id: "jmt_penatua_001", name: "Pnt. Yohanes Budi Santoso", role: "Penatua", detail: "Wilayah Sumberejo", image: majelis1 },
  { id: "pnt_2", name: "Pnt. Fajar Eko Kristanto", role: "Penatua", detail: "Wilayah Sumberejo", image: majelis2 },
  { id: "pnt_3", name: "Pnt. Hendra Budi Saputra", role: "Penatua", detail: "Wilayah Krosok", image: majelis3 },
  { id: "pnt_4", name: "Pnt. Bambang Tri Mulyono", role: "Penatua", detail: "Wilayah Pluneng", image: majelis4 },
  { id: "pnt_5", name: "Pnt. Joko Dwi Hermawan", role: "Penatua", detail: "Wilayah Ngrundul", image: majelis5 },
  { id: "pnt_6", name: "Pnt. Agus Kurniawan", role: "Penatua", detail: "Wilayah Prayan", image: majelis6 },
  { id: "pnt_7", name: "Pnt. Suparna Wibowo", role: "Penatua", detail: "Wilayah Sumberejo", image: majelis1 },
  { id: "pnt_8", name: "Pnt. Tri Wibowo", role: "Penatua", detail: "Wilayah Krosok", image: majelis2 },
];

const FALLBACK_DIAKEN = [
  { id: "jmt_diaken_001", name: "Dkn. Bapak Agus Prasetyo", role: "Diaken", detail: "Wilayah Krosok", image: majelis1 },
  { id: "dkn_2", name: "Dkn. Nisa Putra Handoko", role: "Diaken", detail: "Wilayah Krosok", image: majelis2 },
  { id: "dkn_3", name: "Dkn. Eko Heru Supriyanto", role: "Diaken", detail: "Wilayah Pluneng", image: majelis3 },
  { id: "dkn_4", name: "Dkn. Sigit Adi Rahardjo", role: "Diaken", detail: "Wilayah Ngrundul", image: majelis4 },
  { id: "dkn_5", name: "Dkn. Danu Tri Mulyono", role: "Diaken", detail: "Wilayah Prayan", image: majelis5 },
  { id: "dkn_6", name: "Dkn. Rina Wahyuni", role: "Diaken", detail: "Wilayah Sumberejo", image: majelis6 },
  { id: "dkn_7", name: "Dkn. Sri Wahyuni", role: "Diaken", detail: "Wilayah Pluneng", image: majelis1 },
  { id: "dkn_8", name: "Dkn. Budi Utomo", role: "Diaken", detail: "Wilayah Ngrundul", image: majelis2 },
];

const formatPenatuaName = (name) => {
  if (!name) return "Pnt. Penatua";
  if (name.startsWith("Pnt.") || name.startsWith("Pdm.") || name.startsWith("Dkn.")) return name;
  return `Pnt. ${name}`;
};

const formatDiakenName = (name) => {
  if (!name) return "Dkn. Diaken";
  if (name.startsWith("Dkn.") || name.startsWith("Pnt.") || name.startsWith("Pdm.")) return name;
  return `Dkn. ${name}`;
};

const MajelisGKJ = () => {
  const navigate = useNavigate();
  const [penatuaList, setPenatuaList] = useState(FALLBACK_PENATUA);
  const [diakenList, setDiakenList] = useState(FALLBACK_DIAKEN);

  useEffect(() => {
    const loadData = async () => {
      try {
        const rawData = await getMajelisData();
        if (Array.isArray(rawData) && rawData.length > 0) {
          const penatuas = rawData
            .filter((item) => item.subPeran === "Penatua")
            .map((item, idx) => ({
              id: item.id || `pnt_${idx}`,
              name: formatPenatuaName(item.namaLengkap),
              role: "Penatua",
              detail: `Wilayah ${item.wilayah || "Kebonarum"}`,
              image: item.imageUrl || MAJELIS_IMAGES[idx % MAJELIS_IMAGES.length],
            }));

          const diakens = rawData
            .filter((item) => item.subPeran === "Diaken")
            .map((item, idx) => ({
              id: item.id || `dkn_${idx}`,
              name: formatDiakenName(item.namaLengkap),
              role: "Diaken",
              detail: `Wilayah ${item.wilayah || "Kebonarum"}`,
              image: item.imageUrl || MAJELIS_IMAGES[idx % MAJELIS_IMAGES.length],
            }));

          if (penatuas.length > 0) setPenatuaList(penatuas.slice(0, 8));
          if (diakens.length > 0) setDiakenList(diakens.slice(0, 8));
        }
      } catch (err) {
        console.warn("Using fallback majelis data:", err.message);
      }
    };

    loadData();
  }, []);

  const handleClick = () => {
    window.scrollTo(0, 0);
    navigate("/majelis");
  };

  return (
    <section className="majelis-gkj-kebonarum">
      <div className="majelis-gkj-container">
        <div className="section-header-minimal">
          <span className="section-tag">KEPEMIMPINAN GEREJA</span>
          <h2 className="section-title-minimal">Majelis GKJ Kebonarum</h2>
          <p className="section-subtitle-minimal">
            Badan penatua dan diaken yang memimpin, mengatur, dan mengawasi
            pelayanan gereja bersama pendeta.
          </p>
        </div>

        {/* Penatua Section — 2-column layout */}
        <div className="majelis-gkj-section">
          <div className="majelis-gkj-two-col">
            {/* Left: Sub Header */}
            <div className="majelis-gkj-left">
              <h3 className="majelis-gkj-subtitle">Penatua</h3>
              <p className="majelis-gkj-sub-description">
                Anggota majelis yang bertugas memimpin bimbingan rohani kepada
                jemaat, serta mengawasi dan mengarahkan setiap aspek pelayanan
                gereja agar sesuai dengan ajaran dan nilai-nilai Alkitab.
              </p>
              <div className="batik-rule batik-rule--vertical">
                <span className="batik-rule--icon">❖</span>
              </div>
            </div>

            {/* Right: Cards Grid */}
            <div className="majelis-gkj-right">
              <div className="majelis-gkj-grid">
                {penatuaList.map((item) => (
                  <article key={item.id} className="majelis-gkj-card">
                    <div
                      className="majelis-gkj-image"
                      style={{ backgroundImage: `url(${item.image})` }}
                    >
                      <span className="role-tag role-tag--penatua">Penatua</span>
                      <div className="majelis-gkj-overlay" />
                    </div>
                    <div className="majelis-gkj-info">
                      <h3 className="majelis-gkj-name">{item.name}</h3>
                      <p className="majelis-gkj-detail">{item.detail}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Diaken Section — 2-column layout */}
        <div className="majelis-gkj-section">
          <div className="majelis-gkj-two-col">
            {/* Left: Sub Header */}
            <div className="majelis-gkj-left">
              <h3 className="majelis-gkj-subtitle">Diaken</h3>
              <p className="majelis-gkj-sub-description">
                Anggota majelis yang melayani kebutuhan praktis jemaat, menangani
                program pelayanan sosial, dan memberikan perhatian khusus dalam
                bidang diakonia kepada seluruh anggota gereja.
              </p>
              <div className="batik-rule batik-rule--vertical">
                <span className="batik-rule--icon">❖</span>
              </div>
            </div>

            {/* Right: Cards Grid */}
            <div className="majelis-gkj-right">
              <div className="majelis-gkj-grid">
                {diakenList.map((item) => (
                  <article key={item.id} className="majelis-gkj-card">
                    <div
                      className="majelis-gkj-image"
                      style={{ backgroundImage: `url(${item.image})` }}
                    >
                      <span className="role-tag role-tag--diaken">Diaken</span>
                      <div className="majelis-gkj-overlay" />
                    </div>
                    <div className="majelis-gkj-info">
                      <h3 className="majelis-gkj-name">{item.name}</h3>
                      <p className="majelis-gkj-detail">{item.detail}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="majelis-cta-container">
          <button className="majelis-cta-btn" onClick={handleClick}>
            Lihat Semua Majelis
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
    </section>
  );
};

export default MajelisGKJ;
