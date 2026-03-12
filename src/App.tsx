import { useState } from "react";
import { isLoggedIn } from "./hooks/useApi";
import { LoginScreen } from "./components/LoginScreen";
import { Header } from "./components/Header";
import { Dashboard } from "./pages/Dashboard";
import { FlightDetail } from "./pages/FlightDetail";
import { ClaimAssistant } from "./pages/ClaimAssistant";

type View = "dashboard" | "flight" | "claim";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(isLoggedIn);
  const [view, setView] = useState<View>("dashboard");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (!loggedIn) {
    return <LoginScreen onLogin={() => setLoggedIn(true)} />;
  }

  const goToDashboard = () => {
    setView("dashboard");
    setSelectedId(null);
  };

  return (
    <div style={styles.layout}>
      <Header onLogout={() => setLoggedIn(false)} />
      <main style={styles.main}>
        {view === "claim" && selectedId ? (
          <ClaimAssistant claimId={selectedId} onBack={goToDashboard} />
        ) : view === "flight" && selectedId ? (
          <FlightDetail
            flightId={selectedId}
            onBack={goToDashboard}
            onOpenClaim={(claimId) => {
              setSelectedId(claimId);
              setView("claim");
            }}
          />
        ) : (
          <Dashboard
            onSelect={(id) => {
              setSelectedId(id);
              setView("flight");
            }}
          />
        )}
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  layout: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "#0f172a",
    color: "#f1f5f9",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
};
