import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Briefcase, Heart, TrendingUp, Users } from "lucide-react";

export default function Careers() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    experience: "",
    resume: "",
    coverLetter: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const openPositions = [
    {
      title: "Business Development Executive",
      department: "Sales",
      location: "Mumbai / Remote",
      type: "Full-time",
      description: "Drive growth by acquiring new clients and expanding our service portfolio.",
    },
    {
      title: "Content Writer",
      department: "Marketing",
      location: "Bangalore / Remote",
      type: "Full-time",
      description: "Create compelling content for our blog, service pages, and marketing materials.",
    },
    {
      title: "Customer Success Manager",
      department: "Support",
      location: "Delhi / Remote",
      type: "Full-time",
      description: "Ensure our clients have an amazing experience and achieve their business goals.",
    },
    {
      title: "Full Stack Developer",
      department: "Engineering",
      location: "Pune / Remote",
      type: "Full-time",
      description: "Build and maintain our platform using modern web technologies.",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: `Position: ${formData.position}\nExperience: ${formData.experience}\n\nCover Letter:\n${formData.coverLetter}`,
          source: "careers",
          leadType: "job_application",
        }),
      });

      if (!response.ok) throw new Error("Failed to submit application");

      toast({
        title: "Application Submitted!",
        description: "Thank you for your interest. We'll review your application and get back to you soon.",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        position: "",
        experience: "",
        resume: "",
        coverLetter: "",
      });
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Please try again or email us at careers@stootap.com",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Navigation />

      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-zinc-600 bg-clip-text text-transparent">
            Join Our Team
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Help us empower entrepreneurs across India. Build your career while building
            the future of business services.
          </p>
        </div>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Why Work at Stootap?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-2">
              <CardContent className="p-6">
                <TrendingUp className="w-10 h-10 text-orange-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">Growth Opportunities</h3>
                <p className="text-muted-foreground">
                  We're a fast-growing startup with endless opportunities to learn,
                  lead, and advance your career.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-6">
                <Heart className="w-10 h-10 text-orange-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">Work-Life Balance</h3>
                <p className="text-muted-foreground">
                  Flexible working hours, remote work options, and a culture that
                  values your wellbeing.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-6">
                <Users className="w-10 h-10 text-orange-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">Collaborative Culture</h3>
                <p className="text-muted-foreground">
                  Work with passionate, talented people who support each other
                  and celebrate wins together.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-6">
                <Briefcase className="w-10 h-10 text-orange-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">Meaningful Impact</h3>
                <p className="text-muted-foreground">
                  Your work directly helps entrepreneurs achieve their dreams and
                  build successful businesses.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Open Positions</h2>
          <div className="space-y-4">
            {openPositions.map((position, index) => (
              <Card key={index} className="border-2 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-2xl font-bold mb-1">{position.title}</h3>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>{position.department}</span>
                        <span>•</span>
                        <span>{position.location}</span>
                        <span>•</span>
                        <span>{position.type}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4">{position.description}</p>
                  <Button
                    onClick={() => {
                      setFormData({ ...formData, position: position.title });
                      document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Apply Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="application-form">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-3xl">Submit Your Application</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="position">Position *</Label>
                    <Input
                      id="position"
                      required
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      placeholder="e.g., Business Development Executive"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience *</Label>
                  <Input
                    id="experience"
                    required
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    placeholder="e.g., 3 years"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="resume">Resume/CV Link *</Label>
                  <Input
                    id="resume"
                    type="url"
                    required
                    value={formData.resume}
                    onChange={(e) => setFormData({ ...formData, resume: e.target.value })}
                    placeholder="https://drive.google.com/... or LinkedIn profile"
                  />
                  <p className="text-sm text-muted-foreground">Please provide a link to your resume (Google Drive, Dropbox, LinkedIn, etc.)</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="coverLetter">Cover Letter *</Label>
                  <Textarea
                    id="coverLetter"
                    required
                    rows={6}
                    value={formData.coverLetter}
                    onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                    placeholder="Tell us why you'd be a great fit for this role..."
                  />
                </div>

                <Button type="submit" size="lg" disabled={submitting} className="w-full md:w-auto">
                  {submitting ? "Submitting..." : "Submit Application"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>
      </div>

      <Footer />
    </div>
  );
}
