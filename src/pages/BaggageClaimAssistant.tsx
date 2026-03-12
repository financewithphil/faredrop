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
    <div style={styles.container}>
      <button onClick={onBack} style={styles.backBtn}>&larr; Back</button>

      {/* Header */}
      <div style={styles.card}>
        <div style={styles.typeBadge}>
          {CLAIM_TYPE_LABELS[claim.claim_type] || claim.claim_type}
        </div>
        <div style={styles.route}>
          {claim.origin && claim.destination ? (
            <>
              <span style={styles.airport}>{claim.origin}</span>
              <span style={styles.arrow}>&rarr;</span>
              <span style={styles.airport}>{claim.destination}</span>
            </>
          ) : (
            <span style={styles.airport}>{claim.policy.name}</span>
          )}
        </div>
        <div style={styles.metaRow}>
          {claim.flight_number && <span>{claim.flight_number}</span>}
          {claim.flight_date && <span>{claim.flight_date}</span>}
          <span>{claim.is_international ? "International" : "Domestic"}</span>
        </div>

        <div style={styles.infoRow}>
          <div style={styles.infoBlock}>
            <span style={styles.infoLabel}>Filing Deadline</span>
            <span style={styles.infoValue}>{deadlineText || "Check with airline"}</span>
          </div>
          <div style={styles.infoBlock}>
            <span style={styles.infoLabel}>Max Compensation</span>
            <span style={styles.infoValue}>${maxComp.toLocaleString()}</span>
          </div>
          <div style={styles.infoBlock}>
            <span style={styles.infoLabel}>Processing Time</span>
            <span style={styles.infoValue}>{claim.policy.processingDays}</span>
          </div>
        </div>
      </div>

      {/* Status Tracker */}
      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>Claim Status</h3>
        <div style={styles.statusTrack}>
          {STATUS_FLOW.map((s, i) => {
            const isActive = i <= currentStatusIdx;
            const isCurrent = s === claim.status;
            return (
              <div key={s} style={styles.statusStep}>
                <div style={{
                  ...styles.statusDot,
                  background: isActive ? "#2563eb" : "#334155",
                  border: isCurrent ? "2px solid #60a5fa" : "2px solid transparent",
                }} />
                <span style={{
                  ...styles.statusLabel,
                  color: isActive ? "#e2e8f0" : "#64748b",
                  fontWeight: isCurrent ? 700 : 400,
                }}>
                  {STATUS_LABELS[s]}
                </span>
                {i < STATUS_FLOW.length - 1 && (
                  <div style={{
                    ...styles.statusLine,
                    background: i < currentStatusIdx ? "#2563eb" : "#334155",
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
                <button onClick={() => updateClaim({ status: "resolved" })} disabled={saving} style={{ ...styles.actionBtn, background: "#16a34a" }}>
                  Resolved
                </button>
                <button onClick={() => setShowDot(true)} style={{ ...styles.actionBtn, background: "#dc2626" }}>
                  Escalate to DOT
                </button>
              </>
            )}
          </div>
        )}
        {claim.status === "escalated_dot" && (
          <p style={{ color: "#fbbf24", fontSize: 13, textAlign: "center", marginTop: 8 }}>
            DOT complaint filed — airline must respond within 60 days
          </p>
        )}
      </div>

      {/* Step-by-step Guide */}
      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>
          Step-by-Step: {CLAIM_TYPE_LABELS[claim.claim_type]}
        </h3>
        <p style={styles.policyName}>{claim.policy.name}</p>
        <div style={styles.stepsList}>
          {steps.map((step, i) => (
            <div key={i} style={styles.stepItem} onClick={() => toggleStep(i)}>
              <div style={{
                ...styles.stepCheck,
                background: completedSteps.has(i) ? "#2563eb" : "transparent",
                borderColor: completedSteps.has(i) ? "#2563eb" : "#475569",
              }}>
                {completedSteps.has(i) && <span style={{ color: "#fff", fontSize: 12 }}>&#10003;</span>}
              </div>
              <span style={{
                ...styles.stepText,
                textDecoration: completedSteps.has(i) ? "line-through" : "none",
                opacity: completedSteps.has(i) ? 0.6 : 1,
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

      {/* Required Documentation */}
      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>Required Documentation</h3>
        <div style={styles.docList}>
          {claim.policy.documentation.map((doc, i) => (
            <div key={i} style={styles.docItem}>
              <span style={styles.docBullet}>&#9679;</span>
              <span style={styles.docText}>{doc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Items List */}
      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>
          Items in Bag {claim.estimated_value ? `($${claim.estimated_value.toFixed(0)} total)` : ""}
        </h3>
        <p style={{ fontSize: 13, color: "#64748b", marginBottom: 12 }}>
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
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <button onClick={addItem} style={styles.addItemBtn}>+ Add Item</button>
          <button onClick={saveItems} disabled={saving} style={styles.saveBtn}>
            {saving ? "Saving..." : "Save Items"}
          </button>
        </div>
      </div>

      {/* File Reference & Notes */}
      <div style={styles.card}>
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

      {/* Tips */}
      {claim.policy.tips && claim.policy.tips.length > 0 && (
        <div style={styles.tipsBox}>
          <h4 style={styles.tipsTitle}>Tips</h4>
          {claim.policy.tips.map((tip, i) => (
            <p key={i} style={styles.tipText}>&#8226; {tip}</p>
          ))}
        </div>
      )}

      {/* DOT Escalation Modal */}
      {showDot && (
        <div style={styles.overlay} onClick={() => setShowDot(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Escalate to DOT</h3>
            <p style={{ fontSize: 14, color: "#94a3b8", marginBottom: 16 }}>
              If the airline hasn't resolved your claim, you can file a complaint with the US Department of Transportation.
            </p>
            <div style={styles.stepsList}>
              {claim.regulations.dot.steps.map((step, i) => (
                <div key={i} style={styles.docItem}>
                  <span style={styles.docBullet}>{i + 1}.</span>
                  <span style={styles.docText}>{step}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
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
              style={{ ...styles.saveBtn, width: "100%", marginTop: 12 }}
            >
              Mark as Escalated to DOT
            </button>
          </div>
        </div>
      )}

      {/* Compensation Info */}
      <div style={styles.infoBox}>
        <h4 style={styles.infoBoxTitle}>Compensation Limits</h4>
        <p style={styles.infoBoxText}>
          <strong>Domestic:</strong> Up to $4,700 per passenger (US DOT regulation)
        </p>
        <p style={styles.infoBoxText}>
          <strong>International:</strong> Up to ~$2,175 per passenger (Montreal Convention, 1,519 SDR)
        </p>
        <p style={styles.infoBoxText}>
          Airlines must also refund checked bag fees for lost bags. Compensation is based on depreciated value.
        </p>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { padding: 20, maxWidth: 600, margin: "0 auto" },
  loading: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" },
  backBtn: { background: "none", border: "none", color: "#3b82f6", fontSize: 14, cursor: "pointer", marginBottom: 16, padding: 0 },
  card: { background: "#1e293b", borderRadius: 12, padding: 20, marginBottom: 16, border: "1px solid #334155" },
  typeBadge: {
    display: "inline-block", padding: "4px 12px", borderRadius: 20,
    background: "#1e3a5f", color: "#93c5fd", fontSize: 13, fontWeight: 600, marginBottom: 12,
  },
  route: { display: "flex", alignItems: "center", gap: 12, marginBottom: 8 },
  airport: { fontSize: 28, fontWeight: 700, color: "#f1f5f9" },
  arrow: { fontSize: 20, color: "#64748b" },
  metaRow: { display: "flex", gap: 12, fontSize: 13, color: "#94a3b8", marginBottom: 16 },
  infoRow: { display: "flex", gap: 12, flexWrap: "wrap" },
  infoBlock: {
    flex: 1, minWidth: 120, background: "#0f172a", borderRadius: 8, padding: 12, textAlign: "center",
  },
  infoLabel: { display: "block", fontSize: 11, color: "#64748b", textTransform: "uppercase" as const, marginBottom: 4 },
  infoValue: { display: "block", fontSize: 15, fontWeight: 600, color: "#e2e8f0" },
  sectionTitle: { fontSize: 16, fontWeight: 600, color: "#e2e8f0", marginBottom: 16 },
  statusTrack: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  statusStep: { display: "flex", flexDirection: "column", alignItems: "center", position: "relative", flex: 1 },
  statusDot: { width: 16, height: 16, borderRadius: "50%", marginBottom: 6 },
  statusLabel: { fontSize: 10, textAlign: "center" },
  statusLine: { position: "absolute", top: 7, left: "60%", right: "-40%", height: 2 },
  statusActions: { display: "flex", gap: 8, justifyContent: "center" },
  actionBtn: { padding: "8px 20px", borderRadius: 8, border: "none", background: "#2563eb", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" },
  policyName: { fontSize: 14, color: "#94a3b8", marginBottom: 12 },
  stepsList: { display: "flex", flexDirection: "column", gap: 12 },
  stepItem: { display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" },
  stepCheck: {
    width: 22, height: 22, minWidth: 22, borderRadius: 4,
    border: "2px solid #475569", display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1,
  },
  stepText: { fontSize: 14, color: "#e2e8f0", lineHeight: "1.5" },
  actionLinks: { display: "flex", gap: 8, marginTop: 20, flexWrap: "wrap" },
  linkBtn: {
    padding: "10px 20px", borderRadius: 8, background: "#2563eb",
    color: "#fff", fontSize: 14, fontWeight: 600, textDecoration: "none",
  },
  phoneBtn: {
    padding: "10px 20px", borderRadius: 8, border: "1px solid #334155",
    background: "#1e293b", color: "#e2e8f0", fontSize: 14, fontWeight: 600, textDecoration: "none",
  },
  docList: { display: "flex", flexDirection: "column", gap: 8 },
  docItem: { display: "flex", alignItems: "flex-start", gap: 8 },
  docBullet: { color: "#64748b", fontSize: 8, marginTop: 5, flexShrink: 0 },
  docText: { fontSize: 14, color: "#cbd5e1", lineHeight: "1.5" },
  itemRow: { display: "flex", gap: 8, marginBottom: 8, alignItems: "center" },
  input: {
    padding: "8px 12px", borderRadius: 8, border: "1px solid #334155",
    background: "#0f172a", color: "#f1f5f9", fontSize: 14, outline: "none",
    boxSizing: "border-box" as const,
  },
  inputFull: {
    width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #334155",
    background: "#0f172a", color: "#f1f5f9", fontSize: 14, outline: "none", marginBottom: 10,
    boxSizing: "border-box" as const,
  },
  textarea: {
    width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #334155",
    background: "#0f172a", color: "#f1f5f9", fontSize: 14, fontFamily: "inherit",
    resize: "vertical" as const, outline: "none", marginBottom: 10, boxSizing: "border-box" as const,
  },
  removeBtn: {
    width: 28, height: 28, borderRadius: 6, border: "1px solid #7f1d1d",
    background: "transparent", color: "#f87171", fontSize: 14, cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  addItemBtn: {
    padding: "6px 14px", borderRadius: 8, border: "1px solid #334155",
    background: "transparent", color: "#94a3b8", fontSize: 13, cursor: "pointer",
  },
  saveBtn: {
    padding: "8px 16px", borderRadius: 8, border: "1px solid #334155",
    background: "#1e293b", color: "#e2e8f0", fontSize: 14, fontWeight: 600, cursor: "pointer",
  },
  tipsBox: {
    background: "#1a1a2e", border: "1px solid #334155", borderRadius: 8,
    padding: 16, marginBottom: 16,
  },
  tipsTitle: { fontSize: 14, fontWeight: 600, color: "#60a5fa", marginBottom: 8 },
  tipText: { fontSize: 13, color: "#94a3b8", marginBottom: 4 },
  infoBox: {
    background: "#1a1a2e", border: "1px solid #334155", borderRadius: 8,
    padding: 16, marginBottom: 16,
  },
  infoBoxTitle: { fontSize: 14, fontWeight: 600, color: "#fbbf24", marginBottom: 8 },
  infoBoxText: { fontSize: 13, color: "#94a3b8", marginBottom: 6, lineHeight: "1.5" },
  overlay: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 16,
  },
  modal: {
    background: "#1e293b", borderRadius: 12, padding: 24,
    width: "100%", maxWidth: 500, border: "1px solid #334155",
  },
  modalTitle: { fontSize: 18, fontWeight: 700, color: "#f1f5f9", marginBottom: 4 },
};
