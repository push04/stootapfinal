import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import Navigation from "@/components/Navigation";
import { fetchWithAuth } from "@/lib/api-client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Phone, Lock, AlertCircle, LogOut, ShoppingBag, Shield, Eye, EyeOff, Package, Activity, Bell, Settings, TrendingUp, Calendar, CreditCard, Building2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { format } from "date-fns";
import { StudentProfile } from "@/components/profiles/StudentProfile";
import { BusinessProfile } from "@/components/profiles/BusinessProfile";
import { ProfileSwitcher } from "@/components/ProfileSwitcher";
import { useQuery } from "@tanstack/react-query";

interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  role: string;
  createdAt: string;
}

interface Order {
  id: string;
  status: string;
  totalInr: string;
  createdAt: string;
  customerName: string | null;
  customerEmail: string | null;
  items?: OrderItem[];
}

interface OrderItem {
  id: string;
  name: string;
  qty: number;
  unitPriceInr: string;
  totalInr: string;
}

export default function Profile() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Edit profile state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ fullName: "", phone: "" });

  // Change password state
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Fetch applications for students
  const { data: applications } = useQuery({
    queryKey: ["/api/opportunities/my-applications"],
    queryFn: async () => {
      const res = await fetchWithAuth("/api/opportunities/my-applications");
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!profile && profile.role === "student",
  });

  // Fetch saved jobs for students
  const { data: savedJobs } = useQuery({
    queryKey: ["/api/opportunities/saved-jobs"],
    queryFn: async () => {
      const res = await fetchWithAuth("/api/opportunities/saved-jobs");
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!profile && profile.role === "student",
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetchWithAuth("/api/me");

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setEditForm({
          fullName: data.fullName,
          phone: data.phone || "",
        });
        setIsAuthenticated(true);
        loadOrders();
      } else {
        // Only redirect if explicitly unauthenticated (401)
        if (response.status === 401) {
          setIsAuthenticated(false);
          toast({
            title: "Authentication Required",
            description: "Please login to view your profile",
            variant: "destructive",
          });
          setLocation("/login");
        } else {
          console.error("Profile load error:", response.status);
          toast({
            title: "Error Loading Profile",
            description: `Server returned ${response.status}. Please try again later.`,
            variant: "destructive"
          });
          // Do NOT redirect, stay on page so user can see error
          setIsAuthenticated(true); // Allow rendering (or partial) to diagnose
        }
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      toast({
        title: "Connection Error",
        description: "Could not connect to server. Please check your connection.",
        variant: "destructive"
      });
      // Do NOT redirect on network error
    } finally {
      setIsLoading(false);
    }
  };

  const loadOrders = async () => {
    setOrdersLoading(true);
    try {
      const response = await fetchWithAuth("/api/me/orders");
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Failed to load orders:", error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const response = await fetchWithAuth("/api/me", {
        method: "PUT",
        body: JSON.stringify(editForm),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update profile");
      }

      const data = await response.json();
      setProfile(prev => prev ? { ...prev, ...data.user } : null);
      setIsEditing(false);

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast({
        title: "Error",
        description: "New password must be at least 8 characters",
        variant: "destructive",
      });
      return;
    }

    setChangingPassword(true);
    try {
      const response = await fetchWithAuth("/api/me/change-password", {
        method: "POST",
        body: JSON.stringify({
          newPassword: passwordForm.newPassword,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to change password");
      }

      toast({
        title: "Success",
        description: "Password changed successfully",
      });

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to change password",
        variant: "destructive",
      });
    } finally {
      setChangingPassword(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { signOut } = await import("@/lib/auth-service");
      const result = await signOut();

      if (result.success) {
        toast({
          title: "Logged Out",
          description: "You have been successfully logged out",
        });
        setLocation("/");
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to log out",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string, className?: string }> = {
      pending: { variant: "secondary", label: "Pending", className: "bg-zinc-100 text-zinc-700" },
      payment_processing: { variant: "default", label: "Payment Processing", className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" },
      processing: { variant: "default", label: "Processing", className: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-200" },
      paid: { variant: "outline", label: "Paid", className: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 border-green-300" },
      completed: { variant: "outline", label: "Completed", className: "bg-green-100 text-green-700" },
      cancelled: { variant: "destructive", label: "Cancelled" },
    };

    const config = statusConfig[status] || { variant: "default", label: status };
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!isAuthenticated || !profile) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <main className="flex-1 flex items-center justify-center px-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                Authentication Required
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertDescription className="mb-4">
                  Please log in or register to view your profile.
                </AlertDescription>
              </Alert>
              <div className="flex gap-4 mt-6">
                <Button asChild className="flex-1">
                  <Link href="/login">Log In</Link>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/register">Register</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-1 bg-zinc-50/50 dark:bg-zinc-950/50 page-transition">
        {/* Profile Header Banner */}
        <div className="h-48 w-full bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.1] bg-[size:20px_20px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-50/50 dark:from-zinc-950/50 to-transparent" />
        </div>

        <div className="mx-auto max-w-7xl px-4 lg:px-8 -mt-24 relative z-10">
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl font-black font-heading text-white drop-shadow-md">Profile Settings</h1>
              <p className="text-white/80 font-medium">Manage your professional identity and orders</p>
            </div>
            <div className="flex items-center gap-3 bg-background/80 backdrop-blur-xl p-2 rounded-2xl border border-white/20 shadow-xl">
              <ProfileSwitcher currentRole={profile.role} />
              <Button variant="ghost" size="sm" onClick={handleLogout} className="flex items-center gap-2 text-destructive hover:bg-destructive/10">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12">
            {/* Profile Card - Sticky Sidebar */}
            <div className="lg:col-span-4">
              <Card className="sticky top-24 shadow-2xl border-white/20 overflow-hidden backdrop-blur-md bg-white/70 dark:bg-zinc-900/70">
                <CardContent className="pt-6 pb-6">
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="h-28 w-28 mb-6 border-8 border-white dark:border-zinc-800 shadow-2xl ring-4 ring-orange-500/10 transition-transform hover:scale-105 duration-500">
                      <AvatarFallback className="text-3xl bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 text-white font-black">
                        {profile.fullName.split(" ").map(n => n[0]).join("").toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <h2 className="text-2xl font-black mb-1 text-foreground tracking-tight">{profile.fullName}</h2>
                    <p className="text-sm font-medium text-muted-foreground mb-4">{profile.email}</p>
                    <Badge className="mb-6 px-4 py-1.5 text-xs font-black uppercase tracking-wider bg-orange-600 text-white border-0 shadow-lg shadow-orange-500/20">
                      {profile.role === "student" ? "Graduate / Intern" : profile.role === "company" ? "Verified Recruiter" : "Business Partner"}
                    </Badge>

                    {profile.role === "company" && (
                      <Link href="/company/dashboard" className="w-full mb-3">
                        <Button size="sm" className="w-full">
                          <Building2 className="h-4 w-4 mr-2" />
                          Company Dashboard
                        </Button>
                      </Link>
                    )}

                    {/* Quick Stats */}
                    <div className="w-full mt-4 pt-4 border-t space-y-3">
                      <div className="flex items-center justify-between text-xs group cursor-default">
                        <span className="text-muted-foreground flex items-center gap-2 group-hover:text-primary transition-colors">
                          <ShoppingBag className="h-3.5 w-3.5" />
                          Orders
                        </span>
                        <span className="font-bold text-sm text-foreground bg-muted/50 px-2 py-0.5 rounded-full">{orders.length}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs group cursor-default">
                        <span className="text-muted-foreground flex items-center gap-2 group-hover:text-primary transition-colors">
                          <CreditCard className="h-3.5 w-3.5" />
                          Spent
                        </span>
                        <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">
                          ₹{orders.reduce((sum, o) => sum + parseFloat(o.totalInr || "0"), 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-8">
              <Card className="shadow-2xl border-white/20 backdrop-blur-md bg-white/70 dark:bg-zinc-900/70 overflow-hidden">
                <Tabs defaultValue={profile.role === "student" || profile.role === "business" ? "dashboard" : "info"} className="w-full">
                  <CardHeader>
                    <TabsList className={`grid w-full h-auto p-1 bg-zinc-100/50 dark:bg-zinc-800/50 backdrop-blur-sm rounded-xl gap-1 ${profile.role === "student" ? "grid-cols-2 lg:grid-cols-4" :
                      profile.role === "business" ? "grid-cols-2 lg:grid-cols-5" :
                        "grid-cols-2 lg:grid-cols-4"
                      }`}>
                      {/* Dashboard tab for students and businesses */}
                      {(profile.role === "student" || profile.role === "business") && (
                        <TabsTrigger value="dashboard" className="py-2.5 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-700 data-[state=active]:shadow-sm data-[state=active]:text-orange-600 transition-all font-semibold">
                          <TrendingUp className="h-4 w-4 mr-2" />
                          <span className="hidden sm:inline font-bold">Overview</span>
                        </TabsTrigger>
                      )}

                      {/* Info tab for everyone */}
                      <TabsTrigger value="info" className="py-2.5 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-700 data-[state=active]:shadow-sm data-[state=active]:text-orange-600 transition-all font-semibold">
                        <User className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline font-bold">Identity</span>
                      </TabsTrigger>

                      {/* Orders tab ONLY for business and company users */}
                      {(profile.role === "business" || profile.role === "company") && (
                        <TabsTrigger value="orders" className="py-2.5 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-700 data-[state=active]:shadow-sm data-[state=active]:text-orange-600 transition-all font-semibold">
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          <span className="hidden sm:inline font-bold">Commerce</span>
                        </TabsTrigger>
                      )}

                      {/* Activity tab for all non-company users */}
                      {profile.role !== "company" && (
                        <TabsTrigger value="activity" className="py-2.5 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-700 data-[state=active]:shadow-sm data-[state=active]:text-orange-600 transition-all font-semibold">
                          <Activity className="h-4 w-4 mr-2" />
                          <span className="hidden sm:inline font-bold">History</span>
                        </TabsTrigger>
                      )}

                      {/* Settings tab for everyone */}
                      <TabsTrigger value="preferences" className="py-2.5 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-700 data-[state=active]:shadow-sm data-[state=active]:text-orange-600 transition-all font-semibold">
                        <Settings className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline font-bold">Preferences</span>
                      </TabsTrigger>

                      {/* Security tab for everyone */}
                      <TabsTrigger value="security" className="py-2.5 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-700 data-[state=active]:shadow-sm data-[state=active]:text-orange-600 transition-all font-semibold">
                        <Shield className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline font-bold">Security</span>
                      </TabsTrigger>
                    </TabsList>
                  </CardHeader>
                  <CardContent>
                    {/* Role-Specific Dashboard Tab */}
                    {profile.role === "student" && (
                      <TabsContent value="dashboard" className="mt-0">
                        <StudentProfile
                          profile={profile}
                          applications={applications || []}
                          savedJobs={savedJobs || []}
                        />
                      </TabsContent>
                    )}

                    {profile.role === "business" && (
                      <TabsContent value="dashboard" className="mt-0">
                        <BusinessProfile
                          profile={profile}
                          orders={orders}
                        />
                      </TabsContent>
                    )}
                    <TabsContent value="info" className="space-y-6 mt-0">
                      <div className="flex justify-end mb-4">
                        <Button
                          variant={isEditing ? "default" : "outline"}
                          onClick={() => isEditing ? handleUpdateProfile() : setIsEditing(true)}
                        >
                          {isEditing ? "Save Changes" : "Edit Profile"}
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="name" className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Full Name
                        </Label>
                        <Input
                          id="name"
                          value={editForm.fullName}
                          onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          disabled
                        />
                        <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          Phone
                        </Label>
                        <Input
                          id="phone"
                          value={editForm.phone}
                          onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                          disabled={!isEditing}
                          placeholder="+91 12345 67890"
                        />
                      </div>
                    </TabsContent>

                    {/* Orders tab - ONLY for business and company users */}
                    {(profile.role === "business" || profile.role === "company") && (
                      <TabsContent value="orders" className="mt-0">
                        {ordersLoading ? (
                          <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                            <p className="text-muted-foreground">Loading orders...</p>
                          </div>
                        ) : orders.length === 0 ? (
                          <div className="text-center py-12">
                            <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No Orders Yet</h3>
                            <p className="text-muted-foreground mb-6">
                              You haven't placed any orders. Explore our services to get started!
                            </p>
                            <Button asChild>
                              <Link href="/services">Browse Services</Link>
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {orders.map((order) => (
                              <Collapsible key={order.id}>
                                <Card>
                                  <CollapsibleTrigger asChild>
                                    <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                                      <div className="flex items-center justify-between">
                                        <div>
                                          <CardTitle className="text-base">
                                            Order #{order.id.slice(0, 8)}
                                          </CardTitle>
                                          <CardDescription>
                                            {format(new Date(order.createdAt), "PPP")}
                                          </CardDescription>
                                        </div>
                                        <div className="flex items-center gap-4">
                                          <div className="text-right">
                                            <p className="text-lg font-semibold">₹{parseFloat(order.totalInr).toFixed(2)}</p>
                                            {getStatusBadge(order.status)}
                                          </div>
                                        </div>
                                      </div>
                                    </CardHeader>
                                  </CollapsibleTrigger>
                                  <CollapsibleContent>
                                    <CardContent className="pt-0">
                                      {order.items && order.items.length > 0 ? (
                                        <Table>
                                          <TableHeader>
                                            <TableRow>
                                              <TableHead>Service</TableHead>
                                              <TableHead className="text-center">Qty</TableHead>
                                              <TableHead className="text-right">Price</TableHead>
                                              <TableHead className="text-right">Total</TableHead>
                                            </TableRow>
                                          </TableHeader>
                                          <TableBody>
                                            {order.items.map((item) => (
                                              <TableRow key={item.id}>
                                                <TableCell className="font-medium">{item.name}</TableCell>
                                                <TableCell className="text-center">{item.qty}</TableCell>
                                                <TableCell className="text-right">₹{parseFloat(item.unitPriceInr).toFixed(2)}</TableCell>
                                                <TableCell className="text-right">₹{parseFloat(item.totalInr).toFixed(2)}</TableCell>
                                              </TableRow>
                                            ))}
                                          </TableBody>
                                        </Table>
                                      ) : (
                                        <p className="text-sm text-muted-foreground">No items found</p>
                                      )}
                                    </CardContent>
                                  </CollapsibleContent>
                                </Card>
                              </Collapsible>
                            ))}
                          </div>
                        )}
                      </TabsContent>
                    )}

                    {/* Activity tab - for all non-company users */}
                    {profile.role !== "company" && (
                      <TabsContent value="activity" className="mt-0 space-y-4">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Recent Activity</CardTitle>
                            <CardDescription>Your recent actions and updates</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="flex items-start gap-4 p-3 rounded-lg bg-muted/50">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                  <User className="h-4 w-4 text-primary" />
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium">Profile Created</p>
                                  <p className="text-sm text-muted-foreground">
                                    {format(new Date(profile.createdAt), "PPP")}
                                  </p>
                                </div>
                              </div>

                              {profile.role === "student" && applications && applications.length > 0 && (
                                <div className="flex items-start gap-4 p-3 rounded-lg bg-muted/50">
                                  <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                                    <Activity className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-medium">Job Applications</p>
                                    <p className="text-sm text-muted-foreground">
                                      Applied to {applications.length} {applications.length === 1 ? 'position' : 'positions'}
                                    </p>
                                  </div>
                                </div>
                              )}

                              {orders.length > 0 && profile.role === "business" && (
                                <div className="flex items-start gap-4 p-3 rounded-lg bg-muted/50">
                                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                    <ShoppingBag className="h-4 w-4 text-green-600 dark:text-green-400" />
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-medium">Service Orders</p>
                                    <p className="text-sm text-muted-foreground">
                                      Placed {orders.length} {orders.length === 1 ? 'order' : 'orders'}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    )}
                    <TabsContent value="preferences" className="mt-0 space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base flex items-center gap-2">
                            <Bell className="h-5 w-5" />
                            Notification Preferences
                          </CardTitle>
                          <CardDescription>
                            Manage how you receive notifications
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between py-3 border-b">
                            <div>
                              <p className="font-medium">Email Notifications</p>
                              <p className="text-sm text-muted-foreground">Receive updates via email</p>
                            </div>
                            <Badge variant="outline">Enabled</Badge>
                          </div>
                          <div className="flex items-center justify-between py-3 border-b">
                            <div>
                              <p className="font-medium">Order Updates</p>
                              <p className="text-sm text-muted-foreground">Get notified about order status changes</p>
                            </div>
                            <Badge variant="outline">Enabled</Badge>
                          </div>
                          <div className="flex items-center justify-between py-3 border-b">
                            <div>
                              <p className="font-medium">Marketing Emails</p>
                              <p className="text-sm text-muted-foreground">Receive promotional offers and updates</p>
                            </div>
                            <Badge variant="outline">Enabled</Badge>
                          </div>
                          <div className="flex items-center justify-between py-3">
                            <div>
                              <p className="font-medium">Service Updates</p>
                              <p className="text-sm text-muted-foreground">Get notified about new services</p>
                            </div>
                            <Badge variant="outline">Enabled</Badge>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Account Statistics
                          </CardTitle>
                          <CardDescription>
                            Your account performance overview
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-muted rounded-lg">
                              <p className="text-sm text-muted-foreground mb-1">Total Orders</p>
                              <p className="text-2xl font-bold">{orders.length}</p>
                            </div>
                            <div className="p-4 bg-muted rounded-lg">
                              <p className="text-sm text-muted-foreground mb-1">Total Spent</p>
                              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                ₹{orders.reduce((sum, o) => sum + parseFloat(o.totalInr || "0"), 0).toFixed(0)}
                              </p>
                            </div>
                            <div className="p-4 bg-muted rounded-lg">
                              <p className="text-sm text-muted-foreground mb-1">Completed</p>
                              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                {orders.filter(o => o.status === 'completed').length}
                              </p>
                            </div>
                            <div className="p-4 bg-muted rounded-lg">
                              <p className="text-sm text-muted-foreground mb-1">Pending</p>
                              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                                {orders.filter(o => o.status === 'pending').length}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base flex items-center gap-2">
                            <Settings className="h-5 w-5" />
                            Account Settings
                          </CardTitle>
                          <CardDescription>
                            Manage your account preferences
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between py-3 border-b">
                            <div>
                              <p className="font-medium">Account Type</p>
                              <p className="text-sm text-muted-foreground">
                                {profile.role === "student" ? "Student Account" : "Business Account"}
                              </p>
                            </div>
                            <Badge variant="secondary">{profile.role}</Badge>
                          </div>
                          <div className="flex items-center justify-between py-3 border-b">
                            <div>
                              <p className="font-medium">Email Verified</p>
                              <p className="text-sm text-muted-foreground">Your email address is verified</p>
                            </div>
                            <Badge className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-0">Verified</Badge>
                          </div>
                          <div className="flex items-center justify-between py-3">
                            <div>
                              <p className="font-medium">Two-Factor Authentication</p>
                              <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                            </div>
                            <Button variant="outline" size="sm">Enable</Button>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="security" className="mt-0 space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Change Password</CardTitle>
                          <CardDescription>
                            Update your password to keep your account secure
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="current-password">Current Password</Label>
                            <div className="relative">
                              <Input
                                id="current-password"
                                type={showCurrentPassword ? "text" : "password"}
                                value={passwordForm.currentPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                placeholder="Enter current password"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              >
                                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="new-password">New Password</Label>
                            <div className="relative">
                              <Input
                                id="new-password"
                                type={showNewPassword ? "text" : "password"}
                                value={passwordForm.newPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                placeholder="Enter new password (min 8 characters)"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                              >
                                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirm New Password</Label>
                            <div className="relative">
                              <Input
                                id="confirm-password"
                                type={showConfirmPassword ? "text" : "password"}
                                value={passwordForm.confirmPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                placeholder="Confirm new password"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              >
                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                            </div>
                          </div>

                          <Button
                            className="w-full"
                            onClick={handleChangePassword}
                            disabled={changingPassword || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
                          >
                            <Lock className="h-4 w-4 mr-2" />
                            {changingPassword ? "Changing Password..." : "Change Password"}
                          </Button>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </CardContent>
                </Tabs>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

