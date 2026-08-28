import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/features/userSlice";
import { useLogoutUserMutation } from "@/services/userApi";
import { RootState } from "@/app/store";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Map,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  Shield,
  Crown,
  Globe,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavLink {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const adminLinks: NavLink[] = [
  { label: "Dashboard", href: "/dashboard/admin/profile", icon: <LayoutDashboard size={18} /> },
  { label: "All Users", href: "/dashboard/admin/users", icon: <Users size={18} /> },
  { label: "Add Population", href: "/dashboard/admin/add-admin-users", icon: <UserPlus size={18} /> },
  { label: "Manage Users", href: "/dashboard/admin/all-users", icon: <Users size={18} /> },
];

const superAdminLinks: NavLink[] = [
  { label: "Dashboard", href: "/dashboard/super-admin/profile", icon: <LayoutDashboard size={18} /> },
  { label: "Profile", href: "/dashboard/super-admin/super-profile", icon: <Crown size={18} /> },
  { label: "Create Items", href: "/dashboard/super-admin/create", icon: <UserPlus size={18} /> },
  { label: "Divisions", href: "/dashboard/super-admin/divisions", icon: <Globe size={18} /> },
  { label: "Districts", href: "/dashboard/super-admin/districts", icon: <MapPin size={18} /> },
  { label: "Upazilas", href: "/dashboard/super-admin/upazilas", icon: <Map size={18} /> },
  { label: "Unions", href: "/dashboard/super-admin/unions", icon: <Map size={18} /> },
  { label: "Villages", href: "/dashboard/super-admin/villages", icon: <Map size={18} /> },
];

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    () => window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logoutUser] = useLogoutUserMutation();
  const user = useSelector((state: RootState) => state.auth.user);

  const isSuperAdmin = user?.isSuperAdmin;
  const isAdmin = user?.isAdmin;
  const links = isSuperAdmin ? superAdminLinks : adminLinks;
  const roleLabel = isSuperAdmin ? "Super Admin" : isAdmin ? "Admin" : "User";
  const RoleIcon = isSuperAdmin ? Crown : Shield;

  const handleLogout = async () => {
    await logoutUser({});
    dispatch(logout());
    navigate("/sign-in");
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark", !darkMode);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 flex flex-col",
          collapsed ? "w-[68px]" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
          {!collapsed && (
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                BD
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">Bangladesh</span>
            </Link>
          )}
          {collapsed && (
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-sm mx-auto">
              BD
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Role badge */}
        {!collapsed && (
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
              <RoleIcon size={14} className="text-emerald-600" />
              <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                {roleLabel}
              </span>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800",
                  collapsed && "justify-center px-2"
                )}
                title={collapsed ? link.label : undefined}
              >
                {link.icon}
                {!collapsed && <span>{link.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-800 space-y-1">
          <button
            onClick={toggleDarkMode}
            className={cn(
              "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors",
              collapsed && "justify-center px-2"
            )}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            {!collapsed && <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>}
          </button>
          <button
            onClick={handleLogout}
            className={cn(
              "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors",
              collapsed && "justify-center px-2"
            )}
          >
            <LogOut size={18} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className={cn("transition-all duration-300", collapsed ? "lg:ml-[68px]" : "lg:ml-64")}>
        {/* Top bar */}
        <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                {user?.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
