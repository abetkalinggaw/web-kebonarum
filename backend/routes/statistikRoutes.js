const express = require('express');
const router = express.Router();

// Mock database connection/query
router.get('/', (req, res) => {
  // In the future, replace this with a real database query (e.g. MongoDB, PostgreSQL)
  const data = {
    metrics: [
      { id: "total_jemaat", label: "Total Jemaat", value: "1.245", trend: "+12", icon: "fas fa-users" },
      { id: "kepala_keluarga", label: "Kepala Keluarga", value: "480", trend: "+5", icon: "fas fa-home" },
      { id: "majelis_pendeta", label: "Majelis & Pendeta", value: "32", trend: "0", icon: "fas fa-user-tie" },
      { id: "wilayah_pelayanan", label: "Wilayah Pelayanan", value: "5", trend: "0", icon: "fas fa-map-marker-alt" }
    ],
    demographics: [
      { id: "anak", label: "Anak-anak", value: 15, color: "#94a3b8" },
      { id: "pemuda", label: "Pemuda", value: 25, color: "#64748b" },
      { id: "dewasa", label: "Dewasa", value: 40, color: "var(--color-brand-700)" },
      { id: "lansia", label: "Adiyuswa (Lansia)", value: 20, color: "#cbd5e1" }
    ],
    growth: [
      { year: "2022", percentage: 40 },
      { year: "2023", percentage: 55 },
      { year: "2024", percentage: 70 },
      { year: "2025", percentage: 85 },
      { year: "2026", percentage: 100 }
    ]
  };
  
  res.json(data);
});

module.exports = router;
