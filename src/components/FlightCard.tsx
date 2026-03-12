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
    <div className="glass-card" style={styles.card} onClick={onClick}>
      <div style={styles.topRow}>
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
        <span
          style={{
            ...styles.status,
            background:
              flight.status === "active"
                ? "var(--green-dim)"
                : flight.status === "alerted"
                  ? "var(--red-dim)"
                  : "var(--indigo-dim)",
            color:
              flight.status === "active"
                ? "var(--green)"
                : flight.status === "alerted"
                  ? "var(--red)"
                  : "var(--text-secondary)",
          }}
        >
          {flight.status}
        </span>
      </div>

      <div style={styles.meta}>
        <span style={styles.metaItem}>{flight.airline || flight.airline_code || ""}</span>
        <span style={styles.metaDivider} />
        <span style={styles.metaItem}>{flight.departure_date}</span>
        {flight.fare_class && (
          <>
            <span style={styles.metaDivider} />
            <span style={{ ...styles.metaItem, textTransform: "capitalize" as const }}>{flight.fare_class}</span>
          </>
        )}
      </div>

      <div style={styles.prices}>
        <div style={styles.priceBlock}>
          <span style={styles.priceLabel}>Paid</span>
          <span style={styles.priceValue}>${flight.price_paid}</span>
        </div>
        <div style={styles.priceBlock}>
          <span style={styles.priceLabel}>Current</span>
          <span
            style={{
              ...styles.priceValue,
              color: hasDrop ? "var(--green)" : "var(--text-secondary)",
            }}
          >
            {flight.current_price !== null
              ? `$${flight.current_price}`
              : "..."}
          </span>
        </div>
        {hasDrop && (
          <div className="savings-pulse" style={styles.savingsBadge}>
            {flight.claim_id
              ? `Claim: ${(flight.claim_status || "detected").replace("_", " ")}`
              : `Save $${savings!.toFixed(0)}`}
          </div>
        )}
      </div>

      <div style={styles.footer}>
        <span style={styles.footerText}>
          {flight.check_count} checks
          {flight.alert_count > 0 ? ` \u00B7 ${flight.alert_count} alerts` : ""}
        </span>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    padding: 22,
    cursor: "pointer",
  },
  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  route: {
    display: "flex",
    alignItems: "center",
    gap: 14,
  },
  airport: {
    fontSize: 24,
    fontWeight: 700,
    color: "var(--text-primary)",
    fontFamily: "var(--font-display)",
    letterSpacing: "-0.02em",
  },
  routeLine: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    opacity: 0.4,
  },
  routeDot: {
    width: 5,
    height: 5,
    borderRadius: "50%",
    background: "var(--accent)",
  },
  routeDash: {
    width: 20,
    height: 1,
    background: "var(--text-muted)",
  },
  routePlane: {
    fontSize: 12,
    color: "var(--accent)",
  },
  status: {
    padding: "3px 10px",
    borderRadius: 6,
    fontSize: 10,
    fontWeight: 700,
    textTransform: "uppercase" as const,
    fontFamily: "var(--font-body)",
    letterSpacing: "0.06em",
  },
  meta: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 13,
    color: "var(--text-secondary)",
    marginBottom: 18,
    fontFamily: "var(--font-body)",
  },
  metaItem: {},
  metaDivider: {
    width: 3,
    height: 3,
    borderRadius: "50%",
    background: "var(--text-muted)",
    flexShrink: 0,
  },
  prices: {
    display: "flex",
    alignItems: "flex-end",
    gap: 24,
    marginBottom: 16,
  },
  priceBlock: { display: "flex", flexDirection: "column", gap: 3 },
  priceLabel: {
    fontSize: 10,
    color: "var(--text-muted)",
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    fontFamily: "var(--font-body)",
    fontWeight: 600,
  },
  priceValue: {
    fontSize: 20,
    fontWeight: 600,
    color: "var(--text-primary)",
    fontFamily: "var(--font-mono)",
    letterSpacing: "-0.02em",
  },
  savingsBadge: {
    padding: "5px 14px",
    borderRadius: 100,
    background: "rgba(96, 165, 250, 0.12)",
    border: "1px solid rgba(96, 165, 250, 0.25)",
    color: "var(--accent)",
    fontSize: 13,
    fontWeight: 700,
    marginLeft: "auto",
    fontFamily: "var(--font-mono)",
    letterSpacing: "-0.01em",
  },
  footer: {
    paddingTop: 14,
    borderTop: "1px solid var(--border)",
  },
  footerText: {
    fontSize: 12,
    color: "var(--text-muted)",
    fontFamily: "var(--font-body)",
  },
};
