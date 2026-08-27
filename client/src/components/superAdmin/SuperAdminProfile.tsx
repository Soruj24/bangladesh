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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Your account information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 border-0 shadow-sm dark:bg-gray-900/50">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
                <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{user?.name}</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1">{user?.email}</p>
              <Badge className="mt-3 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                <Crown className="h-3 w-3 mr-1" /> Super Admin
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-0 shadow-sm dark:bg-gray-900/50">
          <CardHeader>
            <CardTitle className="text-lg">Account Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <User className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
                <p className="font-medium text-gray-900 dark:text-white">{user?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email Address</p>
                <p className="font-medium text-gray-900 dark:text-white">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <Crown className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Role</p>
                <p className="font-medium text-gray-900 dark:text-white">Super Administrator</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SuperAdminProfile;
