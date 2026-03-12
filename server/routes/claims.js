const express = require("express");
const { v4: uuidv4 } = require("uuid");
const db = require("../db");
const { verifyToken } = require("../middleware/auth");
const airlinePolicies = require("../data/airline-policies");

const router = express.Router();

// List all claims for the authenticated user
router.get("/", verifyToken, (req, res) => {
  const claims = db.getAll(`
    SELECT c.*, f.airline, f.airline_code, f.flight_number, f.origin, f.destination,
      f.departure_date, f.fare_class, f.booking_ref
    FROM claims c
    JOIN flights f ON c.flight_id = f.id
    WHERE c.user_id = ?
    ORDER BY c.created_at DESC
  `, [req.user.userId]);
  res.json(claims);
});

// Get single claim with airline policy
router.get("/:id", verifyToken, (req, res) => {
  const claim = db.getOne(`
    SELECT c.*, f.airline, f.airline_code, f.flight_number, f.origin, f.destination,
      f.departure_date, f.return_date, f.fare_class, f.booking_ref, f.passengers, f.currency,
      f.payment_type, f.miles_paid
    FROM claims c
    JOIN flights f ON c.flight_id = f.id
    WHERE c.id = ? AND c.user_id = ?
  `, [req.params.id, req.user.userId]);

  if (!claim) return res.status(404).json({ error: "Claim not found" });

  const policy = airlinePolicies[claim.airline_code] || airlinePolicies._default;

  res.json({ ...claim, policy });
});

// Get claim for a specific flight
router.get("/flight/:flightId", verifyToken, (req, res) => {
  const claim = db.getOne(`
    SELECT c.* FROM claims c
    WHERE c.flight_id = ? AND c.user_id = ?
  `, [req.params.flightId, req.user.userId]);

  if (!claim) return res.json(null);

  const policy = airlinePolicies[claim.airline_code] || airlinePolicies._default;
  res.json({ ...claim, policy });
});

// Create a new claim
router.post("/", verifyToken, (req, res) => {
  const { flightId } = req.body;
  if (!flightId) return res.status(400).json({ error: "flightId required" });

  const flight = db.getOne("SELECT * FROM flights WHERE id = ? AND user_id = ?",
    [flightId, req.user.userId]);
  if (!flight) return res.status(404).json({ error: "Flight not found" });

  // Check for existing claim
  const existing = db.getOne("SELECT id FROM claims WHERE flight_id = ? AND user_id = ?",
    [flightId, req.user.userId]);
  if (existing) return res.status(409).json({ error: "Claim already exists", claimId: existing.id });

  // Get latest price
  const latest = db.getOne(
    "SELECT current_price FROM price_checks WHERE flight_id = ? AND current_price IS NOT NULL ORDER BY checked_at DESC LIMIT 1",
    [flightId]
  );
  if (!latest || latest.current_price >= flight.price_paid) {
    return res.status(400).json({ error: "No price drop detected for this flight" });
  }

  const savings = flight.price_paid - latest.current_price;
  const id = uuidv4();
  const policy = airlinePolicies[flight.airline_code] || airlinePolicies._default;

  db.run(
    `INSERT INTO claims (id, flight_id, user_id, airline_code, price_paid, price_found, savings, claim_method)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, flightId, req.user.userId, flight.airline_code, flight.price_paid, latest.current_price, savings, policy.method]
  );

  const claim = db.getOne("SELECT * FROM claims WHERE id = ?", [id]);
  res.json({ ...claim, policy });
});

// Update claim status/notes
router.patch("/:id", verifyToken, (req, res) => {
  const { status, claimRef, notes } = req.body;
  const claim = db.getOne("SELECT * FROM claims WHERE id = ? AND user_id = ?",
    [req.params.id, req.user.userId]);
  if (!claim) return res.status(404).json({ error: "Claim not found" });

  const updates = [];
  const params = [];

  if (status) { updates.push("status = ?"); params.push(status); }
  if (claimRef !== undefined) { updates.push("claim_ref = ?"); params.push(claimRef); }
  if (notes !== undefined) { updates.push("notes = ?"); params.push(notes); }

  if (updates.length > 0) {
    updates.push("updated_at = datetime('now')");
    params.push(req.params.id);
    db.run(`UPDATE claims SET ${updates.join(", ")} WHERE id = ?`, params);
  }

  const updated = db.getOne("SELECT * FROM claims WHERE id = ?", [req.params.id]);
  const policy = airlinePolicies[updated.airline_code] || airlinePolicies._default;
  res.json({ ...updated, policy });
});

module.exports = router;
