import "./PendetaGKJ.css";
import pendeta1 from "../../assets/pdt/pendeta1.jpeg";
import pendeta2 from "../../assets/pdt/pendeta2.jpeg";

const PendetaGKJ = () => {
  const pendetaData = [
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
    <section className="pendeta-gkj-kebonarum">
      <div className="pendeta-gkj-container">
        <div className="section-header-minimal">
          <span className="section-tag">PELAYAN FIRMAN</span>
          <h2 className="section-title-minimal">Pendeta GKJ Kebonarum</h2>
          <p className="section-subtitle-minimal">
            Pemimpin rohani yang membimbing jemaat dalam kehidupan iman,
            pengajaran Alkitab, dan dukungan pastoral.
          </p>
        </div>

        <div className="pendeta-gkj-grid">
          {pendetaData.map((item) => (
            <div key={item.id} className="pendeta-gkj-card">
              <div
                className="pendeta-gkj-image"
                style={{ backgroundImage: `url(${item.image})` }}
              >
                <div className="pendeta-gkj-overlay"></div>
              </div>
              <div className="pendeta-gkj-info">
                <span className="pendeta-role-badge">Pendeta Jemaat</span>
                <h3 className="pendeta-gkj-name">{item.name}</h3>
                <p className="pendeta-gkj-subtitle">{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PendetaGKJ;
