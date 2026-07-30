import React, { useState, useEffect } from "react";
import Navbar from "../components/menu/Navbar";
import Footer from "../components/menu/Footer";
import "./StatistikPage.css";
import { getStatistikData } from "../services/statistikApi";

const AnimatedNumber = ({ targetValue, duration = 2000, startAnimating }) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!startAnimating) return;

    const parsedTarget = parseInt(
      targetValue.toString().replace(/\./g, ""),
      10,
    );
    if (isNaN(parsedTarget)) {
      setValue(targetValue);
      return;
    }

    let startTime = null;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);

      // Easing: easeOutExpo
      const easeProgress =
        percentage === 1 ? 1 : 1 - Math.pow(2, -10 * percentage);
      const current = Math.floor(easeProgress * parsedTarget);

      setValue(current);

      if (progress < duration) {
        requestAnimationFrame(animate);
      } else {
        setValue(parsedTarget);
      }
    };

    requestAnimationFrame(animate);
  }, [targetValue, duration, startAnimating]);

  if (
    typeof targetValue === "string" &&
    isNaN(parseInt(targetValue.replace(/\./g, ""), 10))
  ) {
    return <>{targetValue}</>;
  }

  return <>{value.toLocaleString("id-ID")}</>;
};

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
