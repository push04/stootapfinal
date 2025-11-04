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
import { User, Mail, Phone, Lock, AlertCircle, LogOut, ShoppingBag, Shield, Eye, EyeOff, Package, Activity, Bell, Settings, TrendingUp, Calendar, CreditCard } from "lucide-react";
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
        setIsAuthenticated(false);
        toast({
          title: "Authentication Required",
          description: "Please login to view your profile",
          variant: "destructive",
        });
        setLocation("/login");
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setIsAuthenticated(false);
      setLocation("/login");
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
      pending: { variant: "secondary", label: "Pending", className: "bg-gray-100 text-gray-700" },
      payment_processing: { variant: "default", label: "Payment Processing", className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" },
      processing: { variant: "default", label: "Processing", className: "bg-blue-100 text-blue-700" },
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
      <main className="flex-1 bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 lg:px-8 py-12">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold font-heading mb-2">Profile Settings</h1>
              <p className="text-muted-foreground">Manage your account information and orders</p>
            </div>
            <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-32 w-32 mb-4 border-4 border-background shadow-xl">
                    <AvatarFallback className="text-2xl bg-gradient-to-br from-primary to-primary/60 text-white">
                      {profile.fullName.split(" ").map(n => n[0]).join("").toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-semibold mb-1">{profile.fullName}</h2>
                  <p className="text-sm text-muted-foreground mb-2">{profile.email}</p>
                  <Badge className="mb-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0">
                    {profile.role === "student" ? "Student" : "Business Owner"}
                  </Badge>
                  
                  {/* Account Stats */}
                  <div className="w-full pt-4 border-t mt-4 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <ShoppingBag className="h-4 w-4" />
                        Total Orders
                      </span>
                      <span className="font-semibold text-lg">{orders.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Total Spent
                      </span>
                      <span className="font-semibold text-lg text-emerald-600 dark:text-emerald-400">
                        ₹{orders.reduce((sum, o) => sum + parseFloat(o.totalInr || "0"), 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm pt-3 border-t">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Member Since
                      </span>
                      <span className="font-medium">
                        {format(new Date(profile.createdAt), "MMM yyyy")}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <Tabs defaultValue="info" className="w-full">
                <CardHeader>
                  <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
                    <TabsTrigger value="info">
                      <User className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Info</span>
                    </TabsTrigger>
                    <TabsTrigger value="orders">
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Orders</span>
                    </TabsTrigger>
                    <TabsTrigger value="activity">
                      <Activity className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Activity</span>
                    </TabsTrigger>
                    <TabsTrigger value="preferences">
                      <Settings className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Settings</span>
                    </TabsTrigger>
                    <TabsTrigger value="security">
                      <Shield className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Security</span>
                    </TabsTrigger>
                  </TabsList>
                </CardHeader>
                <CardContent>
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

                  <TabsContent value="activity" className="mt-0 space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">Recent Activity</h3>
                        <p className="text-sm text-muted-foreground">Your account activity history</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center flex-shrink-0">
                              <ShoppingBag className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">Profile Created</p>
                              <p className="text-sm text-muted-foreground">
                                You joined Stootap and created your account
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {format(new Date(profile.createdAt), "PPP 'at' p")}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {orders.slice(0, 5).map((order, idx) => (
                        <Card key={order.id}>
                          <CardContent className="pt-6">
                            <div className="flex items-start gap-4">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                order.status === 'completed' ? 'bg-green-100 dark:bg-green-900' :
                                order.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900' :
                                'bg-blue-100 dark:bg-blue-900'
                              }`}>
                                <Package className={`h-5 w-5 ${
                                  order.status === 'completed' ? 'text-green-600 dark:text-green-400' :
                                  order.status === 'pending' ? 'text-yellow-600 dark:text-yellow-400' :
                                  'text-blue-600 dark:text-blue-400'
                                }`} />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium">Order Placed</p>
                                <p className="text-sm text-muted-foreground">
                                  Order #{order.id.slice(0, 8)} for ₹{parseFloat(order.totalInr).toFixed(2)}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <p className="text-xs text-muted-foreground">
                                    {format(new Date(order.createdAt), "PPP 'at' p")}
                                  </p>
                                  {getStatusBadge(order.status)}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}

                      {orders.length === 0 && (
                        <Card>
                          <CardContent className="pt-6 text-center py-12">
                            <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">No recent activity yet</p>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </TabsContent>

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
      </main>
    </div>
  );
}
