import "./WartaReadPage.css";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/menu/Navbar";
import Footer from "../../components/menu/Footer";

const wartaList = [
  {
    id: 1,
    title: "Warta Gereja Minggu, 1 Maret 2026",
    date: "2026-03-01",
    description:
      "Warta jemaat minggu pertama bulan Maret 2026, memuat pengumuman kegiatan ibadah, pelayanan diakonia, dan agenda persekutuan doa bersama jemaat GKJ Kebonarum.",
    content: [
      "Selamat datang di ibadah minggu pertama bulan Maret 2026. Kiranya kasih dan damai sejahtera Tuhan menyertai kita semua dalam setiap langkah pelayanan.",
      "Pengumuman kegiatan: Ibadah Pagi akan dilaksanakan pada pukul 07.30 WIB dan ibadah sore pada pukul 17.00 WIB. Diharapkan seluruh jemaat dapat hadir tepat waktu.",
      "Pelayanan diakonia bulan ini akan difokuskan pada bantuan sembako bagi jemaat yang membutuhkan. Jemaat yang ingin berpartisipasi dapat menghubungi majelis gereja.",
      "Persekutuan doa bersama akan diadakan setiap Rabu malam pukul 19.00 WIB di gedung gereja. Mari kita saling menguatkan dalam doa.",
      "Untuk informasi lebih lanjut tentang kegiatan gereja, silakan menghubungi sekretariat GKJ Kebonarum.",
    ],
  },
  {
    id: 2,
    title: "Warta Gereja Minggu, 22 Februari 2026",
    date: "2026-02-22",
    description:
      "Informasi kegiatan ibadah, jadwal pelayanan, serta laporan perkembangan renovasi gedung gereja dan rencana kegiatan Paskah mendatang.",
    content: [
      "Salam sejahtera dalam kasih Kristus. Pada minggu ini kita kembali berhimpun untuk bersyukur atas anugerah Tuhan yang selalu menyertai kita.",
      "Laporan renovasi gedung: Pekerjaan renovasi gedung gereja saat ini telah mencapai 60% dan diperkirakan akan selesai pada bulan April 2026. Ucapan terima kasih kami sampaikan kepada seluruh jemaat yang telah mendukung melalui doa dan persembahan.",
      "Persiapan Paskah: Panitia Paskah 2026 telah dibentuk. Terdapat berbagai kegiatan yang akan dipersiapkan, mulai dari ibadah Kamis Putih, Jumat Agung, hingga Kebaktian Pagi Paskah.",
      "Jadwal pelayanan bulan Maret akan segera diumumkan. Jemaat yang ingin terlibat dalam tim pelayanan dapat mendaftarkan diri kepada koordinator masing-masing bidang.",
    ],
  },
  {
    id: 3,
    title: "Warta Gereja Minggu, 15 Februari 2026",
    date: "2026-02-15",
    description:
      "Pengumuman pembentukan panitia hari jadi gereja, jadwal pemuda-pemudi, dan informasi terkait penerimaan anggota jemaat baru.",
    content: [
      "Puji syukur kepada Tuhan atas pertemuan kita kembali dalam ibadah hari ini. Kiranya firman Tuhan memperbarui semangat kita dalam melayani.",
      "Hari Jadi Gereja: Dalam rangka memperingati hari jadi GKJ Kebonarum, telah dibentuk panitia perayaan. Jemaat yang ingin berpartisipasi dalam kepanitiaan dapat menghubungi sekretariat gereja.",
      "Kegiatan Pemuda-Pemudi: Persekutuan Pemuda-Pemudi GKJ Kebonarum mengundang seluruh anak muda jemaat untuk hadir dalam pertemuan bulanan yang akan diadakan Sabtu ini pukul 16.00 WIB.",
      "Penerimaan Anggota Jemaat Baru: Bagi keluarga atau perorangan yang ingin menjadi anggota jemaat GKJ Kebonarum, silakan menghubungi majelis gereja untuk mendapatkan informasi lebih lanjut mengenai proses dan persyaratan.",
    ],
  },
  {
    id: 4,
    title: "Warta Gereja Minggu, 8 Februari 2026",
    date: "2026-02-08",
    description:
      "Warta jemaat memuat agenda pendampingan pastoral, kegiatan sekolah minggu, serta pengumuman dari majelis gereja untuk bulan Februari.",
    content: [
      "Selamat beribadah, jemaat GKJ Kebonarum yang terkasih. Tuhan memberkati persekutuan kita hari ini.",
      "Pendampingan Pastoral: Tim pastoral gereja akan mengadakan kunjungan ke rumah-rumah jemaat sepanjang bulan Februari. Jemaat yang ingin mendapatkan kunjungan dapat mendaftarkan diri melalui formulir yang tersedia di sekretariat.",
      "Sekolah Minggu: Kelas Sekolah Minggu untuk anak-anak dibuka setiap minggu bersamaan dengan ibadah pagi. Orang tua diharapkan mendaftarkan anak-anak mereka kepada pengurus Sekolah Minggu.",
      "Pengumuman Majelis: Rapat Majelis bulan Februari akan diadakan pada Selasa, 10 Februari 2026 pukul 19.00 WIB. Seluruh anggota majelis dimohon hadir tepat waktu.",
    ],
  },
  {
    id: 5,
    title: "Warta Gereja Minggu, 1 Februari 2026",
    date: "2026-02-01",
    description:
      "Laporan diakonia bulan Januari, informasi kunjungan majelis, jadwal ibadah rumah tangga, dan agenda persekutuan seluruh jemaat.",
    content: [
      "Memasuki bulan Februari, kita bersyukur atas penyertaan Tuhan sepanjang bulan Januari yang telah berlalu. Kiranya kasih dan damai-Nya terus menyertai perjalanan kita.",
      "Laporan Diakonia Januari 2026: Sepanjang bulan Januari, tim diakonia telah menyalurkan bantuan kepada 12 keluarga jemaat yang membutuhkan. Terima kasih atas kepercayaan dan dukungan jemaat dalam pelayanan ini.",
      "Ibadah Rumah Tangga: Jadwal ibadah rumah tangga bulan Februari telah tersedia dan dapat diambil di meja informasi gereja. Jemaat diundang untuk membuka pintu rumah sebagai tempat ibadah dan persekutuan.",
      "Agenda Persekutuan: Persekutuan jemaat seluruh GKJ Kebonarum akan diadakan pada akhir bulan Februari. Informasi tempat dan waktu akan segera diumumkan. Mari hadir dan mempererat tali persaudaraan kita sebagai satu tubuh Kristus.",
    ],
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
  const [year, month, day] = dateStr.split("-").map(Number);
  return `${day} ${MONTHS_FULL_ID[month - 1]} ${year}`;
}

const WartaReadPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const warta = wartaList.find((w) => w.id === Number(id));

  const handleBackClick = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate("/pengumuman/warta-gereja");
  };

  return (
    <>
      <Navbar />
      <main className="warta-read-page">
        <section className="warta-read-hero">
          <div className="warta-read-hero-content">
            <button className="back-button" onClick={handleBackClick}>
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
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Kembali ke Daftar Warta
            </button>

            {warta ? (
              <>
                <p className="warta-read-kicker">
                  {formatFullDate(warta.date)}
                </p>
                <h1 className="warta-read-hero-title">{warta.title}</h1>
                <p className="warta-read-hero-lead">{warta.description}</p>
              </>
            ) : (
              <h1 className="warta-read-hero-title">Warta Tidak Ditemukan</h1>
            )}
          </div>
        </section>

        {warta ? (
          <article className="warta-read-article">
            <div className="warta-read-body">
              {warta.content.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </article>
        ) : (
          <div className="warta-not-found">
            <h2>Warta tidak ditemukan</h2>
            <p>
              Warta gereja yang Anda cari tidak tersedia atau telah dihapus.
            </p>
            <button
              className="warta-read-btn"
              onClick={() => navigate("/pengumuman/warta-gereja")}
            >
              Kembali ke Daftar Warta
            </button>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default WartaReadPage;
