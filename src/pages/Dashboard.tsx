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

export function Dashboard({
  onSelect,
}: {
  onSelect: (id: string) => void;
}) {
  const [flights, setFlights] = useState<Flight[]>([]);
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

  useEffect(() => {
    fetchFlights();
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
      <div style={styles.loading}>Loading flights...</div>
    );
  }

  if (flights.length === 0) {
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <EmptyState />
        <div style={{ textAlign: "center", paddingBottom: 40 }}>
          <button onClick={() => setShowPaste(true)} style={styles.addBtnLg}>
            + Paste Booking Email
          </button>
        </div>
        {showPaste && (
          <div style={styles.overlay} onClick={() => setShowPaste(false)}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
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
                  style={styles.submitBtn}
                >
                  {pasting ? "Parsing..." : "Track Flight"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  const totalSavings = flights.reduce((sum, f) => {
    if (f.current_price !== null && f.current_price < f.price_paid) {
      return sum + (f.price_paid - f.current_price);
    }
    return sum;
  }, 0);

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <div>
          <h2 style={styles.heading}>
            {flights.length} Flight{flights.length !== 1 ? "s" : ""} Tracked
          </h2>
          {totalSavings > 0 && (
            <p style={styles.savings}>
              Total potential savings: ${totalSavings.toFixed(0)}
            </p>
          )}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setShowPaste(true)} style={styles.addBtn}>
            + Add Flight
          </button>
          <button
            onClick={handleCheckNow}
            disabled={checking}
            style={styles.checkBtn}
          >
            {checking ? "Checking..." : "Check Prices Now"}
          </button>
        </div>
      </div>
      <div style={styles.grid}>
        {flights.map((f) => (
          <FlightCard key={f.id} flight={f} onClick={() => onSelect(f.id)} />
        ))}
      </div>

      {showPaste && (
        <div style={styles.overlay} onClick={() => setShowPaste(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
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
                style={styles.submitBtn}
              >
                {pasting ? "Parsing..." : "Track Flight"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { padding: 20, maxWidth: 800, margin: "0 auto" },
  loading: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#94a3b8",
    fontSize: 16,
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
    flexWrap: "wrap",
    gap: 12,
  },
  heading: { fontSize: 20, fontWeight: 700, color: "#f1f5f9" },
  savings: { fontSize: 14, color: "#4ade80", marginTop: 4 },
  checkBtn: {
    padding: "8px 16px",
    borderRadius: 8,
    border: "none",
    background: "#2563eb",
    color: "#fff",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  },
  grid: { display: "flex", flexDirection: "column", gap: 12 },
  addBtn: {
    padding: "8px 16px",
    borderRadius: 8,
    border: "1px solid #334155",
    background: "#1e293b",
    color: "#e2e8f0",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  },
  addBtnLg: {
    padding: "12px 24px",
    borderRadius: 8,
    border: "none",
    background: "#2563eb",
    color: "#fff",
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
    padding: 16,
  },
  modal: {
    background: "#1e293b",
    borderRadius: 12,
    padding: 24,
    width: "100%",
    maxWidth: 500,
    border: "1px solid #334155",
  },
  modalTitle: { fontSize: 18, fontWeight: 700, color: "#f1f5f9", marginBottom: 4 },
  modalDesc: { fontSize: 13, color: "#94a3b8", marginBottom: 16 },
  textarea: {
    width: "100%",
    padding: 12,
    borderRadius: 8,
    border: "1px solid #334155",
    background: "#0f172a",
    color: "#f1f5f9",
    fontSize: 14,
    fontFamily: "inherit",
    resize: "vertical" as const,
    outline: "none",
  },
  error: { color: "#ef4444", fontSize: 13, marginTop: 8 },
  modalBtns: { display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 },
  cancelBtn: {
    padding: "8px 16px",
    borderRadius: 8,
    border: "1px solid #334155",
    background: "transparent",
    color: "#94a3b8",
    fontSize: 14,
    cursor: "pointer",
  },
  submitBtn: {
    padding: "8px 16px",
    borderRadius: 8,
    border: "none",
    background: "#2563eb",
    color: "#fff",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  },
};
