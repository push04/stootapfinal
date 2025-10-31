import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Lock, CheckCircle2 } from "lucide-react";

export default function Hero() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-background pointer-events-none" />
      
      <div className="relative mx-auto max-w-7xl px-4 lg:px-8 py-16 lg:py-24 xl:py-32">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold font-heading mb-6" data-testid="text-hero-title">
            Your Entire Business, Handled.
          </h1>
          
          <h2 className="text-lg lg:text-xl xl:text-2xl text-muted-foreground mb-12" data-testid="text-hero-subtitle">
            From idea to IMPACT. From concept to running brand. 300+ services. One platform.
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button asChild size="lg" className="text-base px-8" data-testid="button-student-cta">
              <Link href="/students">Student? Get Started</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-base px-8" data-testid="button-business-cta">
              <Link href="/services">Business? Explore Services</Link>
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2" data-testid="text-trust-payment">
              <Lock className="h-4 w-4 text-accent" />
              <span>Secure payments via Razorpay</span>
            </div>
            <div className="flex items-center gap-2" data-testid="text-trust-compliance">
              <ShieldCheck className="h-4 w-4 text-accent" />
              <span>India-first compliance</span>
            </div>
            <div className="flex items-center gap-2" data-testid="text-trust-services">
              <CheckCircle2 className="h-4 w-4 text-accent" />
              <span>300+ verified services</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
