import { useNavigate } from "react-router-dom";
import "./KebonarumInfo.css";

const KebonarumInfo = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    window.scrollTo(0, 0);
    navigate("/about");
  };

  return (
    <section className="kebonarum-info-section">
      <div className="kebonarum-container">
        <div className="info-content">
          <h2 className="info-title">GKJ KEBONARUM</h2>

          <p className="info-description">
            Kebonarum is a vibrant community dedicated to fostering connections,
            sharing knowledge, and creating meaningful experiences. We host a
            variety of events and activities that bring people together to
            celebrate culture, learn new skills, and make a positive impact in
            our community.
          </p>

          <div className="view-all-button-container">
            <button className="custom-button" onClick={handleClick}>
              Selengkapnya
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default KebonarumInfo;
