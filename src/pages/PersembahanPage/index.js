import React, { useState } from "react";
import Navbar from "../../components/menu/Navbar";
import Footer from "../../components/menu/Footer";
import "./PersembahanPage.css";
import qrisCodeSvg from "../../assets/qris-code.svg";

const PersembahanPage = () => {
  const [selectedQrItem, setSelectedQrItem] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const persembahanList = [
    {
      id: 1,
      name: "Gereja Induk Sumberejo",
      bank: "Bank BRI",
      accountNumber: "0123-01-000456-50-8",
      accountHolder: "GKJ Kebonarum",
      icon: "fas fa-church",
      qrNote: "Atau scan kode QRIS berikut:",
      qrCode: qrisCodeSvg,
    },
    {
      id: 2,
      name: "Pepanthan Ngrundul",
      bank: "Bank Mandiri",
      accountNumber: "138-00-1234567-8",
      accountHolder: "GKJ Kebonarum Pep. Ngrundul",
      icon: "fas fa-place-of-worship",
      qrNote: "Atau scan kode QRIS berikut:",
      qrCode: qrisCodeSvg,
    },
    {
      id: 3,
      name: "Pepanthan Krosok",
      bank: "Bank BCA",
      accountNumber: "8765432109",
      accountHolder: "GKJ Kebonarum Pep. Krosok",
      icon: "fas fa-place-of-worship",
      qrNote: "Atau scan kode QRIS berikut:",
      qrCode: qrisCodeSvg,
    },
    {
      id: 4,
      name: "Pepanthan Prayan",
      bank: "Bank BNI",
      accountNumber: "0987654321",
      accountHolder: "GKJ Kebonarum Pep. Prayan",
      icon: "fas fa-place-of-worship",
      qrNote: "Atau scan kode QRIS berikut:",
      qrCode: qrisCodeSvg,
    },
    {
      id: 5,
      name: "Pepanthan Pluneng",
      bank: "Bank Jateng",
      accountNumber: "3-012-34567-8",
      accountHolder: "GKJ Kebonarum Pep. Pluneng",
      icon: "fas fa-place-of-worship",
      qrNote: "Atau scan kode QRIS berikut:",
      qrCode: qrisCodeSvg,
    },
  ];

  const persembahanKasihList = [
    {
      id: "kasih-1",
      name: "Diakonia & Aksi Kasih",
      bank: "Bank BRI",
      accountNumber: "0123-01-000789-50-2",
      accountHolder: "GKJ Kebonarum Diakonia",
      icon: "fas fa-hand-holding-heart",
      qrNote: "Atau scan kode QRIS berikut:",
      qrCode: qrisCodeSvg,
    },
    {
      id: "kasih-2",
      name: "Pembangunan & Pemeliharaan",
      bank: "Bank Mandiri",
      accountNumber: "138-00-7654321-0",
      accountHolder: "GKJ Kebonarum Pembangunan",
      icon: "fas fa-building",
      qrNote: "Atau scan kode QRIS berikut:",
      qrCode: qrisCodeSvg,
    },
    {
      id: "kasih-3",
      name: "Beasiswa & Pendidikan Anak",
      bank: "Bank BCA",
      accountNumber: "8765432999",
      accountHolder: "GKJ Kebonarum Pendidikan",
      icon: "fas fa-graduation-cap",
      qrNote: "Atau scan kode QRIS berikut:",
      qrCode: qrisCodeSvg,
    },
  ];

  // Handler Copy Nomor Rekening
  const handleCopyAccount = (id, accountNumber) => {
    const cleanNumber = accountNumber.replace(/[^0-9]/g, "");
    navigator.clipboard.writeText(cleanNumber);

    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  // Handler Download QRIS Image
  const handleDownloadQr = (qrUrl, name) => {
    const fileName = `QRIS-${name.replace(/\s+/g, "-")}.svg`;
    const link = document.createElement("a");
    link.href = qrUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Navbar />
      <main className="persembahan-page">
        <section className="persembahan-hero">
          <div className="persembahan-hero-content">
            <h1 className="persembahan-title">
              Persembahan
              <br />
              GKJ Kebonarum
            </h1>
            <p className="persembahan-lead">
              "Hendaklah masing-masing memberikan menurut kerelaan hatinya,
              jangan dengan sedih hati atau karena paksaan, sebab Allah
              mengasihi orang yang memberi dengan sukacita." <br />
              (2 Korintus 9:7)
            </p>
          </div>
        </section>

        <section className="persembahan-list-section">
          <div className="persembahan-list-container">
            <div className="persembahan-grid">
              {persembahanList.map((item) => (
                <div key={item.id} className="persembahan-card">
                  <div className="persembahan-card-header">
                    <h3 className="persembahan-name">{item.name}</h3>
                  </div>

                  <div className="persembahan-card-body">
                    <div className="bank-info">
                      <span className="bank-name">{item.bank}</span>
                      <div className="account-number">{item.accountNumber}</div>
                      <button
                        className={`copy-btn ${copiedId === item.id ? "copied" : ""}`}
                        onClick={() =>
                          handleCopyAccount(item.id, item.accountNumber)
                        }
                        title="Salin Nomor Rekening"
                      >
                        {copiedId === item.id ? (
                          <>
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            <span>Nomor Rekening Tersalin!</span>
                          </>
                        ) : (
                          <>
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <rect
                                x="9"
                                y="9"
                                width="13"
                                height="13"
                                rx="2"
                                ry="2"
                              ></rect>
                              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                            <span>Salin Nomor Rekening</span>
                          </>
                        )}
                      </button>

                      <div className="account-holder">
                        a.n. {item.accountHolder}
                      </div>
                    </div>

                    <div className="qr-section">
                      <p className="qr-note">{item.qrNote}</p>
                      <div
                        className="qr-image-wrapper"
                        onClick={() => setSelectedQrItem(item)}
                        title="Klik untuk memperbesar QRIS"
                      >
                        <img src={item.qrCode} alt={`QRIS ${item.name}`} />
                        <div className="qr-overlay-icon">
                          <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            <line x1="11" y1="8" x2="11" y2="14"></line>
                            <line x1="8" y1="11" x2="14" y2="11"></line>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="persembahan-list-section persembahan-kasih-section">
          <div className="persembahan-list-container">
            <div className="persembahan-section-header">
              <h2 className="persembahan-section-title">Persembahan Kasih</h2>
              <p className="persembahan-section-subtitle">
                Saluran persembahan khusus untuk pelayanan diakonia,
                pembangunan, dan bantuan operasional sosial gereja.
              </p>
            </div>

            <div className="persembahan-grid">
              {persembahanKasihList.map((item) => (
                <div key={item.id} className="persembahan-card">
                  <div className="persembahan-card-header">
                    <h3 className="persembahan-name">{item.name}</h3>
                  </div>

                  <div className="persembahan-card-body">
                    <div className="bank-info">
                      <span className="bank-name">{item.bank}</span>
                      <div className="account-number">{item.accountNumber}</div>
                      <button
                        className={`copy-btn ${copiedId === item.id ? "copied" : ""}`}
                        onClick={() =>
                          handleCopyAccount(item.id, item.accountNumber)
                        }
                        title="Salin Nomor Rekening"
                      >
                        {copiedId === item.id ? (
                          <>
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            <span>Nomor Rekening Tersalin!</span>
                          </>
                        ) : (
                          <>
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <rect
                                x="9"
                                y="9"
                                width="13"
                                height="13"
                                rx="2"
                                ry="2"
                              ></rect>
                              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                            <span>Salin Nomor Rekening</span>
                          </>
                        )}
                      </button>

                      <div className="account-holder">
                        a.n. {item.accountHolder}
                      </div>
                    </div>

                    <div className="qr-section">
                      <p className="qr-note">{item.qrNote}</p>
                      <div
                        className="qr-image-wrapper"
                        onClick={() => setSelectedQrItem(item)}
                        title="Klik untuk memperbesar QRIS"
                      >
                        <img src={item.qrCode} alt={`QRIS ${item.name}`} />
                        <div className="qr-overlay-icon">
                          <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            <line x1="11" y1="8" x2="11" y2="14"></line>
                            <line x1="8" y1="11" x2="14" y2="11"></line>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {selectedQrItem && (
        <div
          className="qr-modal-overlay"
          onClick={() => setSelectedQrItem(null)}
        >
          <div
            className="qr-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="qr-modal-close"
              onClick={() => setSelectedQrItem(null)}
              aria-label="Tutup Modal"
              title="Tutup"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div className="qr-modal-header">
              <span className="qr-modal-badge">{selectedQrItem.bank}</span>
              <h3 className="qr-modal-title">{selectedQrItem.name}</h3>
            </div>

            <div className="qr-modal-image-wrapper">
              <img
                src={selectedQrItem.qrCode}
                alt={`QRIS ${selectedQrItem.name}`}
                className="qr-modal-img"
              />
            </div>

            <button
              className="btn-download-qr-modal"
              onClick={() =>
                handleDownloadQr(selectedQrItem.qrCode, selectedQrItem.name)
              }
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
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Unduh Gambar QRIS
            </button>

            <p className="qr-modal-hint">
              Scan QRIS ini menggunakan aplikasi M-Banking atau e-Wallet (Gopay,
              OVO, DANA, ShopeePay, LinkAja)
            </p>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default PersembahanPage;
