import { useState } from "react";

const FORWARD_EMAIL = "track@faresaver.financewithphil.com";

export function EmptyState() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(FORWARD_EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={styles.container}>
      <div className="animate-in" style={styles.inner}>
        <div style={styles.icon}>&#9992;</div>
        <h2 style={styles.title}>No flights tracked yet</h2>
        <p style={styles.text}>
          Forward your booking confirmation email to start tracking price drops,
          or paste the email text below.
        </p>

        <div className="glass-card-static animate-in animate-in-2" style={styles.emailBox}>
          <p style={styles.emailLabel}>Forward booking emails to</p>
          <div style={styles.emailRow}>
            <span style={styles.emailAddress}>{FORWARD_EMAIL}</span>
            <button onClick={handleCopy} style={styles.copyBtn}>
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <p style={styles.emailNote}>
            Use the same email address you registered with so we can link it to your account.
          </p>
        </div>

        <div className="animate-in animate-in-3" style={styles.steps}>
          {[
            "Find your booking confirmation email from the airline",
            <>Forward it to <strong style={{ color: "var(--gold)" }}>{FORWARD_EMAIL}</strong></>,
            "We'll parse it, monitor prices 3x daily, and alert you on drops",
          ].map((text, i) => (
            <div key={i} style={styles.step}>
              <span style={styles.num}>{i + 1}</span>
              <span style={styles.stepText}>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    textAlign: "center",
  },
  inner: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    maxWidth: 460,
  },
  icon: {
    fontSize: 52,
    marginBottom: 16,
    filter: "drop-shadow(0 0 12px rgba(212, 168, 83, 0.3))",
  },
  title: {
    fontSize: 26,
    fontWeight: 700,
    color: "var(--text-primary)",
    marginBottom: 10,
    fontFamily: "var(--font-display)",
    letterSpacing: "-0.02em",
  },
  text: {
    fontSize: 15,
    color: "var(--text-secondary)",
    lineHeight: 1.7,
    fontFamily: "var(--font-body)",
  },
  emailBox: {
    marginTop: 28,
    padding: 20,
    width: "100%",
  },
  emailLabel: {
    fontSize: 11,
    color: "var(--text-muted)",
    marginBottom: 10,
    textTransform: "uppercase" as const,
    letterSpacing: "0.1em",
    fontWeight: 600,
    fontFamily: "var(--font-body)",
  },
  emailRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "var(--bg-input)",
    borderRadius: 10,
    padding: "12px 14px",
    border: "1px solid var(--border-accent)",
  },
  emailAddress: {
    flex: 1,
    fontSize: 14,
    fontWeight: 600,
    color: "var(--gold)",
    wordBreak: "break-all" as const,
    textAlign: "left",
    fontFamily: "var(--font-mono)",
    letterSpacing: "-0.02em",
  },
  copyBtn: {
    padding: "7px 16px",
    borderRadius: 8,
    border: "none",
    background: "var(--gold)",
    color: "#0a0c14",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
    flexShrink: 0,
    fontFamily: "var(--font-body)",
    letterSpacing: "0.04em",
    textTransform: "uppercase" as const,
  },
  emailNote: {
    fontSize: 12,
    color: "var(--text-muted)",
    marginTop: 10,
    fontFamily: "var(--font-body)",
  },
  steps: {
    marginTop: 32,
    display: "flex",
    flexDirection: "column",
    gap: 16,
    textAlign: "left",
    width: "100%",
  },
  step: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    color: "var(--text-secondary)",
    fontSize: 14,
    fontFamily: "var(--font-body)",
    lineHeight: 1.5,
  },
  stepText: {
    flex: 1,
  },
  num: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    background: "rgba(212, 168, 83, 0.12)",
    border: "1px solid rgba(212, 168, 83, 0.25)",
    color: "var(--gold)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 13,
    fontWeight: 700,
    flexShrink: 0,
    fontFamily: "var(--font-mono)",
  },
};
