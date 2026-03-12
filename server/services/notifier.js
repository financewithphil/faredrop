const sgMail = require("@sendgrid/mail");
const { v4: uuidv4 } = require("uuid");
const db = require("../db");
const airlinePolicies = require("../data/airline-policies");

function init() {
  if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }
}

async function sendPriceDropAlert(flight, currentPrice) {
  const savings = (flight.price_paid - currentPrice).toFixed(2);

  // Record notification in DB
  db.run(
    `INSERT INTO notifications (flight_id, price_paid, price_found, savings)
     VALUES (?, ?, ?, ?)`,
    [flight.id, flight.price_paid, currentPrice, parseFloat(savings)]
  );

  // Update flight status
  db.run(`UPDATE flights SET status = 'alerted' WHERE id = ?`, [flight.id]);

  // Auto-create claim if user exists and no claim yet
  if (flight.user_id) {
    const existingClaim = db.getOne(
      "SELECT id FROM claims WHERE flight_id = ? AND user_id = ?",
      [flight.id, flight.user_id]
    );
    if (!existingClaim) {
      const policy = airlinePolicies[flight.airline_code] || airlinePolicies._default;
      db.run(
        `INSERT INTO claims (id, flight_id, user_id, airline_code, price_paid, price_found, savings, claim_method)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [uuidv4(), flight.id, flight.user_id, flight.airline_code, flight.price_paid, currentPrice, parseFloat(savings), policy.method]
      );
    }
  }

  // Get airline policy for email
  const policy = airlinePolicies[flight.airline_code] || airlinePolicies._default;

  const toEmail = flight.user_email || process.env.NOTIFICATION_EMAIL;
  if (!toEmail || !process.env.SENDGRID_API_KEY) {
    console.log(
      `[ALERT] Price drop on ${flight.origin}->${flight.destination}: $${flight.price_paid} -> $${currentPrice} (save $${savings})`
    );
    return;
  }

  const stepsHtml = policy.steps
    .map((s, i) => `<li style="margin-bottom: 6px;">${s}</li>`)
    .join("");

  const msg = {
    to: toEmail,
    from: process.env.SENDGRID_FROM_EMAIL || "alerts@faredrop.app",
    subject: `Price Drop! Save $${savings} on ${flight.origin} -> ${flight.destination}`,
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #1e40af;">Price Drop Detected</h2>
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <p style="font-size: 24px; font-weight: 700; color: #16a34a; margin: 0;">Save $${savings}</p>
        </div>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #64748b;">Route</td><td style="padding: 8px 0; font-weight: 600;">${flight.origin} &rarr; ${flight.destination}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b;">Airline</td><td style="padding: 8px 0;">${flight.airline || flight.airline_code || "N/A"}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b;">Date</td><td style="padding: 8px 0;">${flight.departure_date}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b;">You Paid</td><td style="padding: 8px 0; text-decoration: line-through; color: #ef4444;">$${flight.price_paid}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b;">Current Price</td><td style="padding: 8px 0; font-weight: 700; color: #16a34a;">$${currentPrice}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b;">Booking Ref</td><td style="padding: 8px 0;">${flight.booking_ref || "N/A"}</td></tr>
        </table>

        <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <h3 style="color: #1e40af; margin: 0 0 8px 0; font-size: 16px;">How to Claim Your Credit</h3>
          <p style="color: #475569; font-size: 14px; margin: 0 0 12px 0;"><strong>${policy.name}</strong></p>
          <ol style="color: #334155; font-size: 14px; padding-left: 20px; margin: 0;">
            ${stepsHtml}
          </ol>
          ${policy.url ? `<p style="margin: 12px 0 0; font-size: 14px;"><a href="${policy.url}" style="color: #2563eb;">Open ${policy.name} Website</a></p>` : ""}
        </div>

        <p style="color: #94a3b8; font-size: 12px; margin-top: 16px;">
          Track your claim progress at <a href="https://faredrop.onrender.com" style="color: #3b82f6;">FareDrop</a>
        </p>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log(`[NOTIFIER] Price drop email sent to ${toEmail}`);
  } catch (err) {
    console.error("[NOTIFIER] Failed to send email:", err.message);
  }
}

module.exports = { init, sendPriceDropAlert };
