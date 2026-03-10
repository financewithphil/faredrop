const cron = require("node-cron");
const db = require("../db");
const { checkPrice } = require("./price-checker");
const { sendPriceDropAlert } = require("./notifier");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runPriceChecks() {
  console.log("[SCHEDULER] Starting price check run...");

  // Get all active flights with future departure dates
  const flights = db.getAll(
    `SELECT * FROM flights WHERE status = 'active' AND departure_date > date('now')`
  );

  if (flights.length === 0) {
    console.log("[SCHEDULER] No active flights to check.");
    return;
  }

  console.log(`[SCHEDULER] Checking ${flights.length} flight(s)...`);

  for (const flight of flights) {
    try {
      const result = await checkPrice(flight);

      if (!result) {
        console.log(
          `[SCHEDULER] No results for ${flight.origin}->${flight.destination}`
        );
        db.run(
          `INSERT INTO price_checks (flight_id, current_price) VALUES (?, NULL)`,
          [flight.id]
        );
        continue;
      }

      db.run(
        `INSERT INTO price_checks (flight_id, current_price) VALUES (?, ?)`,
        [flight.id, result.currentPrice]
      );

      console.log(
        `[SCHEDULER] ${flight.origin}->${flight.destination}: paid $${flight.price_paid}, now $${result.currentPrice}`
      );

      // Price dropped by at least $10
      if (result.currentPrice < flight.price_paid - 10) {
        await sendPriceDropAlert(flight, result.currentPrice);
      }
    } catch (err) {
      console.error(
        `[SCHEDULER] Error checking ${flight.origin}->${flight.destination}:`,
        err.message
      );
    }

    // Respect Amadeus rate limits
    await sleep(2000);
  }

  // Expire flights with past departure dates
  db.run(
    `UPDATE flights SET status = 'expired' WHERE status = 'active' AND departure_date <= date('now')`
  );

  console.log("[SCHEDULER] Price check run complete.");
}

function startScheduler() {
  // Run at 8am, 2pm, 8pm UTC
  cron.schedule("0 8,14,20 * * *", () => {
    runPriceChecks().catch((err) =>
      console.error("[SCHEDULER] Run failed:", err.message)
    );
  });

  console.log("[SCHEDULER] Cron scheduled: 8am, 2pm, 8pm UTC");
}

module.exports = { startScheduler, runPriceChecks };
