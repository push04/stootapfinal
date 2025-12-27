import { useEffect, useState, ReactNode } from "react";
import { useLocation } from "wouter";
import { getCurrentSession } from "@/lib/auth-service";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({ children, redirectTo = "/login" }: ProtectedRouteProps) {
  const [location, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { session } = await getCurrentSession();
    
    if (!session) {
      const returnUrl = encodeURIComponent(location);
      setLocation(`${redirectTo}?returnUrl=${returnUrl}`);
    } else {
      setIsAuthenticated(true);
    }
    
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
}
