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
    Building2, Search, CheckCircle, XCircle, Edit, Trash2, Plus, RefreshCw,
    Mail, Phone, Calendar, Shield, Ban, Globe, MapPin, ExternalLink
} from "lucide-react";
import { format } from "date-fns";

interface Company {
    id: string;
    companyName: string;
    contactName: string;
    contactEmail: string;
    phone: string | null;
    businessType: string;
    industry: string | null;
    website: string | null;
    location: string | null;
    description: string | null;
    verified: boolean;
    status: string;
    trialStartDate: string | null;
    trialEndDate: string | null;
    createdAt: string;
}

export default function CompaniesManagement() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [verificationFilter, setVerificationFilter] = useState<string>("all");
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
    const [formData, setFormData] = useState({
        companyName: "",
        contactName: "",
        contactEmail: "",
        phone: "",
        businessType: "llp",
        industry: "",
        website: "",
        location: "",
        description: "",
    });

    const { data: companies = [], isLoading, refetch } = useQuery({
        queryKey: ["/api/admin/opportunities/companies"],
        queryFn: async () => {
            const res = await fetch("/api/admin/opportunities/companies");
            if (!res.ok) throw new Error("Failed to fetch companies");
            return res.json();
        },
    });

    const verifyMutation = useMutation({
        mutationFn: async ({ id, verified }: { id: string; verified: boolean }) => {
            const res = await fetch(`/api/admin/opportunities/companies/${id}/verify`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ verified }),
            });
            if (!res.ok) throw new Error("Failed to update verification");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/opportunities/companies"] });
            toast({ title: "Company updated", description: "Verification status changed successfully" });
        },
        onError: () => {
            toast({ title: "Error", description: "Failed to update company", variant: "destructive" });
        },
    });

    const statusMutation = useMutation({
        mutationFn: async ({ id, status }: { id: string; status: string }) => {
            const res = await fetch(`/api/admin/opportunities/companies/${id}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
            if (!res.ok) throw new Error("Failed to update status");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/opportunities/companies"] });
            toast({ title: "Status updated", description: "Company status changed successfully" });
        },
        onError: () => {
            toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
        },
    });

    const createMutation = useMutation({
        mutationFn: async (data: typeof formData) => {
            const res = await fetch("/api/admin/opportunities/companies", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Failed to create company");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/opportunities/companies"] });
            toast({ title: "Company created", description: "New company added successfully" });
            setCreateDialogOpen(false);
            resetForm();
        },
        onError: () => {
            toast({ title: "Error", description: "Failed to create company", variant: "destructive" });
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
            const res = await fetch(`/api/admin/opportunities/companies/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Failed to update company");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/opportunities/companies"] });
            toast({ title: "Company updated", description: "Company details saved successfully" });
            setEditDialogOpen(false);
            setSelectedCompany(null);
        },
        onError: () => {
            toast({ title: "Error", description: "Failed to update company", variant: "destructive" });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/admin/opportunities/companies/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Failed to delete company");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/opportunities/companies"] });
            toast({ title: "Company deleted", description: "Company removed successfully" });
            setDeleteDialogOpen(false);
            setSelectedCompany(null);
        },
        onError: () => {
            toast({ title: "Error", description: "Failed to delete company", variant: "destructive" });
        },
    });

    const resetForm = () => {
        setFormData({
            companyName: "",
            contactName: "",
            contactEmail: "",
            phone: "",
            businessType: "llp",
            industry: "",
            website: "",
            location: "",
            description: "",
        });
    };

    const openEditDialog = (company: Company) => {
        setSelectedCompany(company);
        setFormData({
            companyName: company.companyName,
            contactName: company.contactName,
            contactEmail: company.contactEmail,
            phone: company.phone || "",
            businessType: company.businessType,
            industry: company.industry || "",
            website: company.website || "",
            location: company.location || "",
            description: company.description || "",
        });
        setEditDialogOpen(true);
    };

    // Advanced search and filtering
    const filteredCompanies = companies.filter((company: Company) => {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = !searchTerm ||
            company.companyName.toLowerCase().includes(searchLower) ||
            company.contactName.toLowerCase().includes(searchLower) ||
            company.contactEmail.toLowerCase().includes(searchLower) ||
            (company.industry && company.industry.toLowerCase().includes(searchLower)) ||
            (company.location && company.location.toLowerCase().includes(searchLower)) ||
            company.businessType.toLowerCase().includes(searchLower);

        const matchesStatus = statusFilter === "all" || company.status === statusFilter;
        const matchesVerification =
            verificationFilter === "all" ||
            (verificationFilter === "verified" && company.verified) ||
            (verificationFilter === "unverified" && !company.verified);

        return matchesSearch && matchesStatus && matchesVerification;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "active":
                return <Badge className="bg-green-500">Active</Badge>;
            case "suspended":
                return <Badge variant="destructive">Suspended</Badge>;
            case "pending":
                return <Badge variant="secondary">Pending</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
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
                                <Building2 className="h-5 w-5" />
                                Companies Management
                            </CardTitle>
                            <CardDescription>
                                Manage registered companies, verify accounts, and control access
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => refetch()}>
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Refresh
                            </Button>
                            <Button size="sm" onClick={() => { resetForm(); setCreateDialogOpen(true); }}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Company
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Advanced Search & Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="md:col-span-2 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name, email, industry, location..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="suspended">Suspended</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={verificationFilter} onValueChange={setVerificationFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by verification" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Companies</SelectItem>
                                <SelectItem value="verified">Verified Only</SelectItem>
                                <SelectItem value="unverified">Unverified Only</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Results summary */}
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-sm text-muted-foreground">
                            Showing {filteredCompanies.length} of {companies.length} companies
                        </p>
                        {(searchTerm || statusFilter !== "all" || verificationFilter !== "all") && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => { setSearchTerm(""); setStatusFilter("all"); setVerificationFilter("all"); }}
                            >
                                Clear Filters
                            </Button>
                        )}
                    </div>

                    {/* Companies Table */}
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Company</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Business Type</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Verified</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredCompanies.length > 0 ? (
                                    filteredCompanies.map((company: Company) => (
                                        <TableRow key={company.id}>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{company.companyName}</p>
                                                    {company.industry && (
                                                        <p className="text-xs text-muted-foreground">{company.industry}</p>
                                                    )}
                                                    {company.location && (
                                                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                            <MapPin className="h-3 w-3" />
                                                            {company.location}
                                                        </p>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <p className="text-sm">{company.contactName}</p>
                                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <Mail className="h-3 w-3" />
                                                        {company.contactEmail}
                                                    </p>
                                                    {company.phone && (
                                                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                            <Phone className="h-3 w-3" />
                                                            {company.phone}
                                                        </p>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{company.businessType.toUpperCase()}</Badge>
                                            </TableCell>
                                            <TableCell>{getStatusBadge(company.status)}</TableCell>
                                            <TableCell>
                                                {company.verified ? (
                                                    <Badge className="bg-green-500">
                                                        <CheckCircle className="h-3 w-3 mr-1" />
                                                        Verified
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary">
                                                        <XCircle className="h-3 w-3 mr-1" />
                                                        Unverified
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                    <Calendar className="h-3 w-3" />
                                                    {format(new Date(company.createdAt), "MMM d, yyyy")}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    {company.website && (
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => window.open(company.website!, "_blank")}
                                                        >
                                                            <ExternalLink className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                    <Button
                                                        size="sm"
                                                        variant={company.verified ? "secondary" : "default"}
                                                        onClick={() => verifyMutation.mutate({ id: company.id, verified: !company.verified })}
                                                    >
                                                        {company.verified ? (
                                                            <><Ban className="h-4 w-4 mr-1" />Unverify</>
                                                        ) : (
                                                            <><Shield className="h-4 w-4 mr-1" />Verify</>
                                                        )}
                                                    </Button>
                                                    <Select
                                                        value={company.status}
                                                        onValueChange={(status) => statusMutation.mutate({ id: company.id, status })}
                                                    >
                                                        <SelectTrigger className="w-28">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="active">Active</SelectItem>
                                                            <SelectItem value="pending">Pending</SelectItem>
                                                            <SelectItem value="suspended">Suspended</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <Button size="sm" variant="outline" onClick={() => openEditDialog(company)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => { setSelectedCompany(company); setDeleteDialogOpen(true); }}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                                            {companies.length === 0 ? "No companies registered yet" : "No companies match your filters"}
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
                        <DialogTitle>Add New Company</DialogTitle>
                        <DialogDescription>Create a new company account manually</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4 py-4">
                        <div className="space-y-2">
                            <Label>Company Name *</Label>
                            <Input
                                value={formData.companyName}
                                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                placeholder="Enter company name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Business Type *</Label>
                            <Select
                                value={formData.businessType}
                                onValueChange={(v) => setFormData({ ...formData, businessType: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="sole_proprietorship">Sole Proprietorship</SelectItem>
                                    <SelectItem value="partnership">Partnership</SelectItem>
                                    <SelectItem value="llp">LLP</SelectItem>
                                    <SelectItem value="pvt_ltd">Private Limited</SelectItem>
                                    <SelectItem value="public">Public Limited</SelectItem>
                                    <SelectItem value="startup">Startup</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Contact Name *</Label>
                            <Input
                                value={formData.contactName}
                                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                                placeholder="Contact person name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Contact Email *</Label>
                            <Input
                                type="email"
                                value={formData.contactEmail}
                                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                                placeholder="contact@company.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Phone</Label>
                            <Input
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="+91 XXXXX XXXXX"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Industry</Label>
                            <Input
                                value={formData.industry}
                                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                                placeholder="e.g., Technology, Healthcare"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Website</Label>
                            <Input
                                value={formData.website}
                                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                placeholder="https://company.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Location</Label>
                            <Input
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                placeholder="City, State"
                            />
                        </div>
                        <div className="col-span-2 space-y-2">
                            <Label>Description</Label>
                            <Textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Brief description of the company..."
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
                        <Button
                            onClick={() => createMutation.mutate(formData)}
                            disabled={!formData.companyName || !formData.contactName || !formData.contactEmail || createMutation.isPending}
                        >
                            {createMutation.isPending ? "Creating..." : "Create Company"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Company</DialogTitle>
                        <DialogDescription>Update company details</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4 py-4">
                        <div className="space-y-2">
                            <Label>Company Name *</Label>
                            <Input
                                value={formData.companyName}
                                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Business Type *</Label>
                            <Select
                                value={formData.businessType}
                                onValueChange={(v) => setFormData({ ...formData, businessType: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="sole_proprietorship">Sole Proprietorship</SelectItem>
                                    <SelectItem value="partnership">Partnership</SelectItem>
                                    <SelectItem value="llp">LLP</SelectItem>
                                    <SelectItem value="pvt_ltd">Private Limited</SelectItem>
                                    <SelectItem value="public">Public Limited</SelectItem>
                                    <SelectItem value="startup">Startup</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Contact Name *</Label>
                            <Input
                                value={formData.contactName}
                                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Contact Email *</Label>
                            <Input
                                type="email"
                                value={formData.contactEmail}
                                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Phone</Label>
                            <Input
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Industry</Label>
                            <Input
                                value={formData.industry}
                                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Website</Label>
                            <Input
                                value={formData.website}
                                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Location</Label>
                            <Input
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            />
                        </div>
                        <div className="col-span-2 space-y-2">
                            <Label>Description</Label>
                            <Textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                        <Button
                            onClick={() => selectedCompany && updateMutation.mutate({ id: selectedCompany.id, data: formData })}
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
                        <AlertDialogTitle>Delete Company</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete "{selectedCompany?.companyName}"? This will also remove all associated job posts. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => selectedCompany && deleteMutation.mutate(selectedCompany.id)}
                        >
                            {deleteMutation.isPending ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
