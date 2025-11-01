import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  LogOut, DollarSign, ShoppingCart, Users, Package, TrendingUp, 
  Activity, RefreshCw, Settings, BarChart3, Clock, CheckCheck,
  Home, Layers, FolderKanban, FileText, Bell
} from "lucide-react";
import { format } from "date-fns";
import ServiceManagement from "@/components/admin/ServiceManagement";
import CategoryManagement from "@/components/admin/CategoryManagement";
import UserManagement from "@/components/admin/UserManagement";
import OrderManagement from "@/components/admin/OrderManagement";
import { SecurityBanner } from "@/components/admin/SecurityBanner";
import { WelcomeChecklist } from "@/components/admin/WelcomeChecklist";
import { NotificationBell } from "@/components/admin/NotificationBell";
import { QuickActions } from "@/components/admin/QuickActions";
import { SavedFilters } from "@/components/admin/SavedFilters";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

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
  const { toast } = useToast();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showWelcome, setShowWelcome] = useState(() => {
    return localStorage.getItem("hideAdminWelcome") !== "true";
  });
  const [filters, setFilters] = useState<Record<string, any>>({});

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    await loadAnalytics();
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
        {/* Security Banner */}
        <SecurityBanner />
        
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
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 h-auto gap-2">
                <TabsTrigger value="overview" className="gap-2">
                  <Home className="h-4 w-4" />
                  <span className="hidden sm:inline">Overview</span>
                </TabsTrigger>
                <TabsTrigger value="orders" className="gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  <span className="hidden sm:inline">Orders</span>
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
              <TabsContent value="overview" className="mt-0 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Recent Activity</CardTitle>
                      <CardDescription>Latest actions on your platform</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">New order received</p>
                            <p className="text-xs text-muted-foreground">{format(new Date(), 'PPp')}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Service updated</p>
                            <p className="text-xs text-muted-foreground">2 hours ago</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Quick Stats</CardTitle>
                      <CardDescription>Performance at a glance</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Avg. Order Value</span>
                        <span className="font-semibold">₹{analytics?.totalRevenue ? (parseFloat(analytics.totalRevenue) / Math.max(analytics.totalOrders, 1)).toFixed(2) : '0.00'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Conversion Rate</span>
                        <span className="font-semibold">{conversionRate}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Completion Rate</span>
                        <span className="font-semibold">{revenueGrowth}%</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="orders" className="mt-0">
                <OrderManagement />
              </TabsContent>

              <TabsContent value="services" className="mt-0">
                <ServiceManagement />
              </TabsContent>

              <TabsContent value="categories" className="mt-0">
                <CategoryManagement />
              </TabsContent>

              <TabsContent value="users" className="mt-0">
                <UserManagement />
              </TabsContent>

              <TabsContent value="settings" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Dashboard Settings</CardTitle>
                    <CardDescription>Customize your admin experience</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold">Preferences</h3>
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
                          }}
                        >
                          Reset
                        </Button>
                      </div>
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
