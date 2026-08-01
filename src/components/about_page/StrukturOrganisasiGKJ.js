import React from "react";
import "./StrukturOrganisasiGKJ.css";
import strukturImg from "../../assets/struktur-organisasi.jpg";

const StrukturOrganisasiGKJ = () => {
  return (
    <section className="about-struktur-section">
      <div className="about-struktur-inner">
        <div className="about-struktur-header">
          <span className="section-tag accent">TATA KELOLA ROHANI</span>
          <h2 className="about-struktur-title">Struktur Organisasi GKJ Kebonarum</h2>
          <p className="about-struktur-sub">
            Bagan tata organisasi dan alur kepemimpinan pelayanan dalam mewujudkan persekutuan gereja yang tertata, presbiterial-synodal, dan berdampak bagi jemaat.
          </p>
        </div>

        <div className="about-struktur-image-wrapper">
          <img
            src={strukturImg}
            alt="Tabel Struktur Organisasi GKJ Kebonarum"
            className="about-struktur-image"
            loading="lazy"
          />
        </div>

        <div className="about-struktur-details">
          <div className="struktur-detail-card">
            <span className="struktur-card-num">01</span>
            <h3 className="struktur-card-title">Sidang Majelis Jemaat</h3>
            <p className="struktur-card-desc">
              Badan kepemimpinan tertinggi persekutuan lokal yang terdiri dari Pendeta, Penatua, dan Diaken. Bertanggung jawab mengambil keputusan strategis, tata gereja, serta arah pelayanan jemaat.
            </p>
          </div>

          <div className="struktur-detail-card">
            <span className="struktur-card-num">02</span>
            <h3 className="struktur-card-title">Pendeta Jemaat</h3>
            <p className="struktur-card-desc">
              Pemimpin pengajaran dan pembinaan rohani yang bertugas memberitakan Firman Tuhan, melayankan Sakramen, serta menggembalakan seluruh warga jemaat GKJ Kebonarum.
            </p>
          </div>

          <div className="struktur-detail-card">
            <span className="struktur-card-num">03</span>
            <h3 className="struktur-card-title">Penatua & Diaken</h3>
            <p className="struktur-card-desc">
              <strong>Penatua</strong> memelihara ketertiban ajaran, pastoral, dan penggembalaan wilayah. <strong>Diaken</strong> melayani kebutuhan sosial, perhatian kasih diakonia, dan kepedulian persekutuan.
            </p>
          </div>

          <div className="struktur-detail-card">
            <span className="struktur-card-num">04</span>
            <h3 className="struktur-card-title">Komisi-Komisi Pelayanan</h3>
            <p className="struktur-card-desc">
              Badan pelaksana pembinaan kategori usia dan bidang khusus: Sekolah Minggu (Anak), Remaja, Pemuda, Dewasa, Lansia (Adi Yuswa), serta Persekutuan Wanita Gereja (PWG).
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StrukturOrganisasiGKJ;
