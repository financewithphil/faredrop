import { useState } from "react";
import { login, register } from "../hooks/useApi";

export function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (mode === "register" && password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);
    try {
      const result =
        mode === "login"
          ? await login(email, password)
          : await register(email, password, displayName || undefined);

      if (result.ok) onLogin();
      else setError(result.error || "Something went wrong");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.icon}>&#9992;</div>
        <h1 style={styles.title}>FareDrop</h1>
        <p style={styles.subtitle}>Flight price drop alerts</p>

        <div style={styles.tabs}>
          <button
            onClick={() => { setMode("login"); setError(""); }}
            style={{
              ...styles.tab,
              ...(mode === "login" ? styles.activeTab : {}),
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => { setMode("register"); setError(""); }}
            style={{
              ...styles.tab,
              ...(mode === "register" ? styles.activeTab : {}),
            }}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {mode === "register" && (
            <input
              type="text"
              placeholder="Display Name (optional)"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              style={styles.input}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            autoFocus
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
            minLength={6}
          />
          {mode === "register" && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={styles.input}
              required
              minLength={6}
            />
          )}
          <button type="submit" disabled={loading} style={styles.button}>
            {loading
              ? "..."
              : mode === "login"
                ? "Sign In"
                : "Create Account"}
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
  subtitle: { fontSize: 14, color: "#94a3b8", marginBottom: 20 },
  tabs: {
    display: "flex",
    borderRadius: 8,
    overflow: "hidden",
    border: "1px solid #334155",
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    padding: "8px 0",
    border: "none",
    background: "transparent",
    color: "#64748b",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  },
  activeTab: {
    background: "#2563eb",
    color: "#fff",
  },
  form: { display: "flex", flexDirection: "column", gap: 12 },
  input: {
    padding: "12px 16px",
    borderRadius: 8,
    border: "1px solid #334155",
    background: "#0f172a",
    color: "#f1f5f9",
    fontSize: 15,
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
