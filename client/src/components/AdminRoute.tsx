import { useEffect, useState, ReactNode } from "react";
import { useLocation } from "wouter";
import { getCurrentSession, isAdmin } from "@/lib/auth-service";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface AdminRouteProps {
  children: ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    // Check for hardcoded admin session first
    const adminAuth = sessionStorage.getItem("adminAuth");
    if (adminAuth === "true") {
      setIsAuthorized(true);
      setIsLoading(false);
      return;
    }

    // Check Supabase session
    const { session } = await getCurrentSession();
    
    if (!session) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access this page.",
        variant: "destructive",
      });
      setLocation("/admin/login");
      return;
    }

    const adminStatus = await isAdmin();
    
    if (!adminStatus) {
      toast({
        title: "Access Denied",
        description: "You do not have permission to access the admin area.",
        variant: "destructive",
      });
      setLocation("/profile");
      return;
    }

    setIsAuthorized(true);
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return isAuthorized ? <>{children}</> : null;
}
