import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import { Mail } from "lucide-react";

export default function VerifyEmail() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <Card className="w-full max-w-md backdrop-blur-md bg-card/90 text-center">
          <CardContent className="pt-12 pb-8">
            <div className="inline-flex p-4 rounded-full bg-primary/10 mb-6">
              <Mail className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-2xl font-heading font-bold mb-4">Verify Your Email</h2>
            <p className="text-muted-foreground mb-8">
              We've sent a verification link to your email address. Please check your inbox and click the link to verify your account.
            </p>
            <div className="space-y-4">
              <Button asChild className="w-full" data-testid="button-go-to-login">
                <Link href="/login">Go to Login</Link>
              </Button>
              <Button variant="outline" className="w-full" data-testid="button-resend">
                Resend Verification Email
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
