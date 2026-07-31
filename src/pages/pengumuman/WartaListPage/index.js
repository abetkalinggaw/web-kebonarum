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
  const groupedWarta = groupByMonth(wartaList);

  const navigateTo = (path) => {
    const publicUrl = process.env.PUBLIC_URL || "";
    let basePath = "";
    if (publicUrl) {
      try {
        basePath = new URL(publicUrl, window.location.origin).pathname.replace(
          /\/+$/,
          "",
        );
      } catch {
        basePath = publicUrl.replace(/\/+$/, "");
      }
    }
    window.location.assign(`${basePath}${path}`);
  };

  return (
    <>
      <Navbar />
      <main className="warta-list-page">
        <section className="warta-hero">
          <div className="warta-hero-content">
            <span className="section-tag light">GKJ KEBONARUM KLATEN</span>
            <h1 className="warta-title">
              Warta Gereja GKJ Kebonarum
            </h1>
            <p className="warta-lead">
              Kumpulan warta jemaat GKJ Kebonarum. Temukan pengumuman, jadwal
              kegiatan, dan informasi pelayanan gereja setiap minggunya.
            </p>
          </div>
        </section>

        <section className="warta-list-section">
          <div className="warta-list-inner">
            {wartaList.length === 0 ? (
              <div className="warta-empty">
                <div className="warta-empty-icon">📋</div>
                <p>Belum ada warta gereja yang tersedia.</p>
              </div>
            ) : (
              <div className="warta-months">
                {groupedWarta.map(({ key, month, year, items }) => (
                  <div key={key} className="warta-month-group">
                    <h3 className="warta-month-heading">
                      {MONTHS_FULL_ID[month - 1]} {year}
                    </h3>
                    <div className="warta-grid">
                      {items.map((warta) => {
                        const { day, month: m } = parseDate(warta.date);
                        return (
                          <article key={warta.id} className="warta-card">
                            <div className="warta-card-body">
                              <div className="warta-card-meta">
                                <span className="warta-card-date-day">
                                  {day}
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
                              <button
                                className="warta-read-btn"
                                onClick={() =>
                                  navigateTo(
                                    `/pengumuman/warta-gereja/${warta.id}`,
                                  )
                                }
                              >
                                Baca Warta
                                <svg
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <line x1="5" y1="12" x2="19" y2="12" />
                                  <polyline points="12 5 19 12 12 19" />
                                </svg>
                              </button>
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
