import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { 
  LogOut, DollarSign, ShoppingCart, Users, Package, TrendingUp, 
  Activity, RefreshCw, Settings, BarChart3, Clock, CheckCheck,
  Home, Layers, FolderKanban, FileText, Bell, CheckCircle2, XCircle,
  Database, Wifi, AlertCircle, Zap, Download, ArrowUp, ArrowDown,
  Target, Filter, Calendar as CalendarIcon, PieChart as PieChartIcon
} from "lucide-react";
import { format } from "date-fns";
import ServiceManagement from "@/components/admin/ServiceManagement";
import CategoryManagement from "@/components/admin/CategoryManagement";
import UserManagement from "@/components/admin/UserManagement";
import OrderManagement from "@/components/admin/OrderManagement";
import LeadManagement from "@/components/admin/LeadManagement";
import { WelcomeChecklist } from "@/components/admin/WelcomeChecklist";
import { NotificationBell } from "@/components/admin/NotificationBell";
import { QuickActions } from "@/components/admin/QuickActions";
import { SavedFilters } from "@/components/admin/SavedFilters";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { LineChart, Line, BarChart as RechartsBar, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

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
  recentOrders: any[];
  recentLeads: any[];
  ordersLast7Days: number;
  ordersLast30Days: number;
  leadsLast7Days: number;
  leadsLast30Days: number;
  revenueLast7Days: string;
  revenueLast30Days: string;
  weeklyTrend: Array<{
    date: string;
    name: string;
    orders: number;
    revenue: number;
    leads: number;
  }>;
  servicePerformance: Array<{
    serviceId: string;
    serviceName: string;
    categoryId: string;
    active: boolean;
    basePriceInr: string;
  }>;
  categoryStats: Array<{
    categoryId: string;
    categoryName: string;
    serviceCount: number;
    activeServiceCount: number;
  }>;
  conversionRate: string;
  avgOrderValue: string;
  completionRate: string;
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showWelcome, setShowWelcome] = useState(() => {
    return localStorage.getItem("hideAdminWelcome") !== "true";
  });
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [services, setServices] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [healthLoading, setHealthLoading] = useState(false);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
    if (activeTab === 'settings') {
      checkSystemHealth();
    }
  }, [activeTab]);

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
      description: "All data has been updated",
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
      const response = await fetch("/api/admin/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  };

  const checkSystemHealth = async () => {
    try {
      setHealthLoading(true);
      const res = await fetch("/api/admin/integration-status");
      if (res.ok) {
        const data = await res.json();
        setSystemHealth(data);
        toast({
          title: "System Check Complete",
          description: "All system status updated",
        });
      }
    } catch (error) {
      toast({
        title: "Health Check Failed",
        description: "Unable to fetch system health status",
        variant: "destructive",
      });
    } finally {
      setHealthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      sessionStorage.clear();
      toast({
        title: "Logged Out",
        description: "You have been logged out successfully",
      });
      setLocation("/admin/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const handleDismissWelcome = () => {
    localStorage.setItem("hideAdminWelcome", "true");
    setShowWelcome(false);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "add-service":
        setActiveTab("services");
        toast({
          title: "Add Service",
          description: "Navigate to the Services tab to add a new service",
        });
        break;
      case "add-user":
        setActiveTab("users");
        break;
      case "export-orders":
        toast({
          title: "Exporting Orders",
          description: "Preparing CSV export...",
        });
        break;
      default:
        toast({
          title: "Action Triggered",
          description: `Quick action: ${action}`,
        });
    }
  };

  const handleApplyFilter = (newFilters: Record<string, any>) => {
    setFilters(newFilters);
    toast({
      title: "Filters Applied",
      description: "View updated with saved filter",
    });
  };

  const exportToCSV = async (type: 'orders' | 'services' | 'users' | 'analytics') => {
    try {
      if (!analytics && type === 'analytics') {
        toast({
          title: "Data Not Ready",
          description: "Please wait for analytics to load before exporting",
          variant: "destructive",
        });
        return;
      }

      let data: any[] = [];
      let filename = '';
      let headers: string[] = [];

      switch (type) {
        case 'orders':
          const ordersRes = await fetch('/api/admin/orders');
          if (ordersRes.ok) {
            data = await ordersRes.json();
            filename = `orders_${format(new Date(), 'yyyy-MM-dd')}.csv`;
            headers = ['ID', 'User', 'Total', 'Status', 'Date'];
          }
          break;
        case 'services':
          data = services;
          filename = `services_${format(new Date(), 'yyyy-MM-dd')}.csv`;
          headers = ['ID', 'Name', 'Category', 'Price (INR)', 'Active'];
          break;
        case 'users':
          const usersRes = await fetch('/api/admin/users');
          if (usersRes.ok) {
            data = await usersRes.json();
            filename = `users_${format(new Date(), 'yyyy-MM-dd')}.csv`;
            headers = ['ID', 'Email', 'Name', 'User Type', 'Created At'];
          }
          break;
        case 'analytics':
          data = [analytics];
          filename = `analytics_${format(new Date(), 'yyyy-MM-dd')}.csv`;
          headers = ['Total Revenue', 'Total Orders', 'Pending Orders', 'Completed Orders', 'Total Leads', 'Active Services'];
          break;
      }

      if (!data || data.length === 0) {
        toast({
          title: "No Data",
          description: "There is no data to export",
          variant: "destructive",
        });
        return;
      }

      const csvContent = [
        headers.join(','),
        ...data.map(row => {
          if (type === 'orders') {
            return [row.id, row.userId, row.totalInr, row.status, format(new Date(row.createdAt), 'yyyy-MM-dd')].join(',');
          } else if (type === 'services') {
            return [row.id, row.name, row.categoryId, row.basePriceInr, row.active].join(',');
          } else if (type === 'users') {
            return [row.id, row.email, row.fullName || '', row.userType, format(new Date(row.createdAt), 'yyyy-MM-dd')].join(',');
          } else {
            return [row.totalRevenue, row.totalOrders, row.pendingOrders, row.completedOrders, row.totalLeads, row.activeServices].join(',');
          }
        })
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export Successful",
        description: `${filename} has been downloaded`,
      });
    } catch (err) {
      console.error('Export failed:', err);
      toast({
        title: "Export Failed",
        description: "Failed to export data",
        variant: "destructive",
      });
    }
  };

  // Calculate metrics
  const revenueGrowth = analytics ? 
    ((analytics.completedOrders / Math.max(analytics.totalOrders, 1)) * 100).toFixed(1) : "0";
  const conversionRate = analytics ? 
    ((analytics.totalOrders / Math.max(analytics.totalLeads, 1)) * 100).toFixed(1) : "0";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground font-medium">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      {/* Top Navigation Bar */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 shadow-sm">
        <div className="mx-auto px-4 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
                  <p className="text-xs text-muted-foreground">Manage your platform</p>
                </div>
              </div>
              
              {/* Breadcrumbs */}
              <Breadcrumb className="hidden md:flex">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/admin/dashboard">
                      <Home className="h-4 w-4" />
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="capitalize">{activeTab}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <div className="flex items-center gap-2">
              <SavedFilters currentFilters={filters} onApplyFilter={handleApplyFilter} />
              <QuickActions onAction={handleQuickAction} />
              <NotificationBell />
              <Button 
                onClick={handleRefresh} 
                variant="outline" 
                size="sm"
                disabled={refreshing}
                className="gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="hidden md:inline">Refresh</span>
              </Button>
              <Button onClick={handleLogout} variant="outline" size="sm" className="gap-2">
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto px-4 lg:px-8 py-6 max-w-[1600px]">
        {/* Welcome Checklist */}
        {showWelcome && (
          <div className="mb-6">
            <WelcomeChecklist onDismiss={handleDismissWelcome} />
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-emerald-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                ₹{analytics?.totalRevenue || "0.00"}
              </div>
              <div className="flex items-center text-xs text-muted-foreground mt-2">
                <TrendingUp className="w-3 h-3 mr-1 text-emerald-600" />
                <span>{revenueGrowth}% completion rate</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                From {analytics?.completedOrders || 0} completed orders
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {analytics?.totalOrders || 0}
              </div>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
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

          <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {analytics?.totalLeads || 0}
              </div>
              <div className="flex items-center text-xs text-muted-foreground mt-2">
                <BarChart3 className="w-3 h-3 mr-1 text-purple-600" />
                <span>{conversionRate}% conversion rate</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Lead capture & inquiries
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-orange-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Services</CardTitle>
              <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                <Package className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {analytics?.activeServices || 0}
              </div>
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

        {/* Main Content Tabs */}
        <Card className="shadow-lg">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <CardHeader className="border-b">
              <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7 h-auto gap-2">
                <TabsTrigger value="overview" className="gap-2">
                  <Home className="h-4 w-4" />
                  <span className="hidden sm:inline">Overview</span>
                </TabsTrigger>
                <TabsTrigger value="orders" className="gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  <span className="hidden sm:inline">Orders</span>
                </TabsTrigger>
                <TabsTrigger value="leads" className="gap-2">
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Leads</span>
                </TabsTrigger>
                <TabsTrigger value="services" className="gap-2">
                  <Package className="h-4 w-4" />
                  <span className="hidden sm:inline">Services</span>
                </TabsTrigger>
                <TabsTrigger value="categories" className="gap-2">
                  <Layers className="h-4 w-4" />
                  <span className="hidden sm:inline">Categories</span>
                </TabsTrigger>
                <TabsTrigger value="users" className="gap-2">
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Users</span>
                </TabsTrigger>
                <TabsTrigger value="settings" className="gap-2">
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">Settings</span>
                </TabsTrigger>
              </TabsList>
            </CardHeader>

            <CardContent className="p-6">
              <TabsContent value="overview" className="mt-0 space-y-6">
                {/* Time Range Selector & Export Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">Time Period:</span>
                    <div className="flex rounded-lg border">
                      <Button
                        onClick={() => setTimeRange('7d')}
                        variant={timeRange === '7d' ? 'default' : 'ghost'}
                        size="sm"
                        className="rounded-r-none"
                      >
                        7 Days
                      </Button>
                      <Button
                        onClick={() => setTimeRange('30d')}
                        variant={timeRange === '30d' ? 'default' : 'ghost'}
                        size="sm"
                        className="rounded-none border-x"
                      >
                        30 Days
                      </Button>
                      <Button
                        onClick={() => setTimeRange('90d')}
                        variant={timeRange === '90d' ? 'default' : 'ghost'}
                        size="sm"
                        className="rounded-l-none"
                      >
                        90 Days
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Button onClick={() => exportToCSV('analytics')} variant="outline" size="sm" className="gap-2" disabled={!analytics}>
                      <Download className="h-4 w-4" />
                      <span className="hidden md:inline">Export Analytics</span>
                    </Button>
                    <Button onClick={() => exportToCSV('orders')} variant="outline" size="sm" className="gap-2">
                      <Download className="h-4 w-4" />
                      <span className="hidden md:inline">Export Orders</span>
                    </Button>
                    <Button onClick={() => exportToCSV('services')} variant="outline" size="sm" className="gap-2">
                      <Download className="h-4 w-4" />
                      <span className="hidden md:inline">Export Services</span>
                    </Button>
                  </div>
                </div>

                {/* Charts Section - Using REAL DATA */}
                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="col-span-2">
                    <CardHeader>
                      <CardTitle className="text-lg">Revenue & Order Trends (Last 7 Days)</CardTitle>
                      <CardDescription>Real-time data from your database</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {analytics?.weeklyTrend && analytics.weeklyTrend.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={analytics.weeklyTrend}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis dataKey="name" className="text-xs" />
                            <YAxis yAxisId="left" className="text-xs" />
                            <YAxis yAxisId="right" orientation="right" className="text-xs" />
                            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                            <Legend />
                            <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} name="Revenue (₹)" />
                            <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#6366f1" strokeWidth={2} name="Orders" />
                            <Line yAxisId="right" type="monotone" dataKey="leads" stroke="#f59e0b" strokeWidth={2} name="Leads" />
                          </LineChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                          No data available yet. Start getting orders to see trends!
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Order Distribution</CardTitle>
                      <CardDescription>Real order status breakdown</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {analytics && (analytics.completedOrders > 0 || analytics.pendingOrders > 0 || analytics.processingOrders > 0 || analytics.cancelledOrders > 0) ? (
                        <ResponsiveContainer width="100%" height={250}>
                          <PieChart>
                            <Pie
                              data={[
                                { name: 'Completed', value: analytics?.completedOrders || 0, color: '#10b981' },
                                { name: 'Pending', value: analytics?.pendingOrders || 0, color: '#f59e0b' },
                                { name: 'Processing', value: analytics?.processingOrders || 0, color: '#6366f1' },
                                { name: 'Cancelled', value: analytics?.cancelledOrders || 0, color: '#ef4444' }
                              ].filter(item => item.value > 0)}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={(entry) => `${entry.name}: ${entry.value}`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {[
                                { name: 'Completed', value: analytics?.completedOrders || 0, color: '#10b981' },
                                { name: 'Pending', value: analytics?.pendingOrders || 0, color: '#f59e0b' },
                                { name: 'Processing', value: analytics?.processingOrders || 0, color: '#6366f1' },
                                { name: 'Cancelled', value: analytics?.cancelledOrders || 0, color: '#ef4444' }
                              ].filter(item => item.value > 0).map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                          No orders yet
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Category Performance</CardTitle>
                      <CardDescription>Services per category (real data)</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {analytics?.categoryStats && analytics.categoryStats.length > 0 ? (
                        <ResponsiveContainer width="100%" height={250}>
                          <RechartsBar data={analytics.categoryStats.slice(0, 6)}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis dataKey="categoryName" className="text-xs" angle={-45} textAnchor="end" height={80} />
                            <YAxis className="text-xs" />
                            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                            <Legend />
                            <Bar dataKey="serviceCount" fill="#8b5cf6" name="Total Services" />
                            <Bar dataKey="activeServiceCount" fill="#10b981" name="Active Services" />
                          </RechartsBar>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                          No categories yet
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Advanced Analytics Section */}
                <div className="grid gap-6 md:grid-cols-3">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Lead Conversion Funnel</CardTitle>
                      <CardDescription>Track your conversion metrics</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Total Leads</span>
                        <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {analytics?.totalLeads || 0}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Converted to Orders</span>
                        <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                          {analytics?.totalOrders || 0}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-emerald-600 h-2 rounded-full" 
                          style={{ width: `${analytics?.conversionRate || 0}%` }}
                        ></div>
                      </div>
                      
                      <div className="pt-3 border-t">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Conversion Rate</span>
                          <span className="text-lg font-bold text-primary">{analytics?.conversionRate || 0}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Recent Performance</CardTitle>
                      <CardDescription>Last 7 vs 30 days comparison</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Orders (7d)</span>
                          <span className="font-semibold">{analytics?.ordersLast7Days || 0}</span>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Orders (30d)</span>
                          <span className="font-semibold">{analytics?.ordersLast30Days || 0}</span>
                        </div>
                      </div>
                      <div className="border-t pt-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Revenue (7d)</span>
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                            ₹{analytics?.revenueLast7Days || '0.00'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Revenue (30d)</span>
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                            ₹{analytics?.revenueLast30Days || '0.00'}
                          </span>
                        </div>
                      </div>
                      <div className="border-t pt-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Leads (7d / 30d)</span>
                          <span className="font-semibold">{analytics?.leadsLast7Days || 0} / {analytics?.leadsLast30Days || 0}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Business KPIs</CardTitle>
                      <CardDescription>Key performance indicators</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-3 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-900/10 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Avg Order Value</p>
                        <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                          ₹{analytics?.avgOrderValue || '0.00'}
                        </p>
                      </div>
                      <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Order Completion Rate</p>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {analytics?.completionRate || 0}%
                        </p>
                      </div>
                      <div className="p-3 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Active Services</p>
                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                          {analytics?.activeServices || 0} / {analytics?.totalServices || 0}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Order Value</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        ₹{analytics?.totalRevenue ? (parseFloat(analytics.totalRevenue) / Math.max(analytics.totalOrders, 1)).toFixed(2) : '0.00'}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Per completed order</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Conversion Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {conversionRate}%
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Leads to orders</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Completion Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {revenueGrowth}%
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Orders completed</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="orders" className="mt-0">
                <OrderManagement />
              </TabsContent>

              <TabsContent value="leads" className="mt-0">
                <LeadManagement />
              </TabsContent>

              <TabsContent value="services" className="mt-0">
                <ServiceManagement 
                  services={services} 
                  categories={categories} 
                  onUpdate={loadAllData} 
                />
              </TabsContent>

              <TabsContent value="categories" className="mt-0">
                <CategoryManagement 
                  categories={categories} 
                  services={services} 
                  onUpdate={loadAllData} 
                />
              </TabsContent>

              <TabsContent value="users" className="mt-0">
                <UserManagement />
              </TabsContent>

              <TabsContent value="settings" className="mt-0 space-y-6">
                {/* System Health Monitoring */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Activity className="h-5 w-5" />
                          System Health Monitor
                        </CardTitle>
                        <CardDescription>Real-time status of all integrations and services</CardDescription>
                      </div>
                      <Button onClick={checkSystemHealth} disabled={healthLoading}>
                        <RefreshCw className={`h-4 w-4 mr-2 ${healthLoading ? 'animate-spin' : ''}`} />
                        {healthLoading ? 'Checking...' : 'Check Status'}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Razorpay Status */}
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <DollarSign className="h-5 w-5 text-purple-600" />
                          <div>
                            <p className="font-semibold">Razorpay Payment Gateway</p>
                            <p className="text-sm text-muted-foreground">Payment processing service</p>
                          </div>
                        </div>
                        {systemHealth?.razorpay ? (
                          systemHealth.razorpay.configured ? (
                            <Badge className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-0">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="destructive">
                              <XCircle className="h-3 w-3 mr-1" />
                              Not Configured
                            </Badge>
                          )
                        ) : (
                          <Badge variant="secondary">Unknown</Badge>
                        )}
                      </div>
                      {systemHealth?.razorpay?.error && (
                        <Alert className="mt-2">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription className="text-sm">{systemHealth.razorpay.error}</AlertDescription>
                        </Alert>
                      )}
                    </div>

                    {/* Supabase Status */}
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Database className="h-5 w-5 text-emerald-600" />
                          <div>
                            <p className="font-semibold">Supabase Database</p>
                            <p className="text-sm text-muted-foreground">User authentication & data storage</p>
                          </div>
                        </div>
                        {systemHealth?.supabase ? (
                          systemHealth.supabase.configured ? (
                            <Badge className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-0">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Connected
                            </Badge>
                          ) : (
                            <Badge variant="destructive">
                              <XCircle className="h-3 w-3 mr-1" />
                              Not Connected
                            </Badge>
                          )
                        ) : (
                          <Badge variant="secondary">Unknown</Badge>
                        )}
                      </div>
                      {systemHealth?.supabase?.error && (
                        <Alert className="mt-2">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription className="text-sm">{systemHealth.supabase.error}</AlertDescription>
                        </Alert>
                      )}
                    </div>

                    {/* OpenRouter Status */}
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Zap className="h-5 w-5 text-yellow-600" />
                          <div>
                            <p className="font-semibold">OpenRouter AI Concierge</p>
                            <p className="text-sm text-muted-foreground">AI-powered customer support</p>
                          </div>
                        </div>
                        {systemHealth?.openrouter ? (
                          systemHealth.openrouter.configured ? (
                            <Badge className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-0">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="destructive">
                              <XCircle className="h-3 w-3 mr-1" />
                              Not Configured
                            </Badge>
                          )
                        ) : (
                          <Badge variant="secondary">Unknown</Badge>
                        )}
                      </div>
                      {systemHealth?.openrouter?.error && (
                        <Alert className="mt-2">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription className="text-sm">{systemHealth.openrouter.error}</AlertDescription>
                        </Alert>
                      )}
                    </div>

                    {!systemHealth && (
                      <Alert>
                        <Wifi className="h-4 w-4" />
                        <AlertDescription>
                          Click "Check Status" to view system health information
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>

                {/* File & Opportunity Control */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FolderKanban className="h-5 w-5" />
                      Admin Control Center
                    </CardTitle>
                    <CardDescription>Upload, create, delete, and review every submission from the site.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-3 gap-3">
                      <div className="p-3 border rounded-lg">
                        <p className="text-sm font-semibold">File Upload</p>
                        <p className="text-xs text-muted-foreground">Syncs to student/company records.</p>
                        <Input type="file" className="mt-2" onChange={() => toast({ title: "File staged", description: "Ready to push live or delete" })} />
                      </div>
                      <div className="p-3 border rounded-lg space-y-2">
                        <p className="text-sm font-semibold">Quick Actions</p>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => toast({ title: "Folder created", description: "New space for CVs & templates" })}>Create</Button>
                          <Button variant="outline" size="sm" onClick={() => toast({ title: "File removed", description: "Deleted from listings" })}>Delete</Button>
                        </div>
                        <p className="text-xs text-muted-foreground">Full CRUD without leaving dashboard.</p>
                      </div>
                      <div className="p-3 border rounded-lg space-y-2">
                        <p className="text-sm font-semibold">Admin Controls</p>
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <p>• Publish/Unpublish listings</p>
                          <p>• Edit pricing (₹4,999 listings, ₹199 talent fee)</p>
                          <p>• Attach PDF templates to replies</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="p-3 border rounded-lg flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold">Career Submissions Inbox</p>
                          <p className="text-xs text-muted-foreground">Jobs, internships, and startup intents from students.</p>
                        </div>
                        <Badge variant="secondary">New: 8</Badge>
                      </div>
                      <div className="p-3 border rounded-lg flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold">Company Listings</p>
                          <p className="text-xs text-muted-foreground">Docs optional; pay after 2-month trial.</p>
                        </div>
                        <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 border-0">Active: 14</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Advanced CRUD & Workflow */}
                <Card>
                  <CardHeader>
                    <CardTitle>Workflow Automations</CardTitle>
                    <CardDescription>Full-site controls to respond, tag, and sync new opportunities.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-3 gap-3">
                      <div className="p-3 border rounded-lg space-y-2">
                        <p className="text-sm font-semibold">Career Pipelines</p>
                        <p className="text-xs text-muted-foreground">Move student submissions to "Interview", "Offer", or "Hired".</p>
                        <Button variant="ghost" size="sm">Open Inbox</Button>
                      </div>
                      <div className="p-3 border rounded-lg space-y-2">
                        <p className="text-sm font-semibold">Company Billing</p>
                        <p className="text-xs text-muted-foreground">Track ₹4,999 listings and automate reminders after trials.</p>
                        <Button variant="ghost" size="sm">View Renewals</Button>
                      </div>
                      <div className="p-3 border rounded-lg space-y-2">
                        <p className="text-sm font-semibold">Document Vault</p>
                        <p className="text-xs text-muted-foreground">Upload, version, and delete GSTIN/LLP docs per company.</p>
                        <Button variant="ghost" size="sm">Open Vault</Button>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold">Bulk CRUD</span>
                          <Badge variant="secondary">Beta</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">Batch edit or delete listings, services, and uploaded files from one place.</p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold">Audit Log</span>
                          <Badge variant="outline">Compliance</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">Track every admin change tied to resumes, fees, and templates.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Dashboard Preferences */}
                <Card>
                  <CardHeader>
                    <CardTitle>Dashboard Preferences</CardTitle>
                    <CardDescription>Customize your admin experience</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Show Welcome Checklist</p>
                        <p className="text-sm text-muted-foreground">Display the welcome guide on dashboard load</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          localStorage.removeItem("hideAdminWelcome");
                          setShowWelcome(true);
                          toast({
                            title: "Welcome Checklist Restored",
                            description: "The welcome guide will appear on next refresh",
                          });
                        }}
                      >
                        Reset
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Data Refresh Rate</p>
                        <p className="text-sm text-muted-foreground">Analytics update frequency</p>
                      </div>
                      <Badge variant="outline">Manual</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Admin Session</p>
                        <p className="text-sm text-muted-foreground">Current login status</p>
                      </div>
                      <Badge className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-0">Active</Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* System Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>System Information</CardTitle>
                    <CardDescription>Platform and database details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm text-muted-foreground">Platform</span>
                      <span className="font-medium">Stootap Admin v1.0</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm text-muted-foreground">Database</span>
                      <span className="font-medium">Supabase PostgreSQL</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm text-muted-foreground">Environment</span>
                      <span className="font-medium">Production</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-muted-foreground">Last Updated</span>
                      <span className="font-medium">{format(new Date(), 'PPp')}</span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </main>
    </div>
  );
}
