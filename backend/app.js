require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { FRONTEND_ORIGIN } = require("./config/appConfig");
const healthRoutes = require("./routes/healthRoutes");
const youtubeRoutes = require("./routes/youtubeRoutes");
const documentationRoutes = require("./routes/documentationRoutes");
const statistikRoutes = require("./routes/statistikRoutes");

// Admin & Digitalisasi Database Routes
const authRoutes = require("./routes/authRoutes");
const agendaRoutes = require("./routes/agendaRoutes");
const wartaRoutes = require("./routes/wartaRoutes");
const jemaatRoutes = require("./routes/jemaatRoutes");
const keuanganRoutes = require("./routes/keuanganRoutes");

const { readStore } = require("./services/jsonStore");

const app = express();

if (FRONTEND_ORIGIN) {
  app.use(cors({ origin: FRONTEND_ORIGIN }));
} else {
  app.use(cors());
}

app.use(express.json());

// Public API Routes
app.use("/api", healthRoutes);
app.use("/api/youtube", youtubeRoutes);
app.use("/api/documentation", documentationRoutes);
app.use("/api/statistik", statistikRoutes);

// Backward-compat read-only proxies (Majelis & Pendeta filtered from unified jemaat DB)
app.get("/api/majelis", (req, res) => {
  const jemaat = readStore("jemaat") || [];
  const majelis = jemaat.filter(j =>
    (j.peranGereja || "").toLowerCase() === "majelis"
  );
  res.json(majelis);
});

app.get("/api/pendeta", (req, res) => {
  const jemaat = readStore("jemaat") || [];
  const pendeta = jemaat.filter(j =>
    (j.peranGereja || "").toLowerCase() === "pendeta"
  );
  res.json(pendeta);
});

// Admin & Digitalisasi Database Routes
app.use("/api/auth", authRoutes);
app.use("/api/agenda", agendaRoutes);
app.use("/api/warta", wartaRoutes);
app.use("/api/jemaat", jemaatRoutes);
app.use("/api/keuangan-administrasi", keuanganRoutes);

module.exports = app;
