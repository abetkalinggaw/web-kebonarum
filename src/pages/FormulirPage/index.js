import "./FormulirPage.css";
import Navbar from "../../components/menu/Navbar";
import Footer from "../../components/menu/Footer";

const FormulirPage = () => {
  const formulirSections = [
    {
      sectionId: 1,
      sectionTitle: "Administrasi umum & Keanggotaan",
      sectionDescription:
        "Dokumen dan permohonan pelayanan administrasi jemaat, pendataan warga, serta perpindahan keanggotaan gereja.",
      formulirs: [
        {
          id: 1,
          name: "Formulir Laporan Kelahiran",
          description:
            "Formulir resmi laporan kelahiran anak bagi jemaat GKJ Kebonarum untuk dicatat dalam buku induk warga gereja.",
          downloadUrl:
            "https://docs.google.com/document/d/1ZaVf-uRmkAK-DWvYXSyly6bLTc1KJ7Pk/edit?usp=sharing&ouid=110664307198940283519&rtpof=true&sd=true",
        },
        {
          id: 2,
          name: "Formulir Permohonan Pembaptisan Anak",
          description:
            "Formulir pendaftaran dan persetujuan orang tua untuk pelaksanaan Sakramen Baptis Anak di GKJ Kebonarum.",
          downloadUrl:
            "https://docs.google.com/document/d/1dySZVgSXhS89E5R0OCYrRBMuh2lZ0pn-/edit?usp=sharing&ouid=110664307198940283519&rtpof=true&sd=true",
        },
        {
          id: 3,
          name: "Formulir Permohonan Pembaptisan Dewasa",
          description:
            "Formulir permohonan pelaksanaan Sakramen Baptis Dewasa bagi warga yang telah menerima pembinaan katekisasi.",
          downloadUrl:
            "https://docs.google.com/document/d/1zwdKhYZqPQGLacllU_TeQJFI-WYtN7C1/edit?usp=sharing&ouid=110664307198940283519&rtpof=true&sd=true",
        },
        {
          id: 4,
          name: "Formulir Permohonan SIDI",
          description:
            "Formulir permohonan Pengakuan Iman (Sidi) bagi pemuda/warga gereja setelah menyelesaikan kelas pembinaan sidi.",
          downloadUrl:
            "https://docs.google.com/document/d/1AxaOJ1piUS3u_wWQinAPpO_d6Llxa4tA/edit?usp=sharing&ouid=110664307198940283519&rtpof=true&sd=true",
        },
        {
          id: 5,
          name: "Formulir Permohonan Pindah Warga",
          description:
            "Formulir permohonan surat atestasi pindah keanggotaan gereja bagi warga yang berpindah domisili.",
          downloadUrl:
            "https://docs.google.com/document/d/1y1cHT4pBe5PiV7aTXdXG99hALmU5Op9Q/edit?usp=sharing&ouid=110664307198940283519&rtpof=true&sd=true",
        },
      ],
    },
    {
      sectionId: 2,
      sectionTitle: "Pernikahan & Pertunangan",
      sectionDescription:
        "Formulir pendaftaran pertunangan, perkawinan gerejawi, serta berkas administrasi calon mempelai.",
      formulirs: [
        {
          id: 6,
          name: "Formulir Permohonan Pertunangan",
          description:
            "Formulir pendaftaran permohonan ibadah pengukuhan pertunangan bagi pasangan calon mempelai.",
          downloadUrl:
            "https://docs.google.com/document/d/1snvTLbetGnvkauGLEC7FkrOL-K9xzBc3/edit?usp=sharing&ouid=110664307198940283519&rtpof=true&sd=true",
        },
        {
          id: 7,
          name: "Formulir Laporan Pertunangan",
          description:
            "Formulir verifikasi data dan pengumuman warta pertunangan sebelum memasuki tahap pastoral pernikahan.",
          downloadUrl:
            "https://docs.google.com/document/d/1wMQun2ocq4Q0dXiszY94eneb_XSp3VR6/edit?usp=sharing&ouid=110664307198940283519&rtpof=true&sd=true",
        },
        {
          id: 8,
          name: "Formulir Pengajuan Pernikahan",
          description:
            "Formulir permohonan pemberkatan dan peneguhan Pernikahan Gerejawi di GKJ Kebonarum.",
          downloadUrl:
            "https://docs.google.com/document/d/1CjlwyyTGfQC2b3ata3fEUkIrbiTPSwlg/edit?usp=sharing&ouid=110664307198940283519&rtpof=true&sd=true#",
        },
      ],
    },
    {
      sectionId: 3,
      sectionTitle: "Sakramen & Pembinaan Iman",
      sectionDescription:
        "Formulir permohonan pelayanan pembinaan kerohanian, pertobatan, dan pemulihan keanggotaan gereja.",
      formulirs: [
        {
          id: 9,
          name: "Formulir Permohonan Pertobatan",
          description:
            "Formulir permohonan pelayanan pastoral pengakuan pertobatan dan pemulihan persekutuan jemaat di GKJ Kebonarum.",
          downloadUrl:
            "https://docs.google.com/document/d/14k4I-QH59FrbAeEtUidRXJqM1HjC0Fth/edit?usp=sharing&ouid=110664307198940283519&rtpof=true&sd=true",
        },
      ],
    },
  ];

  const handleDownload = (formulir) => {
    if (!formulir.downloadUrl || formulir.downloadUrl === "#") {
      return;
    }

    window.open(formulir.downloadUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <Navbar />
      <main className="formulir-page">
        <section className="formulir-hero">
          <div className="formulir-hero-content">
            <h1 className="formulir-title">
              Pusat Unduhan Formulir
              <br />
              GKJ Kebonarum
            </h1>
            <p className="formulir-lead">
              Unduh formulir dan dokumen penting yang diperlukan untuk berbagai
              keperluan di GKJ Kebonarum. Semua formulir tersedia dalam format
              PDF.
            </p>
          </div>
        </section>

        {formulirSections.map((section) => (
          <section key={section.sectionId} className="formulir-section">
            <div className="formulir-inner">
              <div className="formulir-section-header">
                <h2 className="formulir-section-title">
                  {section.sectionTitle}
                </h2>
                <p className="formulir-section-description">
                  {section.sectionDescription}
                </p>
              </div>
              <div className="formulir-grid">
                {section.formulirs.map((formulir) => (
                  <article key={formulir.id} className="formulir-item">
                    <div className="formulir-item-content">
                      <div className="formulir-header">
                        <h3 className="formulir-item-title">{formulir.name}</h3>
                      </div>
                      <p className="formulir-description">
                        {formulir.description}
                      </p>
                      <div className="formulir-footer">
                        <button
                          className="formulir-download-btn"
                          onClick={() => handleDownload(formulir)}
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                          </svg>
                          Unduh
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ))}
      </main>
      <Footer />
    </>
  );
};

export default FormulirPage;
