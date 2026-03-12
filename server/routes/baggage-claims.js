const express = require("express");
const { v4: uuidv4 } = require("uuid");
const db = require("../db");
const { verifyToken } = require("../middleware/auth");
const baggagePolicies = require("../data/baggage-policies");

const router = express.Router();

// List all baggage claims for user
router.get("/", verifyToken, (req, res) => {
  const claims = db.getAll(
    `SELECT * FROM baggage_claims WHERE user_id = ? ORDER BY created_at DESC`,
    [req.user.userId]
  );
  res.json(claims);
});

// Get single baggage claim with policy
router.get("/:id", verifyToken, (req, res) => {
  const claim = db.getOne(
    `SELECT * FROM baggage_claims WHERE id = ? AND user_id = ?`,
    [req.params.id, req.user.userId]
  );
  if (!claim) return res.status(404).json({ error: "Claim not found" });

  const policy = baggagePolicies[claim.airline_code] || baggagePolicies._default;
  const regulations = baggagePolicies._regulations;

  res.json({ ...claim, policy, regulations });
});

// Create baggage claim
router.post("/", verifyToken, (req, res) => {
  const {
    airlineCode, airline, claimType, isInternational,
    flightNumber, origin, destination, flightDate,
    description, flightId,
  } = req.body;

  if (!airlineCode || !claimType) {
    return res.status(400).json({ error: "airlineCode and claimType required" });
  }
  if (!["lost", "damaged", "delayed"].includes(claimType)) {
    return res.status(400).json({ error: "claimType must be lost, damaged, or delayed" });
  }

  const id = uuidv4();
  db.run(
    `INSERT INTO baggage_claims (id, user_id, flight_id, airline, airline_code, claim_type,
      is_international, flight_number, origin, destination, flight_date, description)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id, req.user.userId, flightId || null,
      airline || null, airlineCode.toUpperCase(), claimType,
      isInternational ? 1 : 0, flightNumber || null,
      origin || null, destination || null, flightDate || null,
      description || null,
    ]
  );

  const claim = db.getOne("SELECT * FROM baggage_claims WHERE id = ?", [id]);
  const policy = baggagePolicies[claim.airline_code] || baggagePolicies._default;
  const regulations = baggagePolicies._regulations;

  res.json({ ...claim, policy, regulations });
});

// Update baggage claim
router.patch("/:id", verifyToken, (req, res) => {
  const claim = db.getOne(
    "SELECT * FROM baggage_claims WHERE id = ? AND user_id = ?",
    [req.params.id, req.user.userId]
  );
  if (!claim) return res.status(404).json({ error: "Claim not found" });

  const {
    status, fileReference, description, itemsJson,
    estimatedValue, compensationReceived, interimExpenses, notes,
  } = req.body;

  const updates = [];
  const params = [];

  if (status) { updates.push("status = ?"); params.push(status); }
  if (fileReference !== undefined) { updates.push("file_reference = ?"); params.push(fileReference); }
  if (description !== undefined) { updates.push("description = ?"); params.push(description); }
  if (itemsJson !== undefined) { updates.push("items_json = ?"); params.push(typeof itemsJson === "string" ? itemsJson : JSON.stringify(itemsJson)); }
  if (estimatedValue !== undefined) { updates.push("estimated_value = ?"); params.push(estimatedValue); }
  if (compensationReceived !== undefined) { updates.push("compensation_received = ?"); params.push(compensationReceived); }
  if (interimExpenses !== undefined) { updates.push("interim_expenses = ?"); params.push(interimExpenses); }
  if (notes !== undefined) { updates.push("notes = ?"); params.push(notes); }

  if (status === "resolved") {
    updates.push("resolved_at = datetime('now')");
  }

  if (updates.length > 0) {
    updates.push("updated_at = datetime('now')");
    params.push(req.params.id);
    db.run(`UPDATE baggage_claims SET ${updates.join(", ")} WHERE id = ?`, params);
  }

  const updated = db.getOne("SELECT * FROM baggage_claims WHERE id = ?", [req.params.id]);
  const policy = baggagePolicies[updated.airline_code] || baggagePolicies._default;
  const regulations = baggagePolicies._regulations;

  res.json({ ...updated, policy, regulations });
});

// Delete baggage claim
router.delete("/:id", verifyToken, (req, res) => {
  const claim = db.getOne(
    "SELECT id FROM baggage_claims WHERE id = ? AND user_id = ?",
    [req.params.id, req.user.userId]
  );
  if (!claim) return res.status(404).json({ error: "Claim not found" });

  db.run("DELETE FROM baggage_claims WHERE id = ?", [req.params.id]);
  res.json({ success: true });
});

// Get regulations info
router.get("/info/regulations", verifyToken, (req, res) => {
  res.json(baggagePolicies._regulations);
});

module.exports = router;
