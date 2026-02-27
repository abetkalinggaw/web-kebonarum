const cors = require("cors");

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
