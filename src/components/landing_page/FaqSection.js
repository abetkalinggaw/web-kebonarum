import React, { useState, useEffect, useRef } from "react";
import "./FaqSection.css";

const faqData = [
  {
    question: "Kapan jadwal ibadah Minggu di GKJ Kebonarum?",
    answer:
      "Ibadah Minggu di GKJ Kebonarum rutin dilaksanakan setiap pukul 06.00 WIB untuk Ibadah Pagi (Sesi I) dan pukul 08.00 WIB untuk Ibadah Pagi (Sesi II), serta persekutuan doa di jadwal yang ditentukan.",
  },
  {
    question: "Apakah ada ibadah khusus untuk Anak dan Pemuda?",
    answer:
      "Ya, kami memiliki Ibadah Sekolah Minggu (Anak-anak) yang berjalan bersamaan dengan ibadah pagi, serta Persekutuan Pemuda & Remaja (PRGKJ) setiap hari Sabtu sore pukul 16.30 WIB.",
  },
  {
    question: "Bagaimana cara menjadi anggota jemaat GKJ Kebonarum?",
    answer:
      "Anda dapat menghubungi Majelis Gereja seusai ibadah Minggu atau berkonsultasi di kantor gereja pada hari kerja untuk mendapatkan informasi katekisasi, atestasi masuk, atau pendaftaran anggota jemaat baru.",
  },
  {
    question: "Apakah gereja menyediakan pelayanan pernikahan?",
    answer:
      "Tentu. GKJ Kebonarum melayani pemberkatan nikah bagi warga jemaat. Pasangan calon mempelai diwajibkan mengikuti proses bina pramenikah bersama pendeta dan majelis gereja.",
  },
  {
    question: "Bagaimana cara menyampaikan permohonan doa atau diakonia?",
    answer:
      "Permohonan doa maupun dukungan pelayanan diakonia dapat disampaikan secara langsung kepada majelis blok/wilayah masing-masing atau melalui sekretariat gereja.",
  },
];

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq-section" ref={sectionRef}>
      <div className="faq-container">
        <div className="faq-grid">
          {/* Left Column: Header Content */}
          <div
            className={`faq-header-side ${
              isRevealed ? "reveal-visible" : "reveal-hidden"
            }`}
          >
            <span className="section-tag">PERTANYAAN UMUM</span>
            <h2 className="faq-section-title">Ingin Tahu Lebih Banyak?</h2>
            <p className="faq-section-lead">
              Temukan jawaban atas pertanyaan yang paling sering diajukan mengenai jadwal ibadah,
              keanggotaan jemaat, dan pelayanan di GKJ Kebonarum.
            </p>

            <div className="faq-contact-box">
              <span className="faq-contact-label">Punya pertanyaan lain?</span>
              <p className="faq-contact-text">
                Hubungi sekretariat majelis kami untuk informasi pelayanan lebih lanjut.
              </p>
            </div>
          </div>

          {/* Right Column: FAQ Accordion List */}
          <div className="faq-list-side">
            <div className="faq-list">
              {faqData.map((item, index) => (
                <div
                  key={index}
                  className={`faq-item ${
                    isRevealed ? "reveal-visible" : "reveal-hidden"
                  } ${openIndex === index ? "active" : ""}`}
                  style={{ animationDelay: `${index * 0.12}s` }}
                  onClick={() => toggleFaq(index)}
                >
                  <div className="faq-question">
                    <h3>{item.question}</h3>
                    <span className="faq-icon" aria-hidden="true">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </span>
                  </div>
                  <div className="faq-answer">
                    <div className="faq-answer-inner">
                      <p>{item.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
