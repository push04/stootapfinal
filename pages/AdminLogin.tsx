import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, Shield, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { signIn, getCurrentSession, isAdmin } from "@/lib/auth-service";
import { useToast } from "@/hooks/use-toast";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    checkExistingAuth();
  }, []);

  const getNextUrl = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('next') || '/admin/dashboard';
  };

  const checkExistingAuth = async () => {
    try {
      const response = await fetch("/api/admin/check", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        if (data.isAdmin) {
          setLocation(getNextUrl());
        }
      }
    } catch (err) {
      // Not logged in, stay on login page
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please enter both username/email and password");
      setLoading(false);
      return;
    }

    // Try server-side admin login first (handles both hardcoded and Supabase)
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password }),
        credentials: "include", // Important: include cookies
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Welcome back, Admin",
          description: "You have been logged in successfully.",
        });
        setLocation(getNextUrl());
        setLoading(false);
        return;
      }
    } catch (err) {
      console.error("Admin login failed:", err);
    }

    // Fall back to Supabase authentication
    const result = await signIn(email, password);

    if (result.success && result.session) {
      const adminStatus = await isAdmin();
      
      if (adminStatus) {
        toast({
          title: "Welcome back, Admin",
          description: "You have been logged in successfully.",
        });
        setLocation(getNextUrl());
      } else {
        toast({
          title: "Access Denied",
          description: "You do not have admin privileges.",
          variant: "destructive",
        });
        setLocation("/profile");
      }
    } else {
      setError("Invalid credentials. Use username 'admin' or your email.");
      toast({
        title: "Login Failed",
        description: "Invalid username or password",
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-indigo-950 dark:to-purple-950 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-slate-900/[0.04] dark:bg-grid-slate-100/[0.03] bg-[size:32px_32px]" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-300 dark:bg-purple-800 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-300 dark:bg-indigo-800 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
      
      <Card className="w-full max-w-md shadow-2xl backdrop-blur-sm bg-white/95 dark:bg-slate-900/95 border-2 border-white/20 dark:border-slate-700/50 relative z-10 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
        <CardHeader className="space-y-3 text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-2 shadow-lg shadow-indigo-500/30 ring-4 ring-indigo-100 dark:ring-indigo-900/30 transform hover:scale-105 transition-transform duration-200">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">Admin Portal</CardTitle>
          <CardDescription className="text-base">
            Secure access to platform management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold">Username or Email</Label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-200 pointer-events-none" />
                <Input
                  id="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin"
                  required
                  autoComplete="username"
                  className="relative bg-white dark:bg-slate-800 border-2 focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold">Password</Label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-200 pointer-events-none" />
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                    className="pl-10 pr-10 bg-white dark:bg-slate-800 border-2 focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent z-10"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
            
            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-5 w-5" />
                  Access Dashboard
                </>
              )}
            </Button>
            
            <div className="pt-4 text-center text-xs text-muted-foreground border-t">
              <p className="flex items-center justify-center gap-1">
                <Lock className="h-3 w-3" />
                Secured with enterprise-grade encryption
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
