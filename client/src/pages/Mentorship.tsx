import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MentorshipBookingForm } from "@/components/MentorshipBookingForm";
import {
    User,
    Calendar,
    Clock,
    CheckCircle2,
    ArrowRight,
    IndianRupee,
    Target,
    Lightbulb,
    TrendingUp,
    Users,
    Building2,
    Briefcase,
    Brain,
    MessageCircle,
    Zap,
    Shield,
    GraduationCap,
    Award,
    Star
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";

const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

const discussionTopics = [
    { icon: Lightbulb, text: "Business idea validation" },
    { icon: Target, text: "Whether your idea is worth building" },
    { icon: IndianRupee, text: "How much it will actually cost to build" },
    { icon: Building2, text: "Right business model for your industry" },
    { icon: Shield, text: "Legal structure & compliance doubts" },
    { icon: TrendingUp, text: "Scaling strategy" },
    { icon: Users, text: "Hiring & team structure" },
    { icon: Brain, text: "Training systems" },
    { icon: Briefcase, text: "Marketing strategy" },
    { icon: IndianRupee, text: "Sales & pricing issues" },
    { icon: Target, text: "Customer acquisition problems" },
    { icon: Zap, text: "Operational challenges" },
    { icon: User, text: "Founder decision-making" },
    { icon: Shield, text: "Mistakes to avoid" },
    { icon: TrendingUp, text: "When & how to raise funds" },
    { icon: Lightbulb, text: "Whether to bootstrap or scale" },
    { icon: Building2, text: "Industry-specific insights" },
    { icon: Target, text: "Execution roadmap" },
    { icon: Brain, text: "Business confusion & blockers" }
];

const sessionFormats = [
    {
        id: "standard",
        title: "Standard 1-on-1 Session",
        duration: "60 Minutes",
        price: "5,000",
        studentPrice: "3,750",
        hasStudentDiscount: true,
        popular: true,
        features: [
            "One focused business topic",
            "Actionable takeaways",
            "Follow-up notes via email"
        ]
    },
    {
        id: "extended",
        title: "90-Minute Deep Dive",
        duration: "90 Minutes",
        price: "7,500",
        features: [
            "Multiple complex topics",
            "In-depth strategy session",
            "Detailed action plan",
            "Priority email support (7 days)"
        ]
    },
    {
        id: "retainer",
        title: "Monthly Strategy Retainer",
        duration: "Ongoing",
        price: "25,000",
        priceLabel: "/month",
        features: [
            "4 sessions per month",
            "Unlimited async support",
            "Priority scheduling",
            "Business review & tracking",
            "Direct WhatsApp access"
        ]
    }
];

const outcomes = [
    { icon: Target, text: "Clear direction", description: "Know exactly what to do next" },
    { icon: Zap, text: "Confident decisions", description: "Stop second-guessing yourself" },
    { icon: Clock, text: "Time & money saved", description: "Avoid costly mistakes" },
    { icon: Brain, text: "Founder mindset upgrade", description: "Think like a seasoned entrepreneur" }
];

export default function Mentorship() {
    const [showBookingForm, setShowBookingForm] = useState(false);

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <MentorshipBookingForm
                open={showBookingForm}
                onOpenChange={setShowBookingForm}
            />
            <Navigation />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative py-20 lg:py-28 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 overflow-hidden">
                    <div className="absolute inset-0 bg-grid-slate-700/20 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

                    <div className="container mx-auto px-4 relative">
                        <div className="max-w-4xl mx-auto text-center">
                            <motion.div {...fadeIn}>
                                <Badge className="mb-6 bg-primary/20 text-primary border-primary/30 py-2 px-4">
                                    <MessageCircle className="mr-2 h-4 w-4" />
                                    1-on-1 Business Mentorship
                                </Badge>
                            </motion.div>

                            <motion.h1
                                {...fadeIn}
                                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
                            >
                                Talk Directly.
                                <span className="block text-primary mt-2">Decide Clearly.</span>
                            </motion.h1>

                            <motion.p
                                {...fadeIn}
                                className="text-lg md:text-xl text-zinc-300 mb-10 max-w-2xl mx-auto"
                            >
                                A direct, no-fluff, strategic conversation with a business expert to solve real problems, validate decisions, or plan your next move.
                            </motion.p>

                            <motion.div {...fadeIn}>
                                <p className="text-zinc-400 mb-8 italic">
                                    This is not a motivational session. <span className="text-primary font-semibold">This is business clarity.</span>
                                </p>
                            </motion.div>

                            <motion.div {...fadeIn} className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button
                                    size="lg"
                                    className="text-lg px-8 py-6 shadow-lg"
                                    onClick={() => setShowBookingForm(true)}
                                >
                                    <Calendar className="mr-2 h-5 w-5" />
                                    Book Your Session
                                </Button>
                                <Link href="/packages">
                                    <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-zinc-600 text-white hover:bg-zinc-800">
                                        <Building2 className="mr-2 h-5 w-5" />
                                        View Packages Instead
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Mentor Profile Section */}
                <section className="py-20">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                                <motion.div
                                    {...fadeIn}
                                    className="flex-shrink-0"
                                >
                                    <div className="w-48 h-48 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border-4 border-primary/30">
                                        <User className="h-24 w-24 text-primary" />
                                    </div>
                                </motion.div>

                                <motion.div {...fadeIn}>
                                    <Badge className="mb-4" variant="secondary">Your Mentor</Badge>
                                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                                        Namonarayan Divli
                                    </h2>
                                    <p className="text-xl text-primary font-medium mb-4">
                                        Founder – Stootap | Company Builder | Strategic Advisor
                                    </p>
                                    <p className="text-muted-foreground mb-6">
                                        With years of experience building companies from scratch and advising founders across industries, Namonarayan brings practical, no-nonsense guidance to every session. He's seen what works, what fails, and what makes the difference between a struggling startup and a thriving business.
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        <Badge variant="outline">100+ Founders Mentored</Badge>
                                        <Badge variant="outline">50+ Companies Built</Badge>
                                        <Badge variant="outline">₹5Cr+ Funding Raised</Badge>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* What You Can Discuss */}
                <section className="py-20 bg-muted/30">
                    <div className="container mx-auto px-4">
                        <div className="text-center max-w-2xl mx-auto mb-12">
                            <Badge className="mb-4" variant="secondary">
                                <MessageCircle className="mr-1 h-3 w-3" />
                                No Limits
                            </Badge>
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                                What You Can Discuss
                            </h2>
                            <p className="text-muted-foreground">
                                Every session is customized to your needs. Here's what founders typically discuss:
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
                            {discussionTopics.map((topic, index) => (
                                <motion.div
                                    key={topic.text}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.02 }}
                                    viewport={{ once: true }}
                                    className="flex items-center gap-3 p-4 bg-background rounded-lg border border-border/50 hover:border-primary/30 hover:shadow-sm transition-all"
                                >
                                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                                    <span className="text-foreground">{topic.text}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Session Formats & Pricing */}
                <section className="py-20">
                    <div className="container mx-auto px-4">
                        <div className="text-center max-w-2xl mx-auto mb-12">
                            <Badge className="mb-4" variant="secondary">
                                <IndianRupee className="mr-1 h-3 w-3" />
                                Pricing
                            </Badge>
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                                Session Formats & Pricing
                            </h2>
                            <p className="text-muted-foreground">
                                Choose the format that works best for your needs
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            {sessionFormats.map((session, index) => (
                                <motion.div
                                    key={session.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <Card className={`h-full flex flex-col ${session.popular ? 'border-2 border-primary shadow-lg' : ''}`}>
                                        {session.popular && (
                                            <div className="bg-primary text-primary-foreground text-center py-2 text-sm font-medium">
                                                Most Popular
                                            </div>
                                        )}
                                        <CardHeader>
                                            <CardTitle className="text-xl">{session.title}</CardTitle>
                                            <CardDescription className="flex items-center gap-2">
                                                <Clock className="h-4 w-4" />
                                                {session.duration}
                                            </CardDescription>
                                            <div className="pt-4">
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-4xl font-bold text-primary">₹{session.price}</span>
                                                    {session.priceLabel && <span className="text-muted-foreground">{session.priceLabel}</span>}
                                                </div>
                                                {session.hasStudentDiscount && (
                                                    <div className="mt-2 flex items-center gap-2">
                                                        <GraduationCap className="h-4 w-4 text-amber-600" />
                                                        <span className="text-sm">
                                                            <span className="font-semibold text-amber-600">Student Price: ₹{session.studentPrice}</span>
                                                            <span className="text-muted-foreground"> (25% OFF)</span>
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </CardHeader>
                                        <CardContent className="flex-1 flex flex-col">
                                            <ul className="space-y-3 mb-6 flex-1">
                                                {session.features.map((feature, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                                        <span>{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                            <Button
                                                className="w-full"
                                                variant={session.popular ? "default" : "outline"}
                                                onClick={() => setShowBookingForm(true)}
                                            >
                                                Book Now
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            {...fadeIn}
                            className="text-center mt-8 text-muted-foreground"
                        >
                            <p>Extended mentorship options and multiple session bundles available on request.</p>
                        </motion.div>
                    </div>
                </section>

                {/* Outcomes Section */}
                <section className="py-20 bg-muted/30">
                    <div className="container mx-auto px-4">
                        <div className="text-center max-w-2xl mx-auto mb-12">
                            <Badge className="mb-4" variant="secondary">
                                <Award className="mr-1 h-3 w-3" />
                                Results
                            </Badge>
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                                What You'll Walk Away With
                            </h2>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                            {outcomes.map((outcome, index) => (
                                <motion.div
                                    key={outcome.text}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <Card className="h-full text-center hover:shadow-md transition-shadow">
                                        <CardContent className="p-6">
                                            <outcome.icon className="h-10 w-10 text-primary mx-auto mb-4" />
                                            <h3 className="font-semibold text-lg mb-2">{outcome.text}</h3>
                                            <p className="text-sm text-muted-foreground">{outcome.description}</p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Student CTA */}
                <section className="py-16 bg-gradient-to-r from-amber-500 to-orange-500">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl mx-auto text-center text-white">
                            <GraduationCap className="h-12 w-12 mx-auto mb-4" />
                            <h2 className="text-2xl md:text-3xl font-bold mb-4">
                                For Students
                            </h2>
                            <p className="text-lg opacity-90 mb-6">
                                Start your startup the right way — without burning money.
                            </p>
                            <Button
                                size="lg"
                                variant="secondary"
                                className="text-lg px-8 py-6"
                                onClick={() => setShowBookingForm(true)}
                            >
                                Book Student Session (₹3,750)
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-20 bg-primary">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl mx-auto text-center text-primary-foreground">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">
                                One conversation can save you six months of mistakes.
                            </h2>
                            <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
                                Confused? Scaling? Stuck? Validate your idea before you build.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button
                                    size="lg"
                                    variant="secondary"
                                    className="text-lg px-8 py-6"
                                    onClick={() => setShowBookingForm(true)}
                                >
                                    <Calendar className="mr-2 h-5 w-5" />
                                    Book Now
                                </Button>
                                <Link href="/contact">
                                    <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                                        <MessageCircle className="mr-2 h-5 w-5" />
                                        Have Questions?
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
