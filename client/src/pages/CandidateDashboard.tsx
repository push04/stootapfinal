import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { fetchWithAuth } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  User, Briefcase, Heart, Clock, Building2, MapPin,
  CheckCircle, XCircle, Calendar, ExternalLink, Trash2
} from "lucide-react";
import { format } from "date-fns";

interface Application {
  id: string;
  status: string;
  createdAt: string;
  job: {
    id: string;
    title: string;
    slug: string;
    roleType: string;
    locationType: string;
  } | null;
  company: {
    id: string;
    companyName: string;
    logoUrl: string | null;
  } | null;
}

interface SavedJob {
  id: string;
  createdAt: string;
  job: {
    id: string;
    title: string;
    slug: string;
    roleType: string;
    locationType: string;
    isPaid: boolean;
    salaryMin: string | null;
    salaryMax: string | null;
    status: string;
  } | null;
  company: {
    id: string;
    companyName: string;
    logoUrl: string | null;
  } | null;
}

export default function CandidateDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["/api/me"],
    queryFn: async () => {
      const res = await fetchWithAuth("/api/me");
      if (!res.ok) return null;
      return res.json();
    },
  });

  const { data: applications, isLoading: applicationsLoading } = useQuery<Application[]>({
    queryKey: ["/api/opportunities/my-applications"],
    queryFn: async () => {
      const res = await fetchWithAuth("/api/opportunities/my-applications");
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!user,
  });

  const { data: savedJobs, isLoading: savedJobsLoading } = useQuery<SavedJob[]>({
    queryKey: ["/api/opportunities/saved-jobs"],
    queryFn: async () => {
      const res = await fetchWithAuth("/api/opportunities/saved-jobs");
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!user,
  });

  const unsaveJobMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const res = await fetchWithAuth(`/api/opportunities/jobs/${jobId}/save`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to unsave job");
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Job Removed", description: "Job removed from saved list." });
      queryClient.invalidateQueries({ queryKey: ["/api/opportunities/saved-jobs"] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to remove job.", variant: "destructive" });
    },
  });

  if (userLoading) {
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
          <User className="h-16 w-16 text-zinc-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-zinc-900 mb-2">Sign In Required</h1>
          <p className="text-zinc-600 mb-6">Please sign in to access your dashboard.</p>
          <Link href="/login">
            <Button>Sign In</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "applied": return "bg-orange-100 text-orange-800";
      case "shortlisted": return "bg-yellow-100 text-yellow-800";
      case "interview": return "bg-purple-100 text-purple-800";
      case "offered": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-zinc-100 text-zinc-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "applied": return <Clock className="h-4 w-4" />;
      case "shortlisted": return <CheckCircle className="h-4 w-4" />;
      case "interview": return <Calendar className="h-4 w-4" />;
      case "offered": return <CheckCircle className="h-4 w-4" />;
      case "rejected": return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const applicationStats = {
    total: applications?.length || 0,
    applied: applications?.filter(a => a.status === "applied").length || 0,
    shortlisted: applications?.filter(a => a.status === "shortlisted").length || 0,
    interview: applications?.filter(a => a.status === "interview").length || 0,
    offered: applications?.filter(a => a.status === "offered").length || 0,
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-900 flex items-center gap-2">
            <User className="h-6 w-6" />
            Welcome, {user.fullName}
          </h1>
          <p className="text-zinc-600 mt-1">Track your job applications and saved opportunities</p>
        </div>

        <div className="grid md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{applicationStats.total}</p>
              <p className="text-sm text-zinc-500">Total Applied</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-orange-600">{applicationStats.applied}</p>
              <p className="text-sm text-zinc-500">Pending</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-yellow-600">{applicationStats.shortlisted}</p>
              <p className="text-sm text-zinc-500">Shortlisted</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-purple-600">{applicationStats.interview}</p>
              <p className="text-sm text-zinc-500">Interviews</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{applicationStats.offered}</p>
              <p className="text-sm text-zinc-500">Offers</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList>
            <TabsTrigger value="applications" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              My Applications
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Saved Jobs
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="applications">
            {applicationsLoading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-24 bg-zinc-200 rounded"></div>
                ))}
              </div>
            ) : applications && applications.length > 0 ? (
              <div className="space-y-4">
                {applications.map((app) => (
                  <Card key={app.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          {app.company?.logoUrl ? (
                            <img
                              src={app.company.logoUrl}
                              alt={app.company.companyName}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-zinc-100 flex items-center justify-center">
                              <Building2 className="h-6 w-6 text-zinc-400" />
                            </div>
                          )}
                          <div>
                            <h3 className="font-semibold text-lg">
                              {app.job?.title || "Job No Longer Available"}
                            </h3>
                            <p className="text-zinc-600">{app.company?.companyName}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <Badge className={getStatusColor(app.status)}>
                                {getStatusIcon(app.status)}
                                <span className="ml-1 capitalize">{app.status}</span>
                              </Badge>
                              {app.job && (
                                <>
                                  <Badge variant="outline" className="capitalize">
                                    {app.job.roleType}
                                  </Badge>
                                  <Badge variant="outline" className="capitalize">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    {app.job.locationType}
                                  </Badge>
                                </>
                              )}
                            </div>
                            <p className="text-sm text-zinc-500 mt-2">
                              Applied on {format(new Date(app.createdAt), "MMM d, yyyy")}
                            </p>
                          </div>
                        </div>
                        {app.job && (
                          <Link href={`/opportunities/${app.job.slug}`}>
                            <Button variant="outline" size="sm">
                              <ExternalLink className="h-4 w-4 mr-1" />
                              View Job
                            </Button>
                          </Link>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Briefcase className="h-12 w-12 text-zinc-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-zinc-900 mb-2">No applications yet</h3>
                  <p className="text-zinc-500 mb-4">Start applying to jobs to track your applications here.</p>
                  <Link href="/opportunities">
                    <Button>Browse Opportunities</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="saved">
            {savedJobsLoading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-24 bg-zinc-200 rounded"></div>
                ))}
              </div>
            ) : savedJobs && savedJobs.length > 0 ? (
              <div className="space-y-4">
                {savedJobs.map((saved) => (
                  <Card key={saved.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          {saved.company?.logoUrl ? (
                            <img
                              src={saved.company.logoUrl}
                              alt={saved.company.companyName}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-zinc-100 flex items-center justify-center">
                              <Building2 className="h-6 w-6 text-zinc-400" />
                            </div>
                          )}
                          <div>
                            <h3 className="font-semibold text-lg">
                              {saved.job?.title || "Job No Longer Available"}
                            </h3>
                            <p className="text-zinc-600">{saved.company?.companyName}</p>
                            {saved.job && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                <Badge variant="outline" className="capitalize">
                                  {saved.job.roleType}
                                </Badge>
                                <Badge variant="outline" className="capitalize">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {saved.job.locationType}
                                </Badge>
                                {saved.job.status !== "active" && (
                                  <Badge variant="secondary">Closed</Badge>
                                )}
                              </div>
                            )}
                            <p className="text-sm text-zinc-500 mt-2">
                              Saved on {format(new Date(saved.createdAt), "MMM d, yyyy")}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {saved.job && saved.job.status === "active" && (
                            <Link href={`/opportunities/${saved.job.slug}`}>
                              <Button variant="outline" size="sm">
                                <ExternalLink className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </Link>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => saved.job && unsaveJobMutation.mutate(saved.job.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Heart className="h-12 w-12 text-zinc-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-zinc-900 mb-2">No saved jobs</h3>
                  <p className="text-zinc-500 mb-4">Save jobs you're interested in to apply later.</p>
                  <Link href="/opportunities">
                    <Button>Browse Opportunities</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
                <CardDescription>Keep your profile updated for better opportunities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-zinc-500">Full Name</p>
                    <p className="font-medium">{user.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500">Phone</p>
                    <p className="font-medium">{user.phone || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500">Member Since</p>
                    <p className="font-medium">
                      {user.createdAt ? format(new Date(user.createdAt), "MMMM yyyy") : "N/A"}
                    </p>
                  </div>
                </div>
                <div className="pt-4">
                  <Link href="/profile">
                    <Button variant="outline">Edit Profile</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
