const app = require("./app");
const { PORT } = require("./config/appConfig");

app.listen(PORT, () => {
  console.log(`Backend API running on port ${PORT}`);
});
