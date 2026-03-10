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
}: {
  flightId: string;
  onBack: () => void;
}) {
  const [flight, setFlight] = useState<Flight | null>(null);
  const [prices, setPrices] = useState<PriceCheck[]>([]);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    apiFetch(`/api/flights/${flightId}`)
      .then((r) => r.json())
      .then(setFlight);
    apiFetch(`/api/flights/${flightId}/prices`)
      .then((r) => r.json())
      .then(setPrices);
  }, [flightId]);

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
    <div style={styles.container}>
      <button onClick={onBack} style={styles.backBtn}>
        &larr; All Flights
      </button>

      <div style={styles.card}>
        <div style={styles.route}>
          <span style={styles.airport}>{flight.origin}</span>
          <span style={styles.arrow}>&rarr;</span>
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
          <InfoRow label="Booking Ref" value={flight.booking_ref} />
          <InfoRow label="Price Paid" value={`$${flight.price_paid}`} />
          <InfoRow
            label="Current Price"
            value={latestPrice !== null ? `$${latestPrice}` : "Pending"}
            highlight={savings !== null && savings > 0}
          />
          {savings !== null && savings > 0 && (
            <InfoRow label="Savings" value={`$${savings.toFixed(0)}`} highlight />
          )}
        </div>
      </div>

      <div style={styles.chartCard}>
        <h3 style={styles.sectionTitle}>Price History</h3>
        <PriceChart data={prices} pricePaid={flight.price_paid} />
      </div>

      <div style={styles.checksCard}>
        <h3 style={styles.sectionTitle}>
          All Price Checks ({prices.length})
        </h3>
        {prices.length === 0 ? (
          <p style={styles.noData}>No checks yet. Runs 3x daily.</p>
        ) : (
          <div style={styles.checksList}>
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
                        ? "#4ade80"
                        : "#e2e8f0",
                  }}
                >
                  {p.current_price !== null ? `$${p.current_price}` : "N/A"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

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
}: {
  label: string;
  value: string | null;
  highlight?: boolean;
}) {
  return (
    <div style={infoStyles.row}>
      <span style={infoStyles.label}>{label}</span>
      <span
        style={{
          ...infoStyles.value,
          color: highlight ? "#4ade80" : "#e2e8f0",
          fontWeight: highlight ? 700 : 500,
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
    padding: "8px 0",
    borderBottom: "1px solid #1e293b",
  },
  label: { color: "#64748b", fontSize: 14 },
  value: { color: "#e2e8f0", fontSize: 14 },
};

const styles: Record<string, React.CSSProperties> = {
  container: { padding: 20, maxWidth: 600, margin: "0 auto" },
  loading: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#94a3b8",
  },
  backBtn: {
    background: "none",
    border: "none",
    color: "#3b82f6",
    fontSize: 14,
    cursor: "pointer",
    marginBottom: 16,
    padding: 0,
  },
  card: {
    background: "#1e293b",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    border: "1px solid #334155",
  },
  route: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
    paddingBottom: 16,
    borderBottom: "1px solid #334155",
  },
  airport: { fontSize: 28, fontWeight: 700, color: "#f1f5f9" },
  arrow: { fontSize: 20, color: "#64748b" },
  infoGrid: {},
  chartCard: {
    background: "#1e293b",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    border: "1px solid #334155",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: "#e2e8f0",
    marginBottom: 16,
  },
  checksCard: {
    background: "#1e293b",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    border: "1px solid #334155",
    maxHeight: 300,
    overflowY: "auto",
  },
  noData: { color: "#64748b", fontSize: 14, textAlign: "center" },
  checksList: {},
  checkRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "6px 0",
    borderBottom: "1px solid #0f172a",
    fontSize: 13,
  },
  checkDate: { color: "#94a3b8" },
  checkPrice: { fontWeight: 600 },
  deleteBtn: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: 8,
    border: "1px solid #7f1d1d",
    background: "#1c0a0a",
    color: "#f87171",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    marginTop: 8,
  },
};
