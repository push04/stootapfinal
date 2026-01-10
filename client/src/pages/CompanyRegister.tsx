import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { fetchWithAuth } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Building2, CheckCircle, Briefcase, Users, Star } from "lucide-react";

interface CompanyFormData {
  companyName: string;
  contactName: string;
  contactEmail: string;
  phone: string;
  businessType: string;
  websiteUrl: string;
  gstin: string;
  description: string;
  city: string;
  state: string;
}

export default function CompanyRegister() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [agreeTerms, setAgreeTerms] = useState(false);

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["/api/me"],
    queryFn: async () => {
      const res = await fetchWithAuth("/api/me");
      if (!res.ok) return null;
      return res.json();
    },
  });

  const { data: existingCompany, isLoading: companyLoading } = useQuery({
    queryKey: ["/api/opportunities/my-company"],
    queryFn: async () => {
      const res = await fetchWithAuth("/api/opportunities/my-company");
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!user,
  });

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<CompanyFormData>({
    defaultValues: {
      companyName: "",
      contactName: user?.fullName || "",
      contactEmail: user?.email || "",
      phone: user?.phone || "",
      businessType: "",
      websiteUrl: "",
      gstin: "",
      description: "",
      city: "",
      state: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: CompanyFormData) => {
      const res = await fetchWithAuth("/api/opportunities/companies", {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to register company");
      }
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Company Registered!",
        description: "Your company has been registered. You can now post jobs.",
      });
      navigate("/company/dashboard");
    },
    onError: (error: Error) => {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CompanyFormData) => {
    if (!agreeTerms) {
      toast({
        title: "Terms Required",
        description: "Please agree to the terms and conditions.",
        variant: "destructive",
      });
      return;
    }
    registerMutation.mutate(data);
  };

  if (userLoading || companyLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-zinc-200 rounded w-1/3 mx-auto"></div>
            <div className="h-64 bg-zinc-200 rounded max-w-2xl mx-auto"></div>
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    const returnUrl = encodeURIComponent("/company/register");
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <Navigation />
        <main className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <Building2 className="h-20 w-20 text-primary/20 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-foreground mb-4">Register Your Company</h1>
            <p className="text-lg text-muted-foreground mb-8">
              To post job opportunities and access our hiring platform, please sign in or create an account.
            </p>

            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              <Card className="border-2 border-primary/20 hover:border-primary/50 transition-colors">
                <CardContent className="p-8 text-center">
                  <h3 className="text-xl font-semibold text-foreground mb-3">Already have an account?</h3>
                  <p className="text-muted-foreground mb-6">Sign in to your existing account and register your company.</p>
                  <Link href={`/login?returnUrl=${returnUrl}`}>
                    <Button className="w-full" size="lg">
                      <span>Sign In</span>
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/20 hover:border-primary/50 transition-colors">
                <CardContent className="p-8 text-center">
                  <h3 className="text-xl font-semibold text-foreground mb-3">New to Stootap?</h3>
                  <p className="text-muted-foreground mb-6">Create a new account in minutes and start posting jobs immediately.</p>
                  <Link href={`/register?returnUrl=${returnUrl}`}>
                    <Button className="w-full" size="lg" variant="outline">
                      <span>Create Account</span>
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-3">Why register with Stootap?</h3>
                <ul className="text-sm text-muted-foreground space-y-2 text-left inline-block">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    2-month free trial, then just ₹4,999/year
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Access to 50,000+ verified students
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Full dashboard to manage candidates
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (existingCompany) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <Navigation />
        <main className="container mx-auto px-4 py-16 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-zinc-900 mb-2">Company Already Registered</h1>
          <p className="text-zinc-600 mb-6">You already have a registered company: {existingCompany.companyName}</p>
          <Link href="/company/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-zinc-900 mb-2">Register Your Company</h1>
            <p className="text-zinc-600">
              Post jobs and find the right talent for your business
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-6 text-center">
                <Briefcase className="h-10 w-10 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-green-900">Post Jobs</h3>
                <p className="text-sm text-green-700">Internships, full-time, part-time roles</p>
              </CardContent>
            </Card>
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-6 text-center">
                <Users className="h-10 w-10 text-orange-600 mx-auto mb-3" />
                <h3 className="font-semibold text-orange-900">Find Talent</h3>
                <p className="text-sm text-orange-700">Access qualified candidates</p>
              </CardContent>
            </Card>
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="p-6 text-center">
                <Star className="h-10 w-10 text-yellow-600 mx-auto mb-3" />
                <h3 className="font-semibold text-yellow-900">2-Month Free Trial</h3>
                <p className="text-sm text-yellow-700">Then just ₹4,999/year</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>Fill in your company details to get started</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      {...register("companyName", { required: "Company name is required" })}
                      placeholder="Enter company name"
                    />
                    {errors.companyName && (
                      <p className="text-sm text-red-500">{errors.companyName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessType">Business Type *</Label>
                    <Select onValueChange={(value) => setValue("businessType", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="e-commerce">E-commerce</SelectItem>
                        <SelectItem value="services">Services</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactName">Contact Person Name *</Label>
                    <Input
                      id="contactName"
                      {...register("contactName", { required: "Contact name is required" })}
                      placeholder="Enter contact person name"
                    />
                    {errors.contactName && (
                      <p className="text-sm text-red-500">{errors.contactName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email *</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      {...register("contactEmail", { required: "Contact email is required" })}
                      placeholder="Enter email address"
                    />
                    {errors.contactEmail && (
                      <p className="text-sm text-red-500">{errors.contactEmail.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number (optional)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      {...register("phone")}
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="websiteUrl">Website URL (optional)</Label>
                    <Input
                      id="websiteUrl"
                      type="url"
                      {...register("websiteUrl")}
                      placeholder="https://yourcompany.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City (optional)</Label>
                    <Input
                      id="city"
                      {...register("city")}
                      placeholder="City"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State (optional)</Label>
                    <Input
                      id="state"
                      {...register("state")}
                      placeholder="State"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gstin">GSTIN (optional)</Label>
                  <Input
                    id="gstin"
                    {...register("gstin")}
                    placeholder="22AAAAA0000A1Z5"
                  />
                  <p className="text-xs text-zinc-500">Only if your business is GST registered</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Company Description (optional)</Label>
                  <Textarea
                    id="description"
                    {...register("description")}
                    placeholder="Briefly describe your company, products/services, and culture..."
                    rows={4}
                  />
                </div>

                <div className="flex items-start gap-3 p-4 bg-zinc-50 rounded-lg">
                  <Checkbox
                    id="terms"
                    checked={agreeTerms}
                    onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                  />
                  <Label htmlFor="terms" className="text-sm text-zinc-600 leading-relaxed cursor-pointer">
                    I agree to the platform's <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>. I confirm that I'm authorized to register this company.
                  </Label>
                </div>

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? "Registering..." : "Register Company"}
                  </Button>
                  <Link href="/opportunities">
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="mt-8 p-6 bg-primary/5 rounded-xl">
            <h3 className="font-semibold text-zinc-900 mb-2">How it works</h3>
            <ul className="space-y-2 text-zinc-600">
              <li className="flex items-start gap-2">
                <span className="bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shrink-0 mt-0.5">1</span>
                Register your company with basic details
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shrink-0 mt-0.5">2</span>
                Post your first job and start your 2-month free trial
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shrink-0 mt-0.5">3</span>
                Receive applications and manage candidates from your dashboard
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shrink-0 mt-0.5">4</span>
                After trial, continue with featured listing at ₹4,999/year
              </li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
