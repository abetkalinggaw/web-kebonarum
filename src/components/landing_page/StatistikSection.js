import React, { useState, useEffect, useRef } from "react";
import "./StatistikSection.css";
import { getStatistikData } from "../../services/statistikApi";
import AnimatedNumber from "../common/AnimatedNumber";

const StatistikSection = () => {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getStatistikData();
        setMetrics(data.metrics || []);
        setLoading(false);
      } catch (err) {
        console.error("Error loading statistik for landing page:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (loading || error || metrics.length === 0 || !sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, [loading, error, metrics.length]);

  if (loading || error || metrics.length === 0) {
    return (
      <section
        className="statistik-landing-section"
        style={{
          minHeight: "400px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ color: "rgba(255,255,255,0.5)" }}>Loading data...</div>
      </section>
    );
  }

  return (
    <section className="statistik-landing-section" ref={sectionRef}>
      <div className="statistik-landing-container">
        <div className="statistik-landing-header">
          <span className="section-tag light">STATISTIK GEREJA</span>
          <h2
            className="section-title-minimal"
            style={{ color: "var(--color-white)" }}
          >
            Pertumbuhan Jemaat
          </h2>
          <p
            className="section-subtitle-minimal"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            Data terkini seputar jemaat dan pelayanan di GKJ Kebonarum.
          </p>
        </div>

        <div
          className={`statistik-landing-grid ${isVisible ? "animate-in" : ""}`}
        >
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="statistik-landing-card"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="stat-landing-content">
                <h3 className="stat-landing-value">
                  <AnimatedNumber
                    targetValue={metric.value}
                    startAnimating={isVisible}
                  />
                </h3>
                <p className="stat-landing-label">{metric.label}</p>
                {metric.trend && (
                  <div
                    className={`stat-landing-trend ${metric.trend.includes("+") ? "positive" : "neutral"}`}
                  >
                    <i
                      className={`fas fa-arrow-${metric.trend.includes("+") ? "up" : "right"}`}
                    ></i>{" "}
                    {metric.trend}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatistikSection;
