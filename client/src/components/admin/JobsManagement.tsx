import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import {
    Briefcase, Search, CheckCircle, XCircle, Edit, Trash2, Plus, RefreshCw,
    Calendar, Eye, IndianRupee, Building2, MapPin, Users, Clock
} from "lucide-react";
import { format } from "date-fns";

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
    applicationCount?: number;
    location: string | null;
    salary: string | null;
    experienceLevel: string | null;
    createdAt: string;
    company?: {
        id: string;
        companyName: string;
    };
}

interface Company {
    id: string;
    companyName: string;
}

export default function JobsManagement() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [roleTypeFilter, setRoleTypeFilter] = useState<string>("all");
    const [paidFilter, setPaidFilter] = useState<string>("all");
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState<JobPost | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        roleType: "internship",
        companyId: "",
        location: "",
        salary: "",
        experienceLevel: "entry",
        description: "",
        requirements: "",
        isPaid: false,
        visibility: "public",
    });

    const { data: jobs = [], isLoading, refetch } = useQuery({
        queryKey: ["/api/admin/opportunities/jobs"],
        queryFn: async () => {
            const res = await fetch("/api/admin/opportunities/jobs");
            if (!res.ok) throw new Error("Failed to fetch jobs");
            return res.json();
        },
    });

    const { data: companies = [] } = useQuery({
        queryKey: ["/api/admin/opportunities/companies"],
        queryFn: async () => {
            const res = await fetch("/api/admin/opportunities/companies");
            if (!res.ok) throw new Error("Failed to fetch companies");
            return res.json();
        },
    });

    const statusMutation = useMutation({
        mutationFn: async ({ id, status }: { id: string; status: string }) => {
            const res = await fetch(`/api/admin/opportunities/jobs/${id}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
            if (!res.ok) throw new Error("Failed to update status");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/opportunities/jobs"] });
            toast({ title: "Status updated", description: "Job status changed successfully" });
        },
        onError: () => {
            toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
        },
    });

    const feeMutation = useMutation({
        mutationFn: async ({ id, platformFeePaid }: { id: string; platformFeePaid: boolean }) => {
            const res = await fetch(`/api/admin/opportunities/jobs/${id}/fee-status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ platformFeePaid }),
            });
            if (!res.ok) throw new Error("Failed to update fee status");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/opportunities/jobs"] });
            toast({ title: "Fee status updated", description: "Platform fee status changed" });
        },
        onError: () => {
            toast({ title: "Error", description: "Failed to update fee status", variant: "destructive" });
        },
    });

    const createMutation = useMutation({
        mutationFn: async (data: typeof formData) => {
            const res = await fetch("/api/admin/opportunities/jobs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Failed to create job");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/opportunities/jobs"] });
            toast({ title: "Job created", description: "New job post added successfully" });
            setCreateDialogOpen(false);
            resetForm();
        },
        onError: () => {
            toast({ title: "Error", description: "Failed to create job", variant: "destructive" });
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
            const res = await fetch(`/api/admin/opportunities/jobs/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Failed to update job");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/opportunities/jobs"] });
            toast({ title: "Job updated", description: "Job details saved successfully" });
            setEditDialogOpen(false);
            setSelectedJob(null);
        },
        onError: () => {
            toast({ title: "Error", description: "Failed to update job", variant: "destructive" });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/admin/opportunities/jobs/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Failed to delete job");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/opportunities/jobs"] });
            toast({ title: "Job deleted", description: "Job post removed successfully" });
            setDeleteDialogOpen(false);
            setSelectedJob(null);
        },
        onError: () => {
            toast({ title: "Error", description: "Failed to delete job", variant: "destructive" });
        },
    });

    const resetForm = () => {
        setFormData({
            title: "",
            roleType: "internship",
            companyId: "",
            location: "",
            salary: "",
            experienceLevel: "entry",
            description: "",
            requirements: "",
            isPaid: false,
            visibility: "public",
        });
    };

    const openEditDialog = (job: JobPost) => {
        setSelectedJob(job);
        setFormData({
            title: job.title,
            roleType: job.roleType,
            companyId: job.company?.id || "",
            location: job.location || "",
            salary: job.salary || "",
            experienceLevel: job.experienceLevel || "entry",
            description: "",
            requirements: "",
            isPaid: job.isPaid,
            visibility: job.visibility,
        });
        setEditDialogOpen(true);
    };

    // Advanced search and filtering
    const filteredJobs = jobs.filter((job: JobPost) => {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = !searchTerm ||
            job.title.toLowerCase().includes(searchLower) ||
            (job.company?.companyName && job.company.companyName.toLowerCase().includes(searchLower)) ||
            (job.location && job.location.toLowerCase().includes(searchLower)) ||
            job.roleType.toLowerCase().includes(searchLower);

        const matchesStatus = statusFilter === "all" || job.status === statusFilter;
        const matchesRoleType = roleTypeFilter === "all" || job.roleType === roleTypeFilter;
        const matchesPaid =
            paidFilter === "all" ||
            (paidFilter === "paid" && job.isPaid) ||
            (paidFilter === "unpaid" && !job.isPaid);

        return matchesSearch && matchesStatus && matchesRoleType && matchesPaid;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "active":
                return <Badge className="bg-green-500">Active</Badge>;
            case "closed":
                return <Badge variant="secondary">Closed</Badge>;
            case "draft":
                return <Badge variant="outline">Draft</Badge>;
            case "pending":
                return <Badge className="bg-yellow-500">Pending</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const getRoleTypeBadge = (roleType: string) => {
        switch (roleType) {
            case "internship":
                return <Badge className="bg-blue-500">Internship</Badge>;
            case "full_time":
                return <Badge className="bg-purple-500">Full-time</Badge>;
            case "part_time":
                return <Badge className="bg-orange-500">Part-time</Badge>;
            case "contract":
                return <Badge className="bg-teal-500">Contract</Badge>;
            case "freelance":
                return <Badge className="bg-pink-500">Freelance</Badge>;
            default:
                return <Badge variant="outline">{roleType}</Badge>;
        }
    };

    if (isLoading) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center py-12">
                    <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Briefcase className="h-5 w-5" />
                                Jobs Management
                            </CardTitle>
                            <CardDescription>
                                Manage job postings, approve listings, and track applications
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => refetch()}>
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Refresh
                            </Button>
                            <Button size="sm" onClick={() => { resetForm(); setCreateDialogOpen(true); }}>
                                <Plus className="h-4 w-4 mr-2" />
                                Post Job
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Advanced Search & Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                        <div className="md:col-span-2 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by title, company, location..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={roleTypeFilter} onValueChange={setRoleTypeFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Role Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="internship">Internship</SelectItem>
                                <SelectItem value="full_time">Full-time</SelectItem>
                                <SelectItem value="part_time">Part-time</SelectItem>
                                <SelectItem value="contract">Contract</SelectItem>
                                <SelectItem value="freelance">Freelance</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={paidFilter} onValueChange={setPaidFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Compensation" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Jobs</SelectItem>
                                <SelectItem value="paid">Paid Only</SelectItem>
                                <SelectItem value="unpaid">Unpaid Only</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Results summary */}
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-sm text-muted-foreground">
                            Showing {filteredJobs.length} of {jobs.length} jobs
                        </p>
                        {(searchTerm || statusFilter !== "all" || roleTypeFilter !== "all" || paidFilter !== "all") && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setSearchTerm("");
                                    setStatusFilter("all");
                                    setRoleTypeFilter("all");
                                    setPaidFilter("all");
                                }}
                            >
                                Clear Filters
                            </Button>
                        )}
                    </div>

                    {/* Jobs Table */}
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Job Title</TableHead>
                                    <TableHead>Company</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Compensation</TableHead>
                                    <TableHead>Stats</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredJobs.length > 0 ? (
                                    filteredJobs.map((job: JobPost) => (
                                        <TableRow key={job.id}>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{job.title}</p>
                                                    {job.location && (
                                                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                            <MapPin className="h-3 w-3" />
                                                            {job.location}
                                                        </p>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Building2 className="h-4 w-4 text-muted-foreground" />
                                                    {job.company?.companyName || "N/A"}
                                                </div>
                                            </TableCell>
                                            <TableCell>{getRoleTypeBadge(job.roleType)}</TableCell>
                                            <TableCell>{getStatusBadge(job.status)}</TableCell>
                                            <TableCell>
                                                {job.isPaid ? (
                                                    <Badge className="bg-green-500">
                                                        <IndianRupee className="h-3 w-3 mr-1" />
                                                        Paid
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary">Unpaid</Badge>
                                                )}
                                                {job.salary && (
                                                    <p className="text-xs text-muted-foreground mt-1">{job.salary}</p>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <p className="text-xs flex items-center gap-1">
                                                        <Eye className="h-3 w-3" />
                                                        {job.viewCount || 0} views
                                                    </p>
                                                    <p className="text-xs flex items-center gap-1">
                                                        <Users className="h-3 w-3" />
                                                        {job.applicationCount || 0} applications
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                    <Calendar className="h-3 w-3" />
                                                    {format(new Date(job.createdAt), "MMM d, yyyy")}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Select
                                                        value={job.status}
                                                        onValueChange={(status) => statusMutation.mutate({ id: job.id, status })}
                                                    >
                                                        <SelectTrigger className="w-24">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="active">Active</SelectItem>
                                                            <SelectItem value="pending">Pending</SelectItem>
                                                            <SelectItem value="closed">Closed</SelectItem>
                                                            <SelectItem value="draft">Draft</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <Button
                                                        size="sm"
                                                        variant={job.platformFeePaid ? "secondary" : "outline"}
                                                        onClick={() => feeMutation.mutate({ id: job.id, platformFeePaid: !job.platformFeePaid })}
                                                    >
                                                        {job.platformFeePaid ? "Fee Paid" : "Mark Paid"}
                                                    </Button>
                                                    <Button size="sm" variant="outline" onClick={() => openEditDialog(job)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => { setSelectedJob(job); setDeleteDialogOpen(true); }}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                                            {jobs.length === 0 ? "No job posts yet" : "No jobs match your filters"}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Create Dialog */}
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Post New Job</DialogTitle>
                        <DialogDescription>Create a new job posting</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4 py-4">
                        <div className="col-span-2 space-y-2">
                            <Label>Job Title *</Label>
                            <Input
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g., Software Developer Intern"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Company *</Label>
                            <Select
                                value={formData.companyId}
                                onValueChange={(v) => setFormData({ ...formData, companyId: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select company" />
                                </SelectTrigger>
                                <SelectContent>
                                    {companies.map((company: Company) => (
                                        <SelectItem key={company.id} value={company.id}>
                                            {company.companyName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Role Type *</Label>
                            <Select
                                value={formData.roleType}
                                onValueChange={(v) => setFormData({ ...formData, roleType: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="internship">Internship</SelectItem>
                                    <SelectItem value="full_time">Full-time</SelectItem>
                                    <SelectItem value="part_time">Part-time</SelectItem>
                                    <SelectItem value="contract">Contract</SelectItem>
                                    <SelectItem value="freelance">Freelance</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Location</Label>
                            <Input
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                placeholder="City or Remote"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Salary/Stipend</Label>
                            <Input
                                value={formData.salary}
                                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                                placeholder="e.g., ₹15,000 - ₹25,000/month"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Experience Level</Label>
                            <Select
                                value={formData.experienceLevel}
                                onValueChange={(v) => setFormData({ ...formData, experienceLevel: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="entry">Entry Level</SelectItem>
                                    <SelectItem value="mid">Mid Level</SelectItem>
                                    <SelectItem value="senior">Senior Level</SelectItem>
                                    <SelectItem value="lead">Lead/Manager</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Visibility</Label>
                            <Select
                                value={formData.visibility}
                                onValueChange={(v) => setFormData({ ...formData, visibility: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="public">Public</SelectItem>
                                    <SelectItem value="private">Private</SelectItem>
                                    <SelectItem value="unlisted">Unlisted</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="col-span-2 space-y-2">
                            <Label>Description</Label>
                            <Textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Job description and responsibilities..."
                                rows={4}
                            />
                        </div>
                        <div className="col-span-2 space-y-2">
                            <Label>Requirements</Label>
                            <Textarea
                                value={formData.requirements}
                                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                                placeholder="Skills and qualifications required..."
                                rows={3}
                            />
                        </div>
                        <div className="col-span-2 flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isPaid"
                                checked={formData.isPaid}
                                onChange={(e) => setFormData({ ...formData, isPaid: e.target.checked })}
                                className="rounded border-gray-300"
                            />
                            <Label htmlFor="isPaid">This is a paid position</Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
                        <Button
                            onClick={() => createMutation.mutate(formData)}
                            disabled={!formData.title || !formData.companyId || createMutation.isPending}
                        >
                            {createMutation.isPending ? "Creating..." : "Post Job"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Job</DialogTitle>
                        <DialogDescription>Update job post details</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4 py-4">
                        <div className="col-span-2 space-y-2">
                            <Label>Job Title *</Label>
                            <Input
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Role Type</Label>
                            <Select
                                value={formData.roleType}
                                onValueChange={(v) => setFormData({ ...formData, roleType: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="internship">Internship</SelectItem>
                                    <SelectItem value="full_time">Full-time</SelectItem>
                                    <SelectItem value="part_time">Part-time</SelectItem>
                                    <SelectItem value="contract">Contract</SelectItem>
                                    <SelectItem value="freelance">Freelance</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Location</Label>
                            <Input
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Salary/Stipend</Label>
                            <Input
                                value={formData.salary}
                                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Visibility</Label>
                            <Select
                                value={formData.visibility}
                                onValueChange={(v) => setFormData({ ...formData, visibility: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="public">Public</SelectItem>
                                    <SelectItem value="private">Private</SelectItem>
                                    <SelectItem value="unlisted">Unlisted</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="col-span-2 flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isPaidEdit"
                                checked={formData.isPaid}
                                onChange={(e) => setFormData({ ...formData, isPaid: e.target.checked })}
                                className="rounded border-gray-300"
                            />
                            <Label htmlFor="isPaidEdit">This is a paid position</Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                        <Button
                            onClick={() => selectedJob && updateMutation.mutate({ id: selectedJob.id, data: formData })}
                            disabled={updateMutation.isPending}
                        >
                            {updateMutation.isPending ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Job Post</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete "{selectedJob?.title}"? This will also remove all applications. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => selectedJob && deleteMutation.mutate(selectedJob.id)}
                        >
                            {deleteMutation.isPending ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
