import "./PersembahanPage.css";
import Navbar from "../components/menu/Navbar";
import Footer from "../components/menu/Footer";
import React from "react";

const PersembahanPage = () => {
  const persembahanList = [
    {
      id: 1,
      name: "No. Rekening Gereja Sumbeejo",
      accountNumber: "ABC 12345678",
      accountHolder: "A.N Sugeng Tumbler",
      qrNote: "Anda juga dapat scan barcode Qris disamping",
      qrCode: "https://via.placeholder.com/128",
    },
    {
      id: 2,
      name: "No. Rekening Gereja Ngrundul",
      accountNumber: "ABC 12345678",
      accountHolder: "A.N Sugeng Tumbler",
      qrNote: "Anda juga dapat scan barcode Qris disamping",
      qrCode: "https://via.placeholder.com/128",
    },
    {
      id: 3,
      name: "No. Rekening Gereja Krosok",
      accountNumber: "ABC 12345678",
      accountHolder: "A.N Sugeng Tumbler",
      qrNote: "Anda juga dapat scan barcode Qris disamping",
      qrCode: "https://via.placeholder.com/128",
    },
    {
      id: 4,
      name: "No. Rekening Gereja Prayan",
      accountNumber: "ABC 12345678",
      accountHolder: "A.N Sugeng Tumbler",
      qrNote: "Anda juga dapat scan barcode Qris disamping",
      qrCode: "https://via.placeholder.com/128",
    },
    {
      id: 5,
      name: "No. Rekening Gereja Pluneng",
      accountNumber: "ABC 12345678",
      accountHolder: "A.N Sugeng Tumbler",
      qrNote: "Anda juga dapat scan barcode Qris disamping",
      qrCode: "https://via.placeholder.com/128",
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
            <h1 className="persembahan-title">
              Persembahan GKJ Kebonarum
            </h1>
            <p className="persembahan-lead">
              Persembahan adalah wujud syukur kita kepada Tuhan dan dukungan
              untuk melanjutkan misi pelayanan gereja. Setiap persembahan, besar
              atau kecil, adalah berkat yang bermakna.
            </p>
          </div>
        </section>

        {/* Persembahan List Section */}
        <section className="persembahan-list-section">
          <div className="persembahan-list-container">
            {persembahanList.map((item) => (
              <div key={item.id} className="persembahan-item">
                <div className="persembahan-item-content">
                  <h3 className="persembahan-item-name">{item.name}</h3>
                  <p className="persembahan-item-account">
                    {item.accountNumber} - {item.accountHolder}
                  </p>
                  <p className="persembahan-item-note">{item.qrNote}</p>
                </div>
                <div className="persembahan-item-qr">
                  <img src={item.qrCode} alt="QR Code" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default PersembahanPage;
