import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Mail, User } from "lucide-react";

const SuperAdminProfile = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">Administration</p>
        <h1 className="page-title">Profile</h1>
        <p className="page-sub">Your account information</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <span className="text-xl font-semibold">
            {user?.name?.charAt(0)?.toUpperCase()}
          </span>
        </div>
        <div className="min-w-0">
          <h2 className="truncate text-lg font-semibold tracking-tight text-foreground">{user?.name}</h2>
          <p className="truncate text-sm tabular text-muted-foreground">{user?.email}</p>
          <Badge variant="success" className="mt-1.5">
            <Crown className="mr-1 h-3 w-3" /> Super Admin
          </Badge>
        </div>
      </div>

      <Card className="border bg-card shadow-none">
        <CardHeader className="p-5 pb-3">
          <CardTitle className="section-title">Account Details</CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-5 pt-0">
          <div className="divide-y divide-border">
            <div className="ledger-row">
              <User className="h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Full Name</p>
                <p className="truncate text-sm font-medium text-foreground">{user?.name}</p>
              </div>
            </div>
            <div className="ledger-row">
              <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Email Address</p>
                <p className="truncate text-sm font-medium tabular text-foreground">{user?.email}</p>
              </div>
            </div>
            <div className="ledger-row">
              <Crown className="h-4 w-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Role</p>
                <p className="text-sm font-medium text-foreground">Super Administrator</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuperAdminProfile;
