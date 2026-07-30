import React, { useEffect, useRef, useState } from "react";
import "./Footer.css";
import logo from "../../assets/logo.png";

const Footer = ({ isStatic = false }) => {
  const footerRef = useRef(null);
  const [footerHeight, setFooterHeight] = useState(0);

  useEffect(() => {
    if (isStatic) return; // No need to calculate height if static
    const updateHeight = () => {
      if (footerRef.current) {
        setFooterHeight(footerRef.current.offsetHeight);
      }
    };
    
    updateHeight();
    window.addEventListener('resize', updateHeight);
    // Fallback delays for image/font loading
    setTimeout(updateHeight, 300);
    setTimeout(updateHeight, 1500);
    
    return () => window.removeEventListener('resize', updateHeight);
  }, [isStatic]);

  return (
    <>
      {/* Invisible spacer to push the document height so we can scroll past the main content */}
      {!isStatic && <div style={{ height: footerHeight, pointerEvents: 'none', visibility: 'hidden' }} aria-hidden="true"></div>}
      
      {/* Fixed footer behind the main content (or relative if isStatic is true) */}
      <footer ref={footerRef} className="footer" style={{ position: isStatic ? 'relative' : 'fixed', bottom: 0, left: 0, width: '100%', zIndex: 0 }}>
      <div className="footer-container">
        <div className="footer-brand">
          <img src={logo} alt="Kebonarum Logo" className="footer-logo" />
          <div className="footer-brand-text">
            <h2>GKJ KEBONARUM</h2>
            <p>Bersekutu, Bersaksi, & Melayani</p>
          </div>
        </div>

        <div className="footer-grid">
          <div className="footer-col">
            <h3>Lokasi Kami</h3>
            <p>
              Desa Sumberejo, Kec. Klaten Selatan,<br />
              Kabupaten Klaten, Jawa Tengah 57422
            </p>
          </div>

          <div className="footer-col">
            <h3>Hubungi Kami</h3>
            <a href="https://wa.me/62812345678" target="_blank" rel="noopener noreferrer" className="footer-link">
              <i className="fab fa-whatsapp"></i> +62 812 345 678
            </a>
            <a href="mailto:gkjkebonarumklaten@gmail.com" className="footer-link">
              <i className="far fa-envelope"></i> gkjkebonarumklaten@gmail.com
            </a>
          </div>

          <div className="footer-col">
            <h3>Media Sosial</h3>
            <div className="footer-socials">
              <a
                href="https://youtube.com/@gkjkebonarummultimedia3831"
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn"
                aria-label="YouTube"
              >
                <i className="fab fa-youtube"></i>
              </a>
              <a
                href="https://instagram.com/gkj_kebonarum"
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn"
                aria-label="Instagram GKJ"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a
                href="https://instagram.com/multimedia.gkj.kebonarum"
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn"
                aria-label="Instagram Multimedia"
              >
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>

          <div className="footer-col map-col">
            <div className="footer-map-wrapper">
              <iframe
                title="Peta Lokasi GKJ Kebonarum"
                src="https://www.google.com/maps?q=Gereja+Kristen+Jawa+(GKJ)+Kebonarum,+Sumberejo,+Klaten&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Gereja Kristen Jawa Kebonarum. Hak cipta dilindungi.</p>
        </div>
      </div>
    </footer>
    </>
  );
};

export default Footer;
