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
      name: "Nama Lengkap",
      role: "Penatua",
      image: majelis1,
    },
    {
      id: 2,
      name: "Nama Lengkap",
      role: "Penatua",
      image: majelis2,
    },
    {
      id: 3,
      name: "Nama Lengkap",
      role: "Penatua",
      image: majelis3,
    },
    {
      id: 4,
      name: "Nama Lengkap",
      role: "Penatua",
      image: majelis4,
    },
    {
      id: 5,
      name: "Nama Lengkap",
      role: "Penatua",
      image: majelis5,
    },
  ];

  const majelisDiakenData = [
    {
      id: 1,
      name: "Nama Lengkap",
      role: "Diaken",
      image: majelis1,
    },
    {
      id: 2,
      name: "Nama Lengkap",
      role: "Diaken",
      image: majelis2,
    },
    {
      id: 3,
      name: "Nama Lengkap",
      role: "Diaken",
      image: majelis3,
    },
    {
      id: 4,
      name: "Nama Lengkap",
      role: "Diaken",
      image: majelis4,
    },
    {
      id: 5,
      name: "Nama Lengkap",
      role: "Diaken",
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

        <div className="majelis-gkj-section">
          <div className="majelis-sub-header">
            <span className="card-badge">PENATUA</span>
            <h3 className="majelis-gkj-subtitle">Penatua</h3>
            <p className="majelis-gkj-sub-description">
              Anggota majelis yang memimpin bimbingan rohani dan mengawasi
              pelayanan gereja sesuai ajaran Alkitab.
            </p>
          </div>
          <div className="majelis-gkj-grid">
            {majelisPenatuaData.map((item) => (
              <div key={item.id} className="majelis-gkj-card">
                <div
                  className="majelis-gkj-image"
                  style={{ backgroundImage: `url(${item.image})` }}
                />
                <div className="majelis-gkj-info">
                  <h3 className="majelis-gkj-name">{item.name}</h3>
                  <span className="majelis-role-tag">{item.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="majelis-gkj-section">
          <div className="majelis-sub-header">
            <span className="card-badge">DIAKEN</span>
            <h3 className="majelis-gkj-subtitle">Diaken</h3>
            <p className="majelis-gkj-sub-description">
              Anggota majelis yang melayani kebutuhan praktis, pelayanan sosial,
              dan perhatian diakonia jemaat.
            </p>
          </div>
          <div className="majelis-gkj-grid">
            {majelisDiakenData.map((item) => (
              <div key={item.id} className="majelis-gkj-card">
                <div
                  className="majelis-gkj-image"
                  style={{ backgroundImage: `url(${item.image})` }}
                />
                <div className="majelis-gkj-info">
                  <h3 className="majelis-gkj-name">{item.name}</h3>
                  <span className="majelis-role-tag">{item.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="custom-button-container">
        <button className="minimal-outline-btn" onClick={handleClick}>
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
    </section>
  );
};

export default MajelisGKJ;
