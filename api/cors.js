const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN;

// CORS middleware
const corsMiddleware = cors({
  origin: FRONTEND_ORIGIN || "*",
  credentials: true,
});

// Wrap CORS middleware for serverless
const runMiddleware = (req, res, fn) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

module.exports = { corsMiddleware, runMiddleware };
