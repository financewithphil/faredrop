require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");
const db = require("./db");
const { init: initNotifier } = require("./services/notifier");
const { startScheduler } = require("./services/scheduler");

const app = express();
const PORT = process.env.PORT || 8787;

// Middleware
app.use(cors());
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
  })
);

// API routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/flights", require("./routes/flights"));
app.use("/api/flights", require("./routes/prices"));
app.use("/api/claims", require("./routes/claims"));
app.use("/api/baggage-claims", require("./routes/baggage-claims"));
app.use("/api/webhook", require("./routes/webhook"));

// Serve frontend in production
const distPath = path.join(__dirname, "..", "dist");
app.use(express.static(distPath));
app.get("*", (req, res) => {
  if (!req.path.startsWith("/api")) {
    res.sendFile(path.join(distPath, "index.html"));
  }
});

// Start
db.initDb().then(() => {
  initNotifier();
  startScheduler();
  app.listen(PORT, () => {
    console.log(`[FAREDROP] Server running on port ${PORT}`);
  });
});
