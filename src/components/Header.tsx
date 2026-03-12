import { logout, getUser } from "../hooks/useApi";

export function Header({ onLogout }: { onLogout: () => void }) {
  const user = getUser();

  return (
    <header style={styles.header}>
      <div style={styles.left}>
        <span style={styles.icon}>&#9992;</span>
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
          Logout
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
    padding: "12px 20px",
    background: "#0f172a",
    borderBottom: "1px solid #1e293b",
  },
  left: { display: "flex", alignItems: "center", gap: 8 },
  icon: { fontSize: 22 },
  title: { fontSize: 18, fontWeight: 700, color: "#f1f5f9" },
  right: { display: "flex", alignItems: "center", gap: 12 },
  email: { fontSize: 13, color: "#64748b" },
  logout: {
    padding: "6px 14px",
    borderRadius: 6,
    border: "1px solid #334155",
    background: "transparent",
    color: "#94a3b8",
    fontSize: 13,
    cursor: "pointer",
  },
};
