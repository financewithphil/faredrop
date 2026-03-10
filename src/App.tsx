import { useState } from "react";
import { isLoggedIn } from "./hooks/useApi";
import { LoginScreen } from "./components/LoginScreen";
import { Header } from "./components/Header";
import { Dashboard } from "./pages/Dashboard";
import { FlightDetail } from "./pages/FlightDetail";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(isLoggedIn);
  const [selectedFlight, setSelectedFlight] = useState<string | null>(null);

  if (!loggedIn) {
    return <LoginScreen onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <div style={styles.layout}>
      <Header onLogout={() => setLoggedIn(false)} />
      <main style={styles.main}>
        {selectedFlight ? (
          <FlightDetail
            flightId={selectedFlight}
            onBack={() => setSelectedFlight(null)}
          />
        ) : (
          <Dashboard onSelect={(id) => setSelectedFlight(id)} />
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
