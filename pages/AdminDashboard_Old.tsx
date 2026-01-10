import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  LogOut, DollarSign, ShoppingCart, Users, User, Package, Download, Search, Eye, 
  Edit, Trash2, CheckCircle, XCircle, TrendingUp, TrendingDown, Activity,
  RefreshCw, Filter, MoreVertical, Copy, Mail, Phone, MapPin, Calendar,
  CreditCard, AlertCircle, Clock, CheckCheck, Settings, BarChart3
} from "lucide-react";
import { format } from "date-fns";
import ServiceManagement from "@/components/admin/ServiceManagement";
import CategoryManagement from "@/components/admin/CategoryManagement";
import UserManagement from "@/components/admin/UserManagement";
import OrderManagement from "@/components/admin/OrderManagement";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

interface Analytics {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: string;
  totalLeads: number;
  totalServices: number;
  activeServices: number;
  recentOrders: any[];
  recentLeads: any[];
}

function APIIntegrationCheck() {
  const [integrationStatus, setIntegrationStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkIntegrations();
  }, []);

  const checkIntegrations = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/integration-status");
      if (response.ok) {
        const data = await response.json();
        setIntegrationStatus(data);
      }
    } catch (error) {
      console.error("Failed to check integrations", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5 animate-spin text-primary" />
          <span>Checking integrations...</span>
        </div>
      </div>
    );
  }

  const integrations = [
    {
      name: "Razorpay",
      description: "Payment Gateway",
      status: integrationStatus?.razorpay?.configured,
      error: integrationStatus?.razorpay?.error,
      icon: CreditCard,
    },
    {
      name: "OpenRouter",
      description: "AI Concierge",
      status: integrationStatus?.openrouter?.configured,
      error: integrationStatus?.openrouter?.error,
      icon: Activity,
    },
    {
      name: "Supabase",
      description: "Database & Auth",
      status: integrationStatus?.supabase?.configured,
      error: integrationStatus?.supabase?.error,
      icon: Package,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Service Status</h3>
        <Button variant="outline" size="sm" onClick={checkIntegrations}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
      
      <div className="grid gap-4">
        {integrations.map((integration) => {
          const Icon = integration.icon;
          return (
            <Card key={integration.name}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold">{integration.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {integration.description}
                      </p>
                      {integration.error && (
                        <div className="flex items-start gap-2 mt-2 p-2 bg-destructive/10 rounded text-sm">
                          <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
                          <div>
                            <p className="font-medium text-destructive">Error</p>
                            <p className="text-destructive/80 text-xs">{integration.error}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    {integration.status ? (
                      <Badge className="bg-green-500">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Connected
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <XCircle className="h-3 w-3 mr-1" />
                        Not Configured
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderSearch, setOrderSearch] = useState("");
  const [leadSearch, setLeadSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [editingLead, setEditingLead] = useState<any | null>(null);
  const [orderDetailsLoading, setOrderDetailsLoading] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{type: string, id: string} | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    checkAuth();
    loadAllData();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/admin/check");
      const data = await response.json();
      if (!data.isAdmin) {
        setLocation("/admin/login");
      }
    } catch (err) {
      setLocation("/admin/login");
    }
  };

  const loadAllData = async () => {
    setLoading(true);
    await Promise.all([
      loadAnalytics(),
      loadOrders(),
      loadLeads(),
      loadServices(),
      loadCategories(),
    ]);
    setLoading(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAllData();
    setRefreshing(false);
    toast({
      title: "Refreshed",
      description: "Dashboard data has been updated",
    });
  };

  const loadAnalytics = async () => {
    try {
      const response = await fetch("/api/admin/analytics");
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (err) {
      console.error("Failed to load analytics", err);
    }
  };

  const loadOrders = async () => {
    try {
      const response = await fetch("/api/admin/orders");
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (err) {
      console.error("Failed to load orders", err);
    }
  };

  const loadLeads = async () => {
    try {
      const response = await fetch("/api/admin/leads");
      if (response.ok) {
        const data = await response.json();
        setLeads(data);
      }
    } catch (err) {
      console.error("Failed to load leads", err);
    }
  };

  const loadServices = async () => {
    try {
      const response = await fetch("/api/admin/services");
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      }
    } catch (err) {
      console.error("Failed to load services", err);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  };

  const loadOrderDetails = async (orderId: string) => {
    setOrderDetailsLoading(true);
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/details`);
      if (response.ok) {
        const data = await response.json();
        setSelectedOrder(data);
      }
    } catch (err) {
      console.error("Failed to load order details", err);
    } finally {
      setOrderDetailsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      setLocation("/admin/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const handleOrderStatusChange = async (orderId: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (response.ok) {
        await loadOrders();
        await loadAnalytics();
        toast({
          title: "Order Updated",
          description: `Order status changed to ${status}`,
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update order",
        variant: "destructive",
      });
    }
  };

  const handleBulkStatusChange = async (status: string) => {
    try {
      await Promise.all(
        selectedOrders.map(orderId =>
          fetch(`/api/admin/orders/${orderId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
          })
        )
      );
      setSelectedOrders([]);
      await loadOrders();
      await loadAnalytics();
      toast({
        title: "Bulk Update Complete",
        description: `${selectedOrders.length} orders updated to ${status}`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update orders",
        variant: "destructive",
      });
    }
  };

  const handleDeleteItem = async () => {
    if (!itemToDelete) return;

    try {
      const endpoint = itemToDelete.type === 'lead' 
        ? `/api/admin/leads/${itemToDelete.id}`
        : `/api/admin/orders/${itemToDelete.id}`;
      
      const response = await fetch(endpoint, { method: "DELETE" });
      
      if (response.ok) {
        if (itemToDelete.type === 'lead') {
          await loadLeads();
        } else {
          await loadOrders();
          await loadAnalytics();
        }
        toast({
          title: "Deleted",
          description: `${itemToDelete.type} has been deleted`,
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: `Failed to delete ${itemToDelete.type}`,
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const handleUpdateLead = async () => {
    if (!editingLead) return;

    try {
      const response = await fetch(`/api/admin/leads/${editingLead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editingLead.name,
          email: editingLead.email,
          phone: editingLead.phone,
          message: editingLead.message,
        }),
      });

      if (response.ok) {
        await loadLeads();
        setEditingLead(null);
        toast({
          title: "Lead Updated",
          description: "Lead information has been saved",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update lead",
        variant: "destructive",
      });
    }
  };

  const exportToCSV = (data: any[], filename: string, headers: string[]) => {
    const csvContent = [
      headers.join(","),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header] || "";
          return `"${String(value).replace(/"/g, '""')}"`;
        }).join(",")
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}_${format(new Date(), "yyyy-MM-dd")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportOrders = () => {
    const exportData = filteredOrders.map(order => ({
      id: order.id,
      customerName: order.customerName || "",
      customerEmail: order.customerEmail || "",
      customerPhone: order.customerPhone || "",
      totalInr: order.totalInr,
      status: order.status,
      createdAt: format(new Date(order.createdAt), "yyyy-MM-dd HH:mm:ss")
    }));
    exportToCSV(exportData, "stootap_orders", [
      "id", "customerName", "customerEmail", "customerPhone", "totalInr", "status", "createdAt"
    ]);
  };

  const handleExportLeads = () => {
    const exportData = filteredLeads.map(lead => ({
      id: lead.id,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      role: lead.role,
      message: lead.message,
      createdAt: format(new Date(lead.createdAt), "yyyy-MM-dd HH:mm:ss")
    }));
    exportToCSV(exportData, "stootap_leads", [
      "id", "name", "email", "phone", "role", "message", "createdAt"
    ]);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = !orderSearch ||
      order.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      (order.customerName || "").toLowerCase().includes(orderSearch.toLowerCase()) ||
      (order.customerEmail || "").toLowerCase().includes(orderSearch.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const filteredLeads = leads.filter(lead =>
    !leadSearch ||
    lead.name.toLowerCase().includes(leadSearch.toLowerCase()) ||
    lead.email.toLowerCase().includes(leadSearch.toLowerCase()) ||
    lead.phone.includes(leadSearch)
  );

  // Calculate additional metrics
  const revenueGrowth = analytics ? 
    ((analytics.completedOrders / Math.max(analytics.totalOrders, 1)) * 100).toFixed(1) : "0";
  const conversionRate = analytics ? 
    ((analytics.totalOrders / Math.max(analytics.totalLeads, 1)) * 100).toFixed(1) : "0";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <Button 
              onClick={handleRefresh} 
              variant="ghost" 
              size="sm"
              disabled={refreshing}
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="px-3 py-1">
              <Activity className="w-3 h-3 mr-1" />
              Live
            </Badge>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        {/* Enhanced Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600">₹{analytics?.totalRevenue || "0.00"}</div>
              <div className="flex items-center text-xs text-muted-foreground mt-2">
                <TrendingUp className="w-3 h-3 mr-1 text-emerald-600" />
                <span>{revenueGrowth}% completion rate</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                From {analytics?.completedOrders || 0} completed orders
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{analytics?.totalOrders || 0}</div>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  {analytics?.pendingOrders || 0} pending
                </Badge>
                <Badge variant="default" className="text-xs">
                  <CheckCheck className="w-3 h-3 mr-1" />
                  {analytics?.completedOrders || 0} done
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{analytics?.totalLeads || 0}</div>
              <div className="flex items-center text-xs text-muted-foreground mt-2">
                <BarChart3 className="w-3 h-3 mr-1 text-purple-600" />
                <span>{conversionRate}% conversion rate</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Lead capture & inquiries
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Services</CardTitle>
              <Package className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{analytics?.activeServices || 0}</div>
              <div className="flex items-center text-xs text-muted-foreground mt-2">
                <Settings className="w-3 h-3 mr-1 text-orange-600" />
                <span>Out of {analytics?.totalServices || 0} total</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Services available to customers
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="orders" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6 lg:w-auto">
            <TabsTrigger value="orders">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Orders Tab with Enhanced Management */}
          <TabsContent value="orders" className="space-y-4">
            <OrderManagement />
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <UserManagement />
          </TabsContent>

          {/* Legacy Orders Tab Content - REMOVED */}
          <TabsContent value="orders-legacy" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle>All Orders</CardTitle>
                    <CardDescription>
                      Manage and track all customer orders with bulk actions
                    </CardDescription>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search orders..."
                        value={orderSearch}
                        onChange={(e) => setOrderSearch(e.target.value)}
                        className="pl-9 w-64"
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-32">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={handleExportOrders} variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
                {selectedOrders.length > 0 && (
                  <div className="flex items-center gap-2 mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium">{selectedOrders.length} orders selected</span>
                    <div className="ml-auto flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleBulkStatusChange("processing")}>
                        Mark Processing
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleBulkStatusChange("completed")}>
                        Mark Completed
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setSelectedOrders([])}>
                        Clear
                      </Button>
                    </div>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                          onCheckedChange={(checked) => {
                            setSelectedOrders(checked ? filteredOrders.map(o => o.id) : []);
                          }}
                        />
                      </TableHead>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                          <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          {orderSearch || statusFilter !== "all" ? "No orders match your filters" : "No orders yet"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredOrders.map((order) => (
                        <TableRow key={order.id} className="hover:bg-muted/50">
                          <TableCell>
                            <Checkbox
                              checked={selectedOrders.includes(order.id)}
                              onCheckedChange={(checked) => {
                                setSelectedOrders(prev =>
                                  checked
                                    ? [...prev, order.id]
                                    : prev.filter(id => id !== order.id)
                                );
                              }}
                            />
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-auto p-0 font-mono"
                              onClick={() => copyToClipboard(order.id, "Order ID")}
                            >
                              {order.id.slice(0, 8)}...
                              <Copy className="w-3 h-3 ml-1 opacity-50" />
                            </Button>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {order.customerName || "Guest"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1 text-xs">
                              {order.customerEmail && (
                                <div className="flex items-center gap-1">
                                  <Mail className="w-3 h-3" />
                                  {order.customerEmail}
                                </div>
                              )}
                              {order.customerPhone && (
                                <div className="flex items-center gap-1">
                                  <Phone className="w-3 h-3" />
                                  {order.customerPhone}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="font-bold">₹{order.totalInr}</TableCell>
                          <TableCell>
                            <Select
                              value={order.status}
                              onValueChange={(value) => handleOrderStatusChange(order.id, value)}
                            >
                              <SelectTrigger className="w-32">
                                <Badge variant={
                                  order.status === "completed" ? "default" :
                                  order.status === "processing" ? "secondary" :
                                  order.status === "cancelled" ? "destructive" :
                                  "outline"
                                }>
                                  {order.status}
                                </Badge>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="processing">Processing</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="text-xs">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {order.createdAt ? format(new Date(order.createdAt), "MMM d, yyyy") : 'N/A'}
                            </div>
                            <div className="text-muted-foreground">
                              {order.createdAt ? format(new Date(order.createdAt), "HH:mm") : ''}
                            </div>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => loadOrderDetails(order.id)}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => copyToClipboard(order.id, "Order ID")}>
                                  <Copy className="w-4 h-4 mr-2" />
                                  Copy ID
                                </DropdownMenuItem>
                                {order.customerEmail && (
                                  <DropdownMenuItem onClick={() => window.location.href = `mailto:${order.customerEmail}`}>
                                    <Mail className="w-4 h-4 mr-2" />
                                    Email Customer
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-destructive"
                                  onClick={() => {
                                    setItemToDelete({ type: 'order', id: order.id });
                                    setDeleteDialogOpen(true);
                                  }}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Leads Tab with Enhanced Edit Features */}
          <TabsContent value="leads" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle>All Leads</CardTitle>
                    <CardDescription>
                      View and manage customer inquiries with inline editing
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search leads..."
                        value={leadSearch}
                        onChange={(e) => setLeadSearch(e.target.value)}
                        className="pl-9 w-64"
                      />
                    </div>
                    <Button onClick={handleExportLeads} variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLeads.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                          <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          {leadSearch ? "No leads match your search" : "No leads yet"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredLeads.map((lead) => (
                        <TableRow key={lead.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">{lead.name}</TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1 text-xs">
                              <div className="flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                <Button
                                  variant="link"
                                  size="sm"
                                  className="h-auto p-0 text-xs"
                                  onClick={() => window.location.href = `mailto:${lead.email}`}
                                >
                                  {lead.email}
                                </Button>
                              </div>
                              <div className="flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {lead.phone}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{lead.role}</Badge>
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <p className="truncate text-sm">{lead.message}</p>
                          </TableCell>
                          <TableCell className="text-xs">
                            {lead.createdAt ? format(new Date(lead.createdAt), "MMM d, yyyy HH:mm") : 'N/A'}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="sm" onClick={() => setSelectedLead(lead)}>
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Lead Details</DialogTitle>
                                    <DialogDescription>Full lead information and message</DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div>
                                      <Label>Name</Label>
                                      <p className="text-sm font-medium">{selectedLead?.name}</p>
                                    </div>
                                    <div>
                                      <Label>Email</Label>
                                      <p className="text-sm font-medium">{selectedLead?.email}</p>
                                    </div>
                                    <div>
                                      <Label>Phone</Label>
                                      <p className="text-sm font-medium">{selectedLead?.phone}</p>
                                    </div>
                                    <div>
                                      <Label>Role</Label>
                                      <p className="text-sm font-medium">{selectedLead?.role}</p>
                                    </div>
                                    <div>
                                      <Label>Message</Label>
                                      <p className="text-sm whitespace-pre-wrap">{selectedLead?.message}</p>
                                    </div>
                                    <div>
                                      <Label>Received</Label>
                                      <p className="text-sm text-muted-foreground">
                                        {selectedLead && selectedLead.createdAt && format(new Date(selectedLead.createdAt), "MMMM d, yyyy 'at' HH:mm")}
                                      </p>
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button
                                      variant="outline"
                                      onClick={() => window.location.href = `mailto:${selectedLead?.email}`}
                                    >
                                      <Mail className="w-4 h-4 mr-2" />
                                      Send Email
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="sm" onClick={() => setEditingLead({...lead})}>
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Edit Lead</DialogTitle>
                                    <DialogDescription>Update lead information</DialogDescription>
                                  </DialogHeader>
                                  {editingLead && (
                                    <div className="space-y-4">
                                      <div>
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                          id="name"
                                          value={editingLead.name}
                                          onChange={(e) => setEditingLead({...editingLead, name: e.target.value})}
                                        />
                                      </div>
                                      <div>
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                          id="email"
                                          type="email"
                                          value={editingLead.email}
                                          onChange={(e) => setEditingLead({...editingLead, email: e.target.value})}
                                        />
                                      </div>
                                      <div>
                                        <Label htmlFor="phone">Phone</Label>
                                        <Input
                                          id="phone"
                                          value={editingLead.phone}
                                          onChange={(e) => setEditingLead({...editingLead, phone: e.target.value})}
                                        />
                                      </div>
                                      <div>
                                        <Label htmlFor="message">Message</Label>
                                        <Textarea
                                          id="message"
                                          value={editingLead.message}
                                          onChange={(e) => setEditingLead({...editingLead, message: e.target.value})}
                                          rows={4}
                                        />
                                      </div>
                                    </div>
                                  )}
                                  <DialogFooter>
                                    <Button variant="outline" onClick={() => setEditingLead(null)}>
                                      Cancel
                                    </Button>
                                    <Button onClick={handleUpdateLead}>
                                      Save Changes
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  setItemToDelete({ type: 'lead', id: lead.id });
                                  setDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-4">
            <ServiceManagement services={services} categories={categories} onUpdate={loadServices} />
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <CategoryManagement categories={categories} onUpdate={loadCategories} />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>API Integration Status</CardTitle>
                <CardDescription>
                  Check the status of external service integrations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <APIIntegrationCheck />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this {itemToDelete?.type}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteItem} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Order Details Dialog */}
      {selectedOrder && (
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
              <DialogDescription>
                Order ID: {selectedOrder.id}
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[70vh]">
              {orderDetailsLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="space-y-6 p-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Customer Information
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <User className="w-4 h-4 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-muted-foreground text-xs">Name</p>
                            <p className="font-medium">{selectedOrder.customerName || "N/A"}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-muted-foreground text-xs">Email</p>
                            <p className="font-medium">{selectedOrder.customerEmail || "N/A"}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-muted-foreground text-xs">Phone</p>
                            <p className="font-medium">{selectedOrder.customerPhone || "N/A"}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-muted-foreground text-xs">Address</p>
                            <p className="font-medium">{selectedOrder.customerAddress || "N/A"}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        Payment Information
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <p className="text-muted-foreground text-xs">Razorpay Order ID</p>
                          <p className="font-mono text-xs">{selectedOrder.razorpayOrderId || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Payment ID</p>
                          <p className="font-mono text-xs">{selectedOrder.razorpayPaymentId || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Status</p>
                          <Badge className="mt-1">{selectedOrder.status}</Badge>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Created</p>
                          <p className="font-medium">{selectedOrder.createdAt ? format(new Date(selectedOrder.createdAt), "PPpp") : 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-semibold mb-3">Order Items</h4>
                    <div className="space-y-2">
                      {selectedOrder.items?.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-start p-3 bg-muted/50 rounded">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">Qty: {item.qty}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">₹{item.totalInr}</p>
                            <p className="text-xs text-muted-foreground">₹{item.unitPriceInr} each</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">₹{selectedOrder.subtotalInr}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">GST (18%)</span>
                      <span className="font-medium">₹{selectedOrder.gstInr}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg">
                      <span className="font-semibold">Total</span>
                      <span className="font-bold text-primary">₹{selectedOrder.totalInr}</span>
                    </div>
                  </div>
                </div>
              )}
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
