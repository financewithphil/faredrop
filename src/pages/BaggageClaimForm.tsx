import { useState } from "react";
import { apiFetch } from "../hooks/useApi";

const AIRLINES = [
  // US Domestic
  { code: "WN", name: "Southwest Airlines" },
  { code: "DL", name: "Delta Air Lines" },
  { code: "UA", name: "United Airlines" },
  { code: "AA", name: "American Airlines" },
  { code: "B6", name: "JetBlue" },
  { code: "AS", name: "Alaska Airlines" },
  { code: "NK", name: "Spirit Airlines" },
  { code: "F9", name: "Frontier Airlines" },
  // SkyTeam Alliance
  { code: "KE", name: "Korean Air" },
  { code: "AF", name: "Air France" },
  { code: "KL", name: "KLM" },
  { code: "AM", name: "Aeromexico" },
  { code: "VS", name: "Virgin Atlantic" },
  { code: "AZ", name: "ITA Airways" },
  { code: "MU", name: "China Eastern" },
  { code: "VN", name: "Vietnam Airlines" },
  { code: "CI", name: "China Airlines" },
  { code: "GA", name: "Garuda Indonesia" },
  { code: "KQ", name: "Kenya Airways" },
  { code: "SV", name: "Saudia" },
  { code: "RO", name: "TAROM" },
  { code: "ME", name: "Middle East Airlines" },
  { code: "UX", name: "Air Europa" },
  { code: "MF", name: "Xiamen Airlines" },
  { code: "OTHER", name: "Other Airline" },
];

export function BaggageClaimForm({
  onCreated,
  onBack,
}: {
  onCreated: (claimId: string) => void;
  onBack: () => void;
}) {
  const [airlineCode, setAirlineCode] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [claimType, setClaimType] = useState("lost");
  const [isIntl, setIsIntl] = useState(false);
  const [flightNumber, setFlightNumber] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [flightDate, setFlightDate] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const code = airlineCode === "OTHER" ? customCode.toUpperCase() : airlineCode;
    if (!code) {
      setError("Please select an airline");
      return;
    }

    setSubmitting(true);
    try {
      const airline = AIRLINES.find((a) => a.code === airlineCode)?.name || customCode;
      const res = await apiFetch("/api/baggage-claims", {
        method: "POST",
        body: JSON.stringify({
          airlineCode: code,
          airline,
          claimType,
          isInternational: isIntl,
          flightNumber: flightNumber || null,
          origin: origin.toUpperCase() || null,
          destination: destination.toUpperCase() || null,
          flightDate: flightDate || null,
          description: description || null,
        }),
      });
      const data = await res.json();
      if (data.id) {
        onCreated(data.id);
      } else {
        setError(data.error || "Failed to create claim");
      }
    } catch {
      setError("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <button onClick={onBack} style={styles.backBtn}>&larr; Back</button>

      <div style={styles.card}>
        <h2 style={styles.title}>File a Baggage Claim</h2>
        <p style={styles.subtitle}>
          We'll guide you through the airline-specific process step by step.
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>What happened?</label>
          <div style={styles.typeButtons}>
            {(["lost", "damaged", "delayed"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setClaimType(t)}
                style={{
                  ...styles.typeBtn,
                  ...(claimType === t ? styles.typeBtnActive : {}),
                }}
              >
                {t === "lost" ? "Lost" : t === "damaged" ? "Damaged" : "Delayed"}
              </button>
            ))}
          </div>

          <label style={styles.label}>Airline</label>
          <select
            value={airlineCode}
            onChange={(e) => setAirlineCode(e.target.value)}
            style={styles.select}
            required
          >
            <option value="">Select airline...</option>
            {AIRLINES.map((a) => (
              <option key={a.code} value={a.code}>{a.name}</option>
            ))}
          </select>
          {airlineCode === "OTHER" && (
            <input
              type="text"
              placeholder="Airline IATA code (e.g., HA)"
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value)}
              style={styles.input}
              maxLength={3}
              required
            />
          )}

          <div style={styles.row}>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>Flight Number</label>
              <input
                type="text"
                placeholder="e.g., UA 1234"
                value={flightNumber}
                onChange={(e) => setFlightNumber(e.target.value)}
                style={styles.input}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>Flight Date</label>
              <input
                type="date"
                value={flightDate}
                onChange={(e) => setFlightDate(e.target.value)}
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.row}>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>From (Airport Code)</label>
              <input
                type="text"
                placeholder="e.g., SFO"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                style={styles.input}
                maxLength={3}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>To (Airport Code)</label>
              <input
                type="text"
                placeholder="e.g., JFK"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                style={styles.input}
                maxLength={3}
              />
            </div>
          </div>

          <label style={styles.label}>International Flight?</label>
          <div style={styles.typeButtons}>
            <button
              type="button"
              onClick={() => setIsIntl(false)}
              style={{ ...styles.typeBtn, ...(!isIntl ? styles.typeBtnActive : {}) }}
            >
              Domestic (US)
            </button>
            <button
              type="button"
              onClick={() => setIsIntl(true)}
              style={{ ...styles.typeBtn, ...(isIntl ? styles.typeBtnActive : {}) }}
            >
              International
            </button>
          </div>

          <label style={styles.label}>Describe what happened</label>
          <textarea
            placeholder="e.g., Checked one black Samsonite suitcase, never arrived at baggage carousel"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={styles.textarea}
            rows={3}
          />

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" disabled={submitting} style={styles.submitBtn}>
            {submitting ? "Creating..." : "Get Filing Instructions"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { padding: 20, maxWidth: 500, margin: "0 auto" },
  backBtn: { background: "none", border: "none", color: "#3b82f6", fontSize: 14, cursor: "pointer", marginBottom: 16, padding: 0 },
  card: { background: "#1e293b", borderRadius: 12, padding: 24, border: "1px solid #334155" },
  title: { fontSize: 20, fontWeight: 700, color: "#f1f5f9", marginBottom: 4 },
  subtitle: { fontSize: 14, color: "#94a3b8", marginBottom: 24 },
  form: { display: "flex", flexDirection: "column", gap: 16 },
  label: { fontSize: 13, fontWeight: 600, color: "#94a3b8", marginBottom: -8 },
  typeButtons: { display: "flex", gap: 8 },
  typeBtn: {
    flex: 1, padding: "10px 0", borderRadius: 8, border: "1px solid #334155",
    background: "transparent", color: "#94a3b8", fontSize: 14, fontWeight: 600,
    cursor: "pointer", textAlign: "center",
  },
  typeBtnActive: { background: "#2563eb", color: "#fff", borderColor: "#2563eb" },
  select: {
    padding: "10px 12px", borderRadius: 8, border: "1px solid #334155",
    background: "#0f172a", color: "#f1f5f9", fontSize: 14, outline: "none",
  },
  input: {
    width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #334155",
    background: "#0f172a", color: "#f1f5f9", fontSize: 14, outline: "none",
    boxSizing: "border-box" as const,
  },
  row: { display: "flex", gap: 12 },
  textarea: {
    width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #334155",
    background: "#0f172a", color: "#f1f5f9", fontSize: 14, fontFamily: "inherit",
    resize: "vertical" as const, outline: "none", boxSizing: "border-box" as const,
  },
  error: { color: "#ef4444", fontSize: 13 },
  submitBtn: {
    padding: "12px 0", borderRadius: 8, border: "none", background: "#2563eb",
    color: "#fff", fontSize: 16, fontWeight: 600, cursor: "pointer",
  },
};
