import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase-client";
import { fetchWithAuth } from "@/lib/api-client";
import {
  Briefcase, MapPin, Clock, Building2, Calendar, Users,
  Star, IndianRupee, Globe, ArrowLeft, Heart, Share2,
  CheckCircle, FileText, Loader2
} from "lucide-react";

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
  responsibilities: string | null;
  requiredSkills: string[] | null;
  preferredQualifications: string | null;
  numberOfOpenings: number;
  applicationDeadline: string | null;
  visibility: string;
  createdAt: string;
  viewCount: number;
  company: {
    id: string;
    companyName: string;
    logoUrl: string | null;
    verified: boolean;
    city: string | null;
    state: string | null;
    description: string | null;
    websiteUrl: string | null;
  } | null;
}

export default function JobDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [applicationData, setApplicationData] = useState({
    fullName: "",
    email: "",
    phone: "",
    collegeName: "",
    experienceSummary: "",
    preferredHours: "",
    cvUrl: "",
    coverNote: "",
    bankDetailsConsent: false,
  });

  const { data: job, isLoading } = useQuery<JobPost>({
    queryKey: ["/api/opportunities/jobs", slug],
    queryFn: async () => {
      const res = await fetch(`/api/opportunities/jobs/${slug}`);
      if (!res.ok) throw new Error("Job not found");
      return res.json();
    },
    enabled: !!slug,
  });

  const { data: user } = useQuery({
    queryKey: ["/api/me"],
    queryFn: async () => {
      const res = await fetch("/api/me");
      if (!res.ok) return null;
      return res.json();
    },
  });

  const { data: savedStatus } = useQuery<{ saved: boolean }>({
    queryKey: ["/api/opportunities/jobs", job?.id, "saved"],
    queryFn: async () => {
      const res = await fetchWithAuth(`/api/opportunities/jobs/${job?.id}/saved`);
      if (!res.ok) return { saved: false };
      return res.json();
    },
    enabled: !!job?.id && !!user,
  });

  const applyMutation = useMutation({
    mutationFn: async (data: typeof applicationData) => {
      const res = await fetchWithAuth(`/api/opportunities/jobs/${job?.id}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to submit application");
      }
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted",
        description: "Your application has been sent. The company will contact you if shortlisted.",
      });
      setApplyDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/opportunities/my-applications"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const saveJobMutation = useMutation({
    mutationFn: async () => {
      const res = await fetchWithAuth(`/api/opportunities/jobs/${job?.id}/save`, {
        method: savedStatus?.saved ? "DELETE" : "POST",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to save job");
      }
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: savedStatus?.saved ? "Removed from Saved" : "Job Saved",
        description: savedStatus?.saved ? "Job removed from your saved list." : "Job added to your saved list.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/opportunities/jobs", job?.id, "saved"] });
      queryClient.invalidateQueries({ queryKey: ["/api/opportunities/saved-jobs"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSaveJob = () => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to save jobs.",
        variant: "destructive",
      });
      return;
    }
    saveJobMutation.mutate();
  };

  const formatSalary = (min: string | null, max: string | null) => {
    if (!min && !max) return null;
    if (min && max) return `₹${parseInt(min).toLocaleString()} - ₹${parseInt(max).toLocaleString()}`;
    if (min) return `₹${parseInt(min).toLocaleString()}+`;
    return `Up to ₹${parseInt(max!).toLocaleString()}`;
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    applyMutation.mutate(applicationData);
  };

  const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "CV must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    try {
      const fileName = `cv_${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage
        .from("cvs")
        .upload(fileName, file);

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from("cvs")
        .getPublicUrl(fileName);

      setApplicationData(prev => ({ ...prev, cvUrl: urlData.publicUrl }));
      toast({ title: "CV Uploaded", description: "Your CV has been uploaded successfully." });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload CV. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </main>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <Navigation />
        <main className="container mx-auto px-4 py-16 text-center">
          <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</h1>
          <p className="text-gray-600 mb-4">This opportunity may have been closed or removed.</p>
          <Link href="/opportunities">
            <Button>Browse Opportunities</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navigation />

      <main className="container mx-auto px-4 py-8 page-transition">
        <Link href="/opportunities" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Opportunities
        </Link>

        <div className="grid lg:grid-cols-3 gap-8 slide-in">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="flex items-start gap-4">
                    {job.company?.logoUrl ? (
                      <img
                        src={job.company.logoUrl}
                        alt={job.company.companyName}
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-zinc-100 flex items-center justify-center">
                        <Building2 className="h-8 w-8 text-zinc-400" />
                      </div>
                    )}
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-lg text-gray-600">{job.company?.companyName}</span>
                        {job.company?.verified && (
                          <Badge variant="secondary">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleSaveJob}
                      disabled={saveJobMutation.isPending}
                      className={savedStatus?.saved ? "text-red-500 hover:text-red-600" : ""}
                    >
                      {saveJobMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Heart className={`h-4 w-4 ${savedStatus?.saved ? "fill-current" : ""}`} />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        toast({ title: "Link Copied", description: "Job link copied to clipboard." });
                      }}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge className="bg-orange-100 text-orange-800 capitalize">{job.roleType}</Badge>
                  {job.visibility === "featured" && (
                    <Badge className="bg-orange-500 text-white">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                  {job.isPaid && (
                    <Badge className="bg-orange-200 text-orange-900">
                      <IndianRupee className="h-3 w-3 mr-1" />
                      Paid Opportunity
                    </Badge>
                  )}
                  {job.isFlexible && (
                    <Badge variant="outline">Flexible Hours</Badge>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-zinc-600">
                    <MapPin className="h-5 w-5" />
                    <span>{job.locationType === "remote" ? "Remote" : job.city || job.locationType}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-600">
                    <Briefcase className="h-5 w-5" />
                    <span>{job.experienceLevel}</span>
                  </div>
                  {job.workingHours && (
                    <div className="flex items-center gap-2 text-zinc-600">
                      <Clock className="h-5 w-5" />
                      <span>{job.workingHours}</span>
                    </div>
                  )}
                  {job.numberOfOpenings > 1 && (
                    <div className="flex items-center gap-2 text-zinc-600">
                      <Users className="h-5 w-5" />
                      <span>{job.numberOfOpenings} openings</span>
                    </div>
                  )}
                </div>

                {formatSalary(job.salaryMin, job.salaryMax) && (
                  <div className="p-4 bg-orange-50 rounded-lg mb-6">
                    <p className="text-lg font-semibold text-orange-700">
                      {formatSalary(job.salaryMin, job.salaryMax)}/month
                    </p>
                  </div>
                )}

                <div className="prose max-w-none">
                  <h3 className="text-lg font-semibold mb-3">Job Description</h3>
                  <p className="text-zinc-700 whitespace-pre-wrap">{job.description}</p>

                  {job.responsibilities && (
                    <>
                      <h3 className="text-lg font-semibold mt-6 mb-3">Responsibilities</h3>
                      <p className="text-zinc-700 whitespace-pre-wrap">{job.responsibilities}</p>
                    </>
                  )}

                  {job.requiredSkills && job.requiredSkills.length > 0 && (
                    <>
                      <h3 className="text-lg font-semibold mt-6 mb-3">Required Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {job.requiredSkills.map((skill, index) => (
                          <Badge key={index} variant="outline">{skill}</Badge>
                        ))}
                      </div>
                    </>
                  )}

                  {job.preferredQualifications && (
                    <>
                      <h3 className="text-lg font-semibold mt-6 mb-3">Preferred Qualifications</h3>
                      <p className="text-zinc-700 whitespace-pre-wrap">{job.preferredQualifications}</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <Dialog open={applyDialogOpen} onOpenChange={setApplyDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full mb-4" size="lg">
                      Apply Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Apply for {job.title}</DialogTitle>
                      <DialogDescription>
                        at {job.company?.companyName}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleApply} className="space-y-4 mt-4">
                      <div>
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          value={applicationData.fullName}
                          onChange={(e) => setApplicationData(prev => ({ ...prev, fullName: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={applicationData.email}
                          onChange={(e) => setApplicationData(prev => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={applicationData.phone}
                          onChange={(e) => setApplicationData(prev => ({ ...prev, phone: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="collegeName">College Name (optional)</Label>
                        <Input
                          id="collegeName"
                          value={applicationData.collegeName}
                          onChange={(e) => setApplicationData(prev => ({ ...prev, collegeName: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="experienceSummary">Experience Summary (optional)</Label>
                        <Textarea
                          id="experienceSummary"
                          value={applicationData.experienceSummary}
                          onChange={(e) => setApplicationData(prev => ({ ...prev, experienceSummary: e.target.value }))}
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cv">Upload CV (Optional) (PDF preferred, max 5MB)</Label>
                        <Input
                          id="cv"
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleCvUpload}
                          className="mt-1"
                        />
                        {applicationData.cvUrl && (
                          <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                            <CheckCircle className="h-4 w-4" />
                            CV uploaded successfully
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="coverNote">Cover Note (optional)</Label>
                        <Textarea
                          id="coverNote"
                          value={applicationData.coverNote}
                          onChange={(e) => setApplicationData(prev => ({ ...prev, coverNote: e.target.value }))}
                          rows={4}
                          placeholder="Why are you interested in this role?"
                        />
                      </div>

                      <div className="flex items-start gap-2">
                        <Checkbox
                          id="consent"
                          required
                        />
                        <Label htmlFor="consent" className="text-sm text-zinc-600 leading-tight">
                          I consent to share my data with the employer and agree to the platform's privacy policy.
                        </Label>
                      </div>

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={applyMutation.isPending}
                      >
                        {applyMutation.isPending ? "Submitting..." : "Submit Application"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>

                {job.applicationDeadline && (
                  <p className="text-sm text-gray-500 text-center mb-4">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    Apply by {new Date(job.applicationDeadline).toLocaleDateString()}
                  </p>
                )}

                <p className="text-sm text-gray-500 text-center">
                  {job.viewCount} people viewed this job
                </p>
              </CardContent>
            </Card>

            {job.company && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">About {job.company.companyName}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {job.company.description && (
                    <p className="text-zinc-600 text-sm">{job.company.description}</p>
                  )}
                  <div className="flex items-center gap-2 text-sm text-zinc-500">
                    <MapPin className="h-4 w-4" />
                    {job.company.city}, {job.company.state}
                  </div>
                  {job.company.websiteUrl && (
                    <a
                      href={job.company.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <Globe className="h-4 w-4" />
                      Visit Website
                    </a>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
