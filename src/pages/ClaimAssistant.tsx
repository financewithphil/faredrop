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
    <div className="animate-in" style={styles.container}>
      <button onClick={onBack} style={styles.backBtn}>
        &larr; Back
      </button>

      <div className="glass-card-static" style={styles.card}>
        <div style={styles.route}>
          <span style={styles.airport}>{claim.origin}</span>
          <span style={styles.routeLine}>
            <span style={styles.routeDot} />
            <span style={styles.routeDash} />
            <span style={styles.routePlane}>&#9992;</span>
            <span style={styles.routeDash} />
            <span style={styles.routeDot} />
          </span>
          <span style={styles.airport}>{claim.destination}</span>
        </div>
        <div style={styles.airlineRow}>
          <span>{claim.airline || claim.policy.name}</span>
          <span style={styles.metaDot} />
          <span>{claim.flight_number}</span>
          <span style={styles.metaDot} />
          <span>{claim.departure_date}</span>
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

      <div className="glass-card-static animate-in animate-in-1" style={styles.card}>
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
                    background: isActive ? "var(--gold)" : "rgba(255,255,255,0.08)",
                    border: isCurrent ? "2px solid var(--gold)" : "2px solid transparent",
                    boxShadow: isCurrent ? "0 0 12px rgba(212, 168, 83, 0.3)" : "none",
                  }}
                />
                <span
                  style={{
                    ...styles.statusLabel,
                    color: isActive ? "var(--text-primary)" : "var(--text-muted)",
                    fontWeight: isCurrent ? 700 : 400,
                  }}
                >
                  {s.replace("_", " ")}
                </span>
                {i < STATUS_FLOW.length - 1 && (
                  <div
                    style={{
                      ...styles.statusLine,
                      background: i < currentIdx ? "var(--gold)" : "rgba(255,255,255,0.06)",
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
                  style={{ ...styles.actionBtn, background: "var(--green)" }}
                >
                  Credit Received
                </button>
                <button
                  onClick={() => updateClaim({ status: "denied" })}
                  disabled={saving}
                  style={{ ...styles.actionBtn, background: "var(--red)" }}
                >
                  Denied
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {isBasicEconomy && claim.policy.basicEconomyEligible === false && (
        <div className="animate-in animate-in-2" style={styles.warningBox}>
          <strong>Heads up:</strong> Your fare class appears to be Basic
          Economy. {claim.policy.name} typically does not allow changes on
          Basic Economy tickets. You may still try contacting the airline
          directly.
        </div>
      )}

      <div className="glass-card-static animate-in animate-in-2" style={styles.card}>
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
                  background: completedSteps.has(i) ? "var(--gold)" : "transparent",
                  borderColor: completedSteps.has(i) ? "var(--gold)" : "rgba(255,255,255,0.12)",
                }}
              >
                {completedSteps.has(i) && (
                  <span style={{ color: "#0a0c14", fontSize: 12, fontWeight: 700 }}>&#10003;</span>
                )}
              </div>
              <span
                style={{
                  ...styles.stepText,
                  textDecoration: completedSteps.has(i) ? "line-through" : "none",
                  opacity: completedSteps.has(i) ? 0.5 : 1,
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

      {claim.policy.restrictions.length > 0 && (
        <div className="animate-in animate-in-3" style={styles.infoBox}>
          <h4 style={styles.infoTitle}>Important Notes</h4>
          <ul style={styles.restrictionsList}>
            {claim.policy.restrictions.map((r, i) => (
              <li key={i} style={styles.restrictionItem}>{r}</li>
            ))}
          </ul>
          <p style={styles.expiryNote}>
            Credit expires: <strong style={{ color: "var(--gold)" }}>{claim.policy.creditExpiry}</strong> from
            issue date
          </p>
        </div>
      )}

      <div className="glass-card-static animate-in animate-in-4" style={styles.card}>
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
  container: { padding: 24, maxWidth: 640, margin: "0 auto", width: "100%" },
  loading: {
    flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
    color: "var(--text-secondary)", fontFamily: "var(--font-body)",
  },
  backBtn: {
    background: "none", border: "none", color: "var(--gold)",
    fontSize: 14, cursor: "pointer", marginBottom: 20, padding: 0,
    fontFamily: "var(--font-body)", fontWeight: 500,
  },
  card: { padding: 24, marginBottom: 18 },
  route: {
    display: "flex", alignItems: "center", gap: 14, marginBottom: 10,
  },
  airport: {
    fontSize: 30, fontWeight: 700, color: "var(--text-primary)",
    fontFamily: "var(--font-display)", letterSpacing: "-0.02em",
  },
  routeLine: { display: "flex", alignItems: "center", gap: 4, opacity: 0.4 },
  routeDot: { width: 5, height: 5, borderRadius: "50%", background: "var(--gold)" },
  routeDash: { width: 22, height: 1, background: "var(--text-muted)" },
  routePlane: { fontSize: 12, color: "var(--gold)" },
  airlineRow: {
    display: "flex", alignItems: "center", gap: 8,
    fontSize: 13, color: "var(--text-secondary)", marginBottom: 18,
    fontFamily: "var(--font-body)",
  },
  metaDot: {
    width: 3, height: 3, borderRadius: "50%", background: "var(--text-muted)",
  },
  savingsBox: {
    background: "rgba(212, 168, 83, 0.06)", borderRadius: 12, padding: 20,
    textAlign: "center", border: "1px solid rgba(212, 168, 83, 0.15)",
  },
  savingsAmount: {
    fontSize: 40, fontWeight: 700, color: "var(--gold)",
    fontFamily: "var(--font-mono)", letterSpacing: "-0.03em",
  },
  savingsLabel: {
    fontSize: 12, color: "var(--text-secondary)", marginBottom: 10,
    fontFamily: "var(--font-body)", letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
  },
  priceCompare: {
    display: "flex", justifyContent: "center", gap: 10, fontSize: 16,
  },
  pricePaid: {
    color: "var(--red)", textDecoration: "line-through",
    fontFamily: "var(--font-mono)",
  },
  priceArrow: { color: "var(--text-muted)" },
  priceFound: {
    color: "var(--green)", fontWeight: 600,
    fontFamily: "var(--font-mono)",
  },
  sectionTitle: {
    fontSize: 16, fontWeight: 600, color: "var(--text-primary)",
    marginBottom: 18, fontFamily: "var(--font-display)",
  },
  statusTrack: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    marginBottom: 18,
  },
  statusStep: {
    display: "flex", flexDirection: "column", alignItems: "center",
    position: "relative", flex: 1,
  },
  statusDot: {
    width: 18, height: 18, borderRadius: "50%", marginBottom: 8,
    transition: "all 0.3s ease",
  },
  statusLabel: {
    fontSize: 11, textTransform: "capitalize" as const,
    fontFamily: "var(--font-body)", letterSpacing: "0.02em",
  },
  statusLine: {
    position: "absolute", top: 8, left: "60%", right: "-40%", height: 2,
    transition: "background 0.3s ease",
  },
  statusActions: { display: "flex", gap: 10, justifyContent: "center" },
  actionBtn: {
    padding: "10px 24px", borderRadius: 10, border: "none",
    background: "var(--gold)", color: "#0a0c14", fontSize: 13,
    fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-body)",
    letterSpacing: "0.03em", textTransform: "uppercase" as const,
  },
  warningBox: {
    background: "rgba(251, 191, 36, 0.08)", border: "1px solid rgba(251, 191, 36, 0.2)",
    borderRadius: 12, padding: 18, marginBottom: 18,
    fontSize: 14, color: "#fde68a", fontFamily: "var(--font-body)", lineHeight: 1.6,
  },
  policyName: {
    fontSize: 13, color: "var(--text-secondary)", marginBottom: 14,
    fontFamily: "var(--font-body)",
  },
  stepsList: { display: "flex", flexDirection: "column", gap: 14 },
  stepItem: {
    display: "flex", alignItems: "flex-start", gap: 14, cursor: "pointer",
  },
  stepCheck: {
    width: 24, height: 24, minWidth: 24, borderRadius: 6,
    border: "2px solid rgba(255,255,255,0.12)", display: "flex",
    alignItems: "center", justifyContent: "center", marginTop: 1,
    transition: "all 0.2s ease",
  },
  stepText: {
    fontSize: 14, color: "var(--text-primary)", lineHeight: "1.6",
    fontFamily: "var(--font-body)", transition: "opacity 0.2s ease",
  },
  actionLinks: {
    display: "flex", gap: 10, marginTop: 22, flexWrap: "wrap",
  },
  linkBtn: {
    padding: "11px 22px", borderRadius: 10, background: "var(--gold)",
    color: "#0a0c14", fontSize: 13, fontWeight: 700,
    textDecoration: "none", textAlign: "center",
    fontFamily: "var(--font-body)", letterSpacing: "0.03em",
    textTransform: "uppercase" as const,
  },
  phoneBtn: {
    padding: "11px 22px", borderRadius: 10, border: "1px solid var(--border-hover)",
    background: "transparent", color: "var(--text-secondary)", fontSize: 13,
    fontWeight: 600, textDecoration: "none", textAlign: "center",
    fontFamily: "var(--font-body)",
  },
  infoBox: {
    background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)",
    borderRadius: 12, padding: 18, marginBottom: 18,
  },
  infoTitle: {
    fontSize: 13, fontWeight: 700, color: "var(--gold)", marginBottom: 10,
    fontFamily: "var(--font-body)", letterSpacing: "0.04em",
    textTransform: "uppercase" as const,
  },
  restrictionsList: { paddingLeft: 20, margin: 0 },
  restrictionItem: {
    fontSize: 13, color: "var(--text-secondary)", marginBottom: 6,
    fontFamily: "var(--font-body)", lineHeight: 1.5,
  },
  expiryNote: {
    fontSize: 13, color: "var(--text-secondary)", marginTop: 14,
    fontFamily: "var(--font-body)",
  },
  input: {
    width: "100%", padding: "12px 14px", borderRadius: 10,
    border: "1px solid var(--border)", background: "var(--bg-input)",
    color: "var(--text-primary)", fontSize: 14, outline: "none", marginBottom: 12,
    boxSizing: "border-box" as const, fontFamily: "var(--font-body)",
  },
  textarea: {
    width: "100%", padding: "12px 14px", borderRadius: 10,
    border: "1px solid var(--border)", background: "var(--bg-input)",
    color: "var(--text-primary)", fontSize: 14, fontFamily: "var(--font-body)",
    resize: "vertical" as const, outline: "none", marginBottom: 12,
    boxSizing: "border-box" as const,
  },
  saveBtn: {
    padding: "9px 20px", borderRadius: 10, border: "1px solid var(--border-hover)",
    background: "transparent", color: "var(--text-secondary)", fontSize: 13,
    fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)",
  },
};
