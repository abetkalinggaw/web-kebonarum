import "./PendetaCarousel.css";
import pendeta1 from "../../assets/pdt/pendeta1.jpeg";
import pendeta2 from "../../assets/pdt/pendeta2.jpeg";

const PendetaCarousel = () => {
  const pendeta = [
    {
      id: 1,
      name: "Pdt. Nama Lengkap",
      subtitle:
        "Lorem ipsum dolor sit amet consectetur. Convallis faucibus augue porttitor vestibulum. Aliquam ac eget venenatis integer. ",
      image: pendeta1,
    },
    {
      id: 2,
      name: "Pdt. Nama Lengkap",
      subtitle:
        "Lorem ipsum dolor sit amet consectetur. Convallis faucibus augue porttitor vestibulum. Aliquam ac eget venenatis integer. ",
      image: pendeta2,
    },
    {
      id: 3,
      name: "Pdt. Nama Lengkap",
      subtitle:
        "Lorem ipsum dolor sit amet consectetur. Convallis faucibus augue porttitor vestibulum. Aliquam ac eget venenatis integer. ",
      image: pendeta1,
    },
    {
      id: 4,
      name: "Pdt. Nama Lengkap",
      subtitle:
        "Lorem ipsum dolor sit amet consectetur. Convallis faucibus augue porttitor vestibulum. Aliquam ac eget venenatis integer. ",
      image: pendeta2,
    },
  ];

  return (
    <section className="pendeta-section">
      <div className="pendeta-container">
        <div className="section-header-minimal">
          <span className="section-tag">PELAYAN FIRMAN</span>
          <h2 className="section-title-minimal">Pendeta GKJ Kebonarum</h2>
        </div>

        <div className="pendeta-grid">
          {pendeta.map((item) => (
            <div key={item.id} className="pendeta-card">
              <div
                className="pendeta-image-box"
                style={{ backgroundImage: `url(${item.image})` }}
              >
                <div className="pendeta-overlay"></div>
              </div>
              <div className="pendeta-info-card">
                <span className="pendeta-role-tag">Pendeta Jemaat</span>
                <h3 className="pendeta-name">{item.name}</h3>
                <p className="pendeta-subtitle">{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PendetaCarousel;
