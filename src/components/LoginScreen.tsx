import { useState } from "react";
import { login } from "../hooks/useApi";

export function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const ok = await login(pin);
    if (ok) onLogin();
    else setError("Invalid PIN");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.icon}>&#9992;</div>
        <h1 style={styles.title}>FareDrop</h1>
        <p style={styles.subtitle}>Flight price drop alerts</p>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="password"
            placeholder="Enter PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            style={styles.input}
            autoFocus
          />
          <button type="submit" style={styles.button}>
            Sign In
          </button>
          {error && <p style={styles.error}>{error}</p>}
        </form>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)",
    padding: 16,
  },
  card: {
    background: "#1e293b",
    borderRadius: 16,
    padding: 40,
    textAlign: "center",
    width: "100%",
    maxWidth: 360,
  },
  icon: { fontSize: 48, marginBottom: 8 },
  title: { fontSize: 28, fontWeight: 700, color: "#f1f5f9", marginBottom: 4 },
  subtitle: { fontSize: 14, color: "#94a3b8", marginBottom: 24 },
  form: { display: "flex", flexDirection: "column", gap: 12 },
  input: {
    padding: "12px 16px",
    borderRadius: 8,
    border: "1px solid #334155",
    background: "#0f172a",
    color: "#f1f5f9",
    fontSize: 16,
    textAlign: "center",
    outline: "none",
  },
  button: {
    padding: "12px 16px",
    borderRadius: 8,
    border: "none",
    background: "#2563eb",
    color: "#fff",
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
  },
  error: { color: "#ef4444", fontSize: 14, marginTop: 4 },
};
