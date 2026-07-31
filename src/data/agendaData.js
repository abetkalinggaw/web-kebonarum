import event1 from "../assets/events/event1.jpg";
import event2 from "../assets/events/event2.jpg";
import event3 from "../assets/events/event3.jpg";
import event4 from "../assets/events/event4.jpg";
import event5 from "../assets/events/event5.jpg";

export const agendaData = [
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
    badge: "Pusat Persekutuan",
    iconClass: "fas fa-church",
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
    badge: "Doa Syafaat",
    iconClass: "fas fa-hands-praying",
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
    badge: "Koordinasi",
    iconClass: "fas fa-users-cog",
    image: event3,
  },
  {
    id: 4,
    title: "Aksi Sosial Sembako & Kasih",
    date: "2026-03-15",
    time: "09.00 WIB",
    location: "Wilayah Sumberejo & Krosok",
    type: "Kegiatan",
    description:
      "Pembagian 150 paket sembako untuk warga sekitar Kebonarum yang membutuhkan sebagai wujud nyata kasih Kristus.",
    content: [
      "Sebagai wujud nyata warta kasih Kristus di tengah masyarakat, Komisi Diakonia GKJ Kebonarum menyelenggarakan aksi Bakti Sosial dan Penyaluran Sembako Kasih.",
      "Kegiatan ini menargetkan keluarga jemaat serta warga sekitar di wilayah Sumberejo dan Krosok yang membutuhkan uluran tangan.",
      "Bagi jemaat yang rindu mendukung kegiatan ini melalui bantuan persembahan atau barang dapat menghubungi panitia diakonia gereja.",
    ],
    organizer: "Komisi Diakonia & Pelayanan Sosial",
    badge: "Sosial & Kepedulian",
    iconClass: "fas fa-hand-holding-heart",
    image: event4,
  },
  {
    id: 5,
    title: "Donor Darah Rutin Jemaat",
    date: "2026-03-18",
    time: "08.00 WIB",
    location: "Aula Gereja GKJ Kebonarum",
    type: "Kegiatan",
    description:
      "Bekerja sama dengan PMI Klaten, kegiatan donor darah berhasil mengumpulkan kantong darah untuk kemanusiaan.",
    content: [
      "Komisi Diakonia bekerjasama dengan Palang Merah Indonesia (PMI) Kabupaten Klaten menggelar aksi Donor Darah Rutin.",
      "Aksi kemanusiaan ini terbuka untuk jemaat dan masyarakat umum yang memenuhi kriteria medis pendonor.",
      "Setitik darah Anda menyelamatkan sesama.",
    ],
    organizer: "Komisi Diakonia & PMI Klaten",
    badge: "Kesehatan Jemaat",
    iconClass: "fas fa-tint",
    image: event2,
  },
  {
    id: 6,
    title: "Bakti Medis & Pengobatan Gratis",
    date: "2026-03-20",
    time: "08.30 WIB",
    location: "Halaman & Aula GKJ Kebonarum",
    type: "Kegiatan",
    description:
      "Pemeriksaan kesehatan, konsultasi medis, dan pembagian obat gratis bersama tenaga medis Kristen setempat.",
    content: [
      "Pelayanan kesehatan gratis berupa cek gula darah, kolesterol, asam urat, serta konsultasi dokter umum secara cuma-cuma.",
      "Diperuntukkan bagi seluruh jemaat dan warga sekitar yang membutuhkan pelayanan kesehatan prima.",
    ],
    organizer: "Tim Medis & Pelayanan Masyarakat",
    badge: "Bakti Medis",
    iconClass: "fas fa-user-md",
    image: event3,
  },
  {
    id: 7,
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
    badge: "Kaum Muda",
    iconClass: "fas fa-users",
    image: event5,
  },
  {
    id: 8,
    title: "Kunjungan & Santunan Panti Asuhan",
    date: "2026-03-28",
    time: "10.00 WIB",
    location: "Panti Asuhan Kristen Klaten",
    type: "Kegiatan",
    description:
      "Kunjungan rutin Komisi Diakonia memberikan motivasi, persekutuan doa, dan bantuan pendidikan bagi anak-anak panti.",
    content: [
      "Kunjungan wujud kasih dan persekutuan bersama anak-anak panti asuhan mitra gereja.",
      "Diisi dengan pujian, permainan edukatif, doa bersama, dan penyaluran bantuan perlengkapan sekolah.",
    ],
    organizer: "Komisi Diakonia & Anak",
    badge: "Diakonia",
    iconClass: "fas fa-child",
    image: event4,
  },
];
