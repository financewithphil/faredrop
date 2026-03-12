import { useState, useEffect } from "react";
import { apiFetch } from "../hooks/useApi";

interface BaggageClaim {
  id: string;
  airline: string;
  airline_code: string;
  claim_type: string;
  is_international: number;
  flight_number: string;
  origin: string;
  destination: string;
  flight_date: string;
  file_reference: string | null;
  status: string;
  description: string | null;
  items_json: string | null;
  estimated_value: number | null;
  compensation_received: number | null;
  interim_expenses: number | null;
  notes: string | null;
  created_at: string;
  policy: {
    name: string;
    deadlines: Record<string, { domestic: string; international: string }>;
    portalUrl: string | null;
    phoneBaggage: string | null;
    phoneGeneral: string | null;
    processingDays: string;
    steps: Record<string, string[]>;
    documentation: string[];
    tips: string[];
  };
  regulations: {
    domestic: { maxLiability: number };
    international: { maxLiabilityUsdApprox: number };
    dot: { complaintUrl: string; steps: string[] };
  };
}

interface Item {
  name: string;
  value: string;
}

const STATUS_FLOW = ["not_reported", "reported", "claim_filed", "under_review", "resolved"];
const STATUS_LABELS: Record<string, string> = {
  not_reported: "Not Reported",
  reported: "Reported",
  claim_filed: "Claim Filed",
  under_review: "Under Review",
  resolved: "Resolved",
  escalated_dot: "DOT Escalated",
};

const CLAIM_TYPE_LABELS: Record<string, string> = {
  lost: "Lost Baggage",
  damaged: "Damaged Baggage",
  delayed: "Delayed Baggage",
};

export function BaggageClaimAssistant({
  claimId,
  onBack,
}: {
  claimId: string;
  onBack: () => void;
}) {
  const [claim, setClaim] = useState<BaggageClaim | null>(null);
  const [fileRef, setFileRef] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<Item[]>([{ name: "", value: "" }]);
  const [saving, setSaving] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [showDot, setShowDot] = useState(false);

  useEffect(() => {
    apiFetch(`/api/baggage-claims/${claimId}`)
      .then((r) => r.json())
      .then((data) => {
        setClaim(data);
        setFileRef(data.file_reference || "");
        setNotes(data.notes || "");
        if (data.items_json) {
          try {
            const parsed = JSON.parse(data.items_json);
            if (Array.isArray(parsed) && parsed.length > 0) setItems(parsed);
          } catch {}
        }
      });
  }, [claimId]);

  const updateClaim = async (updates: Record<string, any>) => {
    setSaving(true);
    const res = await apiFetch(`/api/baggage-claims/${claimId}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
    const updated = await res.json();
    setClaim(updated);
    setSaving(false);
  };

  const saveItems = () => {
    const filtered = items.filter((i) => i.name.trim());
    const total = filtered.reduce((s, i) => s + (parseFloat(i.value) || 0), 0);
    updateClaim({
      itemsJson: filtered,
      estimatedValue: total,
    });
  };

  const addItem = () => setItems([...items, { name: "", value: "" }]);

  const updateItem = (idx: number, field: keyof Item, val: string) => {
    const next = [...items];
    next[idx] = { ...next[idx], [field]: val };
    setItems(next);
  };

  const removeItem = (idx: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== idx));
  };

  const toggleStep = (i: number) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };

  if (!claim) {
    return <div style={styles.loading}>Loading claim...</div>;
  }

  const steps = claim.policy.steps[claim.claim_type] || [];
  const deadline = claim.policy.deadlines[claim.claim_type];
  const deadlineText = claim.is_international ? deadline?.international : deadline?.domestic;
  const maxComp = claim.is_international
    ? claim.regulations.international.maxLiabilityUsdApprox
    : claim.regulations.domestic.maxLiability;
  const currentStatusIdx = STATUS_FLOW.indexOf(claim.status);

  return (
    <div className="animate-in" style={styles.container}>
      <button onClick={onBack} style={styles.backBtn}>&larr; Back</button>

      <div className="glass-card-static" style={styles.card}>
        <div style={styles.typeBadge}>
          {CLAIM_TYPE_LABELS[claim.claim_type] || claim.claim_type}
        </div>
        <div style={styles.route}>
          {claim.origin && claim.destination ? (
            <>
              <span style={styles.airport}>{claim.origin}</span>
              <span style={styles.routeLine}>
                <span style={styles.routeDot} />
                <span style={styles.routeDash} />
                <span style={styles.routePlane}>&#9992;</span>
                <span style={styles.routeDash} />
                <span style={styles.routeDot} />
              </span>
              <span style={styles.airport}>{claim.destination}</span>
            </>
          ) : (
            <span style={styles.airport}>{claim.policy.name}</span>
          )}
        </div>
        <div style={styles.metaRow}>
          {claim.flight_number && <span>{claim.flight_number}</span>}
          {claim.flight_number && claim.flight_date && <span style={styles.metaDot} />}
          {claim.flight_date && <span>{claim.flight_date}</span>}
          <span style={styles.metaDot} />
          <span>{claim.is_international ? "International" : "Domestic"}</span>
        </div>

        <div style={styles.infoRow}>
          <div style={styles.infoBlock}>
            <span style={styles.infoLabel}>Filing Deadline</span>
            <span style={styles.infoValue}>{deadlineText || "Check with airline"}</span>
          </div>
          <div style={styles.infoBlock}>
            <span style={styles.infoLabel}>Max Compensation</span>
            <span style={{ ...styles.infoValue, color: "var(--accent)" }}>${maxComp.toLocaleString()}</span>
          </div>
          <div style={styles.infoBlock}>
            <span style={styles.infoLabel}>Processing</span>
            <span style={styles.infoValue}>{claim.policy.processingDays}</span>
          </div>
        </div>
      </div>

      <div className="glass-card-static animate-in animate-in-1" style={styles.card}>
        <h3 style={styles.sectionTitle}>Claim Status</h3>
        <div style={styles.statusTrack}>
          {STATUS_FLOW.map((s, i) => {
            const isActive = i <= currentStatusIdx;
            const isCurrent = s === claim.status;
            return (
              <div key={s} style={styles.statusStep}>
                <div style={{
                  ...styles.statusDot,
                  background: isActive ? "var(--accent)" : "rgba(255,255,255,0.08)",
                  border: isCurrent ? "2px solid var(--accent)" : "2px solid transparent",
                  boxShadow: isCurrent ? "0 0 12px rgba(96, 165, 250, 0.3)" : "none",
                }} />
                <span style={{
                  ...styles.statusLabel,
                  color: isActive ? "var(--text-primary)" : "var(--text-muted)",
                  fontWeight: isCurrent ? 700 : 400,
                }}>
                  {STATUS_LABELS[s]}
                </span>
                {i < STATUS_FLOW.length - 1 && (
                  <div style={{
                    ...styles.statusLine,
                    background: i < currentStatusIdx ? "var(--accent)" : "rgba(255,255,255,0.06)",
                  }} />
                )}
              </div>
            );
          })}
        </div>
        {claim.status !== "resolved" && claim.status !== "escalated_dot" && (
          <div style={styles.statusActions}>
            {claim.status === "not_reported" && (
              <button onClick={() => updateClaim({ status: "reported" })} disabled={saving} style={styles.actionBtn}>
                I've Reported at Airport
              </button>
            )}
            {claim.status === "reported" && (
              <button onClick={() => updateClaim({ status: "claim_filed" })} disabled={saving} style={styles.actionBtn}>
                Claim Filed Online
              </button>
            )}
            {claim.status === "claim_filed" && (
              <button onClick={() => updateClaim({ status: "under_review" })} disabled={saving} style={styles.actionBtn}>
                Under Review
              </button>
            )}
            {claim.status === "under_review" && (
              <>
                <button onClick={() => updateClaim({ status: "resolved" })} disabled={saving} style={{ ...styles.actionBtn, background: "var(--green)" }}>
                  Resolved
                </button>
                <button onClick={() => setShowDot(true)} style={{ ...styles.actionBtn, background: "var(--red)" }}>
                  Escalate to DOT
                </button>
              </>
            )}
          </div>
        )}
        {claim.status === "escalated_dot" && (
          <p style={{ color: "var(--accent)", fontSize: 13, textAlign: "center", marginTop: 10, fontFamily: "var(--font-body)" }}>
            DOT complaint filed — airline must respond within 60 days
          </p>
        )}
      </div>

      <div className="glass-card-static animate-in animate-in-2" style={styles.card}>
        <h3 style={styles.sectionTitle}>
          Step-by-Step: {CLAIM_TYPE_LABELS[claim.claim_type]}
        </h3>
        <p style={styles.policyName}>{claim.policy.name}</p>
        <div style={styles.stepsList}>
          {steps.map((step, i) => (
            <div key={i} style={styles.stepItem} onClick={() => toggleStep(i)}>
              <div style={{
                ...styles.stepCheck,
                background: completedSteps.has(i) ? "var(--accent)" : "transparent",
                borderColor: completedSteps.has(i) ? "var(--accent)" : "rgba(255,255,255,0.12)",
              }}>
                {completedSteps.has(i) && <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>&#10003;</span>}
              </div>
              <span style={{
                ...styles.stepText,
                textDecoration: completedSteps.has(i) ? "line-through" : "none",
                opacity: completedSteps.has(i) ? 0.5 : 1,
              }}>
                {step}
              </span>
            </div>
          ))}
        </div>
        <div style={styles.actionLinks}>
          {claim.policy.portalUrl && (
            <a href={claim.policy.portalUrl} target="_blank" rel="noreferrer" style={styles.linkBtn}>
              Open {claim.policy.name} Portal
            </a>
          )}
          {claim.policy.phoneBaggage && (
            <a href={`tel:${claim.policy.phoneBaggage}`} style={styles.phoneBtn}>
              Call Baggage: {claim.policy.phoneBaggage}
            </a>
          )}
        </div>
      </div>

      <div className="glass-card-static animate-in animate-in-3" style={styles.card}>
        <h3 style={styles.sectionTitle}>Required Documentation</h3>
        <div style={styles.docList}>
          {claim.policy.documentation.map((doc, i) => (
            <div key={i} style={styles.docItem}>
              <span style={styles.docBullet} />
              <span style={styles.docText}>{doc}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card-static animate-in animate-in-4" style={styles.card}>
        <h3 style={styles.sectionTitle}>
          Items in Bag {claim.estimated_value ? (
            <span style={{ color: "var(--accent)", fontFamily: "var(--font-mono)", fontSize: 14 }}>
              ${claim.estimated_value.toFixed(0)}
            </span>
          ) : ""}
        </h3>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 14, fontFamily: "var(--font-body)" }}>
          List items and their approximate value for your claim.
        </p>
        {items.map((item, i) => (
          <div key={i} style={styles.itemRow}>
            <input
              type="text"
              placeholder="Item name"
              value={item.name}
              onChange={(e) => updateItem(i, "name", e.target.value)}
              style={{ ...styles.input, flex: 2 }}
            />
            <input
              type="number"
              placeholder="Value ($)"
              value={item.value}
              onChange={(e) => updateItem(i, "value", e.target.value)}
              style={{ ...styles.input, flex: 1 }}
            />
            {items.length > 1 && (
              <button onClick={() => removeItem(i)} style={styles.removeBtn}>&#10005;</button>
            )}
          </div>
        ))}
        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
          <button onClick={addItem} style={styles.addItemBtn}>+ Add Item</button>
          <button onClick={saveItems} disabled={saving} style={styles.saveBtn}>
            {saving ? "Saving..." : "Save Items"}
          </button>
        </div>
      </div>

      <div className="glass-card-static animate-in animate-in-5" style={styles.card}>
        <h3 style={styles.sectionTitle}>Your Notes</h3>
        <input
          type="text"
          placeholder="Airline File Reference / File ID"
          value={fileRef}
          onChange={(e) => setFileRef(e.target.value)}
          style={styles.inputFull}
        />
        <textarea
          placeholder="Notes (e.g., spoke with agent Sarah, reference #12345, expected callback in 5 days)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          style={styles.textarea}
          rows={3}
        />
        {claim.claim_type === "delayed" && (
          <input
            type="number"
            placeholder="Interim expenses total ($)"
            defaultValue={claim.interim_expenses || ""}
            onBlur={(e) => updateClaim({ interimExpenses: parseFloat(e.target.value) || 0 })}
            style={styles.inputFull}
          />
        )}
        <button
          onClick={() => updateClaim({ fileReference: fileRef, notes })}
          disabled={saving}
          style={styles.saveBtn}
        >
          {saving ? "Saving..." : "Save Notes"}
        </button>
      </div>

      {claim.policy.tips && claim.policy.tips.length > 0 && (
        <div style={styles.tipsBox}>
          <h4 style={styles.tipsTitle}>Tips</h4>
          {claim.policy.tips.map((tip, i) => (
            <p key={i} style={styles.tipText}>{tip}</p>
          ))}
        </div>
      )}

      {showDot && (
        <div style={styles.overlay} onClick={() => setShowDot(false)}>
          <div className="glass-card-static animate-in" style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Escalate to DOT</h3>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 18, fontFamily: "var(--font-body)" }}>
              If the airline hasn't resolved your claim, you can file a complaint with the US Department of Transportation.
            </p>
            <div style={styles.stepsList}>
              {claim.regulations.dot.steps.map((step, i) => (
                <div key={i} style={styles.docItem}>
                  <span style={{ ...styles.docBullet, background: "var(--accent)" }} />
                  <span style={styles.docText}>{i + 1}. {step}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
              <a
                href={claim.regulations.dot.complaintUrl}
                target="_blank"
                rel="noreferrer"
                style={{ ...styles.linkBtn, flex: 1, textAlign: "center" }}
              >
                File DOT Complaint
              </a>
              <button onClick={() => setShowDot(false)} style={{ ...styles.phoneBtn, flex: 1 }}>
                Cancel
              </button>
            </div>
            <button
              onClick={() => {
                updateClaim({ status: "escalated_dot" });
                setShowDot(false);
              }}
              disabled={saving}
              style={{ ...styles.saveBtn, width: "100%", marginTop: 14 }}
            >
              Mark as Escalated to DOT
            </button>
          </div>
        </div>
      )}

      <div style={styles.compBox}>
        <h4 style={styles.compTitle}>Compensation Limits</h4>
        <p style={styles.compText}>
          <strong>Domestic:</strong> Up to $4,700 per passenger (US DOT regulation)
        </p>
        <p style={styles.compText}>
          <strong>International:</strong> Up to ~$2,175 per passenger (Montreal Convention, 1,519 SDR)
        </p>
        <p style={styles.compText}>
          Airlines must also refund checked bag fees for lost bags. Compensation is based on depreciated value.
        </p>
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
    background: "none", border: "none", color: "var(--accent)",
    fontSize: 14, cursor: "pointer", marginBottom: 20, padding: 0,
    fontFamily: "var(--font-body)", fontWeight: 500,
  },
  card: { padding: 24, marginBottom: 18 },
  typeBadge: {
    display: "inline-block", padding: "5px 14px", borderRadius: 100,
    background: "var(--indigo-dim)", color: "var(--indigo)",
    fontSize: 12, fontWeight: 700, marginBottom: 14,
    fontFamily: "var(--font-body)", letterSpacing: "0.04em",
    textTransform: "uppercase" as const,
  },
  route: { display: "flex", alignItems: "center", gap: 14, marginBottom: 10 },
  airport: {
    fontSize: 30, fontWeight: 700, color: "var(--text-primary)",
    fontFamily: "var(--font-display)", letterSpacing: "-0.02em",
  },
  routeLine: { display: "flex", alignItems: "center", gap: 4, opacity: 0.4 },
  routeDot: { width: 5, height: 5, borderRadius: "50%", background: "var(--accent)" },
  routeDash: { width: 22, height: 1, background: "var(--text-muted)" },
  routePlane: { fontSize: 12, color: "var(--accent)" },
  metaRow: {
    display: "flex", alignItems: "center", gap: 8,
    fontSize: 13, color: "var(--text-secondary)", marginBottom: 18,
    fontFamily: "var(--font-body)",
  },
  metaDot: { width: 3, height: 3, borderRadius: "50%", background: "var(--text-muted)" },
  infoRow: { display: "flex", gap: 12, flexWrap: "wrap" },
  infoBlock: {
    flex: 1, minWidth: 120, background: "rgba(0,0,0,0.3)",
    borderRadius: 10, padding: 14, textAlign: "center",
    border: "1px solid var(--border)",
  },
  infoLabel: {
    display: "block", fontSize: 10, color: "var(--text-muted)",
    textTransform: "uppercase" as const, marginBottom: 5,
    letterSpacing: "0.08em", fontWeight: 600, fontFamily: "var(--font-body)",
  },
  infoValue: {
    display: "block", fontSize: 14, fontWeight: 600, color: "var(--text-primary)",
    fontFamily: "var(--font-mono)",
  },
  sectionTitle: {
    fontSize: 16, fontWeight: 600, color: "var(--text-primary)",
    marginBottom: 18, fontFamily: "var(--font-display)",
  },
  statusTrack: {
    display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18,
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
    fontSize: 10, textAlign: "center", fontFamily: "var(--font-body)",
    letterSpacing: "0.02em",
  },
  statusLine: {
    position: "absolute", top: 8, left: "60%", right: "-40%", height: 2,
    transition: "background 0.3s ease",
  },
  statusActions: { display: "flex", gap: 10, justifyContent: "center" },
  actionBtn: {
    padding: "10px 24px", borderRadius: 10, border: "none",
    background: "var(--accent)", color: "#fff", fontSize: 13,
    fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-body)",
    letterSpacing: "0.03em", textTransform: "uppercase" as const,
  },
  policyName: {
    fontSize: 13, color: "var(--text-secondary)", marginBottom: 14,
    fontFamily: "var(--font-body)",
  },
  stepsList: { display: "flex", flexDirection: "column", gap: 14 },
  stepItem: { display: "flex", alignItems: "flex-start", gap: 14, cursor: "pointer" },
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
  actionLinks: { display: "flex", gap: 10, marginTop: 22, flexWrap: "wrap" },
  linkBtn: {
    padding: "11px 22px", borderRadius: 10, background: "var(--accent)",
    color: "#fff", fontSize: 13, fontWeight: 700,
    textDecoration: "none", fontFamily: "var(--font-body)",
    letterSpacing: "0.03em", textTransform: "uppercase" as const,
  },
  phoneBtn: {
    padding: "11px 22px", borderRadius: 10, border: "1px solid var(--border-hover)",
    background: "transparent", color: "var(--text-secondary)", fontSize: 13,
    fontWeight: 600, textDecoration: "none", fontFamily: "var(--font-body)",
  },
  docList: { display: "flex", flexDirection: "column", gap: 10 },
  docItem: { display: "flex", alignItems: "flex-start", gap: 10 },
  docBullet: {
    width: 6, height: 6, borderRadius: "50%", background: "var(--text-muted)",
    marginTop: 7, flexShrink: 0,
  },
  docText: {
    fontSize: 14, color: "var(--text-secondary)", lineHeight: "1.6",
    fontFamily: "var(--font-body)",
  },
  itemRow: { display: "flex", gap: 10, marginBottom: 10, alignItems: "center" },
  input: {
    padding: "10px 14px", borderRadius: 10, border: "1px solid var(--border)",
    background: "var(--bg-input)", color: "var(--text-primary)", fontSize: 14,
    outline: "none", boxSizing: "border-box" as const, fontFamily: "var(--font-body)",
  },
  inputFull: {
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
  removeBtn: {
    width: 30, height: 30, borderRadius: 8, border: "1px solid rgba(248, 113, 113, 0.2)",
    background: "transparent", color: "var(--red)", fontSize: 14, cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  addItemBtn: {
    padding: "8px 16px", borderRadius: 10, border: "1px solid var(--border)",
    background: "transparent", color: "var(--text-secondary)", fontSize: 13,
    cursor: "pointer", fontFamily: "var(--font-body)",
  },
  saveBtn: {
    padding: "9px 20px", borderRadius: 10, border: "1px solid var(--border-hover)",
    background: "transparent", color: "var(--text-secondary)", fontSize: 13,
    fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)",
  },
  tipsBox: {
    background: "rgba(56, 189, 248, 0.04)", border: "1px solid rgba(56, 189, 248, 0.12)",
    borderRadius: 12, padding: 18, marginBottom: 18,
  },
  tipsTitle: {
    fontSize: 12, fontWeight: 700, color: "var(--cyan)", marginBottom: 10,
    fontFamily: "var(--font-body)", letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
  },
  tipText: {
    fontSize: 13, color: "var(--text-secondary)", marginBottom: 6,
    fontFamily: "var(--font-body)", lineHeight: 1.5,
    paddingLeft: 14,
    borderLeft: "2px solid rgba(56, 189, 248, 0.15)",
  },
  compBox: {
    background: "rgba(96, 165, 250, 0.04)", border: "1px solid rgba(96, 165, 250, 0.12)",
    borderRadius: 12, padding: 18, marginBottom: 18,
  },
  compTitle: {
    fontSize: 12, fontWeight: 700, color: "var(--accent)", marginBottom: 10,
    fontFamily: "var(--font-body)", letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
  },
  compText: {
    fontSize: 13, color: "var(--text-secondary)", marginBottom: 8,
    fontFamily: "var(--font-body)", lineHeight: 1.6,
  },
  overlay: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)",
    backdropFilter: "blur(4px)", display: "flex", alignItems: "center",
    justifyContent: "center", zIndex: 100, padding: 16,
  },
  modal: {
    padding: 28, width: "100%", maxWidth: 520,
  },
  modalTitle: {
    fontSize: 20, fontWeight: 700, color: "var(--text-primary)", marginBottom: 6,
    fontFamily: "var(--font-display)",
  },
};
