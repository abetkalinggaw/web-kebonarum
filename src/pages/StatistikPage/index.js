import React, { useState, useEffect } from "react";
import Navbar from "../../components/menu/Navbar";
import Footer from "../../components/menu/Footer";
import "./StatistikPage.css";
import { getStatistikData } from "../../services/statistikApi";
import AnimatedNumber from "../../components/common/AnimatedNumber";

const StatistikPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCharts, setShowCharts] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await getStatistikData();
        setData(result);
        setLoading(false);
        // Delay chart expansion for dramatic effect
        setTimeout(() => setShowCharts(true), 300);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <main
          className="statistik-page"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
          }}
        >
          <div style={{ color: "var(--color-text-600)", fontSize: "1.1rem" }}>
            Memuat data statistik...
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !data) {
    return (
      <>
        <Navbar />
        <main
          className="statistik-page"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
          }}
        >
          <div style={{ color: "#dc2626", fontSize: "1.1rem" }}>
            Terjadi kesalahan: {error || "Data tidak ditemukan"}
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="statistik-page">
        <section className="statistik-hero">
          <div className="statistik-hero-content">
            <span className="section-tag light">GKJ KEBONARUM KLATEN</span>
            <h1 className="statistik-title">Statistik Gereja</h1>
            <p className="statistik-lead">
              Gambaran data pertumbuhan jemaat dan pelayanan GKJ Kebonarum. Data
              ini diperbarui secara berkala untuk mendukung pelayanan yang lebih
              baik.
            </p>
          </div>
        </section>

        <section className="statistik-content">
          <div className="statistik-grid">
            {data.metrics.map((metric, idx) => (
              <div key={idx} className="statistik-card">
                <div className="statistik-card-icon">
                  <i className={metric.icon}></i>
                </div>
                <div className="statistik-card-info">
                  <h3 className="statistik-card-value">
                    <AnimatedNumber
                      targetValue={metric.value}
                      startAnimating={showCharts}
                    />
                  </h3>
                  <p className="statistik-card-label">{metric.label}</p>
                </div>
                <div className="statistik-card-trend">
                  <i className="fas fa-arrow-up"></i> {metric.trend} tahun ini
                </div>
              </div>
            ))}
          </div>

          <div className="statistik-charts">
            <div className="chart-card">
              <h3 className="chart-title">Demografi Usia Jemaat</h3>
              <div className="bar-chart">
                {data.demographics.map((item, idx) => (
                  <div key={idx} className="bar-item">
                    <div className="bar-label">
                      <span>{item.label}</span>
                      <span>
                        <AnimatedNumber
                          targetValue={item.value}
                          duration={1500}
                          startAnimating={showCharts}
                        />
                        %
                      </span>
                    </div>
                    <div className="bar-track">
                      <div
                        className="bar-fill"
                        style={{
                          width: showCharts ? `${item.value}%` : "0%",
                          backgroundColor: item.color,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="chart-card">
              <h3 className="chart-title">Pertumbuhan Jemaat (5 Tahun)</h3>
              <div className="line-chart-placeholder">
                <div className="line-chart-bars">
                  {data.growth.map((item, idx) => {
                    const isLast = idx === data.growth.length - 1;
                    return (
                      <div
                        key={idx}
                        className="line-bar"
                        style={{
                          height: showCharts ? `${item.percentage}%` : "0%",
                          backgroundColor: isLast
                            ? "var(--color-brand-700)"
                            : undefined,
                          boxShadow:
                            isLast && showCharts
                              ? "0 10px 20px -5px rgba(52, 78, 65, 0.3)"
                              : undefined,
                        }}
                      >
                        <span
                          className="year-label"
                          style={{
                            color: isLast
                              ? "var(--color-brand-900)"
                              : undefined,
                            fontWeight: isLast ? 700 : undefined,
                            opacity: showCharts ? 1 : 0,
                            transition: "opacity 0.5s ease 1s",
                          }}
                        >
                          {item.year}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default StatistikPage;
