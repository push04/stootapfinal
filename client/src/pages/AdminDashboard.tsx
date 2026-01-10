import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  IndianRupee,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  Clock,
  CheckCheck,
  RefreshCw,
  Download,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Eye,
} from "lucide-react";

// Components
import { AdminLayout } from "@/components/admin/AdminLayout";
import ServiceManagement from "@/components/admin/ServiceManagement";
import CategoryManagement from "@/components/admin/CategoryManagement";
import UserManagement from "@/components/admin/UserManagement";
import OrderManagement from "@/components/admin/OrderManagement";
import LeadManagement from "@/components/admin/LeadManagement";
import CompaniesManagement from "@/components/admin/CompaniesManagement";
import JobsManagement from "@/components/admin/JobsManagement";
import { LineChart, Line, BarChart as RechartsBar, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts";

interface Analytics {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  processingOrders: number;
  cancelledOrders: number;
  totalRevenue: string;
  totalLeads: number;
  totalServices: number;
  activeServices: number;
  totalUsers: number;
  recentOrders: Array<{
    id: string;
    customerName: string;
    totalInr: string;
    status: string;
    createdAt: string;
  }>;
  topServices: Array<{
    serviceId: string;
    serviceName: string;
    orderCount: number;
    revenue: string;
  }>;
  servicesByCategory: Array<{
    categoryId: string;
    categoryName: string;
    serviceCount: number;
    activeServiceCount: number;
  }>;
  conversionRate: string;
  avgOrderValue: string;
  completionRate: string;
  weeklyTrend?: Array<{
    date: string;
    name: string;
    orders: number;
    revenue: number;
    leads: number;
  }>;
}

// Real revenue data will be loaded from analytics.weeklyTrend

const COLORS = ["#f97316", "#22c55e", "#3b82f6", "#a855f7", "#ec4899"];

// Startup Inquiries Tab Component
function StartupInquiriesTab() {
  const { data: inquiries = [], isLoading } = useQuery({
    queryKey: ["/api/admin/leads"],
    queryFn: async () => {
      const res = await fetch("/api/admin/leads");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const startupInquiries = inquiries.filter((lead: any) =>
    lead.source === "startup_form" || lead.message?.toLowerCase().includes("startup")
  );

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-10">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Startup Inquiries</CardTitle>
        <CardDescription>
          Students who want to start a startup and need assistance
        </CardDescription>
      </CardHeader>
      <CardContent>
        {startupInquiries.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            No startup inquiries yet
          </div>
        ) : (
          <div className="space-y-4">
            {startupInquiries.map((inquiry: any) => (
              <Card key={inquiry.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{inquiry.name}</h4>
                    <p className="text-sm text-muted-foreground">{inquiry.email}</p>
                    {inquiry.phone && (
                      <p className="text-sm text-muted-foreground">{inquiry.phone}</p>
                    )}
                  </div>
                  <Badge>{inquiry.status || "New"}</Badge>
                </div>
                {inquiry.message && (
                  <p className="mt-2 text-sm bg-muted p-2 rounded">{inquiry.message}</p>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(inquiry.createdAt).toLocaleDateString()}
                </p>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Settings Tab Component
function SettingsTab() {
  const { toast } = useToast();
  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSystemHealth();
  }, []);

  const checkSystemHealth = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/integration-status");
      if (response.ok) {
        setSystemHealth(await response.json());
      }
    } catch (error) {
      console.error("Failed to check system health");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>System Health</CardTitle>
          <CardDescription>Monitor your integrations and services</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin" />
            </div>
          ) : systemHealth ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                <div className="flex items-center gap-3">
                  <div className={`h-3 w-3 rounded-full ${systemHealth.database ? "bg-green-500" : "bg-red-500"}`} />
                  <span>Database Connection</span>
                </div>
                <Badge variant={systemHealth.database ? "default" : "destructive"}>
                  {systemHealth.database ? "Connected" : "Error"}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                <div className="flex items-center gap-3">
                  <div className={`h-3 w-3 rounded-full ${systemHealth.razorpay ? "bg-green-500" : "bg-yellow-500"}`} />
                  <span>Payment Gateway (Razorpay)</span>
                </div>
                <Badge variant={systemHealth.razorpay ? "default" : "secondary"}>
                  {systemHealth.razorpay ? "Active" : "Not Configured"}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                <div className="flex items-center gap-3">
                  <div className={`h-3 w-3 rounded-full ${systemHealth.supabase ? "bg-green-500" : "bg-red-500"}`} />
                  <span>Supabase Auth</span>
                </div>
                <Badge variant={systemHealth.supabase ? "default" : "destructive"}>
                  {systemHealth.supabase ? "Connected" : "Error"}
                </Badge>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <AlertCircle className="h-8 w-8 mx-auto mb-2" />
              Unable to fetch system status
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" className="w-full justify-start" onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Dashboard
          </Button>
          <Button variant="outline" className="w-full justify-start" onClick={checkSystemHealth}>
            <Activity className="h-4 w-4 mr-2" />
            Check System Health
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// Main Dashboard Component
export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [services, setServices] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    await Promise.all([
      loadAnalytics(),
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
      title: "Dashboard Refreshed",
      description: "All data has been updated.",
    });
  };

  const loadAnalytics = async () => {
    try {
      const response = await fetch("/api/admin/analytics");
      if (response.ok) {
        setAnalytics(await response.json());
      }
    } catch (error) {
      console.error("Failed to load analytics", error);
    }
  };

  const loadServices = async () => {
    try {
      const response = await fetch("/api/admin/services");
      if (response.ok) {
        setServices(await response.json());
      }
    } catch (error) {
      console.error("Failed to load services", error);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories");
      if (response.ok) {
        setCategories(await response.json());
      }
    } catch (error) {
      console.error("Failed to load categories", error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
      setLocation("/admin/login");
    } catch (error) {
      setLocation("/admin/login");
    }
  };

  const exportToCSV = async (type: 'orders' | 'services' | 'users') => {
    try {
      toast({ title: "Exporting...", description: `Preparing ${type} export` });

      let data: any[] = [];
      let filename = "";

      if (type === "orders") {
        const res = await fetch("/api/admin/orders");
        data = await res.json();
        filename = "orders.csv";
      } else if (type === "services") {
        data = services;
        filename = "services.csv";
      } else if (type === "users") {
        const res = await fetch("/api/admin/users");
        data = await res.json();
        filename = "users.csv";
      }

      if (data.length === 0) {
        toast({ title: "No data", description: "No data to export", variant: "destructive" });
        return;
      }

      const headers = Object.keys(data[0]).filter(k => !k.includes('password'));
      const csv = [
        headers.join(","),
        ...data.map(row => headers.map(h => {
          const val = row[h];
          if (val === null || val === undefined) return "";
          if (typeof val === "object") return JSON.stringify(val).replace(/,/g, ";");
          return String(val).replace(/,/g, ";");
        }).join(","))
      ].join("\n");

      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();

      toast({ title: "Export Complete", description: `${type} exported successfully` });
    } catch (error) {
      toast({ title: "Export Failed", description: "Could not export data", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground font-medium">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  // Metrics
  const revenueGrowth = analytics ? ((analytics.completedOrders / Math.max(analytics.totalOrders, 1)) * 100).toFixed(1) : "0";
  const conversionRate = analytics ? ((analytics.totalOrders / Math.max(analytics.totalLeads, 1)) * 100).toFixed(1) : "0";

  // Pie chart data for order status
  const orderStatusData = [
    { name: "Completed", value: analytics?.completedOrders || 0, color: "#22c55e" },
    { name: "Processing", value: analytics?.processingOrders || 0, color: "#3b82f6" },
    { name: "Pending", value: analytics?.pendingOrders || 0, color: "#f97316" },
    { name: "Cancelled", value: analytics?.cancelledOrders || 0, color: "#ef4444" },
  ].filter(d => d.value > 0);

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Welcome back, Admin!</h2>
                <p className="text-muted-foreground">Here's what's happening with your platform today.</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
                <Button variant="outline" size="sm" onClick={() => exportToCSV("orders")}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-l-4 border-l-emerald-500 hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                    <IndianRupee className="h-5 w-5 text-emerald-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-emerald-600">₹{analytics?.totalRevenue || "0"}</div>
                  <div className="flex items-center text-sm text-muted-foreground mt-2">
                    <ArrowUpRight className="h-4 w-4 text-emerald-600 mr-1" />
                    <span>{revenueGrowth}% completion rate</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                    <ShoppingCart className="h-5 w-5 text-orange-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600">{analytics?.totalOrders || 0}</div>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <Badge variant="secondary" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {analytics?.pendingOrders || 0} pending
                    </Badge>
                    <Badge variant="default" className="text-xs bg-emerald-500">
                      <CheckCheck className="h-3 w-3 mr-1" />
                      {analytics?.completedOrders || 0} done
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">{analytics?.totalUsers || 0}</div>
                  <div className="flex items-center text-sm text-muted-foreground mt-2">
                    <TrendingUp className="h-4 w-4 text-blue-600 mr-1" />
                    <span>{analytics?.totalLeads || 0} leads captured</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Active Services</CardTitle>
                  <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                    <Package className="h-5 w-5 text-purple-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">{analytics?.activeServices || 0}</div>
                  <div className="flex items-center text-sm text-muted-foreground mt-2">
                    <span>of {analytics?.totalServices || 0} total services</span>
                  </div>
                  <Progress value={(analytics?.activeServices || 0) / (analytics?.totalServices || 1) * 100} className="mt-2 h-2" />
                </CardContent>
              </Card>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                  <CardDescription>Monthly revenue trend</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    {analytics?.weeklyTrend && analytics.weeklyTrend.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={analytics.weeklyTrend}>
                          <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis dataKey="name" className="text-xs" />
                          <YAxis className="text-xs" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px'
                            }}
                            formatter={(value: number, name: string) => [
                              name === 'revenue' ? `₹${value.toLocaleString()}` : value,
                              name === 'revenue' ? 'Revenue' : name
                            ]}
                          />
                          <Area type="monotone" dataKey="revenue" stroke="#f97316" fill="url(#colorRevenue)" strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-muted-foreground">
                        No revenue data yet
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Order Status Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Status</CardTitle>
                  <CardDescription>Distribution of order statuses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    {orderStatusData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={orderStatusData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={2}
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {orderStatusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-muted-foreground">
                        No orders yet
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity & Top Services */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Recent Orders</CardTitle>
                    <CardDescription>Latest customer orders</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab("orders")}>
                    <Eye className="h-4 w-4 mr-1" />
                    View All
                  </Button>
                </CardHeader>
                <CardContent>
                  {analytics?.recentOrders && analytics.recentOrders.length > 0 ? (
                    <div className="space-y-3">
                      {analytics.recentOrders.slice(0, 5).map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">
                          <div>
                            <p className="font-medium">{order.customerName}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">₹{order.totalInr}</p>
                            <Badge variant={order.status === "completed" ? "default" : "secondary"} className="text-xs">
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No recent orders
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Top Services */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Top Services</CardTitle>
                    <CardDescription>Best performing services</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab("services")}>
                    <Eye className="h-4 w-4 mr-1" />
                    Manage
                  </Button>
                </CardHeader>
                <CardContent>
                  {analytics?.topServices && analytics.topServices.length > 0 ? (
                    <div className="space-y-3">
                      {analytics.topServices.slice(0, 5).map((service, index) => (
                        <div key={service.serviceId} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{service.serviceName}</p>
                            <p className="text-xs text-muted-foreground">{service.orderCount} orders</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-emerald-600">₹{service.revenue}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No service data yet
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "services":
        return <ServiceManagement services={services} categories={categories} onUpdate={loadAllData} />;

      case "categories":
        return <CategoryManagement categories={categories} services={services} onUpdate={loadAllData} />;

      case "users":
        return <UserManagement />;

      case "orders":
        return <OrderManagement />;

      case "leads":
        return <LeadManagement />;

      case "opportunities":
        return <JobsManagement />;

      case "companies":
        return <CompaniesManagement />;

      case "startups":
        return <StartupInquiriesTab />;

      case "settings":
        return <SettingsTab />;

      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <AdminLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onLogout={handleLogout}
      pendingCount={analytics?.pendingOrders || 0}
    >
      {renderContent()}
    </AdminLayout>
  );
}
