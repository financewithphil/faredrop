const express = require("express");
const db = require("../db");
const { verifyToken } = require("../middleware/auth");
const { checkPrice } = require("../services/price-checker");

const router = express.Router();

// Price history for a flight (scoped to user)
router.get("/:flightId/prices", verifyToken, (req, res) => {
  const flight = db.getOne("SELECT id FROM flights WHERE id = ? AND user_id = ?",
    [req.params.flightId, req.user.userId]);
  if (!flight) return res.status(404).json({ error: "Flight not found" });

  const prices = db.getAll(
    `SELECT * FROM price_checks WHERE flight_id = ? ORDER BY checked_at ASC`,
    [req.params.flightId]
  );
  res.json(prices);
});

// Manual trigger: check the current user's active flights
router.post("/check-now", verifyToken, async (req, res) => {
  try {
    const flights = db.getAll(
      `SELECT * FROM flights WHERE user_id = ? AND status = 'active' AND departure_date > date('now')`,
      [req.user.userId]
    );

    for (const flight of flights) {
      try {
        const result = await checkPrice(flight);
        if (result) {
          db.run(`INSERT INTO price_checks (flight_id, current_price) VALUES (?, ?)`,
            [flight.id, result.currentPrice]);
        }
      } catch (err) {
        console.error(`[CHECK-NOW] Error for ${flight.origin}->${flight.destination}:`, err.message);
      }
    }

    res.json({ success: true, checked: flights.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
