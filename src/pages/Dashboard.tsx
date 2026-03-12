import { useState, useEffect } from "react";
import { apiFetch } from "../hooks/useApi";
import { FlightCard } from "../components/FlightCard";
import { EmptyState } from "../components/EmptyState";

interface Flight {
  id: string;
  airline: string;
  airline_code: string;
  flight_number: string;
  origin: string;
  destination: string;
  departure_date: string;
  fare_class: string;
  price_paid: number;
  current_price: number | null;
  last_checked: string | null;
  status: string;
  check_count: number;
  alert_count: number;
  claim_id: string | null;
  claim_status: string | null;
}

interface BaggageClaim {
  id: string;
  airline: string;
  airline_code: string;
  claim_type: string;
  origin: string;
  destination: string;
  flight_date: string;
  status: string;
  estimated_value: number | null;
  compensation_received: number | null;
}

export function Dashboard({
  onSelect,
  onBaggageClaim,
  onOpenBaggageClaim,
}: {
  onSelect: (id: string) => void;
  onBaggageClaim: () => void;
  onOpenBaggageClaim: (id: string) => void;
}) {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [baggageClaims, setBaggageClaims] = useState<BaggageClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [showPaste, setShowPaste] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const [pasting, setPasting] = useState(false);
  const [pasteError, setPasteError] = useState("");

  const fetchFlights = async () => {
    try {
      const res = await apiFetch("/api/flights");
      const data = await res.json();
      setFlights(data);
    } catch (err) {
      console.error("Failed to fetch flights:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBaggageClaims = async () => {
    try {
      const res = await apiFetch("/api/baggage-claims");
      const data = await res.json();
      setBaggageClaims(data);
    } catch (err) {
      console.error("Failed to fetch baggage claims:", err);
    }
  };

  useEffect(() => {
    fetchFlights();
    fetchBaggageClaims();
  }, []);

  const handleCheckNow = async () => {
    setChecking(true);
    try {
      await apiFetch("/api/flights/check-now", { method: "POST" });
      await fetchFlights();
    } catch (err) {
      console.error("Price check failed:", err);
    } finally {
      setChecking(false);
    }
  };

  const handlePaste = async () => {
    if (!pasteText.trim()) return;
    setPasting(true);
    setPasteError("");
    try {
      const res = await apiFetch("/api/flights/parse", {
        method: "POST",
        body: JSON.stringify({ emailText: pasteText }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to parse");
      }
      setPasteText("");
      setShowPaste(false);
      await fetchFlights();
    } catch (err: any) {
      setPasteError(err.message);
    } finally {
      setPasting(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <span style={styles.loadingPlane}>&#9992;</span>
        <span>Loading flights...</span>
      </div>
    );
  }

  if (flights.length === 0) {
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <EmptyState />
        <div style={{ textAlign: "center", paddingBottom: 40, display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => setShowPaste(true)} style={styles.primaryBtn}>
            + Paste Booking Email
          </button>
          <button onClick={onBaggageClaim} style={styles.secondaryBtn}>
            File Baggage Claim
          </button>
        </div>
        {showPaste && renderModal()}
      </div>
    );
  }

  const totalSavings = flights.reduce((sum, f) => {
    if (f.current_price !== null && f.current_price < f.price_paid) {
      return sum + (f.price_paid - f.current_price);
    }
    return sum;
  }, 0);

  function renderModal() {
    return (
      <div style={styles.overlay} onClick={() => setShowPaste(false)}>
        <div className="glass-card-static animate-in" style={styles.modal} onClick={(e) => e.stopPropagation()}>
          <h3 style={styles.modalTitle}>Paste Booking Confirmation</h3>
          <p style={styles.modalDesc}>
            Copy and paste the text from your airline booking confirmation email.
          </p>
          <textarea
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            placeholder={"Your Trip Confirmation\nConfirmation #: ABC123\nFlight: UA 456\nFrom: ORD to LAX\nDate: April 10, 2026\nTotal: $289.00"}
            style={styles.textarea}
            rows={10}
            autoFocus
          />
          {pasteError && <p style={styles.error}>{pasteError}</p>}
          <div style={styles.modalBtns}>
            <button onClick={() => setShowPaste(false)} style={styles.cancelBtn}>
              Cancel
            </button>
            <button
              onClick={handlePaste}
              disabled={pasting || !pasteText.trim()}
              style={styles.goldBtn}
            >
              {pasting ? "Parsing..." : "Track Flight"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div className="animate-in" style={styles.topBar}>
        <div>
          <h2 style={styles.heading}>
            {flights.length} Flight{flights.length !== 1 ? "s" : ""} Tracked
          </h2>
          {totalSavings > 0 && (
            <p style={styles.savings}>
              ${totalSavings.toFixed(0)} in potential savings
            </p>
          )}
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button onClick={() => setShowPaste(true)} style={styles.outlineBtn}>
            + Add Flight
          </button>
          <button onClick={onBaggageClaim} style={styles.outlineBtn}>
            Baggage Claim
          </button>
          <button
            onClick={handleCheckNow}
            disabled={checking}
            style={styles.goldBtn}
          >
            {checking ? "Checking..." : "Check Prices"}
          </button>
        </div>
      </div>

      <div className="glass-card-static animate-in animate-in-1" style={styles.emailTip}>
        <span style={styles.emailTipIcon}>&#9993;</span>
        Forward booking emails to{" "}
        <strong style={{ color: "var(--gold)", fontFamily: "var(--font-mono)", fontSize: 12 }}>track@faresaver.financewithphil.com</strong>
      </div>

      <div style={styles.grid}>
        {flights.map((f, i) => (
          <div key={f.id} className={`animate-in animate-in-${Math.min(i + 2, 5)}`}>
            <FlightCard flight={f} onClick={() => onSelect(f.id)} />
          </div>
        ))}
      </div>

      {baggageClaims.length > 0 && (
        <div className="animate-in animate-in-3" style={{ marginTop: 32 }}>
          <h3 style={styles.sectionHeading}>
            Baggage Claims
            <span style={styles.countBadge}>{baggageClaims.length}</span>
          </h3>
          <div style={styles.grid}>
            {baggageClaims.map((bc) => (
              <div
                key={bc.id}
                className="glass-card"
                style={styles.baggageCard}
                onClick={() => onOpenBaggageClaim(bc.id)}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={styles.baggageRoute}>
                      {bc.origin && bc.destination ? `${bc.origin} \u2192 ${bc.destination}` : bc.airline || bc.airline_code}
                    </span>
                    <span style={styles.baggageType}>{bc.claim_type}</span>
                  </div>
                  <span style={{
                    padding: "3px 12px", borderRadius: 100, fontSize: 10, fontWeight: 700,
                    textTransform: "uppercase" as const, letterSpacing: "0.06em",
                    fontFamily: "var(--font-body)",
                    background: bc.status === "resolved" ? "var(--green-dim)" : "var(--indigo-dim)",
                    color: bc.status === "resolved" ? "var(--green)" : "var(--indigo)",
                  }}>
                    {bc.status.replace("_", " ")}
                  </span>
                </div>
                {bc.flight_date && (
                  <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6, fontFamily: "var(--font-body)" }}>{bc.flight_date}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {showPaste && renderModal()}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { padding: 24, maxWidth: 800, margin: "0 auto", width: "100%" },
  loading: {
    flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
    gap: 10, color: "var(--text-secondary)", fontSize: 15, fontFamily: "var(--font-body)",
  },
  loadingPlane: {
    fontSize: 20,
    animation: "float 2s ease-in-out infinite",
  },
  topBar: {
    display: "flex", justifyContent: "space-between", alignItems: "flex-start",
    marginBottom: 24, flexWrap: "wrap", gap: 14,
  },
  heading: {
    fontSize: 24, fontWeight: 700, color: "var(--text-primary)",
    fontFamily: "var(--font-display)", letterSpacing: "-0.02em",
  },
  savings: {
    fontSize: 14, color: "var(--gold)", marginTop: 4,
    fontFamily: "var(--font-mono)", fontWeight: 600,
  },
  goldBtn: {
    padding: "9px 20px", borderRadius: 10, border: "none",
    background: "var(--gold)", color: "#0a0c14", fontSize: 13,
    fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-body)",
    letterSpacing: "0.03em", textTransform: "uppercase" as const,
  },
  outlineBtn: {
    padding: "9px 20px", borderRadius: 10,
    border: "1px solid var(--border-hover)", background: "transparent",
    color: "var(--text-secondary)", fontSize: 13, fontWeight: 600,
    cursor: "pointer", fontFamily: "var(--font-body)",
  },
  primaryBtn: {
    padding: "14px 28px", borderRadius: 12, border: "none",
    background: "var(--gold)", color: "#0a0c14", fontSize: 15,
    fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-body)",
    letterSpacing: "0.03em", textTransform: "uppercase" as const,
  },
  secondaryBtn: {
    padding: "14px 28px", borderRadius: 12,
    border: "1px solid var(--border-hover)", background: "rgba(255,255,255,0.03)",
    color: "var(--text-secondary)", fontSize: 15, fontWeight: 600,
    cursor: "pointer", fontFamily: "var(--font-body)",
  },
  emailTip: {
    fontSize: 13, color: "var(--text-secondary)", padding: "12px 16px",
    marginBottom: 20, fontFamily: "var(--font-body)",
    display: "flex", alignItems: "center", gap: 8,
  },
  emailTipIcon: { fontSize: 16, opacity: 0.5 },
  grid: { display: "flex", flexDirection: "column", gap: 14 },
  sectionHeading: {
    fontSize: 16, fontWeight: 600, color: "var(--text-primary)",
    marginBottom: 14, fontFamily: "var(--font-display)",
    display: "flex", alignItems: "center", gap: 10,
  },
  countBadge: {
    fontSize: 11, fontWeight: 700, background: "var(--indigo-dim)",
    color: "var(--indigo)", padding: "2px 10px", borderRadius: 100,
    fontFamily: "var(--font-mono)",
  },
  baggageCard: {
    padding: 18, cursor: "pointer",
  },
  baggageRoute: {
    fontSize: 15, fontWeight: 700, color: "var(--text-primary)",
    fontFamily: "var(--font-display)",
  },
  baggageType: {
    fontSize: 12, color: "var(--text-muted)",
    fontFamily: "var(--font-body)", textTransform: "capitalize" as const,
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
    fontSize: 20, fontWeight: 700, color: "var(--text-primary)",
    marginBottom: 6, fontFamily: "var(--font-display)",
  },
  modalDesc: {
    fontSize: 13, color: "var(--text-secondary)", marginBottom: 18,
    fontFamily: "var(--font-body)",
  },
  textarea: {
    width: "100%", padding: 14, borderRadius: 10,
    border: "1px solid var(--border)", background: "var(--bg-input)",
    color: "var(--text-primary)", fontSize: 14, fontFamily: "var(--font-body)",
    resize: "vertical" as const, outline: "none", boxSizing: "border-box" as const,
  },
  error: { color: "var(--red)", fontSize: 13, marginTop: 8, fontFamily: "var(--font-body)" },
  modalBtns: { display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 18 },
  cancelBtn: {
    padding: "9px 18px", borderRadius: 10, border: "1px solid var(--border)",
    background: "transparent", color: "var(--text-secondary)", fontSize: 13,
    cursor: "pointer", fontFamily: "var(--font-body)",
  },
};
