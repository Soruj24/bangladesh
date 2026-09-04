import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "@/app/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, Fingerprint, KeyRound, Plus, Globe, MapPin, ChevronRight } from "lucide-react";

const workspaceLinks = [
  {
    to: "/dashboard/super-admin/create",
    icon: Plus,
    title: "Create items",
    description: "Add divisions, districts, upazilas, unions and villages.",
  },
  {
    to: "/dashboard/super-admin/divisions",
    icon: Globe,
    title: "Divisions",
    description: "Edit or remove top-level regions.",
  },
  {
    to: "/dashboard/super-admin/districts",
    icon: MapPin,
    title: "Districts",
    description: "Edit or remove second-level regions.",
  },
];

const SuperAdminProfile = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) {
    return (
      <div className="space-y-5">
        <div>
          <p className="eyebrow">Administration</p>
          <h1 className="page-title">Profile</h1>
          <p className="page-sub">Your account and access</p>
        </div>
        <Card className="border bg-card shadow-none">
          <CardContent className="flex flex-col items-center justify-center px-5 py-14 text-center">
            <div className="mb-4 rounded-full bg-muted p-3.5">
              <Crown className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
            </div>
            <h2 className="section-title">No profile found</h2>
            <p className="mb-5 mt-1 max-w-sm text-sm text-muted-foreground">
              Your session may have expired. Sign in again to view your profile.
            </p>
            <Button asChild variant="outline" size="sm">
              <Link to="/sign-in">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-5">
      <div>
        <p className="eyebrow">Administration</p>
        <h1 className="page-title">Profile</h1>
        <p className="page-sub">Your account and access</p>
      </div>

      {/* Credential */}
      <Card className="border bg-card shadow-none">
        <CardContent className="p-5 sm:p-6">
          <div className="flex items-center gap-4">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
              aria-hidden="true"
            >
              <span className="text-xl font-semibold">
                {user.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p className="truncate text-lg font-semibold tracking-tight">
                {user.name}
              </p>
              <p className="truncate text-sm text-muted-foreground" title={user.email}>
                {user.email}
              </p>
              <Badge variant="success" className="mt-1.5">
                <Crown className="h-3 w-3" aria-hidden="true" /> Super Admin
              </Badge>
            </div>
          </div>

          <div className="mt-5 divide-y divide-border border-t">
            <div className="ledger-row">
              <Fingerprint className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">User ID</p>
                <p className="truncate text-sm font-medium tabular" title={user.id}>
                  {user.id}
                </p>
              </div>
            </div>
            <div className="ledger-row">
              <KeyRound className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <div>
                <p className="text-xs text-muted-foreground">Access</p>
                <p className="text-sm font-medium">
                  Full control over geography, records and roles.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workspace */}
      <Card className="overflow-hidden border bg-card shadow-none">
        <CardHeader className="p-5 pb-3">
          <CardTitle className="section-title">Workspace</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y divide-border">
            {workspaceLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="flex items-center gap-3 px-5 py-3.5 transition-colors duration-150 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-ring"
                >
                  <span className="rounded-md bg-primary/10 p-2 text-primary" aria-hidden="true">
                    <link.icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{link.title}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {link.description}
                    </span>
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuperAdminProfile;
