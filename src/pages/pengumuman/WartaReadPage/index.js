import { useState, useEffect } from "react";
import "./WartaReadPage.css";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../../components/menu/Navbar";
import Footer from "../../../components/menu/Footer";
import { ArrowLeft, Download, FileText } from "lucide-react";
import { createApiUrl } from "../../../utils/apiConfig";
import { initialWartaData } from "../../../data/wartaData";

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

const WartaReadPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [warta, setWarta] = useState(null);

  useEffect(() => {
    const fetchSingleWarta = async () => {
      try {
        const response = await fetch(createApiUrl(`/api/warta/${id}`));
        if (response.ok) {
          const data = await response.json();
          if (data && (data.title || data.id)) {
            setWarta(data);
            return;
          }
        }
      } catch {
        // Fallback below
      }

      const fallback = initialWartaData.find((w) => String(w.id) === String(id)) || initialWartaData[0];
      setWarta(fallback);
    };

    fetchSingleWarta();
  }, [id]);

  const handleBackClick = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate("/pengumuman/warta-gereja");
  };

  const getPdfUrl = () => {
    if (!warta) return "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
    if (Array.isArray(warta.googleDriveFiles) && warta.googleDriveFiles.length > 0) {
      return warta.googleDriveFiles[0];
    }
    if (typeof warta.googleDriveFiles === "string" && warta.googleDriveFiles.trim()) {
      return warta.googleDriveFiles.trim().split("\n")[0];
    }
    return warta.pdfUrl || warta.fileUrl || "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
  };

  const pdfDocumentUrl = getPdfUrl();

  return (
    <>
      <Navbar />
      <main className="warta-read-page">
        {/* Center-aligned Hero Section */}
        <section className="warta-read-hero">
          <div className="warta-read-hero-content center-aligned">
            <button className="back-button" onClick={handleBackClick}>
              <ArrowLeft size={16} />
              <span>Kembali ke Daftar Warta</span>
            </button>

            {warta ? (
              <>
                <span className="warta-read-kicker">
                  {formatFullDate(warta.date)}
                </span>
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
            {/* 2 Paragraph Long Description */}
            <div className="warta-read-body">
              {(() => {
                const list = Array.isArray(warta.paragraphs)
                  ? warta.paragraphs
                  : Array.isArray(warta.content)
                  ? warta.content
                  : typeof warta.paragraphs === "string"
                  ? warta.paragraphs.split("\n").filter(Boolean)
                  : [];
                return list.length > 0 ? (
                  list.slice(0, 2).map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))
                ) : (
                  <p>{warta.description}</p>
                );
              })()}
            </div>

            {/* Preview PDF Container */}
            <div className="warta-pdf-preview-section">
              <div className="warta-pdf-header">
                <div className="warta-pdf-title-wrap">
                  <FileText size={20} className="pdf-icon" />
                  <h3>Pratinjau Dokumen Warta (PDF)</h3>
                </div>
              </div>

              <div className="warta-pdf-frame-wrapper">
                <iframe
                  src={`${pdfDocumentUrl}#toolbar=0`}
                  title={warta.title}
                  className="warta-pdf-iframe"
                />
              </div>

              {/* Align Right Download Button under PDF Preview */}
              <div className="warta-pdf-actions-right">
                <a
                  href={pdfDocumentUrl}
                  download={`${warta.title}.pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="unduh-warta-btn"
                >
                  <Download size={18} />
                  <span>Unduh Warta</span>
                </a>
              </div>
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
