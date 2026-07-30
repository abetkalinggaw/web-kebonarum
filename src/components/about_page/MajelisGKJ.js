import { useNavigate } from "react-router-dom";
import "./MajelisGKJ.css";
import majelis1 from "../../assets/majelis/majelis1.jpg";
import majelis2 from "../../assets/majelis/majelis2.jpg";
import majelis3 from "../../assets/majelis/majelis3.jpg";
import majelis4 from "../../assets/majelis/majelis4.jpg";
import majelis5 from "../../assets/majelis/majelis5.jpg";
import majelis6 from "../../assets/majelis/majelis6.jpg";

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
    {
      id: 6,
      name: "Nama Lengkap",
      role: "Penatua",
      image: majelis6,
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
  ];

  return (
    <section className="majelis-gkj-kebonarum">
      <div className="majelis-gkj-container">
        <div className="majelis-gkj-header">
          <h2 className="majelis-gkj-title">MAJELIS GKJ KEBONARUM</h2>
          <p className="majelis-gkj-description">
            Majelis GKJ Kebonarum adalah badan yang terdiri dari para penatua
            dan diaken yang bertugas memimpin, mengatur, dan mengawasi pelayanan
            gereja. Mereka bekerja sama dengan pendeta untuk memastikan bahwa
            gereja berjalan dengan baik dan sesuai dengan ajaran Alkitab.
          </p>
        </div>

        <div className="majelis-gkj-section">
          <h3 className="majelis-gkj-subtitle">Penatua</h3>
          <p className="majelis-gkj-sub-description">
            Penatua adalah anggota majelis yang dipilih untuk memimpin dan
            mengawasi pelayanan gereja. Mereka bertanggung jawab untuk
            memberikan bimbingan rohani, mengatur kegiatan gereja, dan
            memastikan bahwa gereja berjalan sesuai dengan ajaran Alkitab.
          </p>
          <div className="majelis-gkj-grid">
            {majelisPenatuaData.map((item) => (
              <div key={item.id} className="majelis-gkj-card">
                <div
                  className="majelis-gkj-image"
                  style={{ backgroundImage: `url(${item.image})` }}
                />
                <div className="majelis-gkj-info">
                  <h3 className="majelis-gkj-name">{item.name}</h3>
                  <p className="majelis-gkj-role">{item.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="majelis-gkj-section">
          <h3 className="majelis-gkj-subtitle">Diaken</h3>
          <p className="majelis-gkj-sub-description">
            Diaken adalah anggota majelis yang dipilih untuk melayani kebutuhan
            praktis gereja, seperti membantu dalam pelayanan sosial, mengatur
            keuangan gereja, dan memberikan dukungan kepada anggota jemaat yang
            membutuhkan. Mereka bekerja sama dengan penatua untuk memastikan
            bahwa gereja berjalan dengan baik dan sesuai dengan ajaran Alkitab.
          </p>
          <div className="majelis-gkj-grid">
            {majelisDiakenData.map((item) => (
              <div key={item.id} className="majelis-gkj-card">
                <div
                  className="majelis-gkj-image"
                  style={{ backgroundImage: `url(${item.image})` }}
                />
                <div className="majelis-gkj-info">
                  <h3 className="majelis-gkj-name">{item.name}</h3>
                  <p className="majelis-gkj-role">{item.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="custom-button-container">
        <button className="custom-button" onClick={handleClick}>
          Lihat Semua Majelis
        </button>
      </div>
    </section>
  );
};

export default MajelisGKJ;
