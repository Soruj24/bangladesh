import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-sm text-center">
        <div className="mb-5 inline-flex rounded-full bg-destructive/10 p-3.5">
          <AlertTriangle className="h-6 w-6 text-destructive" />
        </div>
        <h1 className="mb-2 text-xl font-semibold tracking-tight">Something went wrong</h1>
        <p className="mb-6 text-sm leading-6 text-muted-foreground">
          We encountered an unexpected error. Please try again later or go back to the previous page.
        </p>
        <Button onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    </div>
  );
};

export default ErrorPage;
