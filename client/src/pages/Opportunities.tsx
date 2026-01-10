import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { fetchWithAuth } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase, MapPin, Clock, Building2, Search, Filter, Star, IndianRupee, Users, CheckCircle, TrendingUp, ArrowRight } from "lucide-react";

interface JobPost {
  id: string;
  title: string;
  slug: string;
  roleType: string;
  isPaid: boolean;
  salaryMin: string | null;
  salaryMax: string | null;
  experienceLevel: string;
  locationType: string;
  city: string | null;
  workingDays: string | null;
  workingHours: string | null;
  isFlexible: boolean;
  description: string;
  visibility: string;
  createdAt: string;
  company: {
    id: string;
    companyName: string;
    logoUrl: string | null;
    verified: boolean;
    city: string | null;
    state: string | null;
  } | null;
}

const sampleJobs: JobPost[] = [
  {
    id: "sample-1",
    title: "Frontend Developer Intern",
    slug: "frontend-developer-intern-techcorp",
    roleType: "internship",
    isPaid: true,
    salaryMin: "15000",
    salaryMax: "25000",
    experienceLevel: "fresher",
    locationType: "hybrid",
    city: "Bangalore",
    workingDays: "Mon-Fri",
    workingHours: "9 AM - 6 PM",
    isFlexible: true,
    description: "Join our dynamic team as a Frontend Developer Intern and work on cutting-edge web applications.",
    visibility: "featured",
    createdAt: new Date().toISOString(),
    company: {
      id: "company-1",
      companyName: "TechCorp Solutions",
      logoUrl: null,
      verified: true,
      city: "Bangalore",
      state: "Karnataka"
    }
  },
  {
    id: "sample-2",
    title: "Marketing Executive",
    slug: "marketing-executive-growthlab",
    roleType: "full-time",
    isPaid: true,
    salaryMin: "30000",
    salaryMax: "45000",
    experienceLevel: "entry-level",
    locationType: "onsite",
    city: "Mumbai",
    workingDays: "Mon-Sat",
    workingHours: "10 AM - 7 PM",
    isFlexible: false,
    description: "Drive marketing campaigns and brand growth for our expanding startup.",
    visibility: "standard",
    createdAt: new Date().toISOString(),
    company: {
      id: "company-2",
      companyName: "GrowthLab Digital",
      logoUrl: null,
      verified: true,
      city: "Mumbai",
      state: "Maharashtra"
    }
  },
  {
    id: "sample-3",
    title: "Content Writer Intern",
    slug: "content-writer-intern-mediahub",
    roleType: "internship",
    isPaid: true,
    salaryMin: "10000",
    salaryMax: "15000",
    experienceLevel: "fresher",
    locationType: "remote",
    city: null,
    workingDays: "Flexible",
    workingHours: "Flexible",
    isFlexible: true,
    description: "Create engaging content for blogs, social media, and marketing materials.",
    visibility: "standard",
    createdAt: new Date().toISOString(),
    company: {
      id: "company-3",
      companyName: "MediaHub Creative",
      logoUrl: null,
      verified: false,
      city: "Delhi",
      state: "Delhi"
    }
  },
  {
    id: "sample-4",
    title: "Data Analyst",
    slug: "data-analyst-dataflow",
    roleType: "full-time",
    isPaid: true,
    salaryMin: "40000",
    salaryMax: "60000",
    experienceLevel: "mid-level",
    locationType: "hybrid",
    city: "Hyderabad",
    workingDays: "Mon-Fri",
    workingHours: "9 AM - 6 PM",
    isFlexible: true,
    description: "Analyze complex datasets and provide actionable insights to drive business decisions.",
    visibility: "featured",
    createdAt: new Date().toISOString(),
    company: {
      id: "company-4",
      companyName: "DataFlow Analytics",
      logoUrl: null,
      verified: true,
      city: "Hyderabad",
      state: "Telangana"
    }
  },
  {
    id: "sample-5",
    title: "UI/UX Design Intern",
    slug: "ui-ux-design-intern-designstudio",
    roleType: "internship",
    isPaid: true,
    salaryMin: "12000",
    salaryMax: "18000",
    experienceLevel: "fresher",
    locationType: "remote",
    city: null,
    workingDays: "Mon-Fri",
    workingHours: "Flexible",
    isFlexible: true,
    description: "Design beautiful user interfaces and improve user experience for web and mobile apps.",
    visibility: "standard",
    createdAt: new Date().toISOString(),
    company: {
      id: "company-5",
      companyName: "DesignStudio Pro",
      logoUrl: null,
      verified: true,
      city: "Pune",
      state: "Maharashtra"
    }
  },
  {
    id: "sample-6",
    title: "Sales Development Representative",
    slug: "sdr-salesforce-india",
    roleType: "full-time",
    isPaid: true,
    salaryMin: "25000",
    salaryMax: "35000",
    experienceLevel: "entry-level",
    locationType: "onsite",
    city: "Chennai",
    workingDays: "Mon-Sat",
    workingHours: "9 AM - 6 PM",
    isFlexible: false,
    description: "Generate leads and build customer relationships for our B2B products.",
    visibility: "standard",
    createdAt: new Date().toISOString(),
    company: {
      id: "company-6",
      companyName: "SalesForce India",
      logoUrl: null,
      verified: false,
      city: "Chennai",
      state: "Tamil Nadu"
    }
  }
];

export default function Opportunities() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleTypeFilter, setRoleTypeFilter] = useState<string>("");
  const [locationFilter, setLocationFilter] = useState<string>("");

  // Check if user is authenticated and their role
  const { data: user } = useQuery({
    queryKey: ["/api/me"],
    queryFn: async () => {
      const res = await fetchWithAuth("/api/me");
      if (!res.ok) return null;
      return res.json();
    },
  });

  const { data: jobs, isLoading } = useQuery<JobPost[]>({
    queryKey: ["/api/opportunities/jobs", roleTypeFilter, locationFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (roleTypeFilter) params.append("roleType", roleTypeFilter);
      if (locationFilter) params.append("locationType", locationFilter);
      const res = await fetchWithAuth(`/api/opportunities/jobs?${params}`);
      if (!res.ok) throw new Error("Failed to fetch jobs");
      return res.json();
    },
  });

  const displayJobs = jobs && jobs.length > 0 ? jobs : sampleJobs;
  const isShowingSampleData = !jobs || jobs.length === 0;

  const filteredJobs = displayJobs?.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company?.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatSalary = (min: string | null, max: string | null) => {
    if (!min && !max) return null;
    if (min && max) return `₹${parseInt(min).toLocaleString()} - ₹${parseInt(max).toLocaleString()}`;
    if (min) return `₹${parseInt(min).toLocaleString()}+`;
    return `Up to ₹${parseInt(max!).toLocaleString()}`;
  };

  const getRoleTypeBadgeColor = (roleType: string) => {
    switch (roleType) {
      case "internship": return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200";
      case "full-time": return "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100";
      case "part-time": return "bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-200";
      case "contract": return "bg-zinc-200 text-zinc-950 dark:bg-zinc-700 dark:text-zinc-50";
      default: return "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main>
        <section className="bg-gradient-to-br from-primary/5 via-background to-orange-500/5 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto slide-in">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                <Briefcase className="mr-1 h-3 w-3" />
                For Students
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Find Your Dream Opportunity
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Discover internships, jobs, and career opportunities from verified companies across India
              </p>

              <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{displayJobs.length}+</div>
                  <div className="text-sm text-muted-foreground">Active Jobs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">50+</div>
                  <div className="text-sm text-muted-foreground">Companies</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">10K+</div>
                  <div className="text-sm text-muted-foreground">Students Placed</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8 page-transition">
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-72 space-y-6">
              <Card className="border-border/50">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Filter className="h-5 w-5 text-primary" />
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Job title, company..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Role Type</label>
                    <Select value={roleTypeFilter || "all"} onValueChange={(val) => setRoleTypeFilter(val === "all" ? "" : val)}>
                      <SelectTrigger>
                        <SelectValue placeholder="All types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All types</SelectItem>
                        <SelectItem value="internship">Internship</SelectItem>
                        <SelectItem value="full-time">Full-time</SelectItem>
                        <SelectItem value="part-time">Part-time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Location</label>
                    <Select value={locationFilter || "all"} onValueChange={(val) => setLocationFilter(val === "all" ? "" : val)}>
                      <SelectTrigger>
                        <SelectValue placeholder="All locations" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All locations</SelectItem>
                        <SelectItem value="remote">Remote</SelectItem>
                        <SelectItem value="onsite">On-site</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setSearchTerm("");
                      setRoleTypeFilter("");
                      setLocationFilter("");
                    }}
                  >
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>

              {/* Only show company registration CTA for non-company users */}
              {user && user.role !== "company" && (
                <Card className="bg-gradient-to-br from-orange-500 to-zinc-600 text-white border-0">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Want to Post Jobs?
                    </CardTitle>
                    <CardDescription className="text-white/90">
                      You are not a company. Register as a company to post jobs.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm text-white/90">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        <span>2-month free trial</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        <span>Access to verified candidates</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        <span>Dashboard to manage applicants</span>
                      </div>
                    </div>
                    <Link href="/company/register">
                      <Button variant="secondary" className="w-full">
                        Register Your Company
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <p className="text-xs text-white/70 text-center">
                      Then ₹4,999/year after trial
                    </p>
                  </CardContent>
                </Card>
              )}

              {user && user.role === "company" && (
                <Card className="bg-primary text-primary-foreground border-0">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Company Dashboard
                    </CardTitle>
                    <CardDescription className="text-primary-foreground/80">
                      Manage your jobs and applications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm">
                      View and manage your job postings, track applications, and find the right talent.
                    </p>
                    <Link href="/company/dashboard">
                      <Button variant="secondary" className="w-full">
                        Go to Dashboard
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}

              {!user && (
                <Card className="bg-primary text-primary-foreground border-0">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      For Companies
                    </CardTitle>
                    <CardDescription className="text-primary-foreground/80">
                      Post jobs and find the right talent
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm text-primary-foreground/90">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        <span>2-month free trial</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        <span>Access to verified candidates</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        <span>Dashboard to manage applicants</span>
                      </div>
                    </div>
                    <Link href="/company/register">
                      <Button variant="secondary" className="w-full">
                        Register Your Company
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <p className="text-xs text-primary-foreground/70 text-center">
                      Then ₹4,999/year after trial
                    </p>
                  </CardContent>
                </Card>
              )}
            </aside>

            <div className="flex-1">

              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
                        <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
                        <div className="h-4 bg-muted rounded w-full"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredJobs && filteredJobs.length > 0 ? (
                <div className="space-y-4 stagger-item">
                  <div className="flex items-center justify-between">
                    <p className="text-muted-foreground">{filteredJobs.length} opportunities found</p>
                  </div>
                  {filteredJobs.map((job) => (
                    <Link key={job.id} href={`/opportunities/${job.slug}`}>
                      <Card className="hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer group card-hover">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                {job.company?.logoUrl ? (
                                  <img
                                    src={job.company.logoUrl}
                                    alt={job.company.companyName}
                                    className="w-12 h-12 rounded-lg object-cover"
                                  />
                                ) : (
                                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <Building2 className="h-6 w-6 text-primary" />
                                  </div>
                                )}
                                <div>
                                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                                    {job.title}
                                  </h3>
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <span>{job.company?.companyName || "Company"}</span>
                                    {job.company?.verified && (
                                      <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200">
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Verified
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-2 mb-3">
                                <Badge className={getRoleTypeBadgeColor(job.roleType)}>
                                  {job.roleType}
                                </Badge>
                                {job.visibility === "featured" && (
                                  <Badge className="bg-orange-500 text-white dark:bg-orange-600 dark:text-white">
                                    <Star className="h-3 w-3 mr-1" />
                                    Featured
                                  </Badge>
                                )}
                                {job.isPaid && (
                                  <Badge className="bg-orange-100 text-orange-900 dark:bg-orange-900/30 dark:text-orange-100">
                                    <IndianRupee className="h-3 w-3 mr-1" />
                                    Paid
                                  </Badge>
                                )}
                                {job.isFlexible && (
                                  <Badge variant="outline">Flexible Hours</Badge>
                                )}
                              </div>

                              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  {job.locationType === "remote" ? "Remote" : job.city || job.locationType}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Briefcase className="h-4 w-4" />
                                  {job.experienceLevel}
                                </span>
                                {job.workingHours && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {job.workingHours}
                                  </span>
                                )}
                              </div>

                              {formatSalary(job.salaryMin, job.salaryMax) && (
                                <p className="mt-3 font-semibold text-orange-600 dark:text-orange-400">
                                  {formatSalary(job.salaryMin, job.salaryMax)}/month
                                </p>
                              )}
                            </div>

                            <Button variant="outline" className="hidden sm:flex group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                              View Details
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Briefcase className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No opportunities found</h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your filters or check back later for new listings.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm("");
                        setRoleTypeFilter("");
                        setLocationFilter("");
                      }}
                    >
                      Clear Filters
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
