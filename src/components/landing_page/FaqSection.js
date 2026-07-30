import React, { useState, useEffect, useRef } from 'react';
import './FaqSection.css';

const faqData = [
  {
    question: "Kapan jadwal ibadah Minggu di GKJ Kebonarum?",
    answer: "Ibadah Minggu di GKJ Kebonarum rutin dilaksanakan setiap pukul 07.00 WIB untuk Ibadah Pagi dan 17.00 WIB untuk Ibadah Sore."
  },
  {
    question: "Apakah ada ibadah khusus untuk Anak dan Pemuda?",
    answer: "Ya, kami memiliki Ibadah Sekolah Minggu untuk anak-anak yang berjalan bersamaan dengan ibadah pagi, serta Persekutuan Pemuda (Komisi Pemuda) setiap hari Sabtu pukul 18.30 WIB."
  },
  {
    question: "Bagaimana cara menjadi anggota jemaat GKJ Kebonarum?",
    answer: "Anda dapat menghubungi Majelis Gereja seusai ibadah Minggu atau datang ke kantor gereja pada hari kerja untuk mendapatkan formulir pendaftaran dan informasi lebih lanjut mengenai katekisasi atau atestasi masuk."
  },
  {
    question: "Apakah gereja menyediakan pelayanan pernikahan?",
    answer: "Tentu. GKJ Kebonarum melayani pemberkatan nikah bagi warga jemaat. Pasangan yang akan menikah diwajibkan mengikuti pembinaan pranikah terlebih dahulu."
  }
];

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsRevealed(true);
        observer.disconnect();
      }
    }, { threshold: 0.15 });

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
        <div className={`faq-header ${isRevealed ? 'reveal-visible' : 'reveal-hidden'}`}>
          <span className="section-tag">FAQ</span>
          <h2 className="section-title-minimal">Pertanyaan Umum</h2>
          <p className="section-subtitle-minimal">
            Beberapa pertanyaan yang sering diajukan mengenai pelayanan dan kegiatan di GKJ Kebonarum.
          </p>
        </div>
        
        <div className="faq-list">
          {faqData.map((item, index) => (
            <div 
              key={index} 
              className={`faq-item ${isRevealed ? 'reveal-visible' : 'reveal-hidden'} ${openIndex === index ? 'active' : ''}`}
              style={{ animationDelay: `${index * 0.15}s` }}
              onClick={() => toggleFaq(index)}
            >
              <div className="faq-question">
                <h3>{item.question}</h3>
                <span className="faq-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
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
    </section>
  );
};

export default FaqSection;
