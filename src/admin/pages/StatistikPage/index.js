import React, { useState, useEffect } from 'react';
import { apiCall } from '../../adminApi';

const StatistikPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStatistik = async () => {
    setLoading(true);
    try {
      const res = await apiCall('/admin/statistik');
      setData(res);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistik();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiCall('/admin/statistik', { method: 'PUT', body: JSON.stringify(data) });
      alert('Statistik berhasil diperbarui');
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading || !data) return <div>Loading...</div>;

  return (
    <div className="admin-card">
      <h2 style={{ marginBottom: '24px' }}>Edit Statistik</h2>
      <form onSubmit={handleSubmit}>
        <h3>Metrics</h3>
        {data.metrics.map((metric, i) => (
          <div key={metric.id} style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
            <input className="admin-input" style={{ marginBottom: 0 }} value={metric.label} readOnly />
            <input className="admin-input" style={{ marginBottom: 0 }} value={metric.value} onChange={e => {
              const newData = { ...data };
              newData.metrics[i].value = e.target.value;
              setData(newData);
            }} placeholder="Value" />
            <input className="admin-input" style={{ marginBottom: 0 }} value={metric.trend} onChange={e => {
              const newData = { ...data };
              newData.metrics[i].trend = e.target.value;
              setData(newData);
            }} placeholder="Trend" />
          </div>
        ))}

        <h3 style={{ marginTop: '24px' }}>Demographics</h3>
        {data.demographics.map((demo, i) => (
          <div key={demo.id} style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
            <input className="admin-input" style={{ marginBottom: 0 }} value={demo.label} readOnly />
            <input className="admin-input" type="number" style={{ marginBottom: 0 }} value={demo.value} onChange={e => {
              const newData = { ...data };
              newData.demographics[i].value = parseInt(e.target.value) || 0;
              setData(newData);
            }} placeholder="Value (%)" />
          </div>
        ))}

        <h3 style={{ marginTop: '24px' }}>Growth</h3>
        {data.growth.map((g, i) => (
          <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
            <input className="admin-input" style={{ marginBottom: 0 }} value={g.year} onChange={e => {
              const newData = { ...data };
              newData.growth[i].year = e.target.value;
              setData(newData);
            }} placeholder="Year" />
            <input className="admin-input" type="number" style={{ marginBottom: 0 }} value={g.percentage} onChange={e => {
              const newData = { ...data };
              newData.growth[i].percentage = parseInt(e.target.value) || 0;
              setData(newData);
            }} placeholder="Percentage" />
          </div>
        ))}

        <button type="submit" className="admin-btn" style={{ marginTop: '24px' }}>Simpan Statistik</button>
      </form>
    </div>
  );
};

export default StatistikPage;
