import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./WartaListPage.css";
import Navbar from "../../../components/menu/Navbar";
import Footer from "../../../components/menu/Footer";

const wartaList = [
  {
    id: 1,
    title: "Warta Gereja Minggu, 1 Maret 2026",
    date: "2026-03-01",
    description:
      "Warta jemaat minggu pertama bulan Maret 2026, memuat pengumuman kegiatan ibadah, pelayanan diakonia, dan agenda persekutuan doa bersama jemaat GKJ Kebonarum.",
  },
  {
    id: 2,
    title: "Warta Gereja Minggu, 22 Februari 2026",
    date: "2026-02-22",
    description:
      "Informasi kegiatan ibadah, jadwal pelayanan, serta laporan perkembangan renovasi gedung gereja dan rencana kegiatan Paskah mendatang.",
  },
  {
    id: 3,
    title: "Warta Gereja Minggu, 15 Februari 2026",
    date: "2026-02-15",
    description:
      "Pengumuman pembentukan panitia hari jadi gereja, jadwal pemuda-pemudi, dan informasi terkait penerimaan anggota jemaat baru.",
  },
  {
    id: 4,
    title: "Warta Gereja Minggu, 8 Februari 2026",
    date: "2026-02-08",
    description:
      "Warta jemaat memuat agenda pendampingan pastoral, kegiatan sekolah minggu, serta pengumuman dari majelis gereja untuk bulan Februari.",
  },
  {
    id: 5,
    title: "Warta Gereja Minggu, 1 Februari 2026",
    date: "2026-02-01",
    description:
      "Laporan diakonia bulan Januari, informasi kunjungan majelis, jadwal ibadah rumah tangga, dan agenda persekutuan seluruh jemaat.",
  },
];

const MONTHS_ID = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

const MONTHS_FULL_ID = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

function parseDate(dateStr) {
  const [year, month, day] = dateStr.split("-").map(Number);
  return { day, month, year };
}

function groupByMonth(list) {
  const groups = [];
  const seen = {};
  list.forEach((warta) => {
    const { month, year } = parseDate(warta.date);
    const key = `${year}-${month}`;
    if (!seen[key]) {
      seen[key] = true;
      groups.push({ key, month, year, items: [] });
    }
    groups.find((g) => g.key === key).items.push(warta);
  });
  return groups;
}

const WartaListPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleBackClick = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate("/");
  };

  const filteredWarta = wartaList.filter(
    (warta) =>
      warta.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      warta.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      warta.date.includes(searchQuery)
  );

  const groupedWarta = groupByMonth(filteredWarta);

  return (
    <>
      <Navbar />
      <main className="warta-list-page">
        {/* HERO SECTION */}
        <section className="warta-hero">
          <div className="warta-hero-content">
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
            <p className="warta-kicker">
              <span className="section-tag light">WARTA JEMAAT</span>
            </p>
            <h1 className="warta-title">
              Warta Gereja GKJ Kebonarum
            </h1>
            <p className="warta-lead">
              Kumpulan warta jemaat GKJ Kebonarum. Temukan pengumuman resmi, jadwal
              kegiatan, serta warta pelayanan gereja setiap minggunya.
            </p>
          </div>
        </section>

        {/* CONTENT & SEARCH SECTION */}
        <section className="warta-list-section">
          <div className="warta-list-inner">
            {/* Toolbar Search */}
            <div className="warta-toolbar">
              <div className="warta-search-box">
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
                  placeholder="Cari warta gereja berdasarkan judul atau tanggal..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="warta-search-input"
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
              <span className="warta-total-badge">
                {filteredWarta.length} Warta Tersedia
              </span>
            </div>

            {filteredWarta.length === 0 ? (
              <div className="warta-empty">
                <div className="warta-empty-icon">📋</div>
                <h3>Warta Tidak Ditemukan</h3>
                <p>
                  Tidak ada warta gereja yang cocok dengan pencarian &ldquo;{searchQuery}&rdquo;.
                </p>
                <button
                  type="button"
                  className="reset-filter-btn"
                  onClick={() => setSearchQuery("")}
                >
                  Tampilkan Semua Warta
                </button>
              </div>
            ) : (
              <div className="warta-months">
                {groupedWarta.map(({ key, month, year, items }) => (
                  <div key={key} className="warta-month-group">
                    <div className="warta-month-header">
                      <h2 className="warta-month-heading">
                        {MONTHS_FULL_ID[month - 1]} {year}
                      </h2>
                      <div className="batik-rule">
                        <span className="batik-rule--icon">❖</span>
                      </div>
                    </div>

                    <div className="warta-grid">
                      {items.map((warta) => {
                        const { day, month: m } = parseDate(warta.date);
                        return (
                          <article
                            key={warta.id}
                            className="warta-card"
                            onClick={() => navigate(`/pengumuman/warta-gereja/${warta.id}`)}
                          >
                            <div className="warta-card-body">
                              <div className="warta-card-meta">
                                <span className="warta-card-date-day">
                                  {day < 10 ? `0${day}` : day}
                                </span>
                                <span className="warta-card-date-month">
                                  {MONTHS_ID[m - 1]}
                                </span>
                                <span className="warta-card-date-year">
                                  {year}
                                </span>
                              </div>
                              <div className="warta-card-divider" />
                              <div className="warta-card-content">
                                <h3 className="warta-card-title">
                                  {warta.title}
                                </h3>
                                <p className="warta-card-description">
                                  {warta.description}
                                </p>
                              </div>
                            </div>
                            <div className="warta-card-footer">
                              <span className="warta-read-btn">
                                Baca Warta
                                <svg
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  width="16"
                                  height="16"
                                >
                                  <line x1="5" y1="12" x2="19" y2="12" />
                                  <polyline points="12 5 19 12 12 19" />
                                </svg>
                              </span>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default WartaListPage;

