import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import { signIn, getCurrentSession, resendVerificationEmail } from "@/lib/auth-service";
import { Loader2, Eye, EyeOff, AlertCircle } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().default(false),
});

type LoginData = z.infer<typeof loginSchema>;

export default function Login() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [needsVerification, setNeedsVerification] = useState(false);
  const [, setLocation] = useLocation();

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // Prevent infinite redirect loops
  const [authCheckCount, setAuthCheckCount] = useState(0);
  const MAX_AUTH_CHECKS = 3;

  useEffect(() => {
    checkExistingAuth();
  }, []);

  const getReturnUrl = () => {
    const params = new URLSearchParams(window.location.search);
    const returnUrl = params.get("returnUrl");
    return returnUrl ? decodeURIComponent(returnUrl) : "/profile";
  };

  const checkExistingAuth = async () => {
    // Prevent infinite loops
    if (authCheckCount >= MAX_AUTH_CHECKS) {
      console.warn('⚠️ Maximum auth check attempts reached, stopping to prevent infinite loop');
      return;
    }

    setAuthCheckCount(prev => prev + 1);

    try {
      const { session } = await getCurrentSession();
      if (session) {
        console.log('✅ Existing session found, redirecting to:', getReturnUrl());
        setLocation(getReturnUrl());
      } else {
        console.log('ℹ️ No existing session found');
      }
    } catch (error) {
      console.error('❌ Error checking existing auth:', error);
      // Don't redirect on error - stay on login page
    }
  };

  const handleResendVerification = async () => {
    const email = form.getValues("email");
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    const result = await resendVerificationEmail(email);
    if (result.success) {
      toast({
        title: "Email Sent",
        description: "Verification email has been sent. Please check your inbox.",
      });
    } else {
      toast({
        title: "Failed to Send",
        description: result.error || "Failed to send verification email",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data: LoginData) => {
    setIsSubmitting(true);
    setErrorMessage("");
    setNeedsVerification(false);

    console.log('🔐 Login attempt for:', data.email);
    const result = await signIn(data.email, data.password);

    if (result.success && result.session) {
      console.log('✅ Login successful, redirecting to:', getReturnUrl());
      toast({
        title: "Welcome back!",
        description: "You have been logged in successfully.",
      });
      setLocation(getReturnUrl());
    } else {
      const errorMsg = result.error || "An unexpected error occurred";
      console.error('❌ Login failed:', errorMsg, 'Code:', result.errorCode);
      setErrorMessage(errorMsg);

      if (result.error?.toLowerCase().includes("verify your email") ||
        result.error?.toLowerCase().includes("email not confirmed")) {
        setNeedsVerification(true);
      }

      toast({
        title: "Login Failed",
        description: result.error || "Please check your credentials and try again",
        variant: "destructive",
      });
    }

    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-1 flex items-center justify-center py-16 px-4 page-transition">
        <Card className="w-full max-w-md slide-in">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-heading">Welcome Back</CardTitle>
            <CardDescription>Sign in to your Stootap account</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {errorMessage && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errorMessage}</AlertDescription>
                  </Alert>
                )}

                {needsVerification && (
                  <Alert>
                    <AlertDescription className="flex items-center justify-between">
                      <span>Email not verified</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleResendVerification}
                        className="h-auto p-0 underline"
                      >
                        Resend verification
                      </Button>
                    </AlertDescription>
                  </Alert>
                )}

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          autoComplete="email"
                          {...field}
                          data-testid="input-email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            {...field}
                            data-testid="input-password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
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
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-between">
                  <FormField
                    control={form.control}
                    name="rememberMe"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal cursor-pointer">
                          Remember me
                        </FormLabel>
                      </FormItem>
                    )}
                  />

                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-orange-600 hover:underline"
                    data-testid="link-forgot-password"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                  data-testid="button-login"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>

                <p className="text-center text-sm text-muted-foreground mt-6">
                  Don't have an account?{" "}
                  <Link href="/register" className="text-orange-600 hover:underline" data-testid="link-register">
                    Sign up
                  </Link>
                </p>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
