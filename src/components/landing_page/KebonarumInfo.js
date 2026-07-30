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
        <div className="info-glass-card">
          <span className="section-tag light">TENTANG GEREJA</span>
          <h2 className="info-title">GKJ Kebonarum Klaten</h2>

          <p className="info-description">
            Gereja Kristen Jawa Kebonarum berdedikasi untuk persekutuan iman yang berakar,
            bertumbuh, dan berbuah. Kami menyelenggarakan berbagai pelayanan ibadah,
            kegiatan sosial, dan pembinaan jemaat yang berdampak bagi masyarakat.
          </p>

          <div className="info-stats-grid">
            <div className="stat-item">
              <span className="stat-number">1971</span>
              <span className="stat-label">Tahun Berdiri</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">GKJ</span>
              <span className="stat-label">Sinode GKJ</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">Klaten</span>
              <span className="stat-label">Jawa Tengah</span>
            </div>
          </div>

          <div className="view-all-button-container">
            <button className="minimal-glass-btn" onClick={handleClick}>
              Selengkapnya
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default KebonarumInfo;
