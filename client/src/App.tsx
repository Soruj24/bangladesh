import { Outlet } from "react-router-dom";
import PublicNavbar from "./layout/PublicNavbar";
import AuthInitializer from "./components/AuthInitializer";

function App() {
  return (
    <AuthInitializer>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <PublicNavbar />
        <Outlet />
      </div>
    </AuthInitializer>
  );
}

export default App;
