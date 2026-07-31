import "./PersembahanPage.css";
import Navbar from "../../components/menu/Navbar";
import Footer from "../../components/menu/Footer";
import React, { useState } from "react";

const PersembahanPage = () => {
  const [selectedQr, setSelectedQr] = useState(null);
  const persembahanList = [
    {
      id: 1,
      name: "Gereja Induk Sumberejo",
      bank: "Bank BRI",
      accountNumber: "0123-01-000456-50-8",
      accountHolder: "GKJ Kebonarum",
      icon: "fas fa-church",
      qrNote: "Atau scan kode QRIS berikut:",
      qrCode: "https://via.placeholder.com/150?text=QRIS+Sumberejo",
    },
    {
      id: 2,
      name: "Pepanthan Ngrundul",
      bank: "Bank Mandiri",
      accountNumber: "138-00-1234567-8",
      accountHolder: "GKJ Kebonarum Pep. Ngrundul",
      icon: "fas fa-place-of-worship",
      qrNote: "Atau scan kode QRIS berikut:",
      qrCode: "https://via.placeholder.com/150?text=QRIS+Ngrundul",
    },
    {
      id: 3,
      name: "Pepanthan Krosok",
      bank: "Bank BCA",
      accountNumber: "8765432109",
      accountHolder: "GKJ Kebonarum Pep. Krosok",
      icon: "fas fa-place-of-worship",
      qrNote: "Atau scan kode QRIS berikut:",
      qrCode: "https://via.placeholder.com/150?text=QRIS+Krosok",
    },
    {
      id: 4,
      name: "Pepanthan Prayan",
      bank: "Bank BNI",
      accountNumber: "0987654321",
      accountHolder: "GKJ Kebonarum Pep. Prayan",
      icon: "fas fa-place-of-worship",
      qrNote: "Atau scan kode QRIS berikut:",
      qrCode: "https://via.placeholder.com/150?text=QRIS+Prayan",
    },
    {
      id: 5,
      name: "Pepanthan Pluneng",
      bank: "Bank Jateng",
      accountNumber: "3-012-34567-8",
      accountHolder: "GKJ Kebonarum Pep. Pluneng",
      icon: "fas fa-place-of-worship",
      qrNote: "Atau scan kode QRIS berikut:",
      qrCode: "https://via.placeholder.com/150?text=QRIS+Pluneng",
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
                        onClick={() => setSelectedQr(item.qrCode)}
                        title="Klik untuk memperbesar QRIS"
                      >
                        <img src={item.qrCode} alt={`QRIS ${item.name}`} />
                        <div className="qr-overlay-icon">
                          <i className="fas fa-search-plus"></i>
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
      {selectedQr && (
        <div className="qr-modal-overlay" onClick={() => setSelectedQr(null)}>
          <div className="qr-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="qr-modal-close" onClick={() => setSelectedQr(null)}>
              <i className="fas fa-times"></i>
            </button>
            <img src={selectedQr} alt="QRIS Besar" className="qr-modal-img" />
            <p className="qr-modal-hint">Scan QRIS ini menggunakan aplikasi pembayaran Anda</p>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default PersembahanPage;
