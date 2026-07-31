require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { FRONTEND_ORIGIN } = require("./config/appConfig");
const healthRoutes = require("./routes/healthRoutes");
const youtubeRoutes = require("./routes/youtubeRoutes");
const documentationRoutes = require("./routes/documentationRoutes");
const statistikRoutes = require("./routes/statistikRoutes");

// Admin & Additional Routes
const authRoutes = require("./routes/authRoutes");
const agendaRoutes = require("./routes/agendaRoutes");
const wartaRoutes = require("./routes/wartaRoutes");
const majelisRoutes = require("./routes/majelisRoutes");
const pendetaRoutes = require("./routes/pendetaRoutes");
const statistikAdminRoutes = require("./routes/statistikAdminRoutes");

const app = express();

if (FRONTEND_ORIGIN) {
  app.use(cors({ origin: FRONTEND_ORIGIN }));
} else {
  app.use(cors());
}

app.use(express.json());

// API Routes
app.use("/api", healthRoutes);
app.use("/api/youtube", youtubeRoutes);
app.use("/api/documentation", documentationRoutes);
app.use("/api/statistik", statistikRoutes);

// Admin Routes
app.use("/api/auth", authRoutes);
app.use("/api/agenda", agendaRoutes);
app.use("/api/warta", wartaRoutes);
app.use("/api/majelis", majelisRoutes);
app.use("/api/pendeta", pendetaRoutes);
app.use("/api/admin/statistik", statistikAdminRoutes);

module.exports = app;
