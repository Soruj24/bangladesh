import { Outlet, useLocation } from "react-router-dom";
import PublicNavbar from "./layout/PublicNavbar";
import AuthInitializer from "./components/AuthInitializer";

function App() {
  const location = useLocation();
  return (
    <AuthInitializer>
      <div className="min-h-screen bg-background text-foreground">
        <PublicNavbar />
        <div key={location.pathname} className="animate-enter">
          <Outlet />
        </div>
      </div>
    </AuthInitializer>
  );
}

export default App;
