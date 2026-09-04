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
import { useTheme } from "next-themes";
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
  const { resolvedTheme, setTheme } = useTheme();
  const dark = resolvedTheme === "dark";
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

  return (
    <div className="min-h-screen bg-background text-foreground">
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
          "fixed left-0 top-0 z-50 flex h-screen flex-col border-r bg-card transition-all duration-150",
          collapsed ? "w-[72px]" : "w-[260px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          {!collapsed && (
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-[13px] font-semibold text-primary-foreground">
                BD
              </div>
              <span className="text-[15px] font-semibold tracking-tight">Bangladesh</span>
            </Link>
          )}
          {collapsed && (
            <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-md bg-primary text-[13px] font-semibold text-primary-foreground">
              BD
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            aria-label="Toggle sidebar"
            className="hidden rounded-md p-1.5 text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground lg:flex"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Role badge */}
        {!collapsed && (
          <div className="border-b px-4 py-3">
            <div className="flex items-center gap-2 rounded-md border border-primary/20 bg-primary/[0.07] px-3 py-2">
              <RoleIcon size={14} className="text-primary" />
              <span className="text-xs font-medium text-primary">
                {roleLabel}
              </span>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {!collapsed && (
            <p className="px-3 pb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              {isSuperAdmin ? "Registry" : "Workspace"}
            </p>
          )}
          {links.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "relative flex h-9 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors duration-150",
                  isActive
                    ? "bg-primary/[0.08] text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  collapsed && "justify-center px-2"
                )}
                title={collapsed ? link.label : undefined}
              >
                {isActive && !collapsed && (
                  <span className="absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-full bg-primary" />
                )}
                {link.icon}
                {!collapsed && <span>{link.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="space-y-1 border-t p-3">
          <button
            onClick={() => setTheme(dark ? "light" : "dark")}
            className={cn(
              "flex h-9 w-full items-center gap-3 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground",
              collapsed && "justify-center px-2"
            )}
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
            {!collapsed && <span>{dark ? "Light Mode" : "Dark Mode"}</span>}
          </button>
          <button
            onClick={handleLogout}
            className={cn(
              "flex h-9 w-full items-center gap-3 rounded-md px-3 text-sm font-medium text-destructive transition-colors duration-150 hover:bg-destructive/10",
              collapsed && "justify-center px-2"
            )}
          >
            <LogOut size={18} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className={cn("transition-all duration-150", collapsed ? "lg:ml-[72px]" : "lg:ml-[260px]")}>
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/90 px-4 backdrop-blur-sm sm:px-6">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:hidden"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="hidden lg:block">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              {roleLabel} · Civil Registry
            </p>
          </div>
          <div className="flex min-w-0 items-center gap-3">
            <div className="hidden min-w-0 min-[400px]:block">
              <p className="truncate text-sm font-medium leading-tight">{user?.name}</p>
              <p className="truncate text-xs tabular text-muted-foreground">{user?.email}</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
              <span className="text-sm font-medium text-primary">
                {user?.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="mx-auto w-full max-w-[1200px] p-4 sm:p-6 lg:p-8">
          <div key={location.pathname} className="animate-enter">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
