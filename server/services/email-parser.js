const Anthropic = require("@anthropic-ai/sdk");

const client = new Anthropic();

const SYSTEM_PROMPT = `You extract flight booking details from confirmation emails.
Return ONLY valid JSON with these fields:
{
  "airline": "Full airline name",
  "airline_code": "IATA 2-letter code (e.g. UA, DL, AA, WN, AS, B6)",
  "flight_number": "e.g. UA 1234",
  "origin": "IATA airport code (e.g. SFO)",
  "destination": "IATA airport code (e.g. JFK)",
  "departure_date": "YYYY-MM-DD",
  "return_date": "YYYY-MM-DD or null if one-way",
  "fare_class": "economy, premium_economy, business, or first",
  "price_paid": 347.20,
  "currency": "USD",
  "booking_ref": "Confirmation/record locator code",
  "passengers": 1
}

Rules:
- Convert city/airport names to IATA codes (e.g. "Los Angeles" -> "LAX")
- If the email contains multiple legs/segments, use the FIRST outbound leg
- price_paid should be the TOTAL amount charged (including taxes/fees)
- If a field cannot be determined, use null
- Return ONLY the JSON object, no markdown, no explanation`;

async function parseBookingEmail(emailText) {
  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 500,
    temperature: 0,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Extract flight booking details from this email:\n\n${emailText}`,
      },
    ],
  });

  const text = response.content[0].text.trim();

  // Strip markdown code fences if present
  const cleaned = text.replace(/^```json?\s*/, "").replace(/\s*```$/, "");

  const parsed = JSON.parse(cleaned);

  // Validate required fields
  if (!parsed.origin || !parsed.destination || !parsed.departure_date || !parsed.price_paid) {
    throw new Error(
      "Missing required fields: origin, destination, departure_date, or price_paid"
    );
  }

  return parsed;
}

module.exports = { parseBookingEmail };
