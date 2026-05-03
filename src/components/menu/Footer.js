import React from "react";
import "./Footer.css";
import logo from "../../assets/logo.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section footer-logo">
          <img src={logo} alt="Kebonarum Logo" className="footer-logo-image" />
          <h3 className="footer-name">
            GEREJA KRISTEN JAWA
            <br />
            KEBONARUM KLATEN
          </h3>
        </div>

        <div className="footer-section footer-address">
          <h3>Alamat</h3>
          <p>
            Desa Sumberejo, Kec. Klaten Selatan,
            <br />
            Kab. Klaten. 57422
          </p>
        </div>

        <div className="footer-section footer-contact">
          <h3>Kontak</h3>
          <div className="contact-item">
            <span className="contact-label">Telepon:</span>
            <p>+62 812 345 678</p>
          </div>
          <div className="contact-item">
            <span className="contact-label">WhatsApp:</span>
            <a
              href="https://wa.me/62812345678"
              target="_blank"
              rel="noopener noreferrer"
            >
              +62 812 345 678
            </a>
          </div>
          <div className="contact-item">
            <span className="contact-label">Email:</span>
            <a href="mailto:gkjkebonarumklaten@gmail.com">
              gkjkebonarumklaten@gmail.com
            </a>
          </div>
        </div>

        <div className="footer-section footer-social">
          <h3>Ikuti Kami</h3>
          <div className="social-links">
            <a
              href="https://youtube.com/@gkjkebonarummultimedia3831"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              <i className="fab fa-youtube"></i>
            </a>
            <a
              href="https://instagram.com/gkj_kebonarum"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a
              href="https://instagram.com/multimedia.gkj.kebonarum"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-copyright">
          &copy; 2026 GKJ Kebonarum. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
