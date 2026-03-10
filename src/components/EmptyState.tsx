export function EmptyState() {
  return (
    <div style={styles.container}>
      <div style={styles.icon}>&#9992;</div>
      <h2 style={styles.title}>No flights tracked yet</h2>
      <p style={styles.text}>
        Forward your booking confirmation email to start tracking price drops.
      </p>
      <div style={styles.steps}>
        <div style={styles.step}>
          <span style={styles.num}>1</span>
          <span>Find your booking confirmation email</span>
        </div>
        <div style={styles.step}>
          <span style={styles.num}>2</span>
          <span>Forward it to the webhook endpoint</span>
        </div>
        <div style={styles.step}>
          <span style={styles.num}>3</span>
          <span>We monitor prices and alert you on drops</span>
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
  text: { fontSize: 15, color: "#94a3b8", maxWidth: 400, lineHeight: 1.6 },
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
