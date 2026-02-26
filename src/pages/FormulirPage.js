import "./FormulirPage.css";
import Navbar from "../components/menu/Navbar";
import Footer from "../components/menu/Footer";

const FormulirPage = () => {
  const formulirSections = [
    {
      sectionId: 1,
      sectionTitle: "Administrasi Umum",
      sectionDescription:
        "Formulir untuk keperluan administrasi umum seperti pembaptisan, pernikahan, dan lainnya",
      formulirs: [
        {
          id: 1,
          name: "Formulir Permohonan Pembaptisan",
          description:
            "Formulir untuk permohonan pembaptisan di GKJ Kebonarum. Harap isi dengan lengkap dan tanda tangan.",
          fileSize: "245 KB",
          fileType: "PDF",
          downloadUrl: "#",
        },
        {
          id: 2,
          name: "Formulir Pernikahan Kristen",
          description:
            "Formulir pendaftaran pernikahan di GKJ Kebonarum untuk pasangan yang akan menikah.",
          fileSize: "328 KB",
          fileType: "PDF",
          downloadUrl: "#",
        },
      ],
    },
    {
      sectionId: 2,
      sectionTitle: "Pernikahan & Pertunangan",
      sectionDescription:
        "Formulir terkait dengan pernikahan, pertunangan, dan administrasi keluarga lainnya",
      formulirs: [
        {
          id: 3,
          name: "Formulir Anggota Jemaat Baru",
          description:
            "Formulir pendaftaran untuk jemaat baru yang ingin bergabung dengan GKJ Kebonarum.",
          fileSize: "156 KB",
          fileType: "PDF",
          downloadUrl: "#",
        },
        {
          id: 4,
          name: "Formulir Permohonan Doa Bersama",
          description:
            "Formulir untuk meminta doa bersama dari gereja untuk kebutuhan khusus anda.",
          fileSize: "187 KB",
          fileType: "PDF",
          downloadUrl: "#",
        },
        {
          id: 5,
          name: "Formulir Surat Keterangan Jemaat",
          description:
            "Formulir permintaan surat keterangan sebagai anggota jemaat GKJ Kebonarum.",
          fileSize: "134 KB",
          fileType: "PDF",
          downloadUrl: "#",
        },
      ],
    },
    {
      sectionId: 3,
      sectionTitle: "Sakramen & Pembinaan Iman",
      sectionDescription:
        "Formulir untuk keperluan sakramen seperti komuni, penguatan iman, dan lainnya",
      formulirs: [
        {
          id: 6,
          name: "Formulir Pendaftaran Sekolah Minggu",
          description:
            "Formulir pendaftaran untuk anak-anak yang ingin mengikuti sekolah minggu GKJ Kebonarum.",
          fileSize: "198 KB",
          fileType: "PDF",
          downloadUrl: "#",
        },
      ],
    },
  ];

  const handleDownload = (formulir) => {
    console.log(`Downloading: ${formulir.name}`);
    // Add actual download logic here
  };

  return (
    <>
      <Navbar />
      <main className="formulir-page">
        <section className="formulir-hero">
          <div className="formulir-hero-content">
            <p className="formulir-kicker">GKJ Kebonarum Klaten</p>
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
                        <div className="formulir-badge">
                          {formulir.fileType}
                        </div>
                      </div>
                      <p className="formulir-description">
                        {formulir.description}
                      </p>
                      <div className="formulir-footer">
                        <span className="formulir-size">
                          {formulir.fileSize}
                        </span>
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
                          Download
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
