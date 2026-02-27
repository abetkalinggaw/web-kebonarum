const express = require("express");
const cors = require("cors");

const { PORT, FRONTEND_ORIGIN } = require("./config/appConfig");
const healthRoutes = require("./routes/healthRoutes");
const youtubeRoutes = require("./routes/youtubeRoutes");
const documentationRoutes = require("./routes/documentationRoutes");

const app = express();

if (FRONTEND_ORIGIN) {
  app.use(cors({ origin: FRONTEND_ORIGIN }));
} else {
  app.use(cors());
}

app.use(express.json());

app.use("/api", healthRoutes);
app.use("/api/youtube", youtubeRoutes);
app.use("/api/documentation", documentationRoutes);

app.listen(PORT, () => {
  console.log(`Backend API running on port ${PORT}`);
});
