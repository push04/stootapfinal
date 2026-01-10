import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PackageInquiryForm } from "@/components/PackageInquiryForm";
import {
    Building2,
    Rocket,
    TrendingUp,
    Crown,
    GraduationCap,
    CheckCircle2,
    ArrowRight,
    IndianRupee,
    FileText,
    Shield,
    Users,
    Target,
    Briefcase,
    LineChart,
    Scale,
    Award,
    Zap
} from "lucide-react";
import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { ShinyButton } from "@/components/ui/shiny-button";

const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

const packages = [
    {
        id: "foundation",
        name: "Foundation Package",
        tagline: "From Idea to Legal Reality",
        price: "65,000",
        icon: Building2,
        color: "bg-blue-600",
        forWhom: "First-time founders or early-stage ideas that need clarity, legality, and structure.",
        serviceCount: "22",
        services: [
            "Idea validation & feasibility analysis",
            "Market & problem understanding",
            "Business category & industry mapping",
            "Revenue model selection",
            "Basic competitor landscape",
            "Business structure planning",
            "Company name advisory",
            "Legal entity selection (Pvt Ltd / LLP / OPC)",
            "Company incorporation",
            "PAN & TAN registration",
            "GST registration",
            "MSME (Udyam) registration",
            "Current account advisory & checklist",
            "Basic compliance calendar (12 months)",
            "Shareholding & ownership structure",
            "Founder role definition",
            "Basic pricing logic",
            "Vendor & operational requirement list",
            "Simple execution roadmap (6–7 months)",
            "Risk & compliance overview",
            "Founder orientation session",
            "Handover & documentation pack"
        ],
        outcomes: [
            "Business becomes real",
            "Business becomes legal",
            "Founder gets clarity & direction"
        ]
    },
    {
        id: "startup-launch",
        name: "Startup Launch Package",
        tagline: "From Legal Setup to Market Entry",
        price: "1,50,000",
        icon: Rocket,
        color: "bg-orange-600",
        forWhom: "Founders ready to launch publicly, onboard customers, and start operations.",
        serviceCount: "25+",
        includesFrom: "Foundation Package",
        services: [
            "Brand positioning & value proposition",
            "Brand name finalisation support",
            "Basic brand identity direction",
            "Domain & digital asset advisory",
            "Website structure planning (pages & flow)",
            "Website content framework",
            "Basic landing website (informational)",
            "Email & business communication setup",
            "Pricing strategy & packages",
            "Customer persona definition",
            "Go-to-market strategy",
            "Sales funnel planning",
            "Vendor onboarding checklist",
            "Internal process mapping",
            "Simple CRM flow design",
            "Basic marketing roadmap (90 days)",
            "Cost & burn estimation",
            "Break-even logic",
            "Compliance readiness review",
            "Founder pitch narrative",
            "Legal agreements list (MOUs, NDAs, etc.)",
            "First-hire planning",
            "Task & execution tracker",
            "Weekly review structure",
            "Launch readiness audit"
        ],
        outcomes: [
            "Business is visible",
            "Business can sell",
            "Business can operate independently"
        ]
    },
    {
        id: "growth-systems",
        name: "Growth & Systems Package",
        tagline: "From Startup to Structured Company",
        price: "3,00,000",
        icon: TrendingUp,
        color: "bg-green-600",
        forWhom: "Companies that want systems, scale, and professional operations.",
        serviceCount: "30+",
        includesFrom: "Launch Package",
        services: [
            "Advanced business model optimisation",
            "Unit economics & margin improvement",
            "Department-wise structure (Sales, Ops, Finance, HR)",
            "SOP creation (core processes)",
            "Sales system & pipeline setup",
            "Marketing execution strategy",
            "Performance KPIs for teams",
            "Hiring roadmap (6–12 months)",
            "HR policy framework",
            "Payroll & compliance workflow",
            "Vendor contract structuring",
            "Legal agreement drafting support",
            "Advanced website (conversion-focused)",
            "CRM tool setup & training",
            "Marketing campaign planning",
            "Content strategy framework",
            "Customer onboarding journey",
            "Customer retention strategy",
            "Finance tracking system",
            "Monthly MIS structure",
            "Compliance monitoring system",
            "Risk management framework",
            "Internal review & reporting structure",
            "Founder time-management framework",
            "Delegation & leadership structure",
            "Growth roadmap (12 months)",
            "Investor readiness checklist",
            "Pitch deck advisory",
            "Brand consistency guidelines",
            "Quarterly strategy reviews"
        ],
        outcomes: [
            "Business runs on systems",
            "Founder moves from operator to leader",
            "Company becomes scalable"
        ]
    },
    {
        id: "scale-investor",
        name: "Scale & Investor Package",
        tagline: "From Growth to Fund-Ready Company",
        price: "5,00,000",
        icon: Crown,
        color: "bg-purple-600",
        forWhom: "Companies preparing for funding, partnerships, or aggressive expansion.",
        serviceCount: "35+",
        includesFrom: "Growth & Systems Package",
        services: [
            "Investment-ready business structuring",
            "Cap table planning & optimisation",
            "Valuation logic support",
            "Investor pitch deck creation",
            "Financial projections (3–5 years)",
            "Fund utilisation strategy",
            "Due-diligence readiness",
            "Legal compliance deep audit",
            "Shareholder agreements advisory",
            "ESOP planning",
            "Advanced branding & positioning",
            "PR & visibility strategy",
            "Partnership & alliance framework",
            "Expansion strategy (city/state/national)",
            "Marketing scale plan",
            "Sales team structure",
            "Leadership hiring strategy",
            "CXO advisory structure",
            "Board & governance setup",
            "MIS & reporting for investors",
            "Advanced CRM & analytics",
            "Performance dashboards",
            "Cost optimisation strategy",
            "Compliance automation",
            "Risk mitigation plan",
            "Customer lifetime value optimisation",
            "Brand authority framework",
            "Media & communication narrative",
            "Founder public profile positioning",
            "Monthly strategy calls",
            "Quarterly board-level reviews",
            "Growth tracking KPIs",
            "Exit readiness basics",
            "Documentation & data room setup",
            "Strategic advisory access"
        ],
        outcomes: [
            "Company becomes investment-ready",
            "Governance & credibility established",
            "Long-term scale unlocked"
        ]
    },
    {
        id: "student-essentials",
        name: "Student Startup Essentials",
        tagline: "Start Right. Stay Legal. Spend Smart.",
        price: "40,000",
        icon: GraduationCap,
        color: "bg-amber-600",
        forWhom: "Students, first-time founders, college startups, bootstrapped ideas.",
        serviceCount: "20",
        isStudentPackage: true,
        services: [
            "Idea validation & feasibility discussion",
            "Problem–solution fit assessment",
            "Industry & category guidance",
            "Business model selection (lean-friendly)",
            "Legal entity recommendation (best for students)",
            "Company registration / LLP / OPC setup",
            "PAN & TAN registration",
            "GST registration (if applicable)",
            "MSME (Udyam) registration",
            "Current account advisory & checklist",
            "Basic compliance setup",
            "Cost-saving legal structure planning",
            "Founder ownership & role clarity",
            "Pricing & revenue logic (student-friendly)",
            "Vendor & tool recommendations",
            "Simple go-to-market direction",
            "90-day execution roadmap",
            "Mistake-prevention advisory (common startup errors)",
            "Budget & expense planning",
            "Founder orientation & handover kit"
        ],
        outcomes: [
            "Startup becomes legally operable",
            "Student avoids over-spending",
            "Idea is structured for real execution"
        ],
        perfectFor: "College projects turning into startups, hackathon winners, student founders, side-hustles becoming serious."
    }
];

export default function CompanyPackages() {
    const [showInquiryForm, setShowInquiryForm] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState<string>("");
    const [activeTab, setActiveTab] = useState("all");

    const handlePackageSelect = (packageId: string) => {
        setSelectedPackage(packageId);
        setShowInquiryForm(true);
    };

    const filteredPackages = activeTab === "all"
        ? packages
        : activeTab === "student"
            ? packages.filter(p => p.isStudentPackage)
            : packages.filter(p => !p.isStudentPackage);

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <PackageInquiryForm
                open={showInquiryForm}
                onOpenChange={setShowInquiryForm}
                selectedPackage={selectedPackage}
            />
            <Navigation />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative py-20 lg:py-28 bg-gradient-to-br from-primary/10 via-background to-muted overflow-hidden dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900">
                    <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-700/20 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

                    <div className="container mx-auto px-4 relative">
                        <div className="max-w-4xl mx-auto text-center">
                            <motion.div {...fadeIn}>
                                <Badge className="mb-6 bg-primary/20 text-primary border-primary/30 py-2 px-4">
                                    <Building2 className="mr-2 h-4 w-4" />
                                    Company Building Packages
                                </Badge>
                            </motion.div>

                            <motion.h1
                                {...fadeIn}
                                className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6"
                            >
                                We don't just register companies.
                                <span className="block text-primary mt-2">We architect businesses.</span>
                            </motion.h1>

                            <motion.p
                                {...fadeIn}
                                className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
                            >
                                From idea validation to investor readiness — choose the package that matches your stage and let us build your business foundation.
                            </motion.p>

                            <motion.div {...fadeIn} className="flex flex-col sm:flex-row gap-4 justify-center">
                                <ShinyButton
                                    className="text-lg px-8 py-6 shadow-lg h-auto"
                                    onClick={() => setShowInquiryForm(true)}
                                >
                                    <Briefcase className="mr-2 h-5 w-5 inline-block" />
                                    Get Started Today
                                </ShinyButton>
                                <Link href="/mentorship">
                                    <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                                        <Users className="mr-2 h-5 w-5" />
                                        Talk to a Mentor First
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </section>


                {/* Stats Section */}
                <section className="py-12 bg-primary">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {[
                                { label: "Companies Built", value: "4+", icon: Building2 },
                                { label: "Success Rate", value: "100%", icon: Target },
                                { label: "Avg. Time to Launch", value: "90 Days", icon: Zap },
                                { label: "Funding Raised", value: "₹4.5 Lakhs", icon: IndianRupee }
                            ].map((stat, index) => (
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

                {/* Packages Section */}
                <section className="py-20">
                    <div className="container mx-auto px-4">
                        <div className="text-center max-w-2xl mx-auto mb-12">
                            <Badge className="mb-4" variant="secondary">
                                <FileText className="mr-1 h-3 w-3" />
                                Choose Your Package
                            </Badge>
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                                Five Packages. One Goal: Your Success.
                            </h2>
                            <p className="text-muted-foreground">
                                Each package is designed for a specific stage of business — from first-time founders to scale-ready companies.
                            </p>
                        </div>

                        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
                            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
                                <TabsTrigger value="all">All Packages</TabsTrigger>
                                <TabsTrigger value="business">Business</TabsTrigger>
                                <TabsTrigger value="student">Student</TabsTrigger>
                            </TabsList>
                        </Tabs>

                        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
                            {filteredPackages.map((pkg, index) => (
                                <motion.div
                                    key={pkg.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <Card className={`h-full hover:shadow-xl transition-all duration-300 border-2 ${pkg.isStudentPackage ? 'border-amber-300 dark:border-amber-600' : 'border-border/50'} flex flex-col`}>
                                        <CardHeader className="pb-4">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className={`w-14 h-14 rounded-xl ${pkg.color} flex items-center justify-center shadow-lg`}>
                                                    <pkg.icon className="h-7 w-7 text-white" />
                                                </div>
                                                {pkg.isStudentPackage && (
                                                    <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">
                                                        Student Special
                                                    </Badge>
                                                )}
                                            </div>
                                            <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                                            <CardDescription className="text-base italic">"{pkg.tagline}"</CardDescription>
                                            <div className="flex items-baseline gap-1 mt-4">
                                                <span className="text-sm text-muted-foreground">Stootap Fees:</span>
                                                <span className="text-3xl font-bold text-primary">₹{pkg.price}</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground">+ Government Fees: Actuals</p>
                                        </CardHeader>

                                        <CardContent className="flex-1 flex flex-col">
                                            <div className="mb-4">
                                                <p className="text-sm font-medium text-foreground mb-2">Who this is for:</p>
                                                <p className="text-sm text-muted-foreground">{pkg.forWhom}</p>
                                            </div>

                                            {pkg.includesFrom && (
                                                <div className="mb-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
                                                    <p className="text-sm text-primary font-medium">
                                                        ✓ Includes everything in {pkg.includesFrom}, plus:
                                                    </p>
                                                </div>
                                            )}

                                            <div className="mb-6">
                                                <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                                                    <FileText className="h-4 w-4" />
                                                    {pkg.serviceCount} Services Included
                                                </p>
                                                <ul className="space-y-1.5 max-h-48 overflow-y-auto pr-2">
                                                    {pkg.services.slice(0, 8).map((service, i) => (
                                                        <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                                                            <CheckCircle2 className="h-3.5 w-3.5 text-primary mt-0.5 flex-shrink-0" />
                                                            <span>{service}</span>
                                                        </li>
                                                    ))}
                                                    {pkg.services.length > 8 && (
                                                        <li className="text-xs text-primary font-medium pt-1">
                                                            + {pkg.services.length - 8} more services...
                                                        </li>
                                                    )}
                                                </ul>
                                            </div>

                                            <div className="mb-6 p-4 bg-muted/50 rounded-lg">
                                                <p className="text-sm font-semibold text-foreground mb-2">Outcomes:</p>
                                                <ul className="space-y-1">
                                                    {pkg.outcomes.map((outcome, i) => (
                                                        <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                                                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                                                            {outcome}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {pkg.perfectFor && (
                                                <div className="mb-6 text-xs text-muted-foreground">
                                                    <span className="font-medium">Perfect for:</span> {pkg.perfectFor}
                                                </div>
                                            )}

                                            <div className="mt-auto">
                                                <Button
                                                    className="w-full"
                                                    size="lg"
                                                    onClick={() => handlePackageSelect(pkg.id)}
                                                >
                                                    Get Started
                                                    <ArrowRight className="ml-2 h-4 w-4" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Why Choose Us Section */}
                <section className="py-20 bg-muted/30">
                    <div className="container mx-auto px-4">
                        <div className="text-center max-w-2xl mx-auto mb-12">
                            <Badge className="mb-4" variant="secondary">
                                <Award className="mr-1 h-3 w-3" />
                                Why Stootap
                            </Badge>
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                                More Than Just Registration
                            </h2>
                            <p className="text-muted-foreground">
                                We're not paper-pushers. We're business architects who understand what it takes to build companies that last.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            {[
                                {
                                    icon: Target,
                                    title: "Strategic Clarity",
                                    description: "Every package includes strategic planning — not just paperwork. We help you understand where you're going."
                                },
                                {
                                    icon: Shield,
                                    title: "Full Compliance",
                                    description: "Stay legal, stay safe. From Day 1 compliance to ongoing monitoring, we've got you covered."
                                },
                                {
                                    icon: LineChart,
                                    title: "Growth-Ready",
                                    description: "Our systems are designed for scale. When you're ready to grow, your foundation is already solid."
                                }
                            ].map((feature, index) => (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <Card className="h-full text-center hover:shadow-md transition-shadow">
                                        <CardContent className="p-8">
                                            <feature.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                                            <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                                            <p className="text-muted-foreground">{feature.description}</p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 bg-primary">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl mx-auto text-center text-primary-foreground">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">
                                Ready to Build Your Business?
                            </h2>
                            <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
                                Not sure which package is right for you? Let's talk. Our team will help you find the perfect fit for your stage and goals.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button
                                    size="lg"
                                    variant="secondary"
                                    className="text-lg px-8 py-6"
                                    onClick={() => setShowInquiryForm(true)}
                                >
                                    <Briefcase className="mr-2 h-5 w-5" />
                                    Get Started Now
                                </Button>
                                <Link href="/contact">
                                    <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                                        <Users className="mr-2 h-5 w-5" />
                                        Contact Us
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
