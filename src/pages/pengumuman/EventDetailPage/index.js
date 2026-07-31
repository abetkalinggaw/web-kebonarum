import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../../components/menu/Navbar";
import Footer from "../../../components/menu/Footer";
import "./EventDetailPage.css";

import event1 from "../../../assets/events/event1.jpg";
import event2 from "../../../assets/events/event2.jpg";
import event3 from "../../../assets/events/event3.jpg";
import event4 from "../../../assets/events/event4.jpg";
import event5 from "../../../assets/events/event5.jpg";

const fallbackEvents = [
  {
    id: 1,
    title: "Ibadah Minggu Raya",
    date: "2026-03-01",
    time: "06.00 WIB & 08.00 WIB",
    location: "Gedung GKJ Kebonarum Utama",
    type: "Ibadah",
    description:
      "Ibadah Minggu Raya jemaat GKJ Kebonarum dengan pelayanan sabda firman dan persekutuan jemaat.",
    content: [
      "Selamat datang dalam Ibadah Minggu Raya jemaat GKJ Kebonarum. Ibadah dilaksanakan dalam dua sesi, yaitu Sesi I pada pukul 06.00 WIB dan Sesi II pada pukul 08.00 WIB.",
      "Mari hadir dengan hati yang rindu akan firman Tuhan, mempersembahkan pujian dan syukur dalam persekutuan jemaat yang kudus.",
      "Diharapkan seluruh jemaat tetap menjaga ketertiban ibadah dan mengikuti arahan dari para diaken serta majelis penatalayanan.",
    ],
    organizer: "Majelis GKJ Kebonarum",
    image: event1,
  },
  {
    id: 2,
    title: "Persekutuan Doa Malam Jemaat",
    date: "2026-03-04",
    time: "19.00 WIB",
    location: "Ruang Serbaguna GKJ Kebonarum",
    type: "Persekutuan",
    description:
      "Persekutuan doa malam bersama seluruh jemaat dan majelis untuk saling menguatkan dalam doa.",
    content: [
      "Persekutuan Doa Malam merupakan wadah bagi seluruh jemaat GKJ Kebonarum untuk berkumpul, menaikkan ucapan syukur, serta saling mendoakan kebutuhan pelayanan dan kehidupan beriman.",
      "Acara akan diisi dengan pujian penyembahan, perenungan firman, dan sesi doa syafaat bersama untuk pergumulan jemaat, gereja, serta bangsa.",
      "Seluruh jemaat diundang hadir mengajak keluarga dan sesama saudara seiman.",
    ],
    organizer: "Komisi Doa & Diakonia",
    image: event2,
  },
  {
    id: 3,
    title: "Rapat Pleno Majelis Jemaat",
    date: "2026-03-10",
    time: "18.30 WIB",
    location: "Ruang Rapat Majelis",
    type: "Rapat",
    description:
      "Rapat koordinasi dan evaluasi pelayanan bulanan majelis penatua dan diaken GKJ Kebonarum.",
    content: [
      "Rapat Pleno Majelis Jemaat GKJ Kebonarum dilaksanakan rutin setiap bulan untuk membahas laporan keuangan, evaluasi program kerja komisi, serta perencanaan pelayanan mendatang.",
      "Dimohon kepada seluruh anggota Penatua dan Diaken untuk mempersiapkan laporan berkala masing-masing komisi dan hadir tepat waktu.",
    ],
    organizer: "Pengurus Harian Majelis",
    image: event3,
  },
  {
    id: 4,
    title: "Bakti Sosial Diakonia Kasih",
    date: "2026-03-15",
    time: "09.00 WIB",
    location: "Wilayah Sumberejo & Krosok",
    type: "Kegiatan",
    description:
      "Penyaluran bantuan sembako dan perhatian kasih bagi warga sekitar dan jemaat yang membutuhkan.",
    content: [
      "Sebagai wujud nyata warta kasih Kristus di tengah masyarakat, Komisi Diakonia GKJ Kebonarum menyelenggarakan aksi Bakti Sosial dan Penyaluran Sembako Kasih.",
      "Kegiatan ini menargetkan keluarga jemaat serta warga sekitar di wilayah Sumberejo dan Krosok yang membutuhkan uluran tangan.",
      "Bagi jemaat yang rindu mendukung kegiatan ini melalui bantuan persembahan atau barang dapat menghubungi panitia diakonia gereja.",
    ],
    organizer: "Komisi Diakonia & Pelayanan Sosial",
    image: event4,
  },
  {
    id: 5,
    title: "Persekutuan Pemuda Remaja (PRGKJ)",
    date: "2026-03-21",
    time: "16.30 WIB",
    location: "Gedung Pemuda GKJ Kebonarum",
    type: "Persekutuan",
    description:
      "Ibadah dan persekutuan rutin pemuda-pemudi GKJ Kebonarum dengan puji-pujian dan diskusi Alkitab.",
    content: [
      "Persekutuan Pemuda & Remaja GKJ Kebonarum (PRGKJ) mengundang seluruh anak muda untuk hadir dalam persekutuan hangat dan inspiratif.",
      "Acara diisi dengan akustik worship, pemahaman Alkitab aplikatif untuk kaum muda, serta ruang diskusi seputar tantangan hidup beriman di masa kini.",
      "Mari tumbuh bersama dalam iman dan persahabatan sejati di dalam Kristus!",
    ],
    organizer: "Komisi Pemuda Remaja GKJ",
    image: event5,
  },
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

function formatFullDate(dateStr) {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-").map(Number);
  return `${day} ${MONTHS_FULL_ID[month - 1]} ${year}`;
}

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const defaultIndex = Math.max(0, (Number(id) || 1) - 1) % fallbackEvents.length;
    const matched = fallbackEvents.find((e) => e.id === Number(id)) || fallbackEvents[defaultIndex];
    setEvent(matched);

    const fetchDetail = async () => {
      try {
        const response = await fetch(`http://localhost:5050/api/agenda/${id}`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.title) {
            setEvent({
              ...data,
              image: data.image || matched.image,
              content: data.content || matched.content,
            });
          }
        }
      } catch {
        // Fallback matched event already set
      }
    };

    fetchDetail();
  }, [id]);

  const handleBackClick = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate("/pengumuman/events");
  };

  const heroBg = event?.image || event1;

  return (
    <>
      <Navbar />
      <main className="event-detail-page">
        {/* HERO SECTION WITH EVENT THUMBNAIL AS BACKGROUND */}
        <section
          className="event-detail-hero"
          style={{ backgroundImage: `url(${heroBg})` }}
        >
          <div className="event-detail-hero-overlay" />
          <div className="event-detail-hero-content">
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
              Kembali ke Agenda
            </button>

            {event ? (
              <>
                <div className="event-detail-hero-tags">
                  <span
                    className={`agenda-type-tag type-${(
                      event.type || ""
                    ).toLowerCase()}`}
                  >
                    {event.type}
                  </span>
                  <span className="event-detail-hero-date">
                    {formatFullDate(event.date)}
                  </span>
                </div>

                <h1 className="event-detail-hero-title">{event.title}</h1>
                <p className="event-detail-hero-lead">{event.description}</p>
              </>
            ) : (
              <h1 className="event-detail-hero-title">Kegiatan Tidak Ditemukan</h1>
            )}
          </div>
        </section>

        {/* DETAIL CONTENT & SIDEBAR */}
        {event ? (
          <section className="event-detail-section">
            <div className="event-detail-container">
              <div className="event-detail-grid">
                {/* Main Article Body */}
                <article className="event-detail-article">
                  <div className="event-article-body">
                    <h2 className="event-article-heading">Tentang Kegiatan Ini</h2>
                    {event.content && event.content.length > 0 ? (
                      event.content.map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))
                    ) : (
                      <p>{event.description}</p>
                    )}
                  </div>
                </article>

                {/* Event Info Sidebar */}
                <aside className="event-detail-sidebar">
                  <div className="event-info-card">
                    <h3 className="info-card-title">Informasi Pelaksanaan</h3>
                    <div className="info-card-divider" />

                    <div className="info-item">
                      <div className="info-icon">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                      </div>
                      <div className="info-text">
                        <span className="info-label">Tanggal Hari</span>
                        <span className="info-value">{formatFullDate(event.date)}</span>
                      </div>
                    </div>

                    <div className="info-item">
                      <div className="info-icon">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                      </div>
                      <div className="info-text">
                        <span className="info-label">Waktu</span>
                        <span className="info-value">{event.time}</span>
                      </div>
                    </div>

                    <div className="info-item">
                      <div className="info-icon">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                      </div>
                      <div className="info-text">
                        <span className="info-label">Lokasi</span>
                        <span className="info-value">{event.location}</span>
                      </div>
                    </div>

                    {event.organizer && (
                      <div className="info-item">
                        <div className="info-icon">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                          </svg>
                        </div>
                        <div className="info-text">
                          <span className="info-label">Penyelenggara</span>
                          <span className="info-value">{event.organizer}</span>
                        </div>
                      </div>
                    )}

                    <div className="info-card-actions">
                      <button
                        type="button"
                        className="sidebar-action-btn"
                        onClick={handleBackClick}
                      >
                        Lihat Semua Agenda
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </section>
        ) : (
          <section className="event-detail-not-found">
            <h2>Kegiatan Tidak Ditemukan</h2>
            <p>Agenda kegiatan yang Anda cari tidak tersedia.</p>
            <button
              className="minimal-outline-btn"
              onClick={() => navigate("/pengumuman/events")}
            >
              Kembali ke Daftar Agenda
            </button>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
};

export default EventDetailPage;
