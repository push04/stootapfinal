import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Users, Target, Award, Zap, Shield } from "lucide-react";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900">
      <Navigation />

      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-zinc-600 bg-clip-text text-transparent">
            About Stootap
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Your trusted partner in launching and scaling businesses in India.
            We simplify entrepreneurship with 300+ expert services on one seamless platform.
          </p>
        </div>

        <section className="mb-16">
          <Card className="border-2">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-4">Our Story</h2>
              <p className="text-lg text-muted-foreground mb-4">
                Founded with a vision to democratize entrepreneurship in India, Stootap emerged from a simple observation:
                starting and running a business shouldn't require navigating dozens of different service providers.
              </p>
              <p className="text-lg text-muted-foreground mb-4">
                From company registration to digital marketing, legal compliance to financial services, we've built
                a comprehensive ecosystem that brings together India's best business service providers under one roof.
              </p>
              <p className="text-lg text-muted-foreground">
                Today, we're proud to serve thousands of entrepreneurs, startups, and established businesses,
                helping them focus on what matters most - building great products and services.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Shield className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Trust & Transparency</h3>
                <p className="text-muted-foreground">
                  We believe in complete transparency in pricing, processes, and deliverables.
                  No hidden fees, no surprises.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Zap className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Speed & Efficiency</h3>
                <p className="text-muted-foreground">
                  Time is money in business. Our streamlined processes and expert teams
                  ensure fast, efficient service delivery.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Award className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Quality Excellence</h3>
                <p className="text-muted-foreground">
                  We partner only with verified, experienced professionals who meet our
                  strict quality standards.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Why Choose Stootap?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-2">
              <CardContent className="p-6">
                <Building2 className="w-10 h-10 text-orange-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">300+ Services, One Platform</h3>
                <p className="text-muted-foreground">
                  From incorporation to GST filing, trademark registration to digital marketing,
                  everything your business needs is here.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-6">
                <Users className="w-10 h-10 text-orange-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">Expert Support</h3>
                <p className="text-muted-foreground">
                  Our team of chartered accountants, lawyers, and business consultants
                  guides you every step of the way.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-6">
                <Shield className="w-10 h-10 text-orange-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">India-First Compliance</h3>
                <p className="text-muted-foreground">
                  Stay compliant with all Indian regulations including GST, Companies Act,
                  and industry-specific requirements.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-6">
                <Target className="w-10 h-10 text-orange-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">Tailored Solutions</h3>
                <p className="text-muted-foreground">
                  Whether you're a student startup or an established enterprise,
                  we customize our services to match your needs and budget.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="text-center">
          <Card className="border-2 bg-gradient-to-r from-orange-50 to-zinc-50 dark:from-orange-950 dark:to-zinc-950">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-4">Ready to Launch Your Dream Business?</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Join thousands of entrepreneurs who trust Stootap for their business services.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <a
                  href="/services"
                  className="inline-flex items-center justify-center px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Explore Services
                </a>
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 border-2 border-orange-600 text-orange-600 font-semibold rounded-lg hover:bg-orange-50 dark:hover:bg-orange-950 transition-colors"
                >
                  Contact Us
                </a>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      <Footer />
    </div>
  );
}
