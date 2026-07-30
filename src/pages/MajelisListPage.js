import { useNavigate } from "react-router-dom";
import "./MajelisListPage.css";
import Navbar from "../components/menu/Navbar";
import Footer from "../components/menu/Footer";
import majelis1 from "../assets/majelis/majelis1.jpg";
import majelis2 from "../assets/majelis/majelis2.jpg";
import majelis3 from "../assets/majelis/majelis3.jpg";
import majelis4 from "../assets/majelis/majelis4.jpg";
import majelis5 from "../assets/majelis/majelis5.jpg";
import majelis6 from "../assets/majelis/majelis6.jpg";

const MajelisListPage = () => {
  const navigate = useNavigate();
  const handleBackClick = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate("/about");
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
    {
      id: 6,
      name: "Nama Lengkap",
      role: "Penatua",
      image: majelis6,
    },
    {
      id: 7,
      name: "Nama Lengkap",
      role: "Penatua",
      image: majelis1,
    },
    {
      id: 8,
      name: "Nama Lengkap",
      role: "Penatua",
      image: majelis2,
    },
    {
      id: 9,
      name: "Nama Lengkap",
      role: "Penatua",
      image: majelis3,
    },
    {
      id: 10,
      name: "Nama Lengkap",
      role: "Penatua",
      image: majelis4,
    },
    {
      id: 11,
      name: "Nama Lengkap",
      role: "Penatua",
      image: majelis5,
    },
    {
      id: 12,
      name: "Nama Lengkap",
      role: "Penatua",
      image: majelis6,
    },
    {
      id: 13,
      name: "Nama Lengkap",
      role: "Penatua",
      image: majelis1,
    },
    {
      id: 14,
      name: "Nama Lengkap",
      role: "Penatua",
      image: majelis2,
    },
    {
      id: 15,
      name: "Nama Lengkap",
      role: "Penatua",
      image: majelis3,
    },
    {
      id: 16,
      name: "Nama Lengkap",
      role: "Penatua",
      image: majelis4,
    },
    {
      id: 17,
      name: "Nama Lengkap",
      role: "Penatua",
      image: majelis5,
    },
    {
      id: 18,
      name: "Nama Lengkap",
      role: "Penatua",
      image: majelis6,
    },
    {
      id: 19,
      name: "Nama Lengkap",
      role: "Penatua",
      image: majelis1,
    },
    {
      id: 20,
      name: "Nama Lengkap",
      role: "Penatua",
      image: majelis2,
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
    {
      id: 6,
      name: "Nama Lengkap",
      role: "Diaken",
      image: majelis6,
    },
    {
      id: 7,
      name: "Nama Lengkap",
      role: "Diaken",
      image: majelis1,
    },
    {
      id: 8,
      name: "Nama Lengkap",
      role: "Diaken",
      image: majelis2,
    },
    {
      id: 9,
      name: "Nama Lengkap",
      role: "Diaken",
      image: majelis3,
    },
    {
      id: 10,
      name: "Nama Lengkap",
      role: "Diaken",
      image: majelis4,
    },
    {
      id: 11,
      name: "Nama Lengkap",
      role: "Diaken",
      image: majelis5,
    },
    {
      id: 12,
      name: "Nama Lengkap",
      role: "Diaken",
      image: majelis6,
    },
    {
      id: 13,
      name: "Nama Lengkap",
      role: "Diaken",
      image: majelis1,
    },
    {
      id: 14,
      name: "Nama Lengkap",
      role: "Diaken",
      image: majelis2,
    },
    {
      id: 15,
      name: "Nama Lengkap",
      role: "Diaken",
      image: majelis3,
    },
    {
      id: 16,
      name: "Nama Lengkap",
      role: "Diaken",
      image: majelis4,
    },
    {
      id: 17,
      name: "Nama Lengkap",
      role: "Diaken",
      image: majelis5,
    },
    {
      id: 18,
      name: "Nama Lengkap",
      role: "Diaken",
      image: majelis6,
    },
    {
      id: 19,
      name: "Nama Lengkap",
      role: "Diaken",
      image: majelis1,
    },
    {
      id: 20,
      name: "Nama Lengkap",
      role: "Diaken",
      image: majelis2,
    },
  ];

  return (
    <>
      <Navbar />
      <main className="majelis-list-page">
        <section className="majelis-list-hero">
          <div className="majelis-list-hero-content">
            <button className="back-button" onClick={handleBackClick}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M12.5 15L7.5 10L12.5 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Kembali
            </button>
            <p className="majelis-list-kicker">
              <span className="section-tag light">KEPEMIMPINAN GEREJA</span>
            </p>
            <h1 className="majelis-list-title">
              Majelis Jemaat GKJ Kebonarum
            </h1>
            <p className="majelis-list-lead">
              Majelis Jemaat GKJ Kebonarum yang terdiri dari para Penatua dan Diaken yang berdedikasi melayani dan memimpin jemaat dalam kasih.
            </p>
          </div>
        </section>

        <section className="majelis-list-section">
          <div className="majelis-list-inner">
            {/* Penatua Section */}
            <div className="majelis-section">
              <h2 className="majelis-section-title">Daftar Majelis Penatua</h2>
              <div className="majelis-grid">
                {majelisPenatuaData.map((member) => (
                  <div key={member.id} className="majelis-card">
                    <div
                      className="majelis-card-image"
                      style={{ backgroundImage: `url(${member.image})` }}
                    />
                    <div className="majelis-card-content">
                      <h3 className="majelis-card-name">{member.name}</h3>
                      <p className="majelis-card-role">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Diaken Section */}
            <div className="majelis-section">
              <h2 className="majelis-section-title">Daftar Majelis Diaken</h2>
              <div className="majelis-grid">
                {majelisDiakenData.map((member) => (
                  <div key={member.id} className="majelis-card">
                    <div
                      className="majelis-card-image"
                      style={{ backgroundImage: `url(${member.image})` }}
                    />
                    <div className="majelis-card-content">
                      <h3 className="majelis-card-name">{member.name}</h3>
                      <p className="majelis-card-role">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default MajelisListPage;
