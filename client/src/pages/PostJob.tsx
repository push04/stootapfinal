import { useState } from "react";
import { fetchWithAuth } from "@/lib/api-client";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Building2, ArrowLeft, AlertCircle, IndianRupee } from "lucide-react";

interface JobFormData {
  title: string;
  roleType: string;
  isPaid: boolean;
  salaryMin: string;
  salaryMax: string;
  experienceLevel: string;
  locationType: string;
  city: string;
  workingDays: string;
  workingHours: string;
  isFlexible: boolean;
  description: string;
  responsibilities: string;
  requiredSkills: string;
  preferredQualifications: string;
  numberOfOpenings: string;
  applicationDeadline: string;
}

export default function PostJob() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isPaid, setIsPaid] = useState(false);
  const [isFlexible, setIsFlexible] = useState(false);

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["/api/me"],
    queryFn: async () => {
      const res = await fetchWithAuth("/api/me");
      if (!res.ok) return null;
      return res.json();
    },
  });

  const { data: company, isLoading: companyLoading } = useQuery({
    queryKey: ["/api/opportunities/my-company"],
    queryFn: async () => {
      const res = await fetchWithAuth("/api/opportunities/my-company");
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!user,
  });

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<JobFormData>({
    defaultValues: {
      title: "",
      roleType: "",
      isPaid: false,
      salaryMin: "",
      salaryMax: "",
      experienceLevel: "",
      locationType: "",
      city: "",
      workingDays: "",
      workingHours: "",
      isFlexible: false,
      description: "",
      responsibilities: "",
      requiredSkills: "",
      preferredQualifications: "",
      numberOfOpenings: "1",
      applicationDeadline: "",
    },
  });

  const postJobMutation = useMutation({
    mutationFn: async (data: JobFormData) => {
      const payload = {
        ...data,
        isPaid,
        isFlexible,
        salaryMin: data.salaryMin ? parseFloat(data.salaryMin) : null,
        salaryMax: data.salaryMax ? parseFloat(data.salaryMax) : null,
        numberOfOpenings: parseInt(data.numberOfOpenings) || 1,
        requiredSkills: data.requiredSkills ? data.requiredSkills.split(",").map(s => s.trim()).filter(Boolean) : [],
        applicationDeadline: data.applicationDeadline ? new Date(data.applicationDeadline).toISOString() : null,
      };

      const res = await fetchWithAuth("/api/opportunities/jobs", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to post job");
      }
      return res.json();
    },
    onSuccess: (data) => {
      if (data.requiresPayment) {
        toast({
          title: "Job Posted!",
          description: data.message,
        });
      } else {
        toast({
          title: "Job Posted!",
          description: "Your job has been published successfully.",
        });
      }
      navigate("/company/dashboard");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: JobFormData) => {
    postJobMutation.mutate(data);
  };

  if (userLoading || companyLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4 max-w-3xl mx-auto">
            <div className="h-8 bg-zinc-200 rounded w-1/3"></div>
            <div className="h-64 bg-zinc-200 rounded"></div>
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
          <p className="text-zinc-600 mb-6">Please sign in to post a job.</p>
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
        <main className="container mx-auto px-4 py-16">
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <Building2 className="h-16 w-16 text-orange-500 mx-auto mb-4" />
              <CardTitle className="text-2xl">Company Registration Required</CardTitle>
              <CardDescription>
                {user?.role === "student" || user?.role === "business"
                  ? "You are not registered as a company. Register your company to start posting jobs."
                  : "You need to register your company before posting jobs."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-900">
                <h4 className="font-semibold mb-2 text-orange-900 dark:text-orange-100">Why Register as a Company?</h4>
                <ul className="space-y-2 text-sm text-orange-800 dark:text-orange-200">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 dark:text-orange-400">✓</span>
                    <span>Post unlimited jobs during 2-month free trial</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 dark:text-orange-400">✓</span>
                    <span>Access verified student candidates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 dark:text-orange-400">✓</span>
                    <span>Dedicated dashboard to manage applications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 dark:text-orange-400">✓</span>
                    <span>Only ₹4,999/year after trial</span>
                  </li>
                </ul>
              </div>
              <div className="flex gap-3">
                <Link href="/company/register" className="flex-1">
                  <Button className="w-full">Register as Company</Button>
                </Link>
                <Link href="/opportunities" className="flex-1">
                  <Button variant="outline" className="w-full">Browse Jobs</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navigation />

      <main className="container mx-auto px-4 py-8 page-transition">
        <div className="max-w-3xl mx-auto">
          <Link href="/company/dashboard" className="inline-flex items-center text-zinc-600 hover:text-zinc-900 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>

          <Card className="slide-in">
            <CardHeader>
              <CardTitle>Post a New Job</CardTitle>
              <CardDescription>
                Fill in the details to publish your job opening
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    {...register("title", { required: "Job title is required" })}
                    placeholder="e.g., Frontend Developer Intern"
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500">{errors.title.message}</p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Role Type *</Label>
                    <Select onValueChange={(value) => setValue("roleType", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="internship">Internship</SelectItem>
                        <SelectItem value="full-time">Full-time</SelectItem>
                        <SelectItem value="part-time">Part-time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Experience Level *</Label>
                    <Select onValueChange={(value) => setValue("experienceLevel", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select experience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="freshers">Freshers</SelectItem>
                        <SelectItem value="0-1">0-1 years</SelectItem>
                        <SelectItem value="1-3">1-3 years</SelectItem>
                        <SelectItem value="3+">3+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Location Type *</Label>
                    <Select onValueChange={(value) => setValue("locationType", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="remote">Remote</SelectItem>
                        <SelectItem value="onsite">On-site</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">City (if on-site/hybrid)</Label>
                    <Input
                      id="city"
                      {...register("city")}
                      placeholder="e.g., Mumbai"
                    />
                  </div>
                </div>

                <div className="p-4 border rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Paid Opportunity</Label>
                      <p className="text-sm text-zinc-500">Does this role offer compensation?</p>
                    </div>
                    <Switch checked={isPaid} onCheckedChange={setIsPaid} />
                  </div>

                  {isPaid && (
                    <>
                      <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-orange-800 font-medium">Platform Fee: ₹199</p>
                          <p className="text-xs text-orange-700">A one-time fee for 6 months visibility on paid job listings.</p>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="salaryMin">Minimum Salary (₹/month)</Label>
                          <Input
                            id="salaryMin"
                            type="number"
                            {...register("salaryMin")}
                            placeholder="e.g., 10000"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="salaryMax">Maximum Salary (₹/month)</Label>
                          <Input
                            id="salaryMax"
                            type="number"
                            {...register("salaryMax")}
                            placeholder="e.g., 25000"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="workingDays">Working Days</Label>
                    <Input
                      id="workingDays"
                      {...register("workingDays")}
                      placeholder="e.g., Mon-Fri"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workingHours">Working Hours</Label>
                    <Input
                      id="workingHours"
                      {...register("workingHours")}
                      placeholder="e.g., 9 AM - 6 PM"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label>Flexible Hours</Label>
                    <p className="text-sm text-zinc-500">Allow flexible working hours?</p>
                  </div>
                  <Switch checked={isFlexible} onCheckedChange={setIsFlexible} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Job Description *</Label>
                  <Textarea
                    id="description"
                    {...register("description", { required: "Description is required" })}
                    placeholder="Describe the role, what the candidate will do, and what a typical day looks like..."
                    rows={5}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500">{errors.description.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="responsibilities">Key Responsibilities</Label>
                  <Textarea
                    id="responsibilities"
                    {...register("responsibilities")}
                    placeholder="List the main responsibilities and tasks..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requiredSkills">Required Skills (comma-separated)</Label>
                  <Input
                    id="requiredSkills"
                    {...register("requiredSkills")}
                    placeholder="e.g., React, JavaScript, CSS, Git"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferredQualifications">Preferred Qualifications</Label>
                  <Textarea
                    id="preferredQualifications"
                    {...register("preferredQualifications")}
                    placeholder="Any preferred qualifications or nice-to-haves..."
                    rows={3}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="numberOfOpenings">Number of Openings</Label>
                    <Input
                      id="numberOfOpenings"
                      type="number"
                      min="1"
                      {...register("numberOfOpenings")}
                      placeholder="1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="applicationDeadline">Application Deadline (optional)</Label>
                    <Input
                      id="applicationDeadline"
                      type="date"
                      {...register("applicationDeadline")}
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={postJobMutation.isPending}
                  >
                    {postJobMutation.isPending ? "Posting..." : isPaid ? "Post Job (₹199 fee)" : "Post Job"}
                  </Button>
                  <Link href="/company/dashboard">
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
