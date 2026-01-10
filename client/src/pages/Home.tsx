import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import CategoryTile from "@/components/CategoryTile";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Building2,
  Landmark,
  Globe,
  TrendingUp,
  Shield,
  Briefcase,
  GraduationCap,
  FileText,
  ArrowRight,
} from "lucide-react";

const categories = [
  { slug: "business-registration", name: "Business Registration", icon: Building2, count: 12 },
  { slug: "financial-compliance", name: "Financial Compliance", icon: Landmark, count: 18 },
  { slug: "digital-marketing", name: "Digital Marketing", icon: Globe, count: 24 },
  { slug: "growth-scaling", name: "Growth & Scaling", icon: TrendingUp, count: 15 },
  { slug: "legal-protection", name: "Legal Protection", icon: Shield, count: 10 },
  { slug: "consulting", name: "Consulting", icon: Briefcase, count: 14 },
  { slug: "education", name: "Education & Training", icon: GraduationCap, count: 8 },
  { slug: "documentation", name: "Documentation", icon: FileText, count: 11 },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-1 page-transition">
        <Hero />

        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="text-center mb-12 slide-in">
              <h2 className="text-3xl lg:text-4xl font-bold font-heading mb-4">
                Complete Business Solutions at Your Fingertips
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Whether you're a student entrepreneur or scaling business, access expert services across registration, compliance, marketing, and more - all in one place.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <CategoryTile
                  key={category.slug}
                  slug={category.slug}
                  name={category.name}
                  icon={category.icon}
                  serviceCount={category.count}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold font-heading mb-4">
                Why Choose Stootap?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-8 text-center card-hover">
                <div className="inline-flex p-4 rounded-2xl bg-primary/10 mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Bank-Grade Security</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Enterprise-level encryption and Razorpay-secured payments ensure your data and transactions are always protected. India-compliant, globally trusted.
                </p>
              </Card>

              <Card className="p-8 text-center hover:shadow-lg transition-shadow">
                <div className="inline-flex p-4 rounded-2xl bg-primary/10 mb-4">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Built to Scale with You</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Whether you're filing your first GST or expanding nationwide, our ecosystem of services adapts to your growth stage. Start small, scale smart.
                </p>
              </Card>

              <Card className="p-8 text-center hover:shadow-lg transition-shadow">
                <div className="inline-flex p-4 rounded-2xl bg-primary/10 mb-4">
                  <Briefcase className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Everything Under One Roof</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Stop juggling multiple vendors. Access 300+ verified business services - from incorporation to intellectual property - through a single, intuitive dashboard.
                </p>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-24 bg-gradient-to-b from-orange-500/5 to-background">
          <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold font-heading mb-4">
              Your Business Journey Starts Here
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of entrepreneurs who trust Stootap to handle their business needs. Get expert guidance, transparent pricing, and results you can count on.
            </p>
            <Link href="/contact">
              <Button size="lg" className="text-lg px-8">
                Contact Us
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
