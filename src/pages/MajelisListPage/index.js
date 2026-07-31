import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MajelisListPage.css";
import Navbar from "../../components/menu/Navbar";
import Footer from "../../components/menu/Footer";
import majelis1 from "../../assets/majelis/majelis1.jpg";
import majelis2 from "../../assets/majelis/majelis2.jpg";
import majelis3 from "../../assets/majelis/majelis3.jpg";
import majelis4 from "../../assets/majelis/majelis4.jpg";
import majelis5 from "../../assets/majelis/majelis5.jpg";
import majelis6 from "../../assets/majelis/majelis6.jpg";

const MajelisListPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'penatua' | 'diaken'

  const handleBackClick = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate("/about");
  };

  const majelisPenatuaData = [
    { id: "p1", name: "Dkn. / Pnt. Penatua 1", role: "Penatua", detail: "Wilayah Sumberejo", image: majelis1 },
    { id: "p2", name: "Pnt. Penatua 2", role: "Penatua", detail: "Wilayah Krosok", image: majelis2 },
    { id: "p3", name: "Pnt. Penatua 3", role: "Penatua", detail: "Wilayah Pluneng", image: majelis3 },
    { id: "p4", name: "Pnt. Penatua 4", role: "Penatua", detail: "Wilayah Ngrundul", image: majelis4 },
    { id: "p5", name: "Pnt. Penatua 5", role: "Penatua", detail: "Wilayah Prayan", image: majelis5 },
    { id: "p6", name: "Pnt. Penatua 6", role: "Penatua", detail: "Wilayah Sumberejo", image: majelis6 },
    { id: "p7", name: "Pnt. Penatua 7", role: "Penatua", detail: "Wilayah Krosok", image: majelis1 },
    { id: "p8", name: "Pnt. Penatua 8", role: "Penatua", detail: "Wilayah Pluneng", image: majelis2 },
    { id: "p9", name: "Pnt. Penatua 9", role: "Penatua", detail: "Wilayah Ngrundul", image: majelis3 },
    { id: "p10", name: "Pnt. Penatua 10", role: "Penatua", detail: "Wilayah Prayan", image: majelis4 },
    { id: "p11", name: "Pnt. Penatua 11", role: "Penatua", detail: "Wilayah Sumberejo", image: majelis5 },
    { id: "p12", name: "Pnt. Penatua 12", role: "Penatua", detail: "Wilayah Krosok", image: majelis6 },
    { id: "p13", name: "Pnt. Penatua 13", role: "Penatua", detail: "Wilayah Pluneng", image: majelis1 },
    { id: "p14", name: "Pnt. Penatua 14", role: "Penatua", detail: "Wilayah Ngrundul", image: majelis2 },
    { id: "p15", name: "Pnt. Penatua 15", role: "Penatua", detail: "Wilayah Prayan", image: majelis3 },
    { id: "p16", name: "Pnt. Penatua 16", role: "Penatua", detail: "Wilayah Sumberejo", image: majelis4 },
    { id: "p17", name: "Pnt. Penatua 17", role: "Penatua", detail: "Wilayah Krosok", image: majelis5 },
    { id: "p18", name: "Pnt. Penatua 18", role: "Penatua", detail: "Wilayah Pluneng", image: majelis6 },
    { id: "p19", name: "Pnt. Penatua 19", role: "Penatua", detail: "Wilayah Ngrundul", image: majelis1 },
    { id: "p20", name: "Pnt. Penatua 20", role: "Penatua", detail: "Wilayah Prayan", image: majelis2 },
  ];

  const majelisDiakenData = [
    { id: "d1", name: "Dkn. Diaken 1", role: "Diaken", detail: "Wilayah Sumberejo", image: majelis1 },
    { id: "d2", name: "Dkn. Diaken 2", role: "Diaken", detail: "Wilayah Krosok", image: majelis2 },
    { id: "d3", name: "Dkn. Diaken 3", role: "Diaken", detail: "Wilayah Pluneng", image: majelis3 },
    { id: "d4", name: "Dkn. Diaken 4", role: "Diaken", detail: "Wilayah Ngrundul", image: majelis4 },
    { id: "d5", name: "Dkn. Diaken 5", role: "Diaken", detail: "Wilayah Prayan", image: majelis5 },
    { id: "d6", name: "Dkn. Diaken 6", role: "Diaken", detail: "Wilayah Sumberejo", image: majelis6 },
    { id: "d7", name: "Dkn. Diaken 7", role: "Diaken", detail: "Wilayah Krosok", image: majelis1 },
    { id: "d8", name: "Dkn. Diaken 8", role: "Diaken", detail: "Wilayah Pluneng", image: majelis2 },
    { id: "d9", name: "Dkn. Diaken 9", role: "Diaken", detail: "Wilayah Ngrundul", image: majelis3 },
    { id: "d10", name: "Dkn. Diaken 10", role: "Diaken", detail: "Wilayah Prayan", image: majelis4 },
    { id: "d11", name: "Dkn. Diaken 11", role: "Diaken", detail: "Wilayah Sumberejo", image: majelis5 },
    { id: "d12", name: "Dkn. Diaken 12", role: "Diaken", detail: "Wilayah Krosok", image: majelis6 },
    { id: "d13", name: "Dkn. Diaken 13", role: "Diaken", detail: "Wilayah Pluneng", image: majelis1 },
    { id: "d14", name: "Dkn. Diaken 14", role: "Diaken", detail: "Wilayah Ngrundul", image: majelis2 },
    { id: "d15", name: "Dkn. Diaken 15", role: "Diaken", detail: "Wilayah Prayan", image: majelis3 },
    { id: "d16", name: "Dkn. Diaken 16", role: "Diaken", detail: "Wilayah Sumberejo", image: majelis4 },
    { id: "d17", name: "Dkn. Diaken 17", role: "Diaken", detail: "Wilayah Krosok", image: majelis5 },
    { id: "d18", name: "Dkn. Diaken 18", role: "Diaken", detail: "Wilayah Pluneng", image: majelis6 },
    { id: "d19", name: "Dkn. Diaken 19", role: "Diaken", detail: "Wilayah Ngrundul", image: majelis1 },
    { id: "d20", name: "Dkn. Diaken 20", role: "Diaken", detail: "Wilayah Prayan", image: majelis2 },
  ];

  const filterMembers = (members) => {
    if (!searchQuery.trim()) return members;
    const query = searchQuery.toLowerCase();
    return members.filter(
      (m) =>
        m.name.toLowerCase().includes(query) ||
        m.role.toLowerCase().includes(query) ||
        m.detail.toLowerCase().includes(query)
    );
  };

  const filteredPenatua = filterMembers(majelisPenatuaData);
  const filteredDiaken = filterMembers(majelisDiakenData);

  const showPenatua = activeTab === "all" || activeTab === "penatua";
  const showDiaken = activeTab === "all" || activeTab === "diaken";
  const totalResults =
    (showPenatua ? filteredPenatua.length : 0) +
    (showDiaken ? filteredDiaken.length : 0);

  return (
    <>
      <Navbar />
      <main className="majelis-list-page">
        {/* HERO SECTION */}
        <section className="majelis-list-hero">
          <div className="majelis-list-hero-content">
            <button className="back-button" onClick={handleBackClick} type="button">
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
              Para Penatua dan Diaken yang dipanggil dan diutus untuk melayani, membimbing, serta memelihara persekutuan jemaat GKJ Kebonarum dalam kasih Kristus.
            </p>

            <div className="majelis-hero-stats">
              <div className="hero-stat-pill">
                <span className="stat-num">{majelisPenatuaData.length}</span>
                <span className="stat-label">Penatua</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat-pill">
                <span className="stat-num">{majelisDiakenData.length}</span>
                <span className="stat-label">Diaken</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat-pill">
                <span className="stat-num">5</span>
                <span className="stat-label">Wilayah</span>
              </div>
            </div>
          </div>
        </section>

        {/* TOOLBAR & CONTENT SECTION */}
        <section className="majelis-list-section">
          <div className="majelis-list-inner">
            {/* Filter & Search Bar */}
            <div className="majelis-toolbar">
              <div className="majelis-tabs">
                <button
                  type="button"
                  className={`majelis-tab ${activeTab === "all" ? "active" : ""}`}
                  onClick={() => setActiveTab("all")}
                >
                  Semua ({majelisPenatuaData.length + majelisDiakenData.length})
                </button>
                <button
                  type="button"
                  className={`majelis-tab ${activeTab === "penatua" ? "active" : ""}`}
                  onClick={() => setActiveTab("penatua")}
                >
                  Penatua ({majelisPenatuaData.length})
                </button>
                <button
                  type="button"
                  className={`majelis-tab ${activeTab === "diaken" ? "active" : ""}`}
                  onClick={() => setActiveTab("diaken")}
                >
                  Diaken ({majelisDiakenData.length})
                </button>
              </div>

              <div className="majelis-search-box">
                <svg
                  className="search-icon"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="Cari nama majelis atau wilayah..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="majelis-search-input"
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="clear-search-btn"
                    onClick={() => setSearchQuery("")}
                    aria-label="Bersihkan pencarian"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Empty State */}
            {totalResults === 0 && (
              <div className="majelis-empty-state">
                <div className="empty-icon">🔍</div>
                <h3>Majelis Tidak Ditemukan</h3>
                <p>
                  Tidak ada anggota majelis yang cocok dengan kata kunci &ldquo;{searchQuery}&rdquo;.
                </p>
                <button
                  type="button"
                  className="reset-filter-btn"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveTab("all");
                  }}
                >
                  Tampilkan Semua Majelis
                </button>
              </div>
            )}

            {/* PENATUA SECTION */}
            {showPenatua && filteredPenatua.length > 0 && (
              <div className="majelis-section">
                <div className="majelis-section-header">
                  <div>
                    <span className="section-tag accent">PENATUA</span>
                    <h2 className="majelis-section-title">
                      Daftar Majelis Penatua
                    </h2>
                    <p className="majelis-section-subtitle">
                      Memelihara pengajaran, ketertiban, dan pemeliharaan rohani jemaat GKJ Kebonarum.
                    </p>
                  </div>
                  <span className="count-badge">{filteredPenatua.length} Anggota</span>
                </div>

                <div className="batik-rule">
                  <span className="batik-rule--icon">❖</span>
                </div>

                <div className="majelis-grid">
                  {filteredPenatua.map((member) => (
                    <article key={member.id} className="majelis-card">
                      <div
                        className="majelis-card-image"
                        style={{ backgroundImage: `url(${member.image})` }}
                      >
                        <span className="role-tag role-tag--penatua">
                          Penatua
                        </span>
                        <div className="majelis-card-overlay" />
                      </div>
                      <div className="majelis-card-content">
                        <h3 className="majelis-card-name">{member.name}</h3>
                        <p className="majelis-card-detail">{member.detail}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {/* DIAKEN SECTION */}
            {showDiaken && filteredDiaken.length > 0 && (
              <div className="majelis-section">
                <div className="majelis-section-header">
                  <div>
                    <span className="section-tag">DIAKEN</span>
                    <h2 className="majelis-section-title">
                      Daftar Majelis Diaken
                    </h2>
                    <p className="majelis-section-subtitle">
                      Melayani kebutuhan diakonia, perhatian kasih, dan kepedulian sosial jemaat.
                    </p>
                  </div>
                  <span className="count-badge">{filteredDiaken.length} Anggota</span>
                </div>

                <div className="batik-rule">
                  <span className="batik-rule--icon">❖</span>
                </div>

                <div className="majelis-grid">
                  {filteredDiaken.map((member) => (
                    <article key={member.id} className="majelis-card">
                      <div
                        className="majelis-card-image"
                        style={{ backgroundImage: `url(${member.image})` }}
                      >
                        <span className="role-tag role-tag--diaken">
                          Diaken
                        </span>
                        <div className="majelis-card-overlay" />
                      </div>
                      <div className="majelis-card-content">
                        <h3 className="majelis-card-name">{member.name}</h3>
                        <p className="majelis-card-detail">{member.detail}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default MajelisListPage;

