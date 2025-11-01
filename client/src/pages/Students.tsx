import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  GraduationCap, 
  Rocket, 
  BookOpen, 
  TrendingUp, 
  IndianRupee,
  Award,
  Users,
  Target,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Lightbulb,
  FileText,
  Shield,
  Briefcase,
  LineChart,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const stats = [
  { label: "Student Startups Launched", value: "500+", icon: Rocket },
  { label: "Funding Secured", value: "₹50Cr+", icon: IndianRupee },
  { label: "Success Rate", value: "85%", icon: TrendingUp },
  { label: "Avg. Setup Time", value: "7 Days", icon: Calendar },
];

const fundingOpportunities = [
  {
    id: 1,
    title: "Startup India Seed Fund",
    amount: "Up to ₹20 Lakhs",
    deadline: "Rolling basis",
    eligibility: "Early-stage startups with DPIIT recognition",
    type: "Grant",
    provider: "Government of India",
    link: "https://seedfund.startupindia.gov.in/",
  },
  {
    id: 2,
    title: "National Startup Awards",
    amount: "₹5-10 Lakhs",
    deadline: "March 2025",
    eligibility: "Innovative startups solving real problems",
    type: "Award",
    provider: "DPIIT",
    link: "#",
  },
  {
    id: 3,
    title: "Student Entrepreneur Program",
    amount: "Up to ₹5 Lakhs",
    deadline: "Ongoing",
    eligibility: "Current students with viable business plans",
    type: "Grant",
    provider: "NSTEDB",
    link: "#",
  },
  {
    id: 4,
    title: "BIRAC BIG Scheme",
    amount: "Up to ₹50 Lakhs",
    deadline: "Quarterly",
    eligibility: "Biotech and healthcare innovations",
    type: "Seed Fund",
    provider: "DBT",
    link: "#",
  },
  {
    id: 5,
    title: "Atal Innovation Mission",
    amount: "Up to ₹10 Lakhs",
    deadline: "Ongoing",
    eligibility: "Students with innovative prototypes",
    type: "Grant",
    provider: "NITI Aayog",
    link: "#",
  },
  {
    id: 6,
    title: "Incubation Support",
    amount: "In-kind + ₹3 Lakhs",
    deadline: "Rolling",
    eligibility: "Tech startups seeking mentorship",
    type: "Incubation",
    provider: "T-Hub / IITs",
    link: "#",
  },
];

const startupJourney = [
  {
    phase: "Ideation",
    duration: "Week 1-2",
    tasks: ["Validate your idea", "Market research", "Define target audience"],
    progress: 100,
  },
  {
    phase: "Foundation",
    duration: "Week 3-4",
    tasks: ["Business registration", "GST registration", "Open business account"],
    progress: 75,
  },
  {
    phase: "Legal Setup",
    duration: "Week 5-6",
    tasks: ["Trademark filing", "Legal agreements", "Compliance setup"],
    progress: 50,
  },
  {
    phase: "Launch",
    duration: "Week 7-8",
    tasks: ["Build MVP", "Marketing strategy", "First customers"],
    progress: 25,
  },
];

const studentServices = [
  {
    category: "Company Formation",
    icon: Briefcase,
    services: [
      "Startup India Registration",
      "OPC/Private Limited Registration",
      "DPIIT Recognition",
      "Trademark Filing"
    ]
  },
  {
    category: "Legal & Compliance",
    icon: Shield,
    services: [
      "Founder Agreements",
      "IP Protection",
      "GST Registration",
      "Annual Compliance"
    ]
  },
  {
    category: "Funding Support",
    icon: IndianRupee,
    services: [
      "Pitch Deck Creation",
      "Financial Projections",
      "Grant Applications",
      "Investor Connections"
    ]
  },
  {
    category: "Growth & Marketing",
    icon: LineChart,
    services: [
      "Digital Marketing",
      "Brand Strategy",
      "Website Development",
      "Social Media Setup"
    ]
  },
];

const successStories = [
  {
    name: "Rohan Sharma",
    startup: "EduTech Solutions",
    achievement: "Raised ₹15L seed funding",
    testimonial: "Stootap helped us navigate all legal requirements and secured government funding within 2 months.",
    batch: "Class of 2024"
  },
  {
    name: "Priya Patel",
    startup: "GreenCycle",
    achievement: "Won National Startup Award",
    testimonial: "From idea to incorporation in just 3 weeks. The team guided us through every step.",
    batch: "Class of 2023"
  },
  {
    name: "Amit Kumar",
    startup: "HealthFirst",
    achievement: "Successfully launched MVP",
    testimonial: "Amazing support for student entrepreneurs. They made compliance simple and affordable.",
    batch: "Class of 2024"
  },
];

const learningResources = [
  {
    id: 1,
    title: "Complete Guide to Startup Registration",
    category: "Legal",
    duration: "15 min read",
    level: "Beginner",
    description: "Step-by-step process to register your startup and get DPIIT recognition"
  },
  {
    id: 2,
    title: "Understanding GST for Student Startups",
    category: "Finance",
    duration: "20 min read",
    level: "Beginner",
    description: "Everything you need to know about GST registration and compliance"
  },
  {
    id: 3,
    title: "Building Your First Pitch Deck",
    category: "Funding",
    duration: "25 min read",
    level: "Intermediate",
    description: "Create investor-ready pitch decks that secure funding"
  },
  {
    id: 4,
    title: "Digital Marketing on a Student Budget",
    category: "Marketing",
    duration: "18 min read",
    level: "Beginner",
    description: "Cost-effective marketing strategies for bootstrapped startups"
  },
  {
    id: 5,
    title: "IP Protection for Tech Startups",
    category: "Legal",
    duration: "22 min read",
    level: "Advanced",
    description: "Protect your innovations with trademarks and patents"
  },
  {
    id: 6,
    title: "Founder Agreements 101",
    category: "Legal",
    duration: "16 min read",
    level: "Beginner",
    description: "Avoid future conflicts with proper founder agreements"
  },
];

export default function Students() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-1">
        {/* Hero Section */}
        <motion.div 
          initial="initial"
          animate="animate"
          variants={stagger}
          className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950 dark:via-purple-950 dark:to-pink-950 py-20 lg:py-32"
        >
          <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
          <div className="mx-auto max-w-7xl px-4 lg:px-8 relative">
            <div className="text-center max-w-4xl mx-auto">
              <motion.div variants={fadeIn}>
                <Badge className="mb-6 text-sm py-2 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
                  <GraduationCap className="mr-2 h-4 w-4" />
                  Student Entrepreneur Program
                </Badge>
              </motion.div>
              <motion.h1 
                variants={fadeIn}
                className="text-5xl lg:text-7xl font-bold font-heading mb-6"
              >
                <span className="text-gray-900 dark:text-gray-100">Turn Your Ideas Into</span>
                <span className="block mt-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Successful Startups</span>
              </motion.h1>
              <motion.p variants={fadeIn} className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                Access ₹50Cr+ in funding opportunities, expert guidance, and fast-track legal support designed specifically for student entrepreneurs
              </motion.p>
              <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/services">
                  <Button size="lg" className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Rocket className="mr-2 h-5 w-5" />
                    Start Your Journey
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2 border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950">
                    <Calendar className="mr-2 h-5 w-5" />
                    Book Free Consultation
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Stats Section */}
        <section className="py-12 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center text-white"
                >
                  <stat.icon className="h-8 w-8 mx-auto mb-3 text-white/90" />
                  <div className="text-3xl lg:text-4xl font-bold mb-2">{stat.value}</div>
                  <div className="text-sm text-white/80">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Startup Journey Roadmap */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <Badge className="mb-4 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                <Target className="mr-1 h-3 w-3" />
                Your Roadmap
              </Badge>
              <h2 className="text-4xl font-bold font-heading mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                8-Week Startup Launch Plan
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                From idea to launch - follow our proven roadmap designed for student entrepreneurs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {startupJourney.map((phase, index) => (
                <motion.div
                  key={phase.phase}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="hover-elevate h-full">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant={index === 0 ? "default" : "secondary"}>
                          {phase.duration}
                        </Badge>
                        <span className="text-2xl font-bold text-muted-foreground">
                          0{index + 1}
                        </span>
                      </div>
                      <CardTitle className="text-xl">{phase.phase}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Progress value={phase.progress} className="h-2" />
                      <ul className="space-y-2">
                        {phase.tasks.map((task, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                            <span>{task}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Funding Opportunities */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <Badge className="mb-4 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                <IndianRupee className="mr-1 h-3 w-3" />
                Funding
              </Badge>
              <h2 className="text-4xl font-bold font-heading mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                ₹50Cr+ in Funding Opportunities
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Access government grants, awards, and seed funding programs for student startups
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fundingOpportunities.map((opportunity, index) => (
                <motion.div
                  key={opportunity.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <Card className="hover-elevate h-full group">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-3">
                        <Badge variant="secondary">{opportunity.type}</Badge>
                        <Sparkles className="h-5 w-5 text-accent" />
                      </div>
                      <CardTitle className="text-xl mb-2">{opportunity.title}</CardTitle>
                      <CardDescription>{opportunity.provider}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-accent/10 rounded-lg p-4 text-center">
                        <p className="text-sm text-muted-foreground mb-1">Funding Amount</p>
                        <p className="text-2xl font-bold text-accent">{opportunity.amount}</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium">Deadline</p>
                            <p className="text-muted-foreground">{opportunity.deadline}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium">Eligibility</p>
                            <p className="text-muted-foreground">{opportunity.eligibility}</p>
                          </div>
                        </div>
                      </div>
                      {opportunity.link && opportunity.link !== "#" ? (
                        <Button 
                          variant="outline" 
                          className="w-full group-hover:bg-accent group-hover:text-accent-foreground transition-all"
                          onClick={() => window.open(opportunity.link, '_blank', 'noopener,noreferrer')}
                        >
                          Learn More
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      ) : (
                        <Link href="/contact">
                          <Button variant="outline" className="w-full group-hover:bg-accent group-hover:text-accent-foreground transition-all">
                            Contact for Details
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

        {/* Services for Students */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <Badge className="mb-4">
                <Briefcase className="mr-1 h-3 w-3" />
                Services
              </Badge>
              <h2 className="text-4xl font-bold font-heading mb-4">
                All-in-One Startup Services
              </h2>
              <p className="text-lg text-muted-foreground">
                Everything you need to launch and grow - at student-friendly prices
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {studentServices.map((service, index) => (
                <motion.div
                  key={service.category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="hover-elevate h-full">
                    <CardHeader>
                      <service.icon className="h-10 w-10 text-accent mb-3" />
                      <CardTitle className="text-lg">{service.category}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {service.services.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
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
                <Button size="lg" variant="outline" className="shadow-lg">
                  View All Services
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <Badge className="mb-4">
                <Award className="mr-1 h-3 w-3" />
                Success Stories
              </Badge>
              <h2 className="text-4xl font-bold font-heading mb-4">
                Student Founders Like You
              </h2>
              <p className="text-lg text-muted-foreground">
                Join hundreds of successful student entrepreneurs who started with Stootap
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {successStories.map((story, index) => (
                <motion.div
                  key={story.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="hover-elevate h-full">
                    <CardHeader>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-white font-bold text-lg">
                          {story.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{story.name}</CardTitle>
                          <CardDescription>{story.startup}</CardDescription>
                        </div>
                      </div>
                      <Badge className="w-fit" variant="secondary">{story.achievement}</Badge>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground italic mb-4">"{story.testimonial}"</p>
                      <p className="text-sm text-accent font-medium">{story.batch}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Learning Hub */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <Badge className="mb-4">
                <BookOpen className="mr-1 h-3 w-3" />
                Learning Hub
              </Badge>
              <h2 className="text-4xl font-bold font-heading mb-4">
                Free Startup Resources
              </h2>
              <p className="text-lg text-muted-foreground">
                Expert guides and tutorials to accelerate your entrepreneurial journey
              </p>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-4 mb-8">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="legal">Legal</TabsTrigger>
                <TabsTrigger value="finance">Finance</TabsTrigger>
                <TabsTrigger value="marketing">Marketing</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {learningResources.map((resource, index) => (
                  <motion.div
                    key={resource.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    viewport={{ once: true }}
                  >
                    <Card className="hover-elevate cursor-pointer h-full group">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-3">
                          <Badge variant="secondary">{resource.category}</Badge>
                          <Badge variant="outline">{resource.level}</Badge>
                        </div>
                        <CardTitle className="text-lg group-hover:text-accent transition-colors">
                          {resource.title}
                        </CardTitle>
                        <CardDescription>{resource.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{resource.duration}</span>
                        <ArrowRight className="h-4 w-4 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </TabsContent>

              {['legal', 'finance', 'marketing'].map(category => (
                <TabsContent key={category} value={category} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {learningResources
                    .filter(r => r.category.toLowerCase() === category)
                    .map((resource) => (
                      <Card key={resource.id} className="hover-elevate cursor-pointer group">
                        <CardHeader>
                          <div className="flex items-start justify-between mb-3">
                            <Badge variant="secondary">{resource.category}</Badge>
                            <Badge variant="outline">{resource.level}</Badge>
                          </div>
                          <CardTitle className="text-lg group-hover:text-accent transition-colors">
                            {resource.title}
                          </CardTitle>
                          <CardDescription>{resource.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">{resource.duration}</span>
                          <ArrowRight className="h-4 w-4 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </CardContent>
                      </Card>
                    ))}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 lg:py-32 bg-gradient-to-br from-accent/10 to-primary/5">
          <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <Lightbulb className="h-20 w-20 text-accent mx-auto mb-8" />
              <h2 className="text-4xl lg:text-5xl font-bold font-heading mb-6">
                Ready to Build Something Amazing?
              </h2>
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                Get personalized guidance from our AI concierge. Tell us about your idea and we'll create a custom roadmap for your startup journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button size="lg" className="text-lg px-8 py-6 shadow-lg">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Talk to AI Concierge
                </Button>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                    <Users className="mr-2 h-5 w-5" />
                    Contact Expert Team
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
