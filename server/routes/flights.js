const express = require("express");
const db = require("../db");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

// List all flights with latest price
router.get("/", verifyToken, (req, res) => {
  const flights = db.getAll(`
    SELECT f.*,
      (SELECT pc.current_price FROM price_checks pc
       WHERE pc.flight_id = f.id ORDER BY pc.checked_at DESC LIMIT 1) as current_price,
      (SELECT pc.checked_at FROM price_checks pc
       WHERE pc.flight_id = f.id ORDER BY pc.checked_at DESC LIMIT 1) as last_checked,
      (SELECT COUNT(*) FROM price_checks pc WHERE pc.flight_id = f.id) as check_count,
      (SELECT COUNT(*) FROM notifications n WHERE n.flight_id = f.id) as alert_count
    FROM flights f
    ORDER BY f.created_at DESC
  `);
  res.json(flights);
});

// Get single flight
router.get("/:id", verifyToken, (req, res) => {
  const flight = db.getOne(`SELECT * FROM flights WHERE id = ?`, [
    req.params.id,
  ]);
  if (!flight) return res.status(404).json({ error: "Flight not found" });

  const notifications = db.getAll(
    `SELECT * FROM notifications WHERE flight_id = ? ORDER BY sent_at DESC`,
    [req.params.id]
  );

  res.json({ ...flight, notifications });
});

// Delete a tracked flight
router.delete("/:id", verifyToken, (req, res) => {
  db.run(`DELETE FROM price_checks WHERE flight_id = ?`, [req.params.id]);
  db.run(`DELETE FROM notifications WHERE flight_id = ?`, [req.params.id]);
  db.run(`DELETE FROM flights WHERE id = ?`, [req.params.id]);
  res.json({ success: true });
});

module.exports = router;
