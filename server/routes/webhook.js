const express = require("express");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const db = require("../db");
const { parseBookingEmail } = require("../services/email-parser");
const { checkPrice } = require("../services/price-checker");

const router = express.Router();
const upload = multer();

// SendGrid Inbound Parse sends multipart/form-data
router.post("/email", upload.none(), async (req, res) => {
  // Verify webhook secret
  const secret = req.query.secret;
  if (secret !== process.env.WEBHOOK_SECRET) {
    return res.status(403).json({ error: "Invalid webhook secret" });
  }

  try {
    const { from, subject, text, html } = req.body;
    const emailBody = text || html || "";

    if (!emailBody) {
      return res.status(400).json({ error: "No email body found" });
    }

    console.log(`[WEBHOOK] Received email from: ${from}, subject: ${subject}`);

    // Extract sender email
    const emailMatch = from ? from.match(/<(.+?)>/) : null;
    const userEmail = emailMatch ? emailMatch[1] : from || "unknown";

    // Parse with Claude
    const parsed = await parseBookingEmail(emailBody);
    console.log("[WEBHOOK] Parsed flight:", parsed);

    const id = uuidv4();
    db.run(
      `INSERT INTO flights (id, user_email, airline, airline_code, flight_number,
        origin, destination, departure_date, return_date, fare_class,
        price_paid, currency, booking_ref, passengers, raw_email)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        userEmail,
        parsed.airline,
        parsed.airline_code,
        parsed.flight_number,
        parsed.origin,
        parsed.destination,
        parsed.departure_date,
        parsed.return_date,
        parsed.fare_class,
        parsed.price_paid,
        parsed.currency || "USD",
        parsed.booking_ref,
        parsed.passengers || 1,
        emailBody.substring(0, 5000), // Truncate for storage
      ]
    );

    // Do an immediate first price check
    try {
      const priceResult = await checkPrice({
        ...parsed,
        passengers: parsed.passengers || 1,
      });
      if (priceResult) {
        db.run(
          `INSERT INTO price_checks (flight_id, current_price) VALUES (?, ?)`,
          [id, priceResult.currentPrice]
        );
      }
    } catch (priceErr) {
      console.error("[WEBHOOK] Initial price check failed:", priceErr.message);
    }

    res.json({ success: true, flightId: id, parsed });
  } catch (err) {
    console.error("[WEBHOOK] Error:", err.message);
    res.status(500).json({ error: "Failed to process email" });
  }
});

module.exports = router;
