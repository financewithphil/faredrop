import { logout, getUser } from "../hooks/useApi";

export function Header({ onLogout }: { onLogout: () => void }) {
  const user = getUser();

  return (
    <header style={styles.header}>
      <div style={styles.left}>
        <span style={styles.plane}>&#9992;&#65039;</span>
        <span style={styles.title}>FareDrop</span>
      </div>
      <div style={styles.right}>
        {user && (
          <span style={styles.email}>{user.displayName || user.email}</span>
        )}
        <button
          onClick={() => {
            logout();
            onLogout();
          }}
          style={styles.logout}
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 24px",
    background: "rgba(11, 17, 32, 0.85)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    borderBottom: "1px solid var(--border)",
    position: "sticky",
    top: 0,
    zIndex: 50,
  },
  left: { display: "flex", alignItems: "center", gap: 10 },
  plane: {
    fontSize: 32,
    lineHeight: 1,
    filter: "drop-shadow(0 0 8px rgba(96, 165, 250, 0.3))",
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    color: "var(--accent)",
    fontFamily: "var(--font-display)",
    letterSpacing: "-0.01em",
  },
  right: { display: "flex", alignItems: "center", gap: 14 },
  email: {
    fontSize: 13,
    color: "var(--text-secondary)",
    fontFamily: "var(--font-body)",
  },
  logout: {
    padding: "6px 16px",
    borderRadius: 8,
    border: "1px solid var(--border)",
    background: "transparent",
    color: "var(--text-secondary)",
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "var(--font-body)",
    letterSpacing: "0.04em",
    textTransform: "uppercase" as const,
  },
};
