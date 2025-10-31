import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ShoppingBag, CheckCircle } from "lucide-react";

export default function Checkout() {
  const [, setLocation] = useLocation();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerAddress: "",
  });

  const sessionId = localStorage.getItem("cartSessionId") || "";

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    if (!sessionId) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/cart/${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        setCartItems(data);
      }
    } catch (err) {
      console.error("Failed to load cart", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = () => {
    const subtotal = cartItems.reduce((sum, item) => {
      return sum + (parseFloat(item.service?.basePriceInr || 0) * item.qty);
    }, 0);
    const gst = subtotal * 0.18;
    const total = subtotal + gst;
    return { subtotal, gst, total };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const { subtotal, gst, total } = calculateTotals();

    const orderItems = cartItems.map(item => ({
      serviceId: item.serviceId,
      name: item.service?.name || "Service",
      unitPriceInr: item.service?.basePriceInr || "0",
      qty: item.qty,
      totalInr: (parseFloat(item.service?.basePriceInr || 0) * item.qty).toFixed(2),
    }));

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          status: "pending",
          subtotalInr: subtotal.toFixed(2),
          gstInr: gst.toFixed(2),
          totalInr: total.toFixed(2),
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          customerPhone: formData.customerPhone,
          customerAddress: formData.customerAddress,
          items: orderItems,
        }),
      });

      if (response.ok) {
        await fetch("/api/cart/clear", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
        
        setSuccess(true);
        setTimeout(() => setLocation("/"), 3000);
      } else {
        const data = await response.json();
        setError(data.error || "Failed to create order");
      }
    } catch (err) {
      setError("An error occurred while placing your order");
    } finally {
      setSubmitting(false);
    }
  };

  const { subtotal, gst, total } = calculateTotals();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Navigation />
        <div className="min-h-[80vh] flex items-center justify-center px-4">
          <Card className="max-w-md w-full text-center">
            <CardContent className="pt-8 pb-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Order Placed Successfully!</h2>
              <p className="text-muted-foreground mb-4">
                Thank you for your order. We'll be in touch soon.
              </p>
              <p className="text-sm text-muted-foreground">
                Redirecting to home page...
              </p>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Navigation />
        <div className="min-h-[80vh] flex items-center justify-center px-4">
          <Card className="max-w-md w-full text-center">
            <CardContent className="pt-8 pb-8">
              <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Your Cart is Empty</h2>
              <p className="text-muted-foreground mb-4">
                Add some services to your cart before checking out.
              </p>
              <Button onClick={() => setLocation("/services")}>
                Browse Services
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        <h1 className="text-3xl lg:text-4xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
                <CardDescription>
                  Please provide your details to complete the order
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      type="text"
                      required
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.customerEmail}
                      onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                      placeholder="john@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.customerPhone}
                      onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={formData.customerAddress}
                      onChange={(e) => setFormData({ ...formData, customerAddress: e.target.value })}
                      placeholder="Street address, city, state, PIN code"
                      rows={3}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={submitting}
                    size="lg"
                  >
                    {submitting ? "Placing Order..." : `Place Order - ₹${total.toFixed(2)}`}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="flex-1">
                        {item.service?.name} × {item.qty}
                      </span>
                      <span className="font-medium">
                        ₹{(parseFloat(item.service?.basePriceInr || 0) * item.qty).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>GST (18%)</span>
                    <span>₹{gst.toFixed(2)}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
