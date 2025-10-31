import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { LogOut, DollarSign, ShoppingCart, Users, Package, Download, Search, Eye } from "lucide-react";
import { format } from "date-fns";
import ServiceManagement from "@/components/admin/ServiceManagement";
import CategoryManagement from "@/components/admin/CategoryManagement";

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

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderSearch, setOrderSearch] = useState("");
  const [leadSearch, setLeadSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [orderDetailsLoading, setOrderDetailsLoading] = useState(false);

  useEffect(() => {
    checkAuth();
    loadAnalytics();
    loadOrders();
    loadLeads();
    loadServices();
    loadCategories();
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

  const loadAnalytics = async () => {
    try {
      const response = await fetch("/api/admin/analytics");
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (err) {
      console.error("Failed to load analytics", err);
    } finally {
      setLoading(false);
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
        loadOrders();
        loadAnalytics();
      }
    } catch (err) {
      console.error("Failed to update order", err);
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

  const filteredOrders = orders.filter(order => 
    !orderSearch ||
    order.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
    (order.customerName || "").toLowerCase().includes(orderSearch.toLowerCase()) ||
    (order.customerEmail || "").toLowerCase().includes(orderSearch.toLowerCase())
  );

  const filteredLeads = leads.filter(lead =>
    !leadSearch ||
    lead.name.toLowerCase().includes(leadSearch.toLowerCase()) ||
    lead.email.toLowerCase().includes(leadSearch.toLowerCase()) ||
    lead.phone.includes(leadSearch)
  );

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
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <Button onClick={handleLogout} variant="outline" size="sm">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{analytics?.totalRevenue || "0.00"}</div>
              <p className="text-xs text-muted-foreground">
                From {analytics?.completedOrders || 0} completed orders
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.totalOrders || 0}</div>
              <p className="text-xs text-muted-foreground">
                {analytics?.pendingOrders || 0} pending
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.totalLeads || 0}</div>
              <p className="text-xs text-muted-foreground">
                Lead capture forms
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Services</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.activeServices || 0}</div>
              <p className="text-xs text-muted-foreground">
                Out of {analytics?.totalServices || 0} total
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="orders" className="space-y-4">
          <TabsList>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>All Orders</CardTitle>
                    <CardDescription>
                      Manage and track all customer orders
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search orders..."
                        value={orderSearch}
                        onChange={(e) => setOrderSearch(e.target.value)}
                        className="pl-9 w-64"
                      />
                    </div>
                    <Button onClick={handleExportOrders} variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground">
                          {orderSearch ? "No orders match your search" : "No orders yet"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-mono text-sm">
                            {order.id.slice(0, 8)}...
                          </TableCell>
                          <TableCell>
                            {order.customerName || order.customerEmail || "Guest"}
                          </TableCell>
                          <TableCell>₹{order.totalInr}</TableCell>
                          <TableCell>
                            <Badge variant={
                              order.status === "completed" ? "default" :
                              order.status === "pending" ? "secondary" :
                              "outline"
                            }>
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {format(new Date(order.createdAt), "MMM d, yyyy")}
                          </TableCell>
                          <TableCell className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => loadOrderDetails(order.id)}
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  View
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-3xl max-h-[90vh]">
                                <DialogHeader>
                                  <DialogTitle>Order Details</DialogTitle>
                                  <DialogDescription>
                                    Order ID: {selectedOrder?.id || order.id}
                                  </DialogDescription>
                                </DialogHeader>
                                <ScrollArea className="max-h-[70vh]">
                                  {orderDetailsLoading ? (
                                    <div className="flex items-center justify-center p-8">
                                      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                  ) : selectedOrder ? (
                                    <div className="space-y-6 p-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <h4 className="font-semibold mb-2">Customer Information</h4>
                                          <div className="space-y-1 text-sm">
                                            <p><span className="text-muted-foreground">Name:</span> {selectedOrder.customerName || "N/A"}</p>
                                            <p><span className="text-muted-foreground">Email:</span> {selectedOrder.customerEmail || "N/A"}</p>
                                            <p><span className="text-muted-foreground">Phone:</span> {selectedOrder.customerPhone || "N/A"}</p>
                                            <p><span className="text-muted-foreground">Address:</span> {selectedOrder.customerAddress || "N/A"}</p>
                                          </div>
                                        </div>
                                        <div>
                                          <h4 className="font-semibold mb-2">Payment Information</h4>
                                          <div className="space-y-1 text-sm">
                                            <p><span className="text-muted-foreground">Status:</span> <Badge>{selectedOrder.status}</Badge></p>
                                            <p><span className="text-muted-foreground">Subtotal:</span> ₹{selectedOrder.subtotalInr}</p>
                                            <p><span className="text-muted-foreground">GST:</span> ₹{selectedOrder.gstInr}</p>
                                            <p><span className="text-muted-foreground font-semibold">Total:</span> <strong>₹{selectedOrder.totalInr}</strong></p>
                                            {selectedOrder.razorpayOrderId && (
                                              <p className="text-xs text-muted-foreground">Razorpay Order: {selectedOrder.razorpayOrderId}</p>
                                            )}
                                            {selectedOrder.razorpayPaymentId && (
                                              <p className="text-xs text-muted-foreground">Payment ID: {selectedOrder.razorpayPaymentId}</p>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                      <Separator />
                                      <div>
                                        <h4 className="font-semibold mb-3">Order Items</h4>
                                        <div className="space-y-2">
                                          {selectedOrder.items && selectedOrder.items.length > 0 ? (
                                            selectedOrder.items.map((item: any) => (
                                              <div key={item.id} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                                                <div>
                                                  <p className="font-medium">{item.name}</p>
                                                  <p className="text-sm text-muted-foreground">Qty: {item.qty} × ₹{item.unitPriceInr}</p>
                                                </div>
                                                <p className="font-semibold">₹{item.totalInr}</p>
                                              </div>
                                            ))
                                          ) : (
                                            <p className="text-sm text-muted-foreground">No items found</p>
                                          )}
                                        </div>
                                      </div>
                                      <Separator />
                                      <div className="text-xs text-muted-foreground">
                                        <p>Created: {format(new Date(selectedOrder.createdAt), "PPpp")}</p>
                                      </div>
                                    </div>
                                  ) : null}
                                </ScrollArea>
                              </DialogContent>
                            </Dialog>
                            <Select
                              value={order.status}
                              onValueChange={(value) => handleOrderStatusChange(order.id, value)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="processing">Processing</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leads" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>All Leads</CardTitle>
                    <CardDescription>
                      Captured leads from contact forms
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
                      Export CSV
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLeads.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground">
                          {leadSearch ? "No leads match your search" : "No leads yet"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredLeads.map((lead) => (
                        <TableRow key={lead.id}>
                          <TableCell className="font-medium">{lead.name}</TableCell>
                          <TableCell>{lead.email}</TableCell>
                          <TableCell>{lead.phone}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{lead.role}</Badge>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {lead.message}
                          </TableCell>
                          <TableCell>
                            {format(new Date(lead.createdAt), "MMM d, yyyy")}
                          </TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => setSelectedLead(lead)}
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  View
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Lead Details</DialogTitle>
                                  <DialogDescription>
                                    Captured on {format(new Date(lead.createdAt), "PPP")}
                                  </DialogDescription>
                                </DialogHeader>
                                {selectedLead && (
                                  <div className="space-y-4 p-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <p className="text-sm font-medium text-muted-foreground">Name</p>
                                        <p className="font-semibold">{selectedLead.name}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium text-muted-foreground">Role</p>
                                        <Badge>{selectedLead.role}</Badge>
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium text-muted-foreground">Email</p>
                                        <p>{selectedLead.email}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium text-muted-foreground">Phone</p>
                                        <p>{selectedLead.phone}</p>
                                      </div>
                                    </div>
                                    <Separator />
                                    <div>
                                      <p className="text-sm font-medium text-muted-foreground mb-2">Message</p>
                                      <div className="bg-muted/50 p-4 rounded-lg">
                                        <p className="whitespace-pre-wrap">{selectedLead.message}</p>
                                      </div>
                                    </div>
                                    {selectedLead.kind && (
                                      <div>
                                        <p className="text-sm font-medium text-muted-foreground">Lead Type</p>
                                        <Badge variant="outline">{selectedLead.kind}</Badge>
                                      </div>
                                    )}
                                    <Separator />
                                    <div className="text-xs text-muted-foreground">
                                      <p>Lead ID: {selectedLead.id}</p>
                                      <p>Created: {format(new Date(selectedLead.createdAt), "PPpp")}</p>
                                      {selectedLead.capturedVia && <p>Captured via: {selectedLead.capturedVia}</p>}
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
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
            <ServiceManagement 
              services={services} 
              categories={categories} 
              onUpdate={() => {
                loadServices();
                loadAnalytics();
              }} 
            />
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <CategoryManagement 
              categories={categories} 
              services={services} 
              onUpdate={() => {
                loadCategories();
                loadServices();
                loadAnalytics();
              }} 
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
