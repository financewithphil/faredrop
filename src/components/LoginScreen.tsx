import { useState } from "react";
import { login, register } from "../hooks/useApi";

type Mode = "login" | "register" | "forgot" | "reset";

export function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [mode, setMode] = useState<Mode>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("reset") ? "reset" : "login";
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (mode === "register" && password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);
    try {
      if (mode === "forgot") {
        const res = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (res.ok) {
          setSuccess("Password reset link sent to your email!");
          setEmail("");
        } else {
          setError(data.error || "Something went wrong");
        }
      } else if (mode === "reset") {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("reset");
        if (!token) {
          setError("Invalid reset link");
          return;
        }
        if (password !== confirmPassword) {
          setError("Passwords don't match");
          return;
        }
        const res = await fetch("/api/auth/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, password }),
        });
        const data = await res.json();
        if (res.ok) {
          setSuccess("Password updated! You can now sign in.");
          window.history.replaceState({}, "", "/");
          setTimeout(() => setMode("login"), 1500);
        } else {
          setError(data.error || "Reset failed");
        }
      } else {
        const result =
          mode === "login"
            ? await login(email, password)
            : await register(email, password, displayName || undefined);

        if (result.ok) onLogin();
        else setError(result.error || "Something went wrong");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const switchTo = (m: Mode) => {
    setMode(m);
    setError("");
    setSuccess("");
  };

  return (
    <div style={styles.container}>
      <div className="sky-bg" />
      <div className="sky-trail" />
      <div className="animate-in" style={styles.card}>
        <div style={styles.logoRow}>
          <span style={styles.plane}>&#9992;&#65039;</span>
          <h1 style={styles.title}>FareDrop</h1>
        </div>
        <p style={styles.subtitle}>
          {mode === "forgot"
            ? "Reset your password"
            : mode === "reset"
              ? "Choose a new password"
              : "Never overpay for flights again"}
        </p>

        {(mode === "login" || mode === "register") && (
          <div style={styles.tabs}>
            <button
              onClick={() => switchTo("login")}
              style={{
                ...styles.tab,
                ...(mode === "login" ? styles.activeTab : {}),
              }}
            >
              Sign In
            </button>
            <button
              onClick={() => switchTo("register")}
              style={{
                ...styles.tab,
                ...(mode === "register" ? styles.activeTab : {}),
              }}
            >
              Create Account
            </button>
          </div>
        )}

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
          {(mode === "login" || mode === "register" || mode === "forgot") && (
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              autoFocus
              required
            />
          )}
          {mode !== "forgot" && (
            <input
              type="password"
              placeholder={mode === "reset" ? "New Password" : "Password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
              minLength={6}
            />
          )}
          {(mode === "register" || mode === "reset") && (
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
                : mode === "register"
                  ? "Create Account"
                  : mode === "forgot"
                    ? "Send Reset Link"
                    : "Set New Password"}
          </button>
          {error && <p style={styles.error}>{error}</p>}
          {success && <p style={styles.success}>{success}</p>}
        </form>

        {mode === "login" && (
          <button
            onClick={() => switchTo("forgot")}
            style={styles.forgotLink}
          >
            Forgot your password?
          </button>
        )}
        {(mode === "forgot" || mode === "reset") && (
          <button
            onClick={() => switchTo("login")}
            style={styles.forgotLink}
          >
            Back to Sign In
          </button>
        )}
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
    padding: "48px 36px 36px",
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
    fontSize: 36,
    lineHeight: 1,
    filter: "drop-shadow(0 0 10px rgba(96, 165, 250, 0.4))",
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
    background: "var(--accent)",
    color: "#fff",
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
    background: "var(--accent)",
    color: "#fff",
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
  success: {
    color: "var(--green)",
    fontSize: 13,
    marginTop: 4,
    fontFamily: "var(--font-body)",
  },
  forgotLink: {
    background: "none",
    border: "none",
    color: "var(--accent-bright)",
    fontSize: 13,
    cursor: "pointer",
    fontFamily: "var(--font-body)",
    marginTop: 16,
    padding: 0,
    textDecoration: "underline",
    textUnderlineOffset: 3,
  },
};
