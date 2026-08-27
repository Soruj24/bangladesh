import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 px-4">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/20 mb-6">
          <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Something went wrong</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          We encountered an unexpected error. Please try again later or go back to the previous page.
        </p>
        <Button onClick={() => navigate(-1)} className="bg-emerald-600 hover:bg-emerald-700">
          Go Back
        </Button>
      </div>
    </div>
  );
};

export default ErrorPage;
