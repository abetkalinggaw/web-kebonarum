import React, { useEffect, useRef, useState } from "react";
import "./Footer.css";
import logo from "../../assets/logo.png";

const Footer = () => {
  const footerRef = useRef(null);
  const [footerHeight, setFooterHeight] = useState(0);

  useEffect(() => {
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
  }, []);

  return (
    <>
      {/* Invisible spacer to push the document height so we can scroll past the main content */}
      <div style={{ height: footerHeight, pointerEvents: 'none', visibility: 'hidden' }} aria-hidden="true"></div>
      
      {/* Fixed footer behind the main content */}
      <footer ref={footerRef} className="footer" style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', zIndex: 0 }}>
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
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15814.717646536968!2d110.5732151!3d-7.7174621!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a44f50684f801%3A0xc39bc6ff11e86016!2sGereja%20Kristen%20Jawa%20(GKJ)%20Kebonarum!5e0!3m2!1sen!2sid!4v1680000000000!5m2!1sen!2sid"
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
