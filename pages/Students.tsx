import { useMemo, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
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
  Download,
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

const careerTracks = [
  {
    title: "Get a Job",
    description: "Curated fresher-friendly roles with clear salary ranges and real employer feedback.",
    perks: ["Interview prep playbooks", "Salary benchmarking", "Campus-to-corporate mentors"],
    fee: "Platform verification: ₹199 / 6 months",
  },
  {
    title: "Get an Internship",
    description: "Flexible, skill-aligned internships with stipend clarity and certificate support.",
    perks: ["Work hour flexibility", "Project-based assessments", "Direct recruiter responses"],
    fee: "No hidden charges; pay only after confirmation",
  },
  {
    title: "Pitch Your Venture",
    description: "Share your business idea and match with mentors, grants, and startup services.",
    perks: ["Funding templates", "Mentor hours", "Launch checklists"],
    fee: "Complimentary for students",
  },
];

const featuredCompanies = [
  {
    name: "Innovate Solutions Co.",
    focus: "Product & Growth",
    perks: "₹4,999 annual listing after 2-month trial",
    docs: "GSTIN, e-commerce certificate, or founder ID accepted",
    roles: ["Growth Analyst", "Product Intern", "Customer Success Fellow"],
  },
  {
    name: "FutureStack Labs",
    focus: "Engineering",
    perks: "Hands-on builds, flexible hours, paid sprints",
    docs: "Startup registration or accelerator letter",
    roles: ["Full-stack Trainee", "QA Explorer", "DevOps Apprentice"],
  },
  {
    name: "Community Impact Hub",
    focus: "Operations & Partnerships",
    perks: "Field projects, stipend clarity, letters of experience",
    docs: "NGO registration, MSME certificate, or MoU",
    roles: ["Ops Fellow", "Partnerships Scout", "Program Assistant"],
  },
];

const templateText = `The Vision & The Team
Business Name: Innovate Solutions Co.
[Craft a name that is memorable, relevant to your industry, and has an available domain.]
Tagline: "___________________________________________________"
Example: "Bridging the Gap Between Food Waste and Community Nourishment."
Founder's Pledge:
"My name is [Your Name], a final-year student at [Your College/University]. 
Driven by a passion for [Your Industry/Field] and a desire to create tangible impact, I founded [Business
 Name] to address a critical challenge I witnessed firsthand. You can reach me at [Your Email] or [Your
 Phone Number] to discuss this vision further."
The Driving Force: Our Team
We are not just classmates; we are a multidisciplinary team united by a shared mission.
O O
[Team Member 1 Name], Role (e.g., Chief Technology Officer): Brings expertise in [Specific Skill, e.g.,
 full-stack development, AI integration] from their projects in [Relevant Experience].
[Team Member 2 Name], Role (e.g., Head of Marketing): A creative force with a proven track record in
 [Specific Skill, e.g., digital marketing campaigns, brand storytelling].
[Team Member 3 Name], Role (e.g., Operations Lead): Ensures seamless execution with their strong
 background in [Specific Skill, e.g., project management, logistics].
The Problem We Observed: A Market Gap
Currently, [Your Target Audience] struggles with [Describe the core problem in a relatable way]. Existing
 solutions are often [List 2-3 key pain points: e.g., too expensive, overly complex, inaccessible, or
 inefficient]. This results in [The negative consequence for the customer and the market], creating a
 significant gap for a smarter, more human-centric solution.
Our Human-Centric Solution
[Business Name] addresses this by providing [Describe your solution simply]. We don't just offer a
 product/service; we offer an experience that is [List 3 key adjectives: e.g., intuitive, affordable, and
 empowering]. Our solution directly alleviates the frustrations of [The Problem] by [Explain the
 mechanism simply], making our customers' lives noticeably easier and better.
Our Target Customers: Who We Serve
We have a clear focus on serving [Specific Audience Description]. These are individuals/businesses who
 are typically [Describe their demographics, behaviors, and psychographics]. For example, "Urban
 millennials who value sustainability but lack time for eco-friendly shopping," or "Local small businesses
 struggling with inefficient inventory management."
The Opportunity: Market Size
The total addressable market in our region is approximately [X] potential customers, representing a
 market value of roughly ₹[Y] Crores. Our initial serviceable available market (SAM) is [Z] customers in
 [Specific Geographic Area], with a potential revenue of ₹[A] Lakhs, demonstrating a substantial and
 viable opportunity for a scalable startup.
Learning from the Competition
We respect our main competitors: 
O O
 [Competitor A], [Competitor B], and [Competitor C], and [Competitor
 D],and [Competitor E]
 Their Strengths: They have [e.g., established brand recognition, extensive
 funding, a broad feature set].
 Their Weaknesses: However, they often fall short in [e.g., personalized customer service, affordability
 for our specific niche, user-friendly design]. This is where we see our opening.
Our Competitive Edge: Why We Will Succeed
 Our unique selling proposition is threefold:
 Unmatched Personalization: We offer a level of customization and direct support that larger players
 cannot.
 Affordability & Accessibility: Our pricing model is designed to be inclusive without compromising on
 quality.
 Focus on [Your Nuke]: We are solely dedicated to solving [The Problem] for [Your Target Audience],
 making us the specialists, not generalists.
Bringing the Idea to Life
 Our Core Offering
 We are offering a [Product/Service Category] that provides [Core Value Proposition]. It is designed to be
 [Describe its primary characteristic, e.g., a SaaS platform, a physical product with a service component, a
 community-driven marketplace].
 Key Features & Customer Benefits
 Feature 1: [e.g., AI-Powered Dashboard] → Benefit: Saves our customers hours of manual work each week.
 Feature 2: [e.g., Subscription Box with Customizable Options] → Benefit: Delivers convenience and a
 personalized experience directly to their doorstep.
 Feature 3: [e.g., Dedicated Customer Success Manager] → Benefit: Ensures they feel supported and
 valued, not just like another ticket number.
 The Technology Behind the Scenes
 To operate efficiently, we will leverage:
 Software/Tools: [e.g., Cloud Hosting (AWS/Google Cloud), CRM Software, Analytics Tools]. 
(keep it simple) 
O O
 Hardware/Production: [e.g., Specific manufacturing equipment, logistics partner APIs].
 Core Platform: [e.g., Our proprietary mobile app built on React Native].
 Our Current Journey: The Stage We're At
 We are currently in the [Idea/Prototype/Ready to Launch] stage.
 If Idea: We have conducted extensive market research, built wireframes, and validated the concept with
 over [Number] potential customers.
 If Prototype: We have a working prototype/MVP and are running a private beta with a select group of
 users to gather feedback.
 If Ready to Launch: All systems are developed, tested, and we are prepared for a public launch within
 [Timeline] of securing funding.
Sustainable Financial Model
 How We Create Value & Revenue
 Our revenue model is designed for sustainability and growth through:
 Primary Stream: [e.g., Subscription Fees (SaaS), Transaction Commissions, Direct Product Sales].
 Secondary Streams: [e.g., Premium Support Tiers, Affiliate Partnerships, White-labeling Services].
 Our Pricing Philosophy
 We believe in transparent and fair pricing.
 O O
 Strategy: We employ a [e.g., Freemium / Tiered Pricing / Value-Based Pricing] model.
 Structure: Our entry-level plan starts at ₹[X]/month for core features, with our premium
 plan at ₹[Y]/month offering advanced capabilities, positioning us competitively while
 ensuring healthy margins.
 Fueling Our Initial Growth: Funding Request
 To accelerate our development and market entry, we are seeking an initial investment of
 ₹x amount.
 Team & Contingency (10% - ₹50,000): To support core team efforts and provide a buffer for unforeseen expenses.
Our Growth Journey
 First 3 Months (With Stootap's Guidance):
 Refine our idea with expert mentorship.
 Launch a basic version and get our first 50 users.
 Build our first operational workflows.
 Next 6 Months (Making an Impact):
 Grow to 500 happy users.
 Achieve consistent monthly revenue.
 Implement key feedback from our early users.
 One Year from Now:
 Become the go-to solution for [Your Niche] in our city.
 Explore expanding to a new feature or location.
 The Bigger Picture:
 O O
 We're here to make a lasting, positive impact by [Your Value Proposition, e.g., making life easier, supporting
 local communities, or promoting sustainability].
 Why Partner With Us?
 We are a passionate, dedicated team with the energy and drive to see this through. We have the initial idea
 and the will to execute, and we know that with the right guidance, we can build something amazing.
 Our Offer:
 In exchange for the investment of ₹x and, most importantly, the expert guidance from Stootap, we are offering [X]%
 equity in [Business Name].
Our Commitment & Stootap's Support
 We are fully committed to this venture and are confident in the opportunity we've identified. We are
 thrilled by the prospect of working with Stootap, because Stootap is here for our help.
 We understand that Stootap has everything a young business like ours could need. From this point
 forward, we look to Stootap to guide us, and we will focus on executing the plan you help us chart.
 Our List of Required Needs for Stootap:
 Please help us with the following to build a strong foundation for our business:
 Structured Business Plan Finalization: A clear, step-by-step roadmap for the next 12 months.
 Legal & Registration Framework: Guidance on the best business structure (LLP, Pvt. Ltd., etc.) and help
 with the registration process.
 Financial Model & Accounting Setup: A simple, robust financial model for tracking and a recommended
 accounting system.
 Mentorship & Expert Access: Connections to mentors in [Your Industry, e.g., SaaS, E-commerce] for
 specialized advice.
 O O
 Technology & Tool Stack: Recommendations for the best and most affordable software, platforms, and
 tools for our specific needs.
 Marketing & Launch Playbook: A tailored strategy for our initial customer acquisition and brand launch.
 Pitch Deck Refinement: Professional help in crafting our story for future investors.
 Networking Introductions: Introductions to potential partners, vendors, or pilot customers.
 For [Business Name]:
 [Your Name]
 Founder
 Date: [Date]
 For Stootap:
 [Representative Name]
 [Title], Stootap
 Date: [Date]
 Company Stamp/Seal:
 [Space for Stamp/Seal]
`;

export default function Students() {
  const { toast } = useToast();
  const [selectedCompany, setSelectedCompany] = useState(featuredCompanies[0]);
  const [careerForm, setCareerForm] = useState({
    name: "",
    email: "",
    college: "",
    goal: "Get a job",
    preferredRole: "",
    availability: "Hybrid",
    experience: "Fresher",
  });
  const [applicationForm, setApplicationForm] = useState({
    company: featuredCompanies[0].name,
    role: featuredCompanies[0].roles[0],
    experience: "Fresher",
    flexibility: "Remote",
    hoursPerWeek: 20,
    days: "Mon-Fri",
    college: "",
    account: "",
    cvLink: "",
  });

  const templateBlobUrl = useMemo(() => {
    const blob = new Blob([templateText], { type: "application/pdf" });
    return URL.createObjectURL(blob);
  }, []);

  const handleCareerSubmit = () => {
    toast({
      title: "Submitted to Admin Dashboard",
      description: "Your interest has been logged for the admin team to match you with a role.",
    });
  };

  const handleCompanyChange = (companyName: string) => {
    const company = featuredCompanies.find((c) => c.name === companyName) ?? featuredCompanies[0];
    setSelectedCompany(company);
    setApplicationForm((prev) => ({
      ...prev,
      company: company.name,
      role: company.roles[0],
    }));
  };

  const handleApplicationSubmit = () => {
    toast({
      title: "Application captured",
      description: "Details are ready for review in the admin dashboard with your CV preferences.",
    });
  };

  const handleTemplateDownload = () => {
    const link = document.createElement("a");
    link.href = templateBlobUrl;
    link.download = "Stootap_Student_Vision_Template.pdf";
    link.click();
  };

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
                  Student Career & Startup Desk
                </Badge>
              </motion.div>
              <motion.h1 
                variants={fadeIn}
                className="text-5xl lg:text-7xl font-bold font-heading mb-6"
              >
                <span className="text-gray-900 dark:text-gray-100">Launch Your Career or</span>
                <span className="block mt-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Build Your Own Startup</span>
              </motion.h1>
              <motion.p variants={fadeIn} className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                Get internships, jobs, or a funded startup playbook with one hub that routes every response to the Stootap admin dashboard for faster follow-ups.
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

        {/* Career Launchpad */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-start">
              <div>
                <div className="text-center lg:text-left max-w-3xl mb-10">
                  <Badge className="mb-4">Career Hub</Badge>
                  <h2 className="text-4xl font-bold font-heading mb-4">Jobs, Internships, and Startup Tracks</h2>
                  <p className="text-lg text-muted-foreground">
                    Tell us your goal and we will queue your request inside the admin dashboard so mentors can respond quickly.
                    Paid opportunities carry a ₹199 / 6 months platform fee to keep spam away.
                  </p>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  {careerTracks.map((track) => (
                    <Card key={track.title} className="hover-elevate h-full">
                      <CardHeader>
                        <CardTitle>{track.title}</CardTitle>
                        <CardDescription>{track.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <ul className="space-y-2">
                          {track.perks.map((perk) => (
                            <li key={perk} className="flex items-start gap-2 text-sm">
                              <CheckCircle2 className="h-4 w-4 text-accent mt-0.5" />
                              <span>{perk}</span>
                            </li>
                          ))}
                        </ul>
                        <Badge variant="secondary">{track.fee}</Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Share Your Interest</CardTitle>
                  <CardDescription>We collect the details in the admin dashboard for a guided response.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Name</label>
                      <Input
                        value={careerForm.name}
                        onChange={(e) => setCareerForm({ ...careerForm, name: e.target.value })}
                        placeholder="Your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">College</label>
                      <Input
                        value={careerForm.college}
                        onChange={(e) => setCareerForm({ ...careerForm, college: e.target.value })}
                        placeholder="E.g., NIT Trichy"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <Input
                        value={careerForm.email}
                        onChange={(e) => setCareerForm({ ...careerForm, email: e.target.value })}
                        type="email"
                        placeholder="you@college.edu"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Goal</label>
                      <Input
                        value={careerForm.goal}
                        onChange={(e) => setCareerForm({ ...careerForm, goal: e.target.value })}
                        placeholder="Get a job / internship / launch startup"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Preferred Role</label>
                      <Input
                        value={careerForm.preferredRole}
                        onChange={(e) => setCareerForm({ ...careerForm, preferredRole: e.target.value })}
                        placeholder="Product intern, Growth associate, etc."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Availability</label>
                      <Input
                        value={careerForm.availability}
                        onChange={(e) => setCareerForm({ ...careerForm, availability: e.target.value })}
                        placeholder="Remote / Hybrid / Onsite"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Experience Snapshot</label>
                    <Textarea
                      value={careerForm.experience}
                      onChange={(e) => setCareerForm({ ...careerForm, experience: e.target.value })}
                      placeholder="Fresher, 6-month intern, hackathon wins, etc."
                      className="min-h-[100px]"
                    />
                  </div>
                  <Button className="w-full" onClick={handleCareerSubmit}>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Submit to Admin Desk
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    We use this to nudge mentors, recruiters, and the admin dashboard for faster callbacks.
                  </p>
                </CardContent>
              </Card>
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

        {/* Featured Companies & Applications */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-start">
              <div>
                <div className="text-center lg:text-left max-w-3xl mb-10">
                  <Badge className="mb-4 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">Paid Roles</Badge>
                  <h2 className="text-4xl font-bold font-heading mb-4">Apply to Featured Companies</h2>
                  <p className="text-lg text-muted-foreground">
                    Choose a company, pick a position, and share your CV preferences. Applications (including ₹199 / 6 month platform
                    fee for paid roles) are routed to the admin dashboard so recruiters can respond quickly.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {featuredCompanies.map((company) => (
                    <Card
                      key={company.name}
                      className={`h-full cursor-pointer transition-all ${selectedCompany.name === company.name ? "ring-2 ring-accent" : "hover-elevate"}`}
                      onClick={() => handleCompanyChange(company.name)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle>{company.name}</CardTitle>
                            <CardDescription>{company.focus}</CardDescription>
                          </div>
                          <Badge variant="secondary">₹4,999/yr</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3 text-sm">
                        <p className="text-muted-foreground">Listing starts free for 2 months, then ₹4,999 per year.</p>
                        <div className="flex items-start gap-2">
                          <FileText className="h-4 w-4 text-accent mt-0.5" />
                          <span>{company.docs}</span>
                        </div>
                        <div className="space-y-1">
                          <p className="font-semibold">Open roles</p>
                          <div className="flex flex-wrap gap-2">
                            {company.roles.map((role) => (
                              <Badge key={role} variant="outline">{role}</Badge>
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">Companies get a login after verification so they can manage applicants directly.</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Apply to a Featured Company</CardTitle>
                  <CardDescription>Share your flexibility, hours, and college details for stipend routing.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Company</label>
                      <Input
                        value={applicationForm.company}
                        onChange={(e) => handleCompanyChange(e.target.value)}
                        list="company-options"
                      />
                      <datalist id="company-options">
                        {featuredCompanies.map((company) => (
                          <option key={company.name} value={company.name} />
                        ))}
                      </datalist>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Role</label>
                      <Input
                        value={applicationForm.role}
                        onChange={(e) => setApplicationForm({ ...applicationForm, role: e.target.value })}
                        placeholder="Choose from featured positions"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Experience</label>
                      <Input
                        value={applicationForm.experience}
                        onChange={(e) => setApplicationForm({ ...applicationForm, experience: e.target.value })}
                        placeholder="Fresher / 6 months / 1+ year"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Work Mode</label>
                      <Input
                        value={applicationForm.flexibility}
                        onChange={(e) => setApplicationForm({ ...applicationForm, flexibility: e.target.value })}
                        placeholder="Remote / Hybrid / Onsite"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Hours per Week</label>
                      <Input
                        type="number"
                        min={5}
                        value={applicationForm.hoursPerWeek}
                        onChange={(e) => setApplicationForm({ ...applicationForm, hoursPerWeek: Number(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Working Days</label>
                      <Input
                        value={applicationForm.days}
                        onChange={(e) => setApplicationForm({ ...applicationForm, days: e.target.value })}
                        placeholder="Mon-Fri / Weekends"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">College</label>
                      <Input
                        value={applicationForm.college}
                        onChange={(e) => setApplicationForm({ ...applicationForm, college: e.target.value })}
                        placeholder="College for verification"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Account Details for Salary</label>
                      <Input
                        value={applicationForm.account}
                        onChange={(e) => setApplicationForm({ ...applicationForm, account: e.target.value })}
                        placeholder="UPI or bank (encrypted for admin)"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">CV / Portfolio Link</label>
                    <Textarea
                      value={applicationForm.cvLink}
                      onChange={(e) => setApplicationForm({ ...applicationForm, cvLink: e.target.value })}
                      placeholder="Drive/Notion/Portfolio URL"
                      className="min-h-[90px]"
                    />
                  </div>
                  <Button className="w-full" onClick={handleApplicationSubmit}>
                    <Briefcase className="mr-2 h-4 w-4" />
                    Submit & Pay Platform Fee Later
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Admins can upload, edit, or delete your supporting documents from the dashboard once you share them.
                  </p>
                </CardContent>
              </Card>
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

        {/* Founder Toolkit & Company Listing */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="grid md:grid-cols-2 gap-6 items-stretch">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Download Your Venture Vision Template (PDF)</CardTitle>
                  <CardDescription>
                    A fill-in-the-blank guide covering vision, market gap, tech stack, finances, and partnership asks tailored for students.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-accent mt-0.5" />
                      <span>Complete "The Vision & The Team" statement with pledge and team bios.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Target className="h-4 w-4 text-accent mt-0.5" />
                      <span>Market gap, solution, competition, and USP prompts ready for investor decks.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FileText className="h-4 w-4 text-accent mt-0.5" />
                      <span>Financial model, funding ask, and growth roadmap tailored to student founders.</span>
                    </li>
                  </ul>
                  <Button className="w-full" onClick={handleTemplateDownload}>
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF Template
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">Use it for applications, investor outreach, or admin reviews.</p>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>List Your Company on Stootap</CardTitle>
                  <CardDescription>
                    Company login + dashboard after verification. Optional documents (GSTIN, e-commerce proof, MSME/NGO letters) accepted.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p className="font-semibold text-foreground">How it works</p>
                    <p>2-month free listing → ₹4,999/year. Add roles, upload/delete files, and manage applicants in the admin dashboard.</p>
                    <p>Set paid opportunities with a ₹199 / 6 month platform fee for talent; collect CVs, availability, and salary accounts securely.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Badge variant="secondary" className="justify-center">Company login enabled after review</Badge>
                    <Badge variant="outline" className="justify-center">Document uploads optional</Badge>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Registration Type</label>
                    <Input placeholder="LLP / Pvt Ltd / MSME / NGO" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Documents (if any)</label>
                    <Input placeholder="GSTIN, incorporation cert, or leave blank" />
                  </div>
                  <Link href="/contact">
                    <Button className="w-full" variant="outline">
                      <Users className="mr-2 h-4 w-4" />
                      Request Company Login
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
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
