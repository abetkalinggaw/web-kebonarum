import { useNavigate } from "react-router-dom";
import "./MajelisGKJ.css";
import majelis1 from "../../assets/majelis/majelis1.jpg";
import majelis2 from "../../assets/majelis/majelis2.jpg";
import majelis3 from "../../assets/majelis/majelis3.jpg";
import majelis4 from "../../assets/majelis/majelis4.jpg";
import majelis5 from "../../assets/majelis/majelis5.jpg";

const MajelisGKJ = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    window.scrollTo(0, 0);
    navigate("/majelis");
  };

  const majelisPenatuaData = [
    {
      id: 1,
      name: "Pnt. Penatua 1",
      role: "Penatua",
      detail: "Wilayah Sumberejo",
      image: majelis1,
    },
    {
      id: 2,
      name: "Pnt. Penatua 2",
      role: "Penatua",
      detail: "Wilayah Krosok",
      image: majelis2,
    },
    {
      id: 3,
      name: "Pnt. Penatua 3",
      role: "Penatua",
      detail: "Wilayah Pluneng",
      image: majelis3,
    },
    {
      id: 4,
      name: "Pnt. Penatua 4",
      role: "Penatua",
      detail: "Wilayah Ngrundul",
      image: majelis4,
    },
    {
      id: 5,
      name: "Pnt. Penatua 5",
      role: "Penatua",
      detail: "Wilayah Prayan",
      image: majelis5,
    },
  ];

  const majelisDiakenData = [
    {
      id: 1,
      name: "Dkn. Diaken 1",
      role: "Diaken",
      detail: "Wilayah Sumberejo",
      image: majelis1,
    },
    {
      id: 2,
      name: "Dkn. Diaken 2",
      role: "Diaken",
      detail: "Wilayah Krosok",
      image: majelis2,
    },
    {
      id: 3,
      name: "Dkn. Diaken 3",
      role: "Diaken",
      detail: "Wilayah Pluneng",
      image: majelis3,
    },
    {
      id: 4,
      name: "Dkn. Diaken 4",
      role: "Diaken",
      detail: "Wilayah Ngrundul",
      image: majelis4,
    },
    {
      id: 5,
      name: "Dkn. Diaken 5",
      role: "Diaken",
      detail: "Wilayah Prayan",
      image: majelis5,
    },
  ];

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
                {majelisPenatuaData.map((item) => (
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
                {majelisDiakenData.map((item) => (
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
