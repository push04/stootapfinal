import { useEffect, useState, ReactNode } from "react";
import { useLocation } from "wouter";
import { getCurrentSession, isAdmin } from "@/lib/auth-service";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface AdminRouteProps {
  children: ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      // Check admin status from server (handles both cookie-based and Supabase auth)
      const response = await fetch("/api/admin/check", {
        credentials: "include", // Include cookies
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.isAdmin) {
          setIsAuthorized(true);
          setIsLoading(false);
          return;
        }
      }
    } catch (err) {
      console.error("Admin check failed:", err);
    }

    // Not authorized - redirect to login
    toast({
      title: "Authentication Required",
      description: "Please log in to access the admin area.",
      variant: "destructive",
    });
    
    // Remember the intended page for redirect after login
    const nextUrl = location !== '/admin/login' ? encodeURIComponent(location) : '';
    setLocation(`/admin/login${nextUrl ? `?next=${nextUrl}` : ''}`);
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
