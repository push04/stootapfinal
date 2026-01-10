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
import { ShoppingBag, CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Use CartContext - it automatically filters out invalid items
  const { items: cartItems, isLoading: loading, clearCart, subtotal, gst, total } = useCart();

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerAddress: "",
    companyName: "",
    gstNumber: "",
    city: "",
    state: "",
    pincode: "",
  });

  const sessionId = localStorage.getItem("sessionId") || "";

  useEffect(() => {
    loadRazorpayScript();
  }, []);

  const loadRazorpayScript = () => {
    if (window.Razorpay) {
      setRazorpayLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    script.onerror = () => {
      console.error("Failed to load Razorpay script");
      toast({
        title: "Payment System Unavailable",
        description: "Please try again later or contact support.",
        variant: "destructive",
      });
    };
    document.body.appendChild(script);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (cartItems.length === 0) {
      setError("Your cart is empty. Please add services before checking out.");
      return;
    }

    setSubmitting(true);

    // Build full address
    const fullAddress = [
      formData.customerAddress,
      formData.city,
      formData.state,
      formData.pincode
    ].filter(Boolean).join(', ');

    const orderItems = cartItems.map(item => ({
      serviceId: item.serviceId,
      name: item.service?.name || "Service",
      unitPriceInr: item.service?.basePriceInr || "0",
      qty: item.qty,
      totalInr: (parseFloat(item.service?.basePriceInr || 0) * item.qty).toFixed(2),
    }));

    try {
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          status: "payment_processing",
          subtotalInr: subtotal.toFixed(2),
          gstInr: gst.toFixed(2),
          totalInr: total.toFixed(2),
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          customerPhone: formData.customerPhone,
          customerAddress: fullAddress,
          items: orderItems,
        }),
      });

      if (!orderResponse.ok) {
        const data = await orderResponse.json();
        throw new Error(data.error || "Failed to create order");
      }

      const order = await orderResponse.json();

      // Check if payment gateway is available
      const razorpayKeyResponse = await fetch("/api/payment/razorpay-key");

      if (!razorpayKeyResponse.ok || razorpayKeyResponse.status === 503) {
        // Payment gateway is disabled - order is already created, clear cart and redirect
        console.log("Payment gateway disabled, order created:", order.id);

        await fetch("/api/cart/clear", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        toast({
          title: "Order Created Successfully",
          description: `Your order (ID: ${order.id.slice(0, 8)}) has been created. Our team will contact you shortly to complete the payment process.`,
          duration: 6000,
        });

        setSuccess(true);
        setTimeout(() => setLocation("/profile"), 2000);
        return;
      }

      const { key } = await razorpayKeyResponse.json();

      const razorpayOrderResponse = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(total.toFixed(2)),
          currency: "INR",
          receipt: order.id,
          notes: {
            orderId: order.id,
            customerName: formData.customerName,
            customerEmail: formData.customerEmail,
            companyName: formData.companyName || "N/A",
            gstNumber: formData.gstNumber || "N/A",
            phone: formData.customerPhone,
          },
        }),
      });

      if (!razorpayOrderResponse.ok) {
        // Payment gateway failed but order already created - show success
        console.log("Payment gateway failed, but order created:", order.id);

        await clearCart();

        toast({
          title: "Order Submitted Successfully!",
          description: "We will contact you shortly to complete the payment process.",
          duration: 8000,
        });

        setSuccess(true);
        return;
      }

      const razorpayOrder = await razorpayOrderResponse.json();

      const options = {
        key,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Stootap",
        description: "Business Services Payment",
        order_id: razorpayOrder.id,
        handler: async function (response: any) {
          try {
            const verifyResponse = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: order.id,
              }),
            });

            if (!verifyResponse.ok) {
              throw new Error("Payment verification failed");
            }

            await fetch("/api/cart/clear", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ sessionId }),
            });

            setSuccess(true);
            setTimeout(() => setLocation("/"), 3000);
          } catch (err: any) {
            console.error("Payment verification error:", err);
            setError("Payment verification failed. Please contact support with your order ID: " + order.id);
            setSubmitting(false);
          }
        },
        prefill: {
          name: formData.customerName,
          email: formData.customerEmail,
          contact: formData.customerPhone,
        },
        notes: {
          orderId: order.id,
        },
        theme: {
          color: "#6366f1",
        },
        modal: {
          ondismiss: function () {
            toast({
              title: "Payment Cancelled",
              description: `Your order ${order.id} has been created and saved. You can complete payment later by contacting support.`,
              variant: "default",
            });

            fetch("/api/cart/clear", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ sessionId }),
            });

            setSuccess(true);
            setTimeout(() => setLocation("/profile"), 2000);
          },
          onhidden: function () {
            setSubmitting(false);
          }
        },
      };

      const paymentObject = new window.Razorpay(options);

      paymentObject.on('payment.failed', async function (response: any) {
        console.log("Payment failed:", response);
        toast({
          title: "Payment Failed",
          description: `Your order ${order.id} has been saved. Please contact support to complete payment.`,
          variant: "destructive",
        });

        await fetch("/api/cart/clear", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        setSuccess(true);
        setTimeout(() => setLocation("/profile"), 2000);
      });

      paymentObject.open();
    } catch (err: any) {
      console.error("Checkout error:", err);
      const errorMessage = err.message || err.error || "An error occurred. Please check your details and try again.";
      setError(errorMessage);
      toast({
        title: "Checkout Error",
        description: errorMessage,
        variant: "destructive",
      });
      setSubmitting(false);
    }
  };

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
              <h2 className="text-2xl font-bold mb-2">Order Submitted Successfully!</h2>
              <p className="text-muted-foreground mb-4">
                Thank you for your order! Our team will reach out to you shortly to complete the process.
              </p>
              <p className="text-sm text-muted-foreground">
                Redirecting...
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
                    <Label htmlFor="company">Company Name</Label>
                    <Input
                      id="company"
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      placeholder="Your Company Pvt. Ltd."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gst">GST Number (Optional)</Label>
                    <Input
                      id="gst"
                      type="text"
                      value={formData.gstNumber}
                      onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value.toUpperCase() })}
                      placeholder="22AAAAA0000A1Z5"
                      maxLength={15}
                    />
                    <p className="text-xs text-muted-foreground">Enter if you have GST registration for tax credit</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address *</Label>
                    <Textarea
                      id="address"
                      required
                      value={formData.customerAddress}
                      onChange={(e) => setFormData({ ...formData, customerAddress: e.target.value })}
                      placeholder="Building number, street name, area"
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="Mumbai"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        type="text"
                        required
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        placeholder="Maharashtra"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pincode">PIN Code *</Label>
                      <Input
                        id="pincode"
                        type="text"
                        required
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                        placeholder="400001"
                        maxLength={6}
                        pattern="[0-9]{6}"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <input type="checkbox" id="terms" required className="h-4 w-4 rounded border-gray-300" />
                      <label htmlFor="terms">
                        I agree to the <a href="/terms" className="text-primary underline">Terms & Conditions</a> and <a href="/privacy" className="text-primary underline">Privacy Policy</a>
                      </label>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={submitting || !razorpayLoaded}
                    size="lg"
                  >
                    {!razorpayLoaded ? "Loading Payment System..." : submitting ? "Placing Order..." : `Proceed to Payment - ₹${total.toFixed(2)}`}
                  </Button>

                  {!razorpayLoaded && (
                    <p className="text-xs text-center text-muted-foreground">
                      Secure payment powered by Razorpay
                    </p>
                  )}
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
