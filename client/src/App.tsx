import { Outlet } from "react-router-dom";
import PublicNavbar from "./layout/PublicNavbar";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <PublicNavbar />
      <Outlet />
    </div>
  );
}

export default App;
