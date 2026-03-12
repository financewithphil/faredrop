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
  payment_type: string | null;
  miles_paid: number | null;
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
  const [paymentType, setPaymentType] = useState<"cash" | "miles">("cash");
  const [milesPaid, setMilesPaid] = useState("");
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

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
        body: JSON.stringify({
          emailText: pasteText,
          paymentType,
          milesPaid: paymentType === "miles" && milesPaid ? parseInt(milesPaid) : undefined,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to parse");
      }
      setPasteText("");
      setShowPaste(false);
      setPaymentType("cash");
      setMilesPaid("");
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

          <div style={styles.paymentToggle}>
            <span style={styles.paymentLabel}>Payment type:</span>
            <div style={styles.toggleBtns}>
              <button
                type="button"
                onClick={() => setPaymentType("cash")}
                style={{
                  ...styles.toggleBtn,
                  ...(paymentType === "cash" ? styles.toggleBtnActive : {}),
                }}
              >
                Cash / Card
              </button>
              <button
                type="button"
                onClick={() => setPaymentType("miles")}
                style={{
                  ...styles.toggleBtn,
                  ...(paymentType === "miles" ? styles.toggleBtnActive : {}),
                }}
              >
                Miles / Points
              </button>
            </div>
          </div>

          {paymentType === "miles" && (
            <input
              type="number"
              placeholder="Miles/points used (e.g., 25000)"
              value={milesPaid}
              onChange={(e) => setMilesPaid(e.target.value)}
              style={styles.milesInput}
            />
          )}

          <textarea
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            placeholder={paymentType === "miles"
              ? "Your Award Confirmation\nConfirmation #: ABC123\nFlight: UA 456\nFrom: ORD to LAX\nDate: April 10, 2026\nMiles Used: 25,000"
              : "Your Trip Confirmation\nConfirmation #: ABC123\nFlight: UA 456\nFrom: ORD to LAX\nDate: April 10, 2026\nTotal: $289.00"}
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
        <strong style={{ color: "var(--accent)", fontFamily: "var(--font-mono)", fontSize: 12 }}>track@faresaver.financewithphil.com</strong>
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

      <div className="glass-card-static animate-in animate-in-4" style={styles.faqSection}>
        <h3 style={styles.sectionHeading}>
          Frequently Asked Questions
        </h3>
        {FAQ_ITEMS.map((item, i) => (
          <div key={i} style={styles.faqItem}>
            <button
              onClick={() => setFaqOpen(faqOpen === i ? null : i)}
              style={styles.faqQuestion}
            >
              <span>{item.q}</span>
              <span style={{
                ...styles.faqChevron,
                transform: faqOpen === i ? "rotate(180deg)" : "rotate(0deg)",
              }}>&#9660;</span>
            </button>
            {faqOpen === i && (
              <div style={styles.faqAnswer}>{item.a}</div>
            )}
          </div>
        ))}
      </div>

      {showPaste && renderModal()}
    </div>
  );
}

const FAQ_ITEMS = [
  {
    q: "How does FareDrop track prices?",
    a: "We check your flight's price 3 times daily using airline pricing data. When the current fare drops below what you paid, we alert you and show you exactly how to claim the difference.",
  },
  {
    q: "Does this work with miles/points bookings?",
    a: "Yes! When adding a flight, select \"Miles / Points\" as the payment type. If the award price drops, we'll show you airline-specific steps to get your miles redeposited. Most major US airlines allow free award repricing.",
  },
  {
    q: "How do I get my refund or credit?",
    a: "When a price drop is detected, click into the flight and follow the step-by-step instructions. Most airlines issue a travel credit or eCredit — you'll typically rebook the same flight at the lower fare through the airline's website or by calling.",
  },
  {
    q: "Does this work for Basic Economy fares?",
    a: "Unfortunately, most airlines do not allow changes on Basic Economy tickets. FareDrop will warn you if your fare class isn't eligible. However, you can still try calling the airline directly — some agents will make exceptions.",
  },
  {
    q: "What airlines are supported?",
    a: "We support all major US domestic airlines (Southwest, Delta, United, American, JetBlue, Alaska, Spirit, Frontier) plus SkyTeam alliance carriers. For other airlines, we provide general guidance on how to contact them.",
  },
  {
    q: "How do I add a flight?",
    a: "Two ways: (1) Paste your booking confirmation email using the \"+ Add Flight\" button, or (2) forward your confirmation email to track@faresaver.financewithphil.com. We'll automatically extract the flight details.",
  },
  {
    q: "What about baggage claims?",
    a: "FareDrop also helps with lost, damaged, or delayed baggage. Click \"Baggage Claim\" to get airline-specific filing instructions, DOT complaint escalation guidance, and compensation tracking — all in one place.",
  },
  {
    q: "Is my data secure?",
    a: "Your booking data is stored securely and only accessible to your account. We never share your information with third parties. You can delete any tracked flight at any time.",
  },
];

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
    fontSize: 14, color: "var(--accent)", marginTop: 4,
    fontFamily: "var(--font-mono)", fontWeight: 600,
  },
  goldBtn: {
    padding: "9px 20px", borderRadius: 10, border: "none",
    background: "var(--accent)", color: "#fff", fontSize: 13,
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
    background: "var(--accent)", color: "#fff", fontSize: 15,
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
  paymentToggle: {
    display: "flex", alignItems: "center", gap: 12, marginBottom: 14,
  },
  paymentLabel: {
    fontSize: 11, fontWeight: 700, color: "var(--text-muted)",
    textTransform: "uppercase" as const, letterSpacing: "0.08em",
    fontFamily: "var(--font-body)",
  },
  toggleBtns: { display: "flex", gap: 8 },
  toggleBtn: {
    padding: "7px 16px", borderRadius: 8,
    border: "1px solid var(--border)", background: "transparent",
    color: "var(--text-secondary)", fontSize: 12, fontWeight: 600,
    cursor: "pointer", fontFamily: "var(--font-body)",
    transition: "all 0.2s ease",
  },
  toggleBtnActive: {
    background: "var(--accent)", color: "#fff",
    borderColor: "var(--accent)",
  },
  milesInput: {
    width: "100%", padding: "10px 14px", borderRadius: 10,
    border: "1px solid var(--border)", background: "var(--bg-input)",
    color: "var(--text-primary)", fontSize: 14, outline: "none",
    boxSizing: "border-box" as const, fontFamily: "var(--font-mono)",
    marginBottom: 12,
  },
  faqSection: {
    padding: 24, marginTop: 32,
  },
  faqItem: {
    borderBottom: "1px solid var(--border)",
  },
  faqQuestion: {
    width: "100%", padding: "16px 0", background: "none", border: "none",
    color: "var(--text-primary)", fontSize: 14, fontWeight: 600,
    cursor: "pointer", fontFamily: "var(--font-body)",
    display: "flex", justifyContent: "space-between", alignItems: "center",
    textAlign: "left" as const, gap: 12,
  },
  faqChevron: {
    fontSize: 10, color: "var(--text-muted)",
    transition: "transform 0.2s ease", flexShrink: 0,
  },
  faqAnswer: {
    fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7,
    paddingBottom: 16, fontFamily: "var(--font-body)",
  },
};
