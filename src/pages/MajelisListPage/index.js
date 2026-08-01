import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MajelisListPage.css";
import Navbar from "../../components/menu/Navbar";
import Footer from "../../components/menu/Footer";
import { getMajelisData } from "../../services/majelisApi";
import majelis1 from "../../assets/majelis/majelis1.jpg";
import majelis2 from "../../assets/majelis/majelis2.jpg";
import majelis3 from "../../assets/majelis/majelis3.jpg";
import majelis4 from "../../assets/majelis/majelis4.jpg";
import majelis5 from "../../assets/majelis/majelis5.jpg";
import majelis6 from "../../assets/majelis/majelis6.jpg";

const MAJELIS_IMAGES = [
  majelis1,
  majelis2,
  majelis3,
  majelis4,
  majelis5,
  majelis6,
];

const formatPenatuaName = (name) => {
  if (!name) return "Pnt. Penatua";
  if (
    name.startsWith("Pnt.") ||
    name.startsWith("Pdm.") ||
    name.startsWith("Dkn.")
  )
    return name;
  return `Pnt. ${name}`;
};

const formatDiakenName = (name) => {
  if (!name) return "Dkn. Diaken";
  if (
    name.startsWith("Dkn.") ||
    name.startsWith("Pnt.") ||
    name.startsWith("Pdm.")
  )
    return name;
  return `Dkn. ${name}`;
};

const MajelisListPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'penatua' | 'diaken'
  const [penatuaList, setPenatuaList] = useState([]);
  const [diakenList, setDiakenList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMajelis = async () => {
      setLoading(true);
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
              image:
                item.imageUrl || MAJELIS_IMAGES[idx % MAJELIS_IMAGES.length],
            }));

          const diakens = rawData
            .filter((item) => item.subPeran === "Diaken")
            .map((item, idx) => ({
              id: item.id || `dkn_${idx}`,
              name: formatDiakenName(item.namaLengkap),
              role: "Diaken",
              detail: `Wilayah ${item.wilayah || "Kebonarum"}`,
              image:
                item.imageUrl || MAJELIS_IMAGES[idx % MAJELIS_IMAGES.length],
            }));

          setPenatuaList(penatuas);
          setDiakenList(diakens);
        }
      } catch (err) {
        console.warn(
          "Using default fallback for majelis list page:",
          err.message,
        );
      } finally {
        setLoading(false);
      }
    };

    loadMajelis();
  }, []);

  const handleBackClick = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate("/about");
  };

  const filterMembers = (members) => {
    if (!searchQuery.trim()) return members;
    const query = searchQuery.toLowerCase();
    return members.filter(
      (m) =>
        m.name.toLowerCase().includes(query) ||
        m.role.toLowerCase().includes(query) ||
        m.detail.toLowerCase().includes(query),
    );
  };

  const filteredPenatua = filterMembers(penatuaList);
  const filteredDiaken = filterMembers(diakenList);

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
            <button
              className="back-button"
              onClick={handleBackClick}
              type="button"
            >
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

            <h1 className="majelis-list-title">Majelis Jemaat GKJ Kebonarum</h1>
            <p className="majelis-list-lead">
              Para Penatua dan Diaken yang dipanggil dan diutus untuk melayani,
              membimbing, serta memelihara persekutuan jemaat GKJ Kebonarum
              dalam kasih Kristus.
            </p>

            <div className="majelis-hero-stats">
              <span className="hero-stat-text">
                <strong className="stat-num">{penatuaList.length}</strong>{" "}
                Penatua
              </span>
              <span className="hero-stat-dot">•</span>
              <span className="hero-stat-text">
                <strong className="stat-num">{diakenList.length}</strong> Diaken
              </span>
              <span className="hero-stat-dot">•</span>
              <span className="hero-stat-text">
                <strong className="stat-num">5</strong> Wilayah
              </span>
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
                  Semua ({penatuaList.length + diakenList.length})
                </button>
                <button
                  type="button"
                  className={`majelis-tab ${activeTab === "penatua" ? "active" : ""}`}
                  onClick={() => setActiveTab("penatua")}
                >
                  Penatua ({penatuaList.length})
                </button>
                <button
                  type="button"
                  className={`majelis-tab ${activeTab === "diaken" ? "active" : ""}`}
                  onClick={() => setActiveTab("diaken")}
                >
                  Diaken ({diakenList.length})
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

            {loading ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "4rem 0",
                  color: "#8a7a6a",
                  fontSize: "1.1rem",
                }}
              >
                Memuat data majelis...
              </div>
            ) : (
              <>
                {/* Empty State */}
                {totalResults === 0 && (
                  <div className="majelis-empty-state">
                    <div className="empty-icon">🔍</div>
                    <h3>Majelis Tidak Ditemukan</h3>
                    <p>
                      Tidak ada anggota majelis yang cocok dengan kata kunci
                      &ldquo;{searchQuery}&rdquo;.
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
                          Memelihara pengajaran, ketertiban, dan pemeliharaan
                          rohani jemaat GKJ Kebonarum.
                        </p>
                      </div>
                      <span className="count-badge">
                        {filteredPenatua.length} Anggota
                      </span>
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
                            <p className="majelis-card-detail">
                              {member.detail}
                            </p>
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
                          Melayani kebutuhan diakonia, perhatian kasih, dan
                          kepedulian sosial jemaat.
                        </p>
                      </div>
                      <span className="count-badge">
                        {filteredDiaken.length} Anggota
                      </span>
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
                            <p className="majelis-card-detail">
                              {member.detail}
                            </p>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Bottom Back Button Container */}
            <div className="majelis-cta-container">
              <button
                className="majelis-cta-btn"
                onClick={handleBackClick}
                type="button"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{ transform: "rotate(180deg)" }}
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
                Kembali Ke Tentang GKJ Kebonarum
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default MajelisListPage;
