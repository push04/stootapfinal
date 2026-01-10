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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import { signUp, getCurrentSession } from "@/lib/auth-service";
import { Loader2, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().regex(/^\+?[1-9]\d{9,14}$/, "Please enter a valid phone number"),
  role: z.enum(["student", "business", "company"], { required_error: "Please select your role" }),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
  consent: z.boolean().refine((val) => val === true, "You must agree to the terms"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterData = z.infer<typeof registerSchema>;

export default function Register() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [, setLocation] = useLocation();

  const form = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      consent: false,
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
      // Don't redirect on error - stay on register page
    }
  };

  const password = form.watch("password");

  const passwordStrength = {
    hasMinLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
  };

  const onSubmit = async (data: RegisterData) => {
    setIsSubmitting(true);
    setErrorMessage("");

    console.log('📝 Registration attempt for:', data.email, 'Role:', data.role);

    const result = await signUp(data.email, data.password, {
      full_name: data.name,
      phone: data.phone,
      role: data.role,
    });

    if (result.success) {
      if (result.session) {
        console.log('✅ Registration successful with immediate session, redirecting to:', getReturnUrl());
        toast({
          title: "Welcome to Stootap!",
          description: "Your account has been created successfully.",
        });
        setLocation(getReturnUrl());
      } else if (result.errorCode === 'email_verification_required') {
        console.log('📧 Email verification required, redirecting to verification page');
        toast({
          title: "Verification Required",
          description: result.error || "Please check your email to verify your account.",
        });
        setLocation("/auth/verify-email");
      }
    } else {
      const errorMsg = result.error || "An unexpected error occurred";
      console.error('❌ Registration failed:', errorMsg, 'Code:', result.errorCode);
      setErrorMessage(errorMsg);
      toast({
        title: "Registration Failed",
        description: result.error || "Failed to create account. Please try again.",
        variant: "destructive",
      });
    }

    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-1 flex items-center justify-center py-16 px-4 page-transition">
        <Card className="w-full max-w-md backdrop-blur-md bg-card/90 slide-in">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-heading">Create Account</CardTitle>
            <CardDescription>Join Stootap and start growing your business</CardDescription>
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

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your full name"
                          autoComplete="name"
                          {...field}
                          data-testid="input-name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="+91 9876543210"
                          autoComplete="tel"
                          {...field}
                          data-testid="input-phone"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>I am a</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-role">
                            <SelectValue placeholder="Select your role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="business">Business Owner</SelectItem>
                          <SelectItem value="company">Company</SelectItem>
                        </SelectContent>
                      </Select>
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
                            placeholder="Create a strong password"
                            autoComplete="new-password"
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
                      {password && (
                        <div className="space-y-1 text-xs mt-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className={`h-3 w-3 ${passwordStrength.hasMinLength ? 'text-green-500' : 'text-muted-foreground'}`} />
                            <span className={passwordStrength.hasMinLength ? 'text-green-600' : 'text-muted-foreground'}>
                              At least 8 characters
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className={`h-3 w-3 ${passwordStrength.hasUppercase ? 'text-green-500' : 'text-muted-foreground'}`} />
                            <span className={passwordStrength.hasUppercase ? 'text-green-600' : 'text-muted-foreground'}>
                              One uppercase letter
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className={`h-3 w-3 ${passwordStrength.hasLowercase ? 'text-green-500' : 'text-muted-foreground'}`} />
                            <span className={passwordStrength.hasLowercase ? 'text-green-600' : 'text-muted-foreground'}>
                              One lowercase letter
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className={`h-3 w-3 ${passwordStrength.hasNumber ? 'text-green-500' : 'text-muted-foreground'}`} />
                            <span className={passwordStrength.hasNumber ? 'text-green-600' : 'text-muted-foreground'}>
                              One number
                            </span>
                          </div>
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            autoComplete="new-password"
                            {...field}
                            data-testid="input-confirm-password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            tabIndex={-1}
                          >
                            {showConfirmPassword ? (
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

                <FormField
                  control={form.control}
                  name="consent"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="checkbox-consent"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-normal">
                          I agree to the{" "}
                          <Link href="/terms" className="text-orange-600 hover:underline">
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link href="/privacy" className="text-orange-600 hover:underline">
                            Privacy Policy
                          </Link>
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                  data-testid="button-register"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>

                <p className="text-center text-sm text-muted-foreground mt-6">
                  Already have an account?{" "}
                  <Link href="/login" className="text-orange-600 hover:underline" data-testid="link-login">
                    Sign in
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
