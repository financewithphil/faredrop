import { useState, useEffect } from "react";
import { apiFetch } from "../hooks/useApi";

interface Policy {
  name: string;
  allowsRebooking: boolean | null;
  method: string;
  url: string | null;
  phone: string | null;
  steps: string[];
  restrictions: string[];
  refundType: string;
  basicEconomyEligible: boolean | null;
  creditExpiry: string;
}

interface Claim {
  id: string;
  flight_id: string;
  airline_code: string;
  airline: string;
  flight_number: string;
  origin: string;
  destination: string;
  departure_date: string;
  fare_class: string;
  booking_ref: string;
  price_paid: number;
  price_found: number;
  savings: number;
  status: string;
  claim_method: string;
  claim_ref: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  policy: Policy;
}

const STATUS_FLOW = ["detected", "in_progress", "submitted", "approved"];

export function ClaimAssistant({
  claimId,
  onBack,
}: {
  claimId: string;
  onBack: () => void;
}) {
  const [claim, setClaim] = useState<Claim | null>(null);
  const [claimRef, setClaimRef] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  useEffect(() => {
    apiFetch(`/api/claims/${claimId}`)
      .then((r) => r.json())
      .then((data) => {
        setClaim(data);
        setClaimRef(data.claim_ref || "");
        setNotes(data.notes || "");
      });
  }, [claimId]);

  const updateClaim = async (updates: Record<string, string>) => {
    setSaving(true);
    const res = await apiFetch(`/api/claims/${claimId}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
    const updated = await res.json();
    setClaim(updated);
    setSaving(false);
  };

  const toggleStep = (i: number) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  if (!claim) {
    return <div style={styles.loading}>Loading claim...</div>;
  }

  const isBasicEconomy =
    claim.fare_class &&
    (claim.fare_class.toLowerCase().includes("basic") ||
      claim.fare_class.toLowerCase() === "basic_economy");

  return (
    <div style={styles.container}>
      <button onClick={onBack} style={styles.backBtn}>
        &larr; Back
      </button>

      {/* Header */}
      <div style={styles.card}>
        <div style={styles.route}>
          <span style={styles.airport}>{claim.origin}</span>
          <span style={styles.arrow}>&rarr;</span>
          <span style={styles.airport}>{claim.destination}</span>
        </div>
        <div style={styles.airlineRow}>
          <span style={styles.airlineName}>
            {claim.airline || claim.policy.name}
          </span>
          <span style={styles.flightNum}>{claim.flight_number}</span>
          <span style={styles.date}>{claim.departure_date}</span>
        </div>

        <div style={styles.savingsBox}>
          <div style={styles.savingsAmount}>${claim.savings.toFixed(0)}</div>
          <div style={styles.savingsLabel}>potential savings</div>
          <div style={styles.priceCompare}>
            <span style={styles.pricePaid}>${claim.price_paid}</span>
            <span style={styles.priceArrow}>&rarr;</span>
            <span style={styles.priceFound}>${claim.price_found}</span>
          </div>
        </div>
      </div>

      {/* Status Tracker */}
      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>Claim Status</h3>
        <div style={styles.statusTrack}>
          {STATUS_FLOW.map((s, i) => {
            const currentIdx = STATUS_FLOW.indexOf(claim.status);
            const isActive = i <= currentIdx;
            const isCurrent = s === claim.status;
            return (
              <div key={s} style={styles.statusStep}>
                <div
                  style={{
                    ...styles.statusDot,
                    background: isActive ? "#2563eb" : "#334155",
                    border: isCurrent ? "2px solid #60a5fa" : "2px solid transparent",
                  }}
                />
                <span
                  style={{
                    ...styles.statusLabel,
                    color: isActive ? "#e2e8f0" : "#64748b",
                    fontWeight: isCurrent ? 700 : 400,
                  }}
                >
                  {s.replace("_", " ")}
                </span>
                {i < STATUS_FLOW.length - 1 && (
                  <div
                    style={{
                      ...styles.statusLine,
                      background: i < currentIdx ? "#2563eb" : "#334155",
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
        {claim.status !== "approved" && claim.status !== "denied" && (
          <div style={styles.statusActions}>
            {claim.status === "detected" && (
              <button
                onClick={() => updateClaim({ status: "in_progress" })}
                disabled={saving}
                style={styles.actionBtn}
              >
                Start Filing
              </button>
            )}
            {claim.status === "in_progress" && (
              <button
                onClick={() => updateClaim({ status: "submitted" })}
                disabled={saving}
                style={styles.actionBtn}
              >
                Mark as Submitted
              </button>
            )}
            {claim.status === "submitted" && (
              <>
                <button
                  onClick={() => updateClaim({ status: "approved" })}
                  disabled={saving}
                  style={{ ...styles.actionBtn, background: "#16a34a" }}
                >
                  Credit Received
                </button>
                <button
                  onClick={() => updateClaim({ status: "denied" })}
                  disabled={saving}
                  style={{ ...styles.actionBtn, background: "#dc2626" }}
                >
                  Denied
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Eligibility Warning */}
      {isBasicEconomy && claim.policy.basicEconomyEligible === false && (
        <div style={styles.warningBox}>
          <strong>Heads up:</strong> Your fare class appears to be Basic
          Economy. {claim.policy.name} typically does not allow changes on
          Basic Economy tickets. You may still try contacting the airline
          directly.
        </div>
      )}

      {/* Step-by-step Guide */}
      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>How to File Your Claim</h3>
        <p style={styles.policyName}>{claim.policy.name}</p>
        <div style={styles.stepsList}>
          {claim.policy.steps.map((step, i) => (
            <div
              key={i}
              style={styles.stepItem}
              onClick={() => toggleStep(i)}
            >
              <div
                style={{
                  ...styles.stepCheck,
                  background: completedSteps.has(i) ? "#2563eb" : "transparent",
                  borderColor: completedSteps.has(i) ? "#2563eb" : "#475569",
                }}
              >
                {completedSteps.has(i) && (
                  <span style={{ color: "#fff", fontSize: 12 }}>&#10003;</span>
                )}
              </div>
              <span
                style={{
                  ...styles.stepText,
                  textDecoration: completedSteps.has(i) ? "line-through" : "none",
                  opacity: completedSteps.has(i) ? 0.6 : 1,
                }}
              >
                {step}
              </span>
            </div>
          ))}
        </div>

        <div style={styles.actionLinks}>
          {claim.policy.url && (
            <a href={claim.policy.url} target="_blank" rel="noreferrer" style={styles.linkBtn}>
              Open {claim.policy.name} Website
            </a>
          )}
          {claim.policy.phone && (
            <a href={`tel:${claim.policy.phone}`} style={styles.phoneBtn}>
              Call {claim.policy.phone}
            </a>
          )}
        </div>
      </div>

      {/* Restrictions */}
      {claim.policy.restrictions.length > 0 && (
        <div style={styles.infoBox}>
          <h4 style={styles.infoTitle}>Important Notes</h4>
          <ul style={styles.restrictionsList}>
            {claim.policy.restrictions.map((r, i) => (
              <li key={i} style={styles.restrictionItem}>{r}</li>
            ))}
          </ul>
          <p style={styles.expiryNote}>
            Credit expires: <strong>{claim.policy.creditExpiry}</strong> from
            issue date
          </p>
        </div>
      )}

      {/* Notes & Reference */}
      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>Your Notes</h3>
        <input
          type="text"
          placeholder="Claim reference / confirmation #"
          value={claimRef}
          onChange={(e) => setClaimRef(e.target.value)}
          style={styles.input}
        />
        <textarea
          placeholder="Notes (e.g., called on 3/12, agent said credit will appear in 5-7 days)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          style={styles.textarea}
          rows={3}
        />
        <button
          onClick={() => updateClaim({ claimRef, notes })}
          disabled={saving}
          style={styles.saveBtn}
        >
          {saving ? "Saving..." : "Save Notes"}
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { padding: 20, maxWidth: 600, margin: "0 auto" },
  loading: {
    flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
    color: "#94a3b8",
  },
  backBtn: {
    background: "none", border: "none", color: "#3b82f6",
    fontSize: 14, cursor: "pointer", marginBottom: 16, padding: 0,
  },
  card: {
    background: "#1e293b", borderRadius: 12, padding: 20,
    marginBottom: 16, border: "1px solid #334155",
  },
  route: {
    display: "flex", alignItems: "center", gap: 12,
    marginBottom: 8,
  },
  airport: { fontSize: 28, fontWeight: 700, color: "#f1f5f9" },
  arrow: { fontSize: 20, color: "#64748b" },
  airlineRow: {
    display: "flex", gap: 12, fontSize: 13, color: "#94a3b8",
    marginBottom: 16,
  },
  airlineName: {},
  flightNum: {},
  date: {},
  savingsBox: {
    background: "#052e16", borderRadius: 8, padding: 16,
    textAlign: "center",
  },
  savingsAmount: { fontSize: 36, fontWeight: 700, color: "#4ade80" },
  savingsLabel: { fontSize: 13, color: "#86efac", marginBottom: 8 },
  priceCompare: { display: "flex", justifyContent: "center", gap: 8, fontSize: 16 },
  pricePaid: { color: "#f87171", textDecoration: "line-through" },
  priceArrow: { color: "#64748b" },
  priceFound: { color: "#4ade80", fontWeight: 600 },
  sectionTitle: { fontSize: 16, fontWeight: 600, color: "#e2e8f0", marginBottom: 16 },
  statusTrack: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    marginBottom: 16,
  },
  statusStep: {
    display: "flex", flexDirection: "column", alignItems: "center",
    position: "relative", flex: 1,
  },
  statusDot: {
    width: 16, height: 16, borderRadius: "50%", marginBottom: 6,
  },
  statusLabel: { fontSize: 11, textTransform: "capitalize" as const },
  statusLine: {
    position: "absolute", top: 7, left: "60%", right: "-40%",
    height: 2,
  },
  statusActions: { display: "flex", gap: 8, justifyContent: "center" },
  actionBtn: {
    padding: "8px 20px", borderRadius: 8, border: "none",
    background: "#2563eb", color: "#fff", fontSize: 14,
    fontWeight: 600, cursor: "pointer",
  },
  warningBox: {
    background: "#422006", border: "1px solid #854d0e",
    borderRadius: 8, padding: 16, marginBottom: 16,
    fontSize: 14, color: "#fde68a",
  },
  policyName: { fontSize: 14, color: "#94a3b8", marginBottom: 12 },
  stepsList: { display: "flex", flexDirection: "column", gap: 12 },
  stepItem: {
    display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer",
  },
  stepCheck: {
    width: 22, height: 22, minWidth: 22, borderRadius: 4,
    border: "2px solid #475569", display: "flex",
    alignItems: "center", justifyContent: "center", marginTop: 1,
  },
  stepText: { fontSize: 14, color: "#e2e8f0", lineHeight: "1.5" },
  actionLinks: {
    display: "flex", gap: 8, marginTop: 20, flexWrap: "wrap",
  },
  linkBtn: {
    padding: "10px 20px", borderRadius: 8, background: "#2563eb",
    color: "#fff", fontSize: 14, fontWeight: 600,
    textDecoration: "none", textAlign: "center",
  },
  phoneBtn: {
    padding: "10px 20px", borderRadius: 8, border: "1px solid #334155",
    background: "#1e293b", color: "#e2e8f0", fontSize: 14,
    fontWeight: 600, textDecoration: "none", textAlign: "center",
  },
  infoBox: {
    background: "#1a1a2e", border: "1px solid #334155",
    borderRadius: 8, padding: 16, marginBottom: 16,
  },
  infoTitle: { fontSize: 14, fontWeight: 600, color: "#fbbf24", marginBottom: 8 },
  restrictionsList: { paddingLeft: 20, margin: 0 },
  restrictionItem: { fontSize: 13, color: "#94a3b8", marginBottom: 4 },
  expiryNote: { fontSize: 13, color: "#94a3b8", marginTop: 12 },
  input: {
    width: "100%", padding: "10px 12px", borderRadius: 8,
    border: "1px solid #334155", background: "#0f172a",
    color: "#f1f5f9", fontSize: 14, outline: "none", marginBottom: 10,
    boxSizing: "border-box" as const,
  },
  textarea: {
    width: "100%", padding: "10px 12px", borderRadius: 8,
    border: "1px solid #334155", background: "#0f172a",
    color: "#f1f5f9", fontSize: 14, fontFamily: "inherit",
    resize: "vertical" as const, outline: "none", marginBottom: 10,
    boxSizing: "border-box" as const,
  },
  saveBtn: {
    padding: "8px 16px", borderRadius: 8, border: "1px solid #334155",
    background: "#1e293b", color: "#e2e8f0", fontSize: 14,
    fontWeight: 600, cursor: "pointer",
  },
};
