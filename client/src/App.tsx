import { Outlet } from "react-router-dom";
import PublicNavbar from "./layout/PublicNavbar";
import AuthInitializer from "./components/AuthInitializer";

function App() {
  return (
    <AuthInitializer>
      <div className="min-h-screen bg-background text-foreground">
        <PublicNavbar />
        <Outlet />
      </div>
    </AuthInitializer>
  );
}

export default App;
