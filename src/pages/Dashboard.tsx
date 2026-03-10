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
}

export function Dashboard({
  onSelect,
}: {
  onSelect: (id: string) => void;
}) {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);

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

  if (loading) {
    return (
      <div style={styles.loading}>Loading flights...</div>
    );
  }

  if (flights.length === 0) {
    return <EmptyState />;
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
        <button
          onClick={handleCheckNow}
          disabled={checking}
          style={styles.checkBtn}
        >
          {checking ? "Checking..." : "Check Prices Now"}
        </button>
      </div>
      <div style={styles.grid}>
        {flights.map((f) => (
          <FlightCard key={f.id} flight={f} onClick={() => onSelect(f.id)} />
        ))}
      </div>
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
};
