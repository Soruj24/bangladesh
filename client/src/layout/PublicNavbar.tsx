import { Link } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import { useSelector } from "react-redux";
import { useTheme } from "next-themes";
import { RootState } from "@/app/store";
import { Button } from "@/components/ui/button";

const PublicNavbar = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const dark = resolvedTheme === "dark";
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <nav className="sticky top-0 z-50 h-16 border-b bg-background/90 backdrop-blur-sm">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-[13px] font-semibold tracking-tight text-primary-foreground">
            BD
          </div>
          <span className="truncate text-[15px] font-semibold tracking-tight">
            Bangladesh <span className="hidden font-normal text-muted-foreground min-[400px]:inline">Registry</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={() => setTheme(dark ? "light" : "dark")}
            className="h-9 w-9 text-muted-foreground"
          >
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </Button>
          {user ? (
            <Button asChild size="sm" className="h-9 px-4">
              <Link
                to={user.isSuperAdmin ? "/dashboard/super-admin/profile" : "/dashboard/admin/profile"}
              >
                Dashboard
              </Link>
            </Button>
          ) : (
            <Button asChild size="sm" className="h-9 px-4">
              <Link to="/sign-in">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar;
