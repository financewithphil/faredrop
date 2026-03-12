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
      <div className="ambient-bg" />
      <div className="animate-in" style={styles.card}>
        <div style={styles.logoRow}>
          <span style={styles.plane}>&#9992;</span>
          <h1 style={styles.title}>FareDrop</h1>
        </div>
        <p style={styles.subtitle}>Never overpay for flights again</p>

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
    background: "var(--bg-base)",
    padding: 16,
    position: "relative",
  },
  card: {
    background: "var(--bg-card)",
    backdropFilter: "blur(24px) saturate(1.3)",
    WebkitBackdropFilter: "blur(24px) saturate(1.3)",
    borderRadius: 20,
    padding: "48px 36px 40px",
    textAlign: "center",
    width: "100%",
    maxWidth: 380,
    border: "1px solid var(--border)",
    position: "relative",
    zIndex: 1,
  },
  logoRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 6,
  },
  plane: {
    fontSize: 32,
    filter: "drop-shadow(0 0 8px rgba(212, 168, 83, 0.4))",
  },
  title: {
    fontSize: 32,
    fontWeight: 700,
    color: "var(--text-primary)",
    fontFamily: "var(--font-display)",
    letterSpacing: "-0.02em",
  },
  subtitle: {
    fontSize: 14,
    color: "var(--text-secondary)",
    marginBottom: 28,
    fontFamily: "var(--font-body)",
    letterSpacing: "0.02em",
  },
  tabs: {
    display: "flex",
    borderRadius: 10,
    overflow: "hidden",
    border: "1px solid var(--border)",
    marginBottom: 24,
    background: "rgba(0,0,0,0.2)",
  },
  tab: {
    flex: 1,
    padding: "10px 0",
    border: "none",
    background: "transparent",
    color: "var(--text-muted)",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "var(--font-body)",
    letterSpacing: "0.03em",
    textTransform: "uppercase" as const,
  },
  activeTab: {
    background: "var(--gold)",
    color: "#0a0c14",
  },
  form: { display: "flex", flexDirection: "column", gap: 14 },
  input: {
    padding: "13px 16px",
    borderRadius: 10,
    border: "1px solid var(--border)",
    background: "var(--bg-input)",
    color: "var(--text-primary)",
    fontSize: 14,
    fontFamily: "var(--font-body)",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  button: {
    padding: "14px 16px",
    borderRadius: 10,
    border: "none",
    background: "var(--gold)",
    color: "#0a0c14",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "var(--font-body)",
    letterSpacing: "0.03em",
    textTransform: "uppercase" as const,
    marginTop: 4,
  },
  error: {
    color: "var(--red)",
    fontSize: 13,
    marginTop: 4,
    fontFamily: "var(--font-body)",
  },
};
