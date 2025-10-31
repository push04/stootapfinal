import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import ContactFormSection from "@/components/ContactFormSection";
import CategoryTile from "@/components/CategoryTile";
import Footer from "@/components/Footer";
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
      <main className="flex-1">
        <Hero />
        
        <ContactFormSection />
        
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold font-heading mb-4">
                Explore Our Services
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                From registration to growth, we've got every aspect of your business covered
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
              <Card className="p-8 text-center">
                <div className="inline-flex p-4 rounded-2xl bg-primary/10 mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Trusted & Secure</h3>
                <p className="text-muted-foreground">
                  All payments secured by Razorpay with India-first compliance standards
                </p>
              </Card>

              <Card className="p-8 text-center">
                <div className="inline-flex p-4 rounded-2xl bg-primary/10 mb-4">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Growth Focused</h3>
                <p className="text-muted-foreground">
                  From startup to scale-up, our services grow with your business needs
                </p>
              </Card>

              <Card className="p-8 text-center">
                <div className="inline-flex p-4 rounded-2xl bg-primary/10 mb-4">
                  <Briefcase className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Complete Platform</h3>
                <p className="text-muted-foreground">
                  300+ services covering every aspect of business launch and management
                </p>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
