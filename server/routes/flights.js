const express = require("express");
const { v4: uuidv4 } = require("uuid");
const db = require("../db");
const { verifyToken } = require("../middleware/auth");
const { parseBookingEmail } = require("../services/email-parser");
const { checkPrice } = require("../services/price-checker");

const router = express.Router();

// List all flights for the authenticated user
router.get("/", verifyToken, (req, res) => {
  const flights = db.getAll(`
    SELECT f.*,
      (SELECT pc.current_price FROM price_checks pc
       WHERE pc.flight_id = f.id ORDER BY pc.checked_at DESC LIMIT 1) as current_price,
      (SELECT pc.checked_at FROM price_checks pc
       WHERE pc.flight_id = f.id ORDER BY pc.checked_at DESC LIMIT 1) as last_checked,
      (SELECT COUNT(*) FROM price_checks pc WHERE pc.flight_id = f.id) as check_count,
      (SELECT COUNT(*) FROM notifications n WHERE n.flight_id = f.id) as alert_count,
      (SELECT c.id FROM claims c WHERE c.flight_id = f.id LIMIT 1) as claim_id,
      (SELECT c.status FROM claims c WHERE c.flight_id = f.id LIMIT 1) as claim_status
    FROM flights f
    WHERE f.user_id = ?
    ORDER BY f.created_at DESC
  `, [req.user.userId]);
  res.json(flights);
});

// Get single flight (scoped to user)
router.get("/:id", verifyToken, (req, res) => {
  const flight = db.getOne(
    `SELECT * FROM flights WHERE id = ? AND user_id = ?`,
    [req.params.id, req.user.userId]
  );
  if (!flight) return res.status(404).json({ error: "Flight not found" });

  const notifications = db.getAll(
    `SELECT * FROM notifications WHERE flight_id = ? ORDER BY sent_at DESC`,
    [req.params.id]
  );

  res.json({ ...flight, notifications });
});

// Add flight by pasting booking email text
router.post("/parse", verifyToken, async (req, res) => {
  const { emailText } = req.body;
  if (!emailText || !emailText.trim()) {
    return res.status(400).json({ error: "No email text provided" });
  }

  try {
    const parsed = await parseBookingEmail(emailText);

    const id = uuidv4();
    db.run(
      `INSERT INTO flights (id, user_id, user_email, airline, airline_code, flight_number,
        origin, destination, departure_date, return_date, fare_class,
        price_paid, currency, booking_ref, passengers, raw_email)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, req.user.userId, req.user.email,
        parsed.airline, parsed.airline_code, parsed.flight_number,
        parsed.origin, parsed.destination, parsed.departure_date, parsed.return_date,
        parsed.fare_class, parsed.price_paid, parsed.currency || "USD",
        parsed.booking_ref, parsed.passengers || 1, emailText.substring(0, 5000),
      ]
    );

    // Immediate price check
    try {
      const priceResult = await checkPrice({ ...parsed, passengers: parsed.passengers || 1 });
      if (priceResult) {
        db.run(`INSERT INTO price_checks (flight_id, current_price) VALUES (?, ?)`,
          [id, priceResult.currentPrice]);
      }
    } catch (priceErr) {
      console.error("[PARSE] Initial price check failed:", priceErr.message);
    }

    res.json({ success: true, flightId: id, parsed });
  } catch (err) {
    console.error("[PARSE] Error:", err.message);
    res.status(500).json({ error: "Failed to parse email: " + err.message });
  }
});

// Delete a tracked flight (scoped to user)
router.delete("/:id", verifyToken, (req, res) => {
  const flight = db.getOne("SELECT id FROM flights WHERE id = ? AND user_id = ?",
    [req.params.id, req.user.userId]);
  if (!flight) return res.status(404).json({ error: "Flight not found" });

  db.run(`DELETE FROM claims WHERE flight_id = ?`, [req.params.id]);
  db.run(`DELETE FROM price_checks WHERE flight_id = ?`, [req.params.id]);
  db.run(`DELETE FROM notifications WHERE flight_id = ?`, [req.params.id]);
  db.run(`DELETE FROM flights WHERE id = ?`, [req.params.id]);
  res.json({ success: true });
});

module.exports = router;
