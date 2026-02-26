import "./WartaGerejaPage.css";
import Navbar from "../../components/menu/Navbar";
import Footer from "../../components/menu/Footer";

const WartaGerejaPage = () => {
  const wartaList = [
    {
      id: 1,
      title: "Renungan Minggu Ini",
      date: "26 Februari 2024",
      excerpt:
        "Mari kita merenungkan firman Tuhan yang menceritakan tentang kasih karunia dan pengampunan dalam kehidupan sehari-hari kita.",
      content:
        "Dalam renungan minggu ini, kami mengajak seluruh jemaat untuk merenungkan makna kasih karunia Tuhan yang begitu besar bagi kehidupan kita. Firman Tuhan menunjukkan bahwa pengampunan adalah dasar dari iman Kristen yang sejati.",
    },
    {
      id: 2,
      title: "Jadwal Kegiatan Bulan Maret",
      date: "25 Februari 2024",
      excerpt:
        "Berikut adalah jadwal kegiatan gereja GKJ Kebonarum untuk bulan Maret 2024. Mohon perhatian dan partisipasi aktif dari seluruh jemaat.",
      content:
        "Bulan Maret akan ada berbagai kegiatan gereja yang penting termasuk persekutuan doa, kebaktian khusus, dan kegiatan pelayanan sosial kepada masyarakat sekitar.",
    },
    {
      id: 3,
      title: "Berita Gembira Dari Pelayanan",
      date: "24 Februari 2024",
      excerpt:
        "Tuhan telah melakukan hal-hal yang luar biasa melalui pelayanan gereja kami. Baca cerita sukses dari misi kita.",
      content:
        "Puji Tuhan, dalam beberapa minggu terakhir kami melihat bagaimana Tuhan bekerja luar biasa melalui pelayanan sosial dan misi penjangkauan kami kepada masyarakat yang membutuhkan.",
    },
    {
      id: 4,
      title: "Undangan Kebaktian Spesial",
      date: "23 Februari 2024",
      excerpt:
        "Kami mengundang seluruh jemaat untuk hadir dalam kebaktian spesial yang akan dilaksanakan minggu depan dengan pembicara tamu istimewa.",
      content:
        "Kebaktian spesial akan menghadirkan pembicara tamu yang berpengalaman untuk berbagi tentang kehidupan rohani dan pendalaman firman Tuhan di zaman yang penuh tantangan ini.",
    },
    {
      id: 5,
      title: "Program Pendampingan Jemaat Baru",
      date: "22 Februari 2024",
      excerpt:
        "Program baru untuk mendampingi jemaat yang baru bergabung dengan GKJ Kebonarum telah dimulai.",
      content:
        "Program pendampingan ini dirancang untuk membantu jemaat baru memahami nilai-nilai gereja dan terintegrasi dengan baik dalam komunitas GKJ Kebonarum.",
    },
    {
      id: 6,
      title: "Laporan Kolekta Sosial",
      date: "21 Februari 2024",
      excerpt:
        "Terima kasih atas dukungan jemaat dalam program kolekta sosial bulan Februari ini.",
      content:
        "Hasil kolekta sosial bulan ini telah disumbangkan kepada keluarga yang membutuhkan dan lembaga sosial yang kami dukung. Semoga berkah Tuhan selalu menyertai kebaikan jemaat.",
    },
  ];

  return (
    <>
      <Navbar />
      <main className="warta-gereja-page">
        <section className="warta-hero">
          <div className="warta-hero-content">
            <p className="warta-kicker">GKJ Kebonarum Klaten</p>
            <h1 className="warta-title">
              Warta Gereja
              <br />
              GKJ Kebonarum
            </h1>
            <p className="warta-lead">
              Dapatkan informasi terbaru seputar kegiatan, pengumuman, dan
              berita penting lainnya dari GKJ Kebonarum melalui Warta Gereja
              kami. Tetap terhubung dengan komunitas dan pelayanan gereja.
            </p>
          </div>
        </section>

        <section className="warta-section">
          <div className="warta-inner">
            <div className="warta-grid">
              {wartaList.map((warta) => (
                <article key={warta.id} className="warta-item">
                  <div className="warta-item-content">
                    <div className="warta-meta">
                      <time className="warta-date">{warta.date}</time>
                    </div>
                    <h2 className="warta-item-title">{warta.title}</h2>
                    <p className="warta-excerpt">{warta.excerpt}</p>
                    <p className="warta-read-more">
                      {warta.content.substring(0, 100)}...
                    </p>
                    <button className="warta-button">Baca Selengkapnya</button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default WartaGerejaPage;
