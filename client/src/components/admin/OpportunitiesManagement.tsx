import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Building2, Briefcase, Users, Search, CheckCircle, XCircle,
  Eye, AlertCircle, RefreshCw, Calendar, IndianRupee, Shield, Ban, Plus
} from "lucide-react";
import { format } from "date-fns";

interface Company {
  id: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  phone: string | null;
  businessType: string;
  verified: boolean;
  status: string;
  trialStartDate: string | null;
  trialEndDate: string | null;
  createdAt: string;
}

interface JobPost {
  id: string;
  title: string;
  slug: string;
  roleType: string;
  isPaid: boolean;
  status: string;
  visibility: string;
  platformFeePaid: boolean;
  viewCount: number;
  createdAt: string;
  company?: {
    id: string;
    companyName: string;
  };
}

interface OpportunitiesManagementProps {
  initialTab?: "companies" | "jobs";
}

export default function OpportunitiesManagement({ initialTab = "companies" }: OpportunitiesManagementProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showCreateJob, setShowCreateJob] = useState(false);
  const [newJob, setNewJob] = useState({
    title: "",
    roleType: "full_time",
    isPaid: true,
    salaryMin: "",
    salaryMax: "",
    experienceLevel: "entry",
    locationType: "onsite",
    city: "",
    description: "",
    companyId: "",
  });

  const { data: companies, isLoading: companiesLoading, refetch: refetchCompanies } = useQuery<Company[]>({
    queryKey: ["/api/admin/opportunities/companies"],
    queryFn: async () => {
      const res = await fetch("/api/admin/opportunities/companies");
      if (!res.ok) return [];
      return res.json();
    },
  });

  const { data: jobs, isLoading: jobsLoading, refetch: refetchJobs } = useQuery<JobPost[]>({
    queryKey: ["/api/admin/opportunities/jobs"],
    queryFn: async () => {
      const res = await fetch("/api/admin/opportunities/jobs");
      if (!res.ok) return [];
      return res.json();
    },
  });

  const verifyCompanyMutation = useMutation({
    mutationFn: async ({ id, verified }: { id: string; verified: boolean }) => {
      const res = await fetch(`/api/admin/opportunities/companies/${id}/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verified }),
      });
      if (!res.ok) throw new Error("Failed to update company");
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Company verification status updated." });
      refetchCompanies();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update company.", variant: "destructive" });
    },
  });

  const updateCompanyStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await fetch(`/api/admin/opportunities/companies/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update company");
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Company status updated." });
      refetchCompanies();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update company status.", variant: "destructive" });
    },
  });

  const updateJobStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await fetch(`/api/admin/opportunities/jobs/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update job");
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Job status updated." });
      refetchJobs();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update job status.", variant: "destructive" });
    },
  });

  const updateJobFeeStatusMutation = useMutation({
    mutationFn: async ({ id, platformFeePaid }: { id: string; platformFeePaid: boolean }) => {
      const res = await fetch(`/api/admin/opportunities/jobs/${id}/fee-status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platformFeePaid }),
      });
      if (!res.ok) throw new Error("Failed to update job fee status");
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Job fee status updated." });
      refetchJobs();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update job fee status.", variant: "destructive" });
    },
  });

  const createJobMutation = useMutation({
    mutationFn: async (jobData: typeof newJob) => {
      const res = await fetch("/api/admin/opportunities/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobData),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create job");
      }
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Job opportunity created successfully." });
      setShowCreateJob(false);
      setNewJob({
        title: "",
        roleType: "full_time",
        isPaid: true,
        salaryMin: "",
        salaryMax: "",
        experienceLevel: "entry",
        locationType: "onsite",
        city: "",
        description: "",
        companyId: "",
      });
      refetchJobs();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const filteredCompanies = companies?.filter(c => {
    const matchesSearch = c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.contactEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredJobs = jobs?.filter(j => {
    const matchesSearch = j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.company?.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const stats = {
    totalCompanies: companies?.length || 0,
    verifiedCompanies: companies?.filter(c => c.verified).length || 0,
    activeCompanies: companies?.filter(c => c.status === "active").length || 0,
    totalJobs: jobs?.length || 0,
    activeJobs: jobs?.filter(j => j.status === "active").length || 0,
    paidJobs: jobs?.filter(j => j.platformFeePaid).length || 0,
  };

  return (
    <div className="space-y-6" >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Opportunities Management</h2>
          <p className="text-muted-foreground">Manage companies, job postings, and verification</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowCreateJob(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Job
          </Button>
          <Button onClick={() => { refetchCompanies(); refetchJobs(); }} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Building2 className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats.totalCompanies}</p>
            <p className="text-sm text-muted-foreground">Companies</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats.verifiedCompanies}</p>
            <p className="text-sm text-muted-foreground">Verified</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Shield className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats.activeCompanies}</p>
            <p className="text-sm text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Briefcase className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats.totalJobs}</p>
            <p className="text-sm text-muted-foreground">Total Jobs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Eye className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats.activeJobs}</p>
            <p className="text-sm text-muted-foreground">Active Jobs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <IndianRupee className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats.paidJobs}</p>
            <p className="text-sm text-muted-foreground">Paid Jobs</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search companies or jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
            <SelectItem value="disabled">Disabled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="companies" className="space-y-4">
        <TabsList>
          <TabsTrigger value="companies" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Companies ({filteredCompanies?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="jobs" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Jobs ({filteredJobs?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="companies">
          {companiesLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 bg-muted rounded animate-pulse"></div>
              ))}
            </div>
          ) : filteredCompanies && filteredCompanies.length > 0 ? (
            <div className="space-y-4">
              {filteredCompanies.map((company) => (
                <Card key={company.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{company.companyName}</h3>
                          {company.verified && (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                          <Badge className={
                            company.status === "active" ? "bg-green-100 text-green-800" :
                              company.status === "suspended" ? "bg-yellow-100 text-yellow-800" :
                                "bg-red-100 text-red-800"
                          }>
                            {company.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>{company.contactName} - {company.contactEmail}</p>
                          <p className="capitalize">{company.businessType}</p>
                          <p className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Joined {format(new Date(company.createdAt), "MMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {!company.verified ? (
                          <Button
                            size="sm"
                            onClick={() => verifyCompanyMutation.mutate({ id: company.id, verified: true })}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Verify
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => verifyCompanyMutation.mutate({ id: company.id, verified: false })}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Unverify
                          </Button>
                        )}
                        {company.status === "active" ? (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => updateCompanyStatusMutation.mutate({ id: company.id, status: "suspended" })}
                          >
                            <Ban className="h-4 w-4 mr-1" />
                            Suspend
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateCompanyStatusMutation.mutate({ id: company.id, status: "active" })}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Activate
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedCompany(company)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
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
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No companies found</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="jobs">
          {jobsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 bg-muted rounded animate-pulse"></div>
              ))}
            </div>
          ) : filteredJobs && filteredJobs.length > 0 ? (
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <Card key={job.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{job.title}</h3>
                          <Badge className={
                            job.status === "active" ? "bg-green-100 text-green-800" :
                              "bg-zinc-100 text-zinc-800"
                          }>
                            {job.status}
                          </Badge>
                          <Badge variant="outline" className="capitalize">{job.roleType}</Badge>
                          {job.isPaid && (
                            <Badge className="bg-yellow-100 text-yellow-800">
                              <IndianRupee className="h-3 w-3 mr-1" />
                              Paid
                            </Badge>
                          )}
                          {job.platformFeePaid && (
                            <Badge className="bg-green-100 text-green-800">Fee Paid</Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <p>{job.company?.companyName}</p>
                          <p className="flex items-center gap-2">
                            <Eye className="h-3 w-3" />
                            {job.viewCount} views
                            <Calendar className="h-3 w-3 ml-2" />
                            {format(new Date(job.createdAt), "MMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateJobFeeStatusMutation.mutate({ id: job.id, platformFeePaid: !job.platformFeePaid })}
                        >
                          <IndianRupee className={`h-4 w-4 mr-1 ${job.platformFeePaid ? "text-green-500" : "text-gray-400"}`} />
                          {job.platformFeePaid ? "Mark Unpaid" : "Mark Paid"}
                        </Button>
                        {job.status === "active" ? (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => updateJobStatusMutation.mutate({ id: job.id, status: "closed" })}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Close
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateJobStatusMutation.mutate({ id: job.id, status: "active" })}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Reactivate
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
                <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No jobs found</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={!!selectedCompany} onOpenChange={() => setSelectedCompany(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedCompany?.companyName}</DialogTitle>
            <DialogDescription>Company Details</DialogDescription>
          </DialogHeader>
          {selectedCompany && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Contact Name</p>
                  <p className="font-medium">{selectedCompany.contactName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedCompany.contactEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{selectedCompany.phone || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Business Type</p>
                  <p className="font-medium capitalize">{selectedCompany.businessType}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className={
                    selectedCompany.status === "active" ? "bg-green-100 text-green-800" :
                      selectedCompany.status === "suspended" ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                  }>
                    {selectedCompany.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Verified</p>
                  <Badge className={selectedCompany.verified ? "bg-green-100 text-green-800" : "bg-zinc-100 text-zinc-800"}>
                    {selectedCompany.verified ? "Verified" : "Not Verified"}
                  </Badge>
                </div>
              </div>
              {selectedCompany.trialStartDate && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Trial Period</p>
                  <p className="font-medium">
                    {format(new Date(selectedCompany.trialStartDate), "MMM d, yyyy")} -
                    {selectedCompany.trialEndDate ? format(new Date(selectedCompany.trialEndDate), " MMM d, yyyy") : " Ongoing"}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showCreateJob} onOpenChange={setShowCreateJob}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Create New Job Opportunity
            </DialogTitle>
            <DialogDescription>
              Post a new job or internship opportunity for students
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Marketing Intern"
                  value={newJob.title}
                  onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="companyId">Company *</Label>
                <Select
                  value={newJob.companyId}
                  onValueChange={(value) => setNewJob({ ...newJob, companyId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies?.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.companyName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="roleType">Role Type</Label>
                <Select
                  value={newJob.roleType}
                  onValueChange={(value) => setNewJob({ ...newJob, roleType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full_time">Full Time</SelectItem>
                    <SelectItem value="part_time">Part Time</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="experienceLevel">Experience Level</Label>
                <Select
                  value={newJob.experienceLevel}
                  onValueChange={(value) => setNewJob({ ...newJob, experienceLevel: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry">Entry Level</SelectItem>
                    <SelectItem value="mid">Mid Level</SelectItem>
                    <SelectItem value="senior">Senior Level</SelectItem>
                    <SelectItem value="any">Any</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="locationType">Location Type</Label>
                <Select
                  value={newJob.locationType}
                  onValueChange={(value) => setNewJob({ ...newJob, locationType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="onsite">Onsite</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="e.g., Mumbai"
                  value={newJob.city}
                  onChange={(e) => setNewJob({ ...newJob, city: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="salaryMin">Min Salary (₹)</Label>
                <Input
                  id="salaryMin"
                  type="number"
                  placeholder="10000"
                  value={newJob.salaryMin}
                  onChange={(e) => setNewJob({ ...newJob, salaryMin: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="salaryMax">Max Salary (₹)</Label>
                <Input
                  id="salaryMax"
                  type="number"
                  placeholder="25000"
                  value={newJob.salaryMax}
                  onChange={(e) => setNewJob({ ...newJob, salaryMax: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="description">Job Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the role, responsibilities, requirements..."
                  rows={4}
                  value={newJob.description}
                  onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateJob(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => createJobMutation.mutate(newJob)}
              disabled={createJobMutation.isPending || !newJob.title || !newJob.companyId || !newJob.description}
            >
              {createJobMutation.isPending ? "Creating..." : "Create Job"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div >
  );
}
