import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { StartupContactForm } from "@/components/StartupContactForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  GraduationCap,
  Rocket,
  Briefcase,
  TrendingUp,
  IndianRupee,
  Award,
  Users,
  Target,
  CheckCircle2,
  ArrowRight,
  FileText,
  Shield,
  LineChart,
  Clock,
  MapPin,
  Star
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const stats = [
  { label: "Students Registered", value: "50+", icon: Users },
  { label: "Startups Launched", value: "25+", icon: Rocket },
  { label: "Funding Given", value: "₹50,000", icon: IndianRupee },
  { label: "Placement Rate", value: "85%", icon: TrendingUp },
];

const careerTracks = [
  {
    id: "jobs",
    title: "Get a Job",
    icon: Briefcase,
    description: "Full-time positions with clear salary ranges and growth paths",
    features: [
      "Verified company listings",
      "Salary transparency",
      "Interview preparation guides",
      "Direct recruiter connections"
    ],
    cta: "Browse Jobs",
    href: "/opportunities",
    color: "bg-orange-600"
  },
  {
    id: "internships",
    title: "Get an Internship",
    icon: Clock,
    description: "Flexible internships to kickstart your career journey",
    features: [
      "Stipend clarity upfront",
      "Certificate support",
      "Flexible work hours",
      "Skill-based matching"
    ],
    cta: "Find Internships",
    href: "/opportunities",
    color: "bg-orange-500"
  },
  {
    id: "startup",
    title: "Launch Your Startup",
    icon: Rocket,
    description: "Full support to turn your idea into a funded business",
    features: [
      "DPIIT registration help",
      "Funding connections",
      "Legal compliance setup",
      "Mentorship access"
    ],
    cta: "Start Your Journey",
    href: null,
    color: "bg-orange-700",
    onClick: true
  },
];

const fundingOpportunities = [
  {
    title: "Startup India Seed Fund",
    amount: "Up to ₹20 Lakhs",
    type: "Grant",
    provider: "Government of India",
  },
  {
    title: "National Startup Awards",
    amount: "₹5-10 Lakhs",
    type: "Award",
    provider: "DPIIT",
  },
  {
    title: "Student Entrepreneur Program",
    amount: "Up to ₹5 Lakhs",
    type: "Grant",
    provider: "NSTEDB",
  },
  {
    title: "Atal Innovation Mission",
    amount: "Up to ₹10 Lakhs",
    type: "Grant",
    provider: "NITI Aayog",
  },
];

const services = [
  {
    title: "Company Formation",
    icon: FileText,
    items: ["Startup India Registration", "Private Limited Setup", "DPIIT Recognition"]
  },
  {
    title: "Legal & Compliance",
    icon: Shield,
    items: ["GST Registration", "Trademark Filing", "Founder Agreements"]
  },
  {
    title: "Funding Support",
    icon: IndianRupee,
    items: ["Pitch Deck Creation", "Grant Applications", "Investor Connect"]
  },
  {
    title: "Growth & Marketing",
    icon: LineChart,
    items: ["Digital Marketing", "Website Development", "Brand Strategy"]
  },
];

const testimonials = [
  {
    name: "Rohan Sharma",
    role: "Founder, EduTech Solutions",
    achievement: "Raised ₹15L seed funding",
    quote: "Stootap helped us navigate all legal requirements and secured government funding within 2 months."
  },
  {
    name: "Priya Patel",
    role: "Founder, GreenCycle",
    achievement: "Won National Startup Award",
    quote: "From idea to incorporation in just 3 weeks. The team guided us through every step."
  },
  {
    name: "Amit Kumar",
    role: "Founder, HealthFirst",
    achievement: "Successfully launched MVP",
    quote: "Amazing support for student entrepreneurs. They made compliance simple and affordable."
  },
];

export default function Students() {
  const [activeTab, setActiveTab] = useState("opportunities");
  const [showStartupForm, setShowStartupForm] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <StartupContactForm open={showStartupForm} onOpenChange={setShowStartupForm} />
      <Navigation />

      <main className="flex-1">
        <section className="relative py-20 lg:py-28 bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
          <div className="absolute inset-0 bg-grid-slate-100/50 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-grid-slate-700/20" />

          <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div {...fadeIn}>
                <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 py-2 px-4">
                  <GraduationCap className="mr-2 h-4 w-4" />
                  For Students
                </Badge>
              </motion.div>

              <motion.h1
                {...fadeIn}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6"
              >
                Your Career Starts Here
              </motion.h1>

              <motion.p
                {...fadeIn}
                className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
              >
                Get placed in top companies, land dream internships, or launch your own startup - all with personalized support from Stootap
              </motion.p>

              <motion.div {...fadeIn} className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/opportunities">
                  <Button size="lg" className="text-lg px-8 py-6 shadow-lg">
                    <Briefcase className="mr-2 h-5 w-5" />
                    Browse Opportunities
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6"
                  onClick={() => setShowStartupForm(true)}
                >
                  <Rocket className="mr-2 h-5 w-5" />
                  Start a Startup
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-orange-600">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center text-primary-foreground"
                >
                  <stat.icon className="h-8 w-8 mx-auto mb-3 opacity-90" />
                  <div className="text-3xl md:text-4xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm opacity-80">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <Badge className="mb-4" variant="secondary">
                <Target className="mr-1 h-3 w-3" />
                Choose Your Path
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Three Ways to Launch Your Career
              </h2>
              <p className="text-muted-foreground">
                Whether you want a job, internship, or to build your own company - we've got you covered
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {careerTracks.map((track, index) => (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow border-border/50 group">
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-lg ${track.color} flex items-center justify-center mb-4`}>
                        <track.icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-xl">{track.title}</CardTitle>
                      <CardDescription>{track.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ul className="space-y-2">
                        {track.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      {track.onClick ? (
                        <Button
                          onClick={() => setShowStartupForm(true)}
                          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                          variant="outline"
                        >
                          {track.cta}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      ) : (
                        <Link href={track.href || "#"}>
                          <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors" variant="outline">
                            {track.cta}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <Badge className="mb-4" variant="secondary">
                <IndianRupee className="mr-1 h-3 w-3" />
                Funding
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Funding Opportunities for Students
              </h2>
              <p className="text-muted-foreground">
                Access grants, awards, and seed funding to fuel your startup dreams
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {fundingOpportunities.map((fund, index) => (
                <motion.div
                  key={fund.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      <Badge variant="outline" className="mb-3">{fund.type}</Badge>
                      <h3 className="font-semibold text-foreground mb-2">{fund.title}</h3>
                      <p className="text-2xl font-bold text-primary mb-2">{fund.amount}</p>
                      <p className="text-sm text-muted-foreground">{fund.provider}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link href="/services">
                <Button variant="outline" size="lg">
                  Get Funding Help
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <Badge className="mb-4" variant="secondary">
                <Briefcase className="mr-1 h-3 w-3" />
                Services
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                All-in-One Startup Services
              </h2>
              <p className="text-muted-foreground">
                Everything you need to launch and grow - at student-friendly prices
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-md transition-shadow border-border/50">
                    <CardHeader className="pb-3">
                      <service.icon className="h-10 w-10 text-primary mb-3" />
                      <CardTitle className="text-lg">{service.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {service.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link href="/services">
                <Button size="lg">
                  View All Services
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <Badge className="mb-4" variant="secondary">
                <Award className="mr-1 h-3 w-3" />
                Success Stories
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Student Founders Like You
              </h2>
              <p className="text-muted-foreground">
                Join hundreds of successful student entrepreneurs who started with Stootap
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-1 mb-4">
                        {[1, 2, 3, 4, 5].map(i => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-muted-foreground mb-6 italic">"{testimonial.quote}"</p>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                          {testimonial.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="mt-4">{testimonial.achievement}</Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Student Startup Essentials Package */}
        <section className="py-20 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <Badge className="mb-4 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100 border-amber-300">
                  <GraduationCap className="mr-1 h-3 w-3" />
                  Designed for Students
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Student Startup Essentials Package
                </h2>
                <p className="text-xl text-primary font-semibold italic mb-2">
                  "Start Right. Stay Legal. Spend Smart."
                </p>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Specially designed for students, first-time founders, college startups, and bootstrapped ideas. Get everything you need to legally operate — without overbuilding.
                </p>
              </div>

              <Card className="border-2 border-amber-300 dark:border-amber-600 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/50 dark:to-orange-900/50 rounded-t-lg">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <CardTitle className="text-2xl mb-1">Stootap Fees: ₹40,000</CardTitle>
                      <CardDescription className="text-base">+ Government Fees: Actuals</CardDescription>
                    </div>
                    <Badge className="bg-amber-600 text-white w-fit">
                      20 High-Efficiency Services
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        What's Included
                      </h3>
                      <ul className="space-y-2">
                        {[
                          "Idea validation & feasibility discussion",
                          "Problem–solution fit assessment",
                          "Industry & category guidance",
                          "Business model selection (lean-friendly)",
                          "Legal entity recommendation",
                          "Company registration / LLP / OPC setup",
                          "PAN & TAN registration",
                          "GST registration (if applicable)",
                          "MSME (Udyam) registration",
                          "Current account advisory",
                          "Basic compliance setup",
                          "Cost-saving legal structure",
                          "Founder ownership & role clarity",
                          "Pricing & revenue logic",
                          "Vendor & tool recommendations",
                          "Go-to-market direction",
                          "90-day execution roadmap",
                          "Mistake-prevention advisory",
                          "Budget & expense planning",
                          "Founder orientation kit"
                        ].map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="mb-8 p-6 bg-muted/50 rounded-lg">
                        <h3 className="font-semibold text-foreground mb-4">Outcomes</h3>
                        <ul className="space-y-3">
                          <li className="flex items-center gap-3">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                            <span className="font-medium">Startup becomes legally operable</span>
                          </li>
                          <li className="flex items-center gap-3">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                            <span className="font-medium">Student avoids over-spending</span>
                          </li>
                          <li className="flex items-center gap-3">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                            <span className="font-medium">Idea is structured for real execution</span>
                          </li>
                        </ul>
                      </div>

                      <div className="mb-6">
                        <h3 className="font-semibold text-foreground mb-3">Perfect For:</h3>
                        <p className="text-muted-foreground text-sm">
                          College projects turning into startups, hackathon winners, student founders, side-hustles becoming serious.
                        </p>
                      </div>

                      <Link href="/packages">
                        <Button size="lg" className="w-full bg-amber-600 hover:bg-amber-700">
                          <GraduationCap className="mr-2 h-5 w-5" />
                          Get Student Package
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Mentorship CTA for Students */}
        <section className="py-16 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                <div className="flex-shrink-0 text-center md:text-left">
                  <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto md:mx-0 mb-4">
                    <Users className="h-12 w-12 text-primary" />
                  </div>
                  <Badge className="bg-green-600 text-white">25% OFF for Students</Badge>
                </div>
                <div className="text-center md:text-left text-white">
                  <p className="text-primary font-semibold mb-2">1-on-1 Business Mentorship</p>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">
                    One conversation can save you six months of mistakes.
                  </h2>
                  <p className="text-zinc-300 mb-4">
                    Talk directly with our founder — validate your idea, understand costs, get clarity on next steps.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                    <div>
                      <span className="text-zinc-400 line-through">₹5,000</span>
                      <span className="text-3xl font-bold text-primary ml-2">₹3,750</span>
                      <span className="text-zinc-400 ml-1">/ 60 min</span>
                    </div>
                    <Link href="/mentorship">
                      <Button size="lg" className="bg-primary hover:bg-primary/90">
                        Book Student Session
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 bg-orange-600">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center text-primary-foreground">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Confused? Scaling? Stuck?
              </h2>
              <p className="text-lg opacity-90 mb-4 max-w-xl mx-auto">
                Validate your idea before you build. Start your startup the right way — without burning money.
              </p>
              <p className="text-xl font-semibold mb-8">
                Whether you're looking for opportunities or building your own venture, we're here to help you succeed.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/packages">
                  <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                    <GraduationCap className="mr-2 h-5 w-5" />
                    Student Package - ₹40,000
                  </Button>
                </Link>
                <Link href="/mentorship">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                    <Users className="mr-2 h-5 w-5" />
                    Book Mentorship - ₹3,750
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
