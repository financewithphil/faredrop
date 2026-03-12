import { useState, useEffect } from "react";
import { apiFetch } from "../hooks/useApi";
import { PriceChart } from "../components/PriceChart";

interface Flight {
  id: string;
  airline: string;
  airline_code: string;
  flight_number: string;
  origin: string;
  destination: string;
  departure_date: string;
  return_date: string | null;
  fare_class: string;
  price_paid: number;
  currency: string;
  booking_ref: string;
  passengers: number;
  status: string;
  user_email: string;
  created_at: string;
}

interface PriceCheck {
  id: number;
  current_price: number | null;
  checked_at: string;
}

export function FlightDetail({
  flightId,
  onBack,
  onOpenClaim,
}: {
  flightId: string;
  onBack: () => void;
  onOpenClaim: (claimId: string) => void;
}) {
  const [flight, setFlight] = useState<Flight | null>(null);
  const [prices, setPrices] = useState<PriceCheck[]>([]);
  const [deleting, setDeleting] = useState(false);
  const [claimId, setClaimId] = useState<string | null>(null);
  const [claimStatus, setClaimStatus] = useState<string | null>(null);
  const [creatingClaim, setCreatingClaim] = useState(false);

  useEffect(() => {
    apiFetch(`/api/flights/${flightId}`)
      .then((r) => r.json())
      .then(setFlight);
    apiFetch(`/api/flights/${flightId}/prices`)
      .then((r) => r.json())
      .then(setPrices);
    apiFetch(`/api/claims/flight/${flightId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data) {
          setClaimId(data.id);
          setClaimStatus(data.status);
        }
      });
  }, [flightId]);

  const handleCreateClaim = async () => {
    setCreatingClaim(true);
    try {
      const res = await apiFetch("/api/claims", {
        method: "POST",
        body: JSON.stringify({ flightId }),
      });
      const data = await res.json();
      if (data.id) {
        onOpenClaim(data.id);
      }
    } catch (err) {
      console.error("Failed to create claim:", err);
    } finally {
      setCreatingClaim(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Stop tracking this flight?")) return;
    setDeleting(true);
    await apiFetch(`/api/flights/${flightId}`, { method: "DELETE" });
    onBack();
  };

  if (!flight) {
    return <div style={styles.loading}>Loading...</div>;
  }

  const latestPrice = prices.length > 0
    ? prices[prices.length - 1].current_price
    : null;
  const savings = latestPrice !== null ? flight.price_paid - latestPrice : null;

  return (
    <div className="animate-in" style={styles.container}>
      <button onClick={onBack} style={styles.backBtn}>
        &larr; All Flights
      </button>

      <div className="glass-card-static" style={styles.card}>
        <div style={styles.route}>
          <span style={styles.airport}>{flight.origin}</span>
          <span style={styles.routeLine}>
            <span style={styles.routeDot} />
            <span style={styles.routeDash} />
            <span style={styles.routePlane}>&#9992;</span>
            <span style={styles.routeDash} />
            <span style={styles.routeDot} />
          </span>
          <span style={styles.airport}>{flight.destination}</span>
        </div>

        <div style={styles.infoGrid}>
          <InfoRow label="Airline" value={flight.airline || flight.airline_code} />
          <InfoRow label="Flight" value={flight.flight_number} />
          <InfoRow label="Date" value={flight.departure_date} />
          {flight.return_date && (
            <InfoRow label="Return" value={flight.return_date} />
          )}
          <InfoRow label="Fare Class" value={flight.fare_class} />
          <InfoRow label="Passengers" value={String(flight.passengers)} />
          <InfoRow label="Booking Ref" value={flight.booking_ref} mono />
          <InfoRow label="Price Paid" value={`$${flight.price_paid}`} mono />
          <InfoRow
            label="Current Price"
            value={latestPrice !== null ? `$${latestPrice}` : "Pending"}
            highlight={savings !== null && savings > 0}
            mono
          />
          {savings !== null && savings > 0 && (
            <InfoRow label="Savings" value={`$${savings.toFixed(0)}`} highlight mono />
          )}
        </div>
      </div>

      <div className="glass-card-static animate-in animate-in-1" style={styles.chartCard}>
        <h3 style={styles.sectionTitle}>Price History</h3>
        <PriceChart data={prices} pricePaid={flight.price_paid} />
      </div>

      <div className="glass-card-static animate-in animate-in-2" style={styles.checksCard}>
        <h3 style={styles.sectionTitle}>
          All Price Checks
          <span style={styles.checkCount}>{prices.length}</span>
        </h3>
        {prices.length === 0 ? (
          <p style={styles.noData}>No checks yet. Runs 3x daily.</p>
        ) : (
          <div>
            {[...prices].reverse().map((p) => (
              <div key={p.id} style={styles.checkRow}>
                <span style={styles.checkDate}>
                  {new Date(p.checked_at).toLocaleString()}
                </span>
                <span
                  style={{
                    ...styles.checkPrice,
                    color:
                      p.current_price !== null &&
                      p.current_price < flight.price_paid
                        ? "var(--green)"
                        : "var(--text-primary)",
                  }}
                >
                  {p.current_price !== null ? `$${p.current_price}` : "N/A"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {savings !== null && savings > 10 && (
        <div className="gold-glow animate-in animate-in-3" style={styles.claimCard}>
          {claimId ? (
            <>
              <div style={styles.claimHeader}>
                <span style={styles.claimBadge}>{claimStatus?.replace("_", " ")}</span>
                <span style={styles.claimSavings}>Save ${savings.toFixed(0)}</span>
              </div>
              <p style={styles.claimText}>
                You have a claim in progress for this flight.
              </p>
              <button onClick={() => onOpenClaim(claimId)} style={styles.claimBtn}>
                View Claim &amp; Filing Instructions
              </button>
            </>
          ) : (
            <>
              <div style={styles.claimHeader}>
                <span style={styles.claimSavings}>
                  Price dropped ${savings.toFixed(0)}!
                </span>
              </div>
              <p style={styles.claimText}>
                You may be eligible for a travel credit from the airline.
              </p>
              <button
                onClick={handleCreateClaim}
                disabled={creatingClaim}
                style={styles.claimBtn}
              >
                {creatingClaim ? "Creating..." : "File a Claim"}
              </button>
            </>
          )}
        </div>
      )}

      <button
        onClick={handleDelete}
        disabled={deleting}
        style={styles.deleteBtn}
      >
        {deleting ? "Removing..." : "Stop Tracking This Flight"}
      </button>
    </div>
  );
}

function InfoRow({
  label,
  value,
  highlight,
  mono,
}: {
  label: string;
  value: string | null;
  highlight?: boolean;
  mono?: boolean;
}) {
  return (
    <div style={infoStyles.row}>
      <span style={infoStyles.label}>{label}</span>
      <span
        style={{
          ...infoStyles.value,
          color: highlight ? "var(--gold)" : "var(--text-primary)",
          fontWeight: highlight ? 700 : 500,
          fontFamily: mono ? "var(--font-mono)" : "var(--font-body)",
        }}
      >
        {value || "N/A"}
      </span>
    </div>
  );
}

const infoStyles: Record<string, React.CSSProperties> = {
  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 0",
    borderBottom: "1px solid var(--border)",
  },
  label: { color: "var(--text-secondary)", fontSize: 13, fontFamily: "var(--font-body)" },
  value: { color: "var(--text-primary)", fontSize: 13 },
};

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
  card: {
    padding: 24, marginBottom: 18,
  },
  route: {
    display: "flex", alignItems: "center", gap: 16,
    marginBottom: 20, paddingBottom: 20, borderBottom: "1px solid var(--border)",
  },
  airport: {
    fontSize: 32, fontWeight: 700, color: "var(--text-primary)",
    fontFamily: "var(--font-display)", letterSpacing: "-0.02em",
  },
  routeLine: {
    display: "flex", alignItems: "center", gap: 4, opacity: 0.4,
  },
  routeDot: {
    width: 5, height: 5, borderRadius: "50%", background: "var(--gold)",
  },
  routeDash: {
    width: 28, height: 1, background: "var(--text-muted)",
  },
  routePlane: { fontSize: 12, color: "var(--gold)" },
  infoGrid: {},
  chartCard: {
    padding: 24, marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 16, fontWeight: 600, color: "var(--text-primary)",
    marginBottom: 18, fontFamily: "var(--font-display)",
    display: "flex", alignItems: "center", gap: 10,
  },
  checkCount: {
    fontSize: 11, fontWeight: 700, background: "var(--indigo-dim)",
    color: "var(--indigo)", padding: "2px 10px", borderRadius: 100,
    fontFamily: "var(--font-mono)",
  },
  checksCard: {
    padding: 24, marginBottom: 18, maxHeight: 320, overflowY: "auto",
  },
  noData: {
    color: "var(--text-muted)", fontSize: 14, textAlign: "center",
    fontFamily: "var(--font-body)",
  },
  checkRow: {
    display: "flex", justifyContent: "space-between",
    padding: "8px 0", borderBottom: "1px solid var(--border)", fontSize: 13,
  },
  checkDate: { color: "var(--text-secondary)", fontFamily: "var(--font-body)" },
  checkPrice: { fontWeight: 600, fontFamily: "var(--font-mono)" },
  claimCard: {
    background: "rgba(212, 168, 83, 0.06)",
    borderRadius: 14, padding: 22, marginBottom: 18,
    border: "1px solid rgba(212, 168, 83, 0.2)",
  },
  claimHeader: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", marginBottom: 10,
  },
  claimBadge: {
    padding: "3px 12px", borderRadius: 100,
    background: "rgba(212, 168, 83, 0.12)",
    color: "var(--gold)", fontSize: 11, fontWeight: 700,
    textTransform: "capitalize" as const,
    fontFamily: "var(--font-body)", letterSpacing: "0.04em",
  },
  claimSavings: {
    fontSize: 20, fontWeight: 700, color: "var(--gold)",
    fontFamily: "var(--font-mono)", letterSpacing: "-0.02em",
  },
  claimText: {
    fontSize: 14, color: "var(--text-secondary)", marginBottom: 14,
    fontFamily: "var(--font-body)",
  },
  claimBtn: {
    padding: "12px 24px", borderRadius: 10, border: "none",
    background: "var(--gold)", color: "#0a0c14", fontSize: 14,
    fontWeight: 700, cursor: "pointer", width: "100%",
    fontFamily: "var(--font-body)", letterSpacing: "0.03em",
    textTransform: "uppercase" as const,
  },
  deleteBtn: {
    width: "100%", padding: "12px 16px", borderRadius: 10,
    border: "1px solid rgba(248, 113, 113, 0.2)",
    background: "rgba(248, 113, 113, 0.06)",
    color: "var(--red)", fontSize: 13, fontWeight: 600,
    cursor: "pointer", marginTop: 8, fontFamily: "var(--font-body)",
  },
};
