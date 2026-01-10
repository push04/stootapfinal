import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Users, Search, Calendar, RefreshCw, Eye, Mail, Phone, MessageSquare, Download } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";

interface Lead {
  id: string;
  userId: string | null;
  name: string;
  email: string;
  phone: string;
  role: string;
  message: string;
  kind: string | null;
  capturedVia: string | null;
  metadata: any;
  createdAt: string;
}

export default function LeadManagement() {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [kindFilter, setKindFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    loadLeads();
  }, [kindFilter, roleFilter]);

  const loadLeads = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (kindFilter !== 'all') params.append('kind', kindFilter);
      if (roleFilter !== 'all') params.append('role', roleFilter);

      const response = await fetch(`/api/admin/leads?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setLeads(data);
      } else {
        toast({
          title: "Error",
          description: "Failed to load leads",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to load leads:", error);
      toast({
        title: "Error",
        description: "Failed to load leads",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadLeadDetails = async (leadId: string) => {
    try {
      const response = await fetch(`/api/admin/leads/${leadId}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedLead(data);
        setDetailsOpen(true);
      } else {
        toast({
          title: "Error",
          description: "Failed to load lead details",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to load lead details:", error);
      toast({
        title: "Error",
        description: "Failed to load lead details",
        variant: "destructive",
      });
    }
  };

  const exportToCSV = () => {
    try {
      const headers = ['Name', 'Email', 'Phone', 'Role', 'Type', 'Message', 'Source', 'Date'];
      const csvContent = [
        headers.join(','),
        ...filteredLeads.map(lead => [
          `"${lead.name}"`,
          lead.email,
          lead.phone,
          lead.role,
          lead.kind || 'general',
          `"${lead.message.replace(/"/g, '""')}"`,
          lead.capturedVia || 'web_form',
          format(new Date(lead.createdAt), 'yyyy-MM-dd HH:mm')
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `leads_${format(new Date(), 'yyyy-MM-dd')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export Successful",
        description: `Exported ${filteredLeads.length} leads to CSV`,
      });
    } catch (err) {
      console.error('Export failed:', err);
      toast({
        title: "Export Failed",
        description: "Failed to export leads",
        variant: "destructive",
      });
    }
  };

  const handleSearch = () => {
    loadLeads();
  };

  const filteredLeads = leads;

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "student": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "business": return "bg-zinc-100 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200";
      case "entrepreneur": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      default: return "bg-zinc-100 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200";
    }
  };

  if (loading && leads.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading leads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Lead Management
              </CardTitle>
              <CardDescription className="mt-1">
                View and manage all customer inquiries and leads
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={exportToCSV}
                variant="outline"
                size="sm"
                className="gap-2"
                disabled={filteredLeads.length === 0}
              >
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
              <Button onClick={loadLeads} variant="outline" size="sm" className="gap-2" disabled={loading}>
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, phone, or message..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="entrepreneur">Entrepreneur</SelectItem>
              </SelectContent>
            </Select>
            <Select value={kindFilter} onValueChange={setKindFilter}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="ai_concierge">AI Concierge</SelectItem>
                <SelectItem value="service_inquiry">Service Inquiry</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSearch} size="sm" className="gap-2">
              <Search className="h-4 w-4" />
              Search
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            Showing {filteredLeads.length} {filteredLeads.length === 1 ? 'lead' : 'leads'}
          </div>

          {isMobile ? (
            <div className="space-y-3">
              {filteredLeads.map((lead) => (
                <Card key={lead.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-base">{lead.name}</h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <Badge className={getRoleBadgeColor(lead.role)}>
                            {lead.role}
                          </Badge>
                          {lead.kind && (
                            <Badge variant="outline" className="text-xs">
                              {lead.kind}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{lead.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-4 w-4 flex-shrink-0" />
                        <span>{lead.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4 flex-shrink-0" />
                        <span>{format(new Date(lead.createdAt), 'MMM dd, yyyy HH:mm')}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {lead.message}
                      </p>
                    </div>

                    <Button
                      onClick={() => loadLeadDetails(lead.id)}
                      variant="outline"
                      size="sm"
                      className="w-full gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Message Preview</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLeads.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No leads found matching your criteria
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredLeads.map((lead) => (
                        <TableRow key={lead.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">{lead.name}</TableCell>
                          <TableCell>
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center gap-1">
                                <Mail className="h-3 w-3 text-muted-foreground" />
                                <span className="truncate max-w-[200px]">{lead.email}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3 text-muted-foreground" />
                                <span>{lead.phone}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getRoleBadgeColor(lead.role)}>
                              {lead.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {lead.kind || 'general'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm text-muted-foreground line-clamp-2 max-w-[300px]">
                              {lead.message}
                            </p>
                          </TableCell>
                          <TableCell className="text-sm">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              {format(new Date(lead.createdAt), 'MMM dd, yyyy')}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {format(new Date(lead.createdAt), 'HH:mm')}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              onClick={() => loadLeadDetails(lead.id)}
                              variant="ghost"
                              size="sm"
                              className="gap-2"
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Lead Details
            </DialogTitle>
            <DialogDescription>
              Full information about this lead inquiry
            </DialogDescription>
          </DialogHeader>

          {selectedLead && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <p className="text-base font-semibold">{selectedLead.name}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">Role</label>
                  <Badge className={getRoleBadgeColor(selectedLead.role)}>
                    {selectedLead.role}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-base flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${selectedLead.email}`} className="text-primary hover:underline">
                      {selectedLead.email}
                    </a>
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <p className="text-base flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${selectedLead.phone}`} className="text-primary hover:underline">
                      {selectedLead.phone}
                    </a>
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">Type</label>
                  <Badge variant="outline">
                    {selectedLead.kind || 'general'}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">Source</label>
                  <p className="text-base">{selectedLead.capturedVia || 'web_form'}</p>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">Date Submitted</label>
                  <p className="text-base flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {format(new Date(selectedLead.createdAt), 'MMMM dd, yyyy')} at {format(new Date(selectedLead.createdAt), 'HH:mm:ss')}
                  </p>
                </div>
              </div>

              <div className="space-y-2 border-t pt-4">
                <label className="text-sm font-medium text-muted-foreground">Message</label>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-base whitespace-pre-wrap">{selectedLead.message}</p>
                </div>
              </div>


              <div className="flex gap-2 pt-4">
                <Button asChild variant="default" className="flex-1">
                  <a href={`mailto:${selectedLead.email}`}>
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </a>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <a href={`tel:${selectedLead.phone}`}>
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </a>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
