import { useState } from "react";
import { fetchWithAuth } from "@/lib/api-client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Building2, Briefcase, Users, Plus, Eye, Edit, Trash2,
  CheckCircle, XCircle, Clock, Calendar, Star, IndianRupee,
  FileText, Download, Mail, Phone, AlertCircle
} from "lucide-react";
import { format, differenceInDays } from "date-fns";

interface Company {
  id: string;
  companyName: string;
  contactEmail: string;
  verified: boolean;
  status: string;
  trialStartDate: string | null;
  trialEndDate: string | null;
  subscription?: {
    status: string;
    endDate: string | null;
  };
}

interface JobPost {
  id: string;
  title: string;
  slug: string;
  roleType: string;
  isPaid: boolean;
  status: string;
  visibility: string;
  applicationCount: number;
  viewCount: number;
  createdAt: string;
}

interface Application {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  collegeName: string | null;
  experienceSummary: string | null;
  cvUrl: string;
  coverNote: string | null;
  status: string;
  createdAt: string;
}

export default function CompanyDashboard() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedJob, setSelectedJob] = useState<JobPost | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);



  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["/api/me"],
    queryFn: async () => {
      const res = await fetchWithAuth("/api/me");
      if (!res.ok) return null;
      return res.json();
    },
  });

  const { data: company, isLoading: companyLoading } = useQuery<Company>({
    queryKey: ["/api/opportunities/my-company"],
    queryFn: async () => {
      const res = await fetchWithAuth("/api/opportunities/my-company");
      if (!res.ok) throw new Error("Company not found");
      return res.json();
    },
    enabled: !!user,
    retry: 2,
  });

  const { data: jobs, isLoading: jobsLoading } = useQuery<JobPost[]>({
    queryKey: ["/api/opportunities/my-jobs"],
    queryFn: async () => {
      const res = await fetchWithAuth("/api/opportunities/my-jobs");
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!company,
  });

  const { data: applications } = useQuery<Application[]>({
    queryKey: ["/api/opportunities/jobs", selectedJob?.id, "applications"],
    queryFn: async () => {
      const res = await fetchWithAuth(`/api/opportunities/jobs/${selectedJob?.id}/applications`);
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!selectedJob,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await fetchWithAuth(`/api/opportunities/applications/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Status Updated", description: "Application status has been updated." });
      queryClient.invalidateQueries({ queryKey: ["/api/opportunities/jobs", selectedJob?.id, "applications"] });
      setSelectedApplication(null);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update status.", variant: "destructive" });
    },
  });

  const closeJobMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const res = await fetchWithAuth(`/api/opportunities/jobs/${jobId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to close job");
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Job Closed", description: "The job posting has been closed." });
      queryClient.invalidateQueries({ queryKey: ["/api/opportunities/my-jobs"] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to close job.", variant: "destructive" });
    },
  });

  if (userLoading || companyLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-zinc-200 rounded w-1/4"></div>
            <div className="h-48 bg-zinc-200 rounded"></div>
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <Navigation />
        <main className="container mx-auto px-4 py-16 text-center">
          <Building2 className="h-16 w-16 text-zinc-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-zinc-900 mb-2">Sign In Required</h1>
          <p className="text-zinc-600 mb-6">Please sign in to access your company dashboard.</p>
          <Link href="/login">
            <Button>Sign In</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <Navigation />
        <main className="container mx-auto px-4 py-16 text-center">
          <Building2 className="h-16 w-16 text-zinc-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-zinc-900 mb-2">No Company Found</h1>
          <p className="text-zinc-600 mb-6">Register your company to start posting jobs.</p>
          <Link href="/company/register">
            <Button>Register Company</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const trialDaysLeft = company.trialEndDate
    ? Math.max(0, differenceInDays(new Date(company.trialEndDate), new Date()))
    : null;
  const isTrialActive = trialDaysLeft !== null && trialDaysLeft > 0;
  const isSubscriptionActive = company.subscription?.status === "active";

  const getStatusColor = (status: string) => {
    switch (status) {
      case "applied": return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200";
      case "shortlisted": return "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100";
      case "interview": return "bg-orange-200 text-orange-900 dark:bg-orange-800 dark:text-orange-100";
      case "offered": return "bg-orange-500 text-white";
      case "rejected": return "bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300";
      default: return "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200";
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Navigation />

      <main className="container mx-auto px-4 py-8 page-transition">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 stagger-item">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 flex items-center gap-2">
              <Building2 className="h-6 w-6" />
              {company.companyName}
              {company.verified && (
                <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
            </h1>
            <p className="text-zinc-600 mt-1">Company Dashboard</p>
          </div>
          <Link href="/company/post-job">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Post a Job
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8 stagger-item">
          <Card className="card-hover border-orange-100 dark:border-orange-900/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <Briefcase className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{jobs?.length || 0}</p>
                  <p className="text-sm text-zinc-500">Total Jobs</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                  <Users className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {jobs?.reduce((sum, job) => sum + (job.applicationCount || 0), 0) || 0}
                  </p>
                  <p className="text-sm text-zinc-500">Total Applicants</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <Eye className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {jobs?.reduce((sum, job) => sum + (job.viewCount || 0), 0) || 0}
                  </p>
                  <p className="text-sm text-zinc-500">Total Views</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className={`card-hover ${isTrialActive ? "border-yellow-300 bg-yellow-50 dark:bg-yellow-900/10" : isSubscriptionActive ? "border-green-300 bg-green-50 dark:bg-green-900/10" : "border-red-300 bg-red-50 dark:bg-red-900/10"}`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isTrialActive ? "bg-yellow-100" : isSubscriptionActive ? "bg-green-100" : "bg-red-100"}`}>
                  <Star className={`h-5 w-5 ${isTrialActive ? "text-yellow-600" : isSubscriptionActive ? "text-green-600" : "text-red-600"}`} />
                </div>
                <div>
                  {isTrialActive ? (
                    <>
                      <p className="text-2xl font-bold">{trialDaysLeft} days</p>
                      <p className="text-sm text-yellow-700">Trial remaining</p>
                    </>
                  ) : isSubscriptionActive ? (
                    <>
                      <p className="text-lg font-bold">Active</p>
                      <p className="text-sm text-green-700">Featured listing</p>
                    </>
                  ) : (
                    <>
                      <p className="text-lg font-bold">Expired</p>
                      <p className="text-sm text-red-700">Renew now</p>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {!isTrialActive && !isSubscriptionActive && (
          <Card className="mb-8 border-yellow-300 bg-yellow-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="h-6 w-6 text-yellow-600 shrink-0" />
                <div>
                  <h3 className="font-semibold text-yellow-900">Your listing has expired</h3>
                  <p className="text-yellow-800 mt-1">
                    Renew your subscription for ₹4,999/year to keep your jobs featured and receive more applications.
                  </p>
                  <Button className="mt-3" size="sm">
                    <IndianRupee className="h-4 w-4 mr-1" />
                    Renew Now - ₹4,999/year
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="jobs" className="space-y-6">
          <TabsList>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="applicants">Applicants</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="jobs">
            {jobsLoading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-24 bg-zinc-200 rounded"></div>
                ))}
              </div>
            ) : jobs && jobs.length > 0 ? (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <Card key={job.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{job.title}</h3>
                            <Badge className={job.status === "active" ? "bg-green-100 text-green-800" : "bg-zinc-100 text-zinc-800"}>
                              {job.status}
                            </Badge>
                            {job.visibility === "featured" && (
                              <Badge className="bg-yellow-100 text-yellow-800">
                                <Star className="h-3 w-3 mr-1" />
                                Featured
                              </Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-zinc-500">
                            <span className="capitalize">{job.roleType}</span>
                            <span className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {job.applicationCount} applicants
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              {job.viewCount} views
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {format(new Date(job.createdAt), "MMM d, yyyy")}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedJob(job)}
                          >
                            <Users className="h-4 w-4 mr-1" />
                            View Applicants
                          </Button>
                          <Link href={`/opportunities/${job.slug}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </Link>
                          {job.status === "active" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => closeJobMutation.mutate(job.id)}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Close
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Briefcase className="h-12 w-12 text-zinc-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-zinc-900 mb-2">No jobs posted yet</h3>
                  <p className="text-zinc-500 mb-4">Post your first job to start receiving applications.</p>
                  <Link href="/company/post-job">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Post a Job
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="applicants">
            <Card>
              <CardHeader>
                <CardTitle>All Applicants</CardTitle>
                <CardDescription>
                  Select a job from the Jobs tab to view its applicants
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-500">
                  Click "View Applicants" on any job to see applications.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing">
            <Card>
              <CardHeader>
                <CardTitle>Billing & Subscription</CardTitle>
                <CardDescription>Manage your subscription and view invoices</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">Current Plan</h4>
                      <p className="text-zinc-600">
                        {isTrialActive
                          ? `Free Trial (${trialDaysLeft} days remaining)`
                          : isSubscriptionActive
                            ? "Featured Listing - ₹4,999/year"
                            : "No Active Plan"}
                      </p>
                    </div>
                    {!isSubscriptionActive && !isTrialActive && (
                      <Button>Upgrade Now</Button>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Pricing</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <h5 className="font-medium">Featured Company Listing</h5>
                        <p className="text-2xl font-bold mt-2">₹4,999<span className="text-sm font-normal text-zinc-500">/year</span></p>
                        <ul className="mt-3 space-y-2 text-sm text-zinc-600">
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            Unlimited job postings
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            Featured company badge
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            Priority in search results
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <h5 className="font-medium">Paid Job Platform Fee</h5>
                        <p className="text-2xl font-bold mt-2">₹199<span className="text-sm font-normal text-zinc-500">/job</span></p>
                        <ul className="mt-3 space-y-2 text-sm text-zinc-600">
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            For paid opportunities only
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            6 months visibility
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            Featured job badge
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Company Settings</CardTitle>
                <CardDescription>Update your company profile and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-zinc-500">Company Name</p>
                    <p className="font-medium">{company.companyName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500">Contact Email</p>
                    <p className="font-medium">{company.contactEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Verification Status</p>
                    <Badge className={company.verified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                      {company.verified ? "Verified" : "Pending Verification"}
                    </Badge>
                  </div>
                  <Button variant="outline">Edit Company Profile</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Applicants for {selectedJob?.title}</DialogTitle>
              <DialogDescription>
                {applications?.length || 0} applications received
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              {applications && applications.length > 0 ? (
                applications.map((app) => (
                  <Card key={app.id}>
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium">{app.fullName}</h4>
                            <Badge className={getStatusColor(app.status)}>
                              {app.status}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-sm text-zinc-500">
                            <p className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              {app.email}
                            </p>
                            <p className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              {app.phone}
                            </p>
                            {app.collegeName && (
                              <p className="flex items-center gap-2">
                                <Building2 className="h-4 w-4" />
                                {app.collegeName}
                              </p>
                            )}
                          </div>
                          {app.coverNote && (
                            <p className="mt-2 text-sm text-zinc-600 line-clamp-2">{app.coverNote}</p>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          <a href={app.cvUrl} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm" className="w-full">
                              <Download className="h-4 w-4 mr-1" />
                              Download CV
                            </Button>
                          </a>
                          <Select
                            value={app.status}
                            onValueChange={(status) => updateStatusMutation.mutate({ id: app.id, status })}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="applied">Applied</SelectItem>
                              <SelectItem value="shortlisted">Shortlisted</SelectItem>
                              <SelectItem value="interview">Interview</SelectItem>
                              <SelectItem value="offered">Offered</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-zinc-300 mx-auto mb-4" />
                  <p className="text-zinc-500">No applications yet</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </main>

      <Footer />
    </div>
  );
}
