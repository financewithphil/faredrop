import { useState } from "react";
import { isLoggedIn } from "./hooks/useApi";
import { LoginScreen } from "./components/LoginScreen";
import { Header } from "./components/Header";
import { Dashboard } from "./pages/Dashboard";
import { FlightDetail } from "./pages/FlightDetail";
import { ClaimAssistant } from "./pages/ClaimAssistant";
import { BaggageClaimForm } from "./pages/BaggageClaimForm";
import { BaggageClaimAssistant } from "./pages/BaggageClaimAssistant";

type View = "dashboard" | "flight" | "claim" | "baggage_form" | "baggage_claim";

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
      <div className="sky-bg" />
      <div className="sky-trail" />
      <Header onLogout={() => setLoggedIn(false)} />
      <main style={styles.main}>
        {view === "baggage_claim" && selectedId ? (
          <BaggageClaimAssistant claimId={selectedId} onBack={goToDashboard} />
        ) : view === "baggage_form" ? (
          <BaggageClaimForm
            onCreated={(claimId) => {
              setSelectedId(claimId);
              setView("baggage_claim");
            }}
            onBack={goToDashboard}
          />
        ) : view === "claim" && selectedId ? (
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
            onBaggageClaim={() => setView("baggage_form")}
            onOpenBaggageClaim={(id) => {
              setSelectedId(id);
              setView("baggage_claim");
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
    background: "var(--bg-base)",
    color: "var(--text-primary)",
    position: "relative",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
};
