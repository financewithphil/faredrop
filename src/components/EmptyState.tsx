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
      <div style={styles.icon}>&#9992;</div>
      <h2 style={styles.title}>No flights tracked yet</h2>
      <p style={styles.text}>
        Forward your booking confirmation email to start tracking price drops,
        or paste the email text below.
      </p>

      <div style={styles.emailBox}>
        <p style={styles.emailLabel}>Forward booking emails to:</p>
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

      <div style={styles.steps}>
        <div style={styles.step}>
          <span style={styles.num}>1</span>
          <span>Find your booking confirmation email from the airline</span>
        </div>
        <div style={styles.step}>
          <span style={styles.num}>2</span>
          <span>
            Forward it to{" "}
            <strong style={{ color: "#60a5fa" }}>{FORWARD_EMAIL}</strong>
          </span>
        </div>
        <div style={styles.step}>
          <span style={styles.num}>3</span>
          <span>We'll parse it, monitor prices 3x daily, and alert you on drops</span>
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
  icon: { fontSize: 56, marginBottom: 12 },
  title: { fontSize: 22, fontWeight: 700, color: "#e2e8f0", marginBottom: 8 },
  text: { fontSize: 15, color: "#94a3b8", maxWidth: 420, lineHeight: 1.6 },
  emailBox: {
    marginTop: 24,
    background: "#1e293b",
    border: "1px solid #334155",
    borderRadius: 12,
    padding: 16,
    width: "100%",
    maxWidth: 420,
  },
  emailLabel: { fontSize: 12, color: "#64748b", marginBottom: 8, textTransform: "uppercase" as const, letterSpacing: 0.5 },
  emailRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "#0f172a",
    borderRadius: 8,
    padding: "10px 12px",
    border: "1px solid #334155",
  },
  emailAddress: {
    flex: 1,
    fontSize: 15,
    fontWeight: 600,
    color: "#60a5fa",
    wordBreak: "break-all" as const,
    textAlign: "left",
  },
  copyBtn: {
    padding: "6px 14px",
    borderRadius: 6,
    border: "none",
    background: "#2563eb",
    color: "#fff",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    flexShrink: 0,
  },
  emailNote: { fontSize: 12, color: "#64748b", marginTop: 8 },
  steps: {
    marginTop: 28,
    display: "flex",
    flexDirection: "column",
    gap: 12,
    textAlign: "left",
  },
  step: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    color: "#cbd5e1",
    fontSize: 14,
  },
  num: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    background: "#1e40af",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 13,
    fontWeight: 600,
    flexShrink: 0,
  },
};
