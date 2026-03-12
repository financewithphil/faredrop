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

export function FlightCard({
  flight,
  onClick,
}: {
  flight: Flight;
  onClick: () => void;
}) {
  const savings =
    flight.current_price !== null
      ? flight.price_paid - flight.current_price
      : null;
  const hasDrop = savings !== null && savings > 0;

  return (
    <div style={styles.card} onClick={onClick}>
      <div style={styles.route}>
        <span style={styles.airport}>{flight.origin}</span>
        <span style={styles.arrow}>&rarr;</span>
        <span style={styles.airport}>{flight.destination}</span>
      </div>
      <div style={styles.meta}>
        <span>{flight.airline || flight.airline_code || ""}</span>
        <span>{flight.departure_date}</span>
        <span style={styles.fareClass}>{flight.fare_class || ""}</span>
      </div>
      <div style={styles.prices}>
        <div style={styles.priceBlock}>
          <span style={styles.priceLabel}>You Paid</span>
          <span style={styles.priceValue}>${flight.price_paid}</span>
        </div>
        <div style={styles.priceBlock}>
          <span style={styles.priceLabel}>Current</span>
          <span
            style={{
              ...styles.priceValue,
              color: hasDrop ? "#22c55e" : "#94a3b8",
            }}
          >
            {flight.current_price !== null
              ? `$${flight.current_price}`
              : "Checking..."}
          </span>
        </div>
        {hasDrop && (
          <div style={styles.savingsBadge}>
            {flight.claim_id
              ? `Claim: ${(flight.claim_status || "detected").replace("_", " ")}`
              : `Save $${savings!.toFixed(0)}`}
          </div>
        )}
      </div>
      <div style={styles.footer}>
        <span style={styles.footerText}>
          {flight.check_count} checks
          {flight.alert_count > 0 ? ` | ${flight.alert_count} alerts` : ""}
        </span>
        <span
          style={{
            ...styles.status,
            background:
              flight.status === "active"
                ? "#1e3a2f"
                : flight.status === "alerted"
                  ? "#3b1e1e"
                  : "#1e1e2f",
            color:
              flight.status === "active"
                ? "#4ade80"
                : flight.status === "alerted"
                  ? "#f87171"
                  : "#94a3b8",
          }}
        >
          {flight.status}
        </span>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: "#1e293b",
    borderRadius: 12,
    padding: 20,
    cursor: "pointer",
    border: "1px solid #334155",
    transition: "border-color 0.2s",
  },
  route: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  airport: { fontSize: 22, fontWeight: 700, color: "#f1f5f9" },
  arrow: { fontSize: 18, color: "#64748b" },
  meta: {
    display: "flex",
    gap: 12,
    fontSize: 13,
    color: "#94a3b8",
    marginBottom: 16,
  },
  fareClass: { textTransform: "capitalize" as const },
  prices: {
    display: "flex",
    alignItems: "flex-end",
    gap: 20,
    marginBottom: 12,
  },
  priceBlock: { display: "flex", flexDirection: "column", gap: 2 },
  priceLabel: { fontSize: 11, color: "#64748b", textTransform: "uppercase" as const },
  priceValue: { fontSize: 18, fontWeight: 600, color: "#e2e8f0" },
  savingsBadge: {
    padding: "4px 10px",
    borderRadius: 20,
    background: "#052e16",
    color: "#4ade80",
    fontSize: 13,
    fontWeight: 600,
    marginLeft: "auto",
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTop: "1px solid #334155",
  },
  footerText: { fontSize: 12, color: "#64748b" },
  status: {
    padding: "2px 8px",
    borderRadius: 4,
    fontSize: 11,
    fontWeight: 600,
    textTransform: "uppercase" as const,
  },
};
