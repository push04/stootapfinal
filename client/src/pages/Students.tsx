import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Rocket, BookOpen, TrendingUp, IndianRupee } from "lucide-react";

const fundingOpportunities = [
  {
    id: 1,
    title: "Startup India Seed Fund",
    amount: "Up to ₹20 Lakhs",
    deadline: "Rolling basis",
    eligibility: "Early-stage startups",
  },
  {
    id: 2,
    title: "National Startup Awards",
    amount: "₹5-10 Lakhs",
    deadline: "March 2025",
    eligibility: "Innovative startups",
  },
  {
    id: 3,
    title: "Student Entrepreneur Program",
    amount: "Up to ₹5 Lakhs",
    deadline: "Ongoing",
    eligibility: "Student entrepreneurs",
  },
];

const learningResources = [
  {
    id: 1,
    title: "Getting Started with Business Registration",
    category: "Legal",
    duration: "15 min read",
  },
  {
    id: 2,
    title: "Understanding GST for Beginners",
    category: "Finance",
    duration: "20 min read",
  },
  {
    id: 3,
    title: "Digital Marketing 101 for Startups",
    category: "Marketing",
    duration: "25 min read",
  },
];

export default function Students() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-1">
        <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-accent/5 to-background py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <Badge className="mb-4" data-testid="badge-student">
                <GraduationCap className="mr-1 h-3 w-3" />
                For Students
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-bold font-heading mb-6">
                Turn Your Ideas Into Reality
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Access funding, learn business essentials, and get expert guidance to launch your startup
              </p>
              <Button size="lg" data-testid="button-get-started">
                <Rocket className="mr-2 h-5 w-5" />
                Get Started
              </Button>
            </div>
          </div>
        </div>

        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="mb-12">
              <h2 className="text-3xl font-bold font-heading mb-4 flex items-center gap-3">
                <IndianRupee className="h-8 w-8 text-accent" />
                Funding Opportunities
              </h2>
              <p className="text-muted-foreground">
                Explore grants and programs available for student entrepreneurs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fundingOpportunities.map((opportunity) => (
                <Card key={opportunity.id} className="hover-elevate" data-testid={`card-funding-${opportunity.id}`}>
                  <CardHeader>
                    <CardTitle className="text-xl">{opportunity.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Amount</p>
                      <p className="text-lg font-semibold text-accent">{opportunity.amount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Deadline</p>
                      <p className="font-medium">{opportunity.deadline}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Eligibility</p>
                      <p className="font-medium">{opportunity.eligibility}</p>
                    </div>
                    <Button variant="outline" className="w-full mt-4" data-testid={`button-learn-more-${opportunity.id}`}>
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="mb-12">
              <h2 className="text-3xl font-bold font-heading mb-4 flex items-center gap-3">
                <BookOpen className="h-8 w-8 text-primary" />
                Learning Hub
              </h2>
              <p className="text-muted-foreground">
                Essential guides to help you navigate your entrepreneurial journey
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {learningResources.map((resource) => (
                <Card key={resource.id} className="hover-elevate cursor-pointer" data-testid={`card-resource-${resource.id}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="secondary">{resource.category}</Badge>
                      <span className="text-sm text-muted-foreground">{resource.duration}</span>
                    </div>
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button variant="ghost" className="w-full" data-testid={`button-read-${resource.id}`}>
                      Read Article
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
            <TrendingUp className="h-16 w-16 text-accent mx-auto mb-6" />
            <h2 className="text-3xl font-bold font-heading mb-4">Ready to Start Your Journey?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Get personalized guidance from our AI concierge. Tell us about your idea and we'll help you get started.
            </p>
            <Button size="lg" data-testid="button-talk-to-concierge">
              Talk to AI Concierge
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
