const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const apiRoutes = require("./routes/api");
const { errorHandler } = require("./middleware/errorHandler");
const { logger } = require("./middleware/logger");

const app = express();
const PORT = process.env.PORT || 5001;

/* ======================
   MIDDLEWARE
====================== */
app.use(helmet());

app.use(
  cors({
    origin: "*", // allow frontend domain
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(logger);

/* ======================
   ROUTES
====================== */

// Root (fixes "Cannot GET /")
app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "OREN Backend",
    message: "API is live",
  });
});

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use("/api", apiRoutes);

/* ======================
   ERROR HANDLING
====================== */
app.use(errorHandler);

/* ======================
   SERVER START
====================== */
app.listen(PORT, () => {
  console.log(`🚀 OREN Backend running on port ${PORT}`);
});

