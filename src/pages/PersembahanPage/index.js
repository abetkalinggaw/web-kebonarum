import React, { useState } from "react";
import Navbar from "../../components/menu/Navbar";
import Footer from "../../components/menu/Footer";
import "./PersembahanPage.css";
import qrisCodeSvg from "../../assets/qris-code.svg";

const PersembahanPage = () => {
  const [selectedQrItem, setSelectedQrItem] = useState(null);
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

  return (
    <>
      <Navbar />
      <main className="persembahan-page">
        {/* Hero Section */}
        <section className="persembahan-hero">
          <div className="persembahan-hero-content">
            <span className="section-tag light">GKJ KEBONARUM KLATEN</span>
            <h1 className="persembahan-title">Persembahan Kasih</h1>
            <p className="persembahan-lead">
              "Hendaklah masing-masing memberikan menurut kerelaan hatinya,
              jangan dengan sedih hati atau karena paksaan, sebab Allah
              mengasihi orang yang memberi dengan sukacita." <br />
              (2 Korintus 9:7)
            </p>
          </div>
        </section>

        {/* Persembahan List Section */}
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
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

      {/* QR Code Modal */}
      {selectedQrItem && (
        <div className="qr-modal-overlay" onClick={() => setSelectedQrItem(null)}>
          <div className="qr-modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="qr-modal-close"
              onClick={() => setSelectedQrItem(null)}
              aria-label="Tutup Modal"
              title="Tutup"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div className="qr-modal-header">
              <span className="qr-modal-badge">{selectedQrItem.bank}</span>
              <h3 className="qr-modal-title">{selectedQrItem.name}</h3>
            </div>

            <div className="qr-modal-image-wrapper">
              <img src={selectedQrItem.qrCode} alt={`QRIS ${selectedQrItem.name}`} className="qr-modal-img" />
            </div>

            <p className="qr-modal-hint">
              Scan QRIS ini menggunakan aplikasi M-Banking atau e-Wallet (Gopay, OVO, DANA, ShopeePay, LinkAja)
            </p>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default PersembahanPage;
