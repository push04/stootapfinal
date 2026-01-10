import { useState } from "react";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import { CheckCircle2 } from "lucide-react";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const form = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordData) => {
    setIsSubmitting(true);
    console.log("Password reset requested for:", data.email);
    
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setEmailSent(true);
    setIsSubmitting(false);
  };

  if (emailSent) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <main className="flex-1 flex items-center justify-center py-16 px-4">
          <Card className="w-full max-w-md backdrop-blur-md bg-card/90 text-center">
            <CardContent className="pt-12 pb-8">
              <div className="inline-flex p-4 rounded-full bg-accent/10 mb-6">
                <CheckCircle2 className="h-12 w-12 text-accent" />
              </div>
              <h2 className="text-2xl font-heading font-bold mb-4">Check Your Email</h2>
              <p className="text-muted-foreground mb-8">
                We've sent password reset instructions to your email address.
              </p>
              <Button asChild className="w-full" data-testid="button-back-to-login">
                <Link href="/login">Back to Login</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <Card className="w-full max-w-md backdrop-blur-md bg-card/90">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-heading">Reset Password</CardTitle>
            <CardDescription>Enter your email to receive reset instructions</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                          {...field}
                          data-testid="input-email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                  data-testid="button-submit"
                >
                  {isSubmitting ? "Sending..." : "Send Reset Link"}
                </Button>

                <p className="text-center text-sm text-muted-foreground mt-6">
                  Remember your password?{" "}
                  <Link href="/login" className="text-primary hover:underline" data-testid="link-login">
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
