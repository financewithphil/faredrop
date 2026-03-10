const express = require("express");
const db = require("../db");
const { verifyToken } = require("../middleware/auth");
const { runPriceChecks } = require("../services/scheduler");

const router = express.Router();

// Price history for a flight
router.get("/:flightId/prices", verifyToken, (req, res) => {
  const prices = db.getAll(
    `SELECT * FROM price_checks WHERE flight_id = ? ORDER BY checked_at ASC`,
    [req.params.flightId]
  );
  res.json(prices);
});

// Manual trigger: check all active flights now
router.post("/check-now", verifyToken, async (req, res) => {
  try {
    await runPriceChecks();
    res.json({ success: true, message: "Price check complete" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
