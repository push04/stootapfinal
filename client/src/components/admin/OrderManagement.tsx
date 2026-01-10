import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  ShoppingCart, Search, Calendar, RefreshCw, Eye, IndianRupee, Package,
  Clock, CheckCircle, XCircle, AlertCircle, TrendingUp, MoreVertical,
  Truck, CreditCard, FileText, Download, Mail, Phone, User
} from "lucide-react";
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
  DialogFooter,
} from "@/components/ui/dialog";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";

interface Order {
  id: string;
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  status: string;
  totalInr: string;
  paymentStatus?: string;
  paymentMethod?: string;
  notes?: string;
  createdAt: string;
}

interface OrderItem {
  id: string;
  name: string;
  qty: number;
  unitPriceInr: string;
  totalInr: string;
}

interface OrderDetails extends Order {
  items: OrderItem[];
}

export default function OrderManagement() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/orders");
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        toast({
          title: "Error",
          description: "Failed to load orders",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to load orders:", error);
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadOrderDetails = async (orderId: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/details`);
      if (response.ok) {
        const data = await response.json();
        setSelectedOrder(data);
        setDetailsOpen(true);
      } else {
        toast({
          title: "Error",
          description: "Failed to load order details",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to load order details:", error);
      toast({
        title: "Error",
        description: "Failed to load order details",
        variant: "destructive",
      });
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingStatus(true);
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Order status updated to ${newStatus}`,
        });

        // Update local state
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
        setCancelDialogOpen(false);
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to update order status");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update order status",
        variant: "destructive",
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", class: string, icon: React.ReactNode }> = {
      pending: {
        variant: "secondary",
        class: "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-200",
        icon: <Clock className="h-3 w-3" />
      },
      processing: {
        variant: "default",
        class: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-200",
        icon: <Package className="h-3 w-3" />
      },
      payment_processing: {
        variant: "default",
        class: "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900 dark:text-orange-200",
        icon: <CreditCard className="h-3 w-3" />
      },
      completed: {
        variant: "outline",
        class: "bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-200",
        icon: <CheckCircle className="h-3 w-3" />
      },
      cancelled: {
        variant: "destructive",
        class: "bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-200",
        icon: <XCircle className="h-3 w-3" />
      },
      shipped: {
        variant: "default",
        class: "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900 dark:text-purple-200",
        icon: <Truck className="h-3 w-3" />
      },
    };
    return configs[status] || { variant: "default", class: "", icon: null };
  };

  const getStatusBadge = (status: string) => {
    const config = getStatusConfig(status);
    return (
      <Badge variant={config.variant} className={`${config.class} flex items-center gap-1`}>
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ')}
      </Badge>
    );
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery ||
      order.customerName?.toLowerCase().includes(searchLower) ||
      order.customerEmail?.toLowerCase().includes(searchLower) ||
      order.id.toLowerCase().includes(searchLower);

    const matchesStatus = statusFilter === "all" || order.status === statusFilter;

    // Date filter
    let matchesDate = true;
    if (dateFilter !== "all") {
      const orderDate = new Date(order.createdAt);
      const now = new Date();
      const diffDays = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));

      switch (dateFilter) {
        case "today":
          matchesDate = diffDays === 0;
          break;
        case "week":
          matchesDate = diffDays <= 7;
          break;
        case "month":
          matchesDate = diffDays <= 30;
          break;
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Stats calculations
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === "pending").length;
  const completedOrders = orders.filter(o => o.status === "completed").length;
  const totalRevenue = orders
    .filter(o => o.status === "completed" || o.status === "processing")
    .reduce((sum, o) => sum + parseFloat(o.totalInr || "0"), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{totalOrders}</p>
              </div>
              <ShoppingCart className="h-10 w-10 text-blue-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 border-yellow-200 dark:border-yellow-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{pendingOrders}</p>
              </div>
              <Clock className="h-10 w-10 text-yellow-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{completedOrders}</p>
              </div>
              <CheckCircle className="h-10 w-10 text-green-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 border-emerald-200 dark:border-emerald-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">₹{totalRevenue.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-10 w-10 text-emerald-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Orders Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Order Management
              </CardTitle>
              <CardDescription>
                View and manage all customer orders
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={loadOrders}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by customer name, email, or order ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="payment_processing">Payment Processing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results summary */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              Showing {filteredOrders.length} of {orders.length} orders
            </p>
            {(searchQuery || statusFilter !== "all" || dateFilter !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setSearchQuery(""); setStatusFilter("all"); setDateFilter("all"); }}
              >
                Clear Filters
              </Button>
            )}
          </div>

          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {searchQuery || statusFilter !== "all" ? "No orders found" : "No orders yet"}
              </h3>
              <p className="text-muted-foreground">
                {searchQuery || statusFilter !== "all" ? "Try adjusting your filters" : "Orders will appear here when customers make purchases"}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id} className="group">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                            <FileText className="h-4 w-4 text-primary" />
                          </div>
                          <span className="font-mono text-sm">#{order.id.slice(0, 8)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium flex items-center gap-1">
                            <User className="h-3 w-3 text-muted-foreground" />
                            {order.customerName || "N/A"}
                          </p>
                          <p className="text-xs text-muted-foreground">{order.customerEmail || "N/A"}</p>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                          <IndianRupee className="h-4 w-4" />
                          {parseFloat(order.totalInr).toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(order.createdAt), "PP")}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => loadOrderDetails(order.id)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => updateOrderStatus(order.id, "processing")}
                              disabled={order.status === "processing" || order.status === "completed" || order.status === "cancelled"}
                            >
                              <Package className="h-4 w-4 mr-2" />
                              Mark Processing
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => updateOrderStatus(order.id, "completed")}
                              disabled={order.status === "completed" || order.status === "cancelled"}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Mark Completed
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => { setSelectedOrder(order as OrderDetails); setCancelDialogOpen(true); }}
                              disabled={order.status === "cancelled" || order.status === "completed"}
                              className="text-destructive"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Cancel Order
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Order Details
            </DialogTitle>
            <DialogDescription>
              Order #{selectedOrder?.id.slice(0, 8)}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Order ID</p>
                  <p className="font-mono text-sm">{selectedOrder.id}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{format(new Date(selectedOrder.createdAt), "PPP p")}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Status</p>
                  {getStatusBadge(selectedOrder.status)}
                </div>
              </div>

              <Separator />

              {/* Customer Info */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Customer Information
                </h4>
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{selectedOrder.customerName || "N/A"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {selectedOrder.customerEmail || "N/A"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {selectedOrder.customerPhone || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Order Items
                </h4>
                <div className="rounded-md border">
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
                      {selectedOrder.items?.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell className="text-center">{item.qty}</TableCell>
                          <TableCell className="text-right">₹{parseFloat(item.unitPriceInr).toLocaleString()}</TableCell>
                          <TableCell className="text-right font-semibold">₹{parseFloat(item.totalInr).toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center p-4 bg-primary/5 rounded-lg">
                <div>
                  <p className="text-lg font-semibold">Total Amount</p>
                  <p className="text-sm text-muted-foreground">Including all taxes</p>
                </div>
                <p className="text-3xl font-bold text-primary">₹{parseFloat(selectedOrder.totalInr).toLocaleString()}</p>
              </div>

              {/* Status Update */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Label className="mb-2 block">Update Status</Label>
                  <Select
                    value={selectedOrder.status}
                    onValueChange={(status) => updateOrderStatus(selectedOrder.id, status)}
                    disabled={updatingStatus}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="payment_processing">Payment Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Cancel Order Confirmation */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Cancel Order
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel order #{selectedOrder?.id.slice(0, 8)}?
              This will notify the customer and cannot be easily undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={updatingStatus}>Keep Order</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedOrder && updateOrderStatus(selectedOrder.id, "cancelled")}
              disabled={updatingStatus}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {updatingStatus ? "Cancelling..." : "Cancel Order"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
