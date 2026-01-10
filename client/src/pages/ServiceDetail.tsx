import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { getIconComponent } from "@/lib/iconMap";
import type { Service } from "@shared/schema";
import {
  Clock,
  IndianRupee,
  Check,
  AlertCircle,
  Calendar,
  FileCheck,
  ShoppingCart,
  ArrowLeft,
  HelpCircle,
} from "lucide-react";

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [, navigate] = useLocation();
  const [quantity, setQuantity] = useState("1");
  const { addToCart } = useCart();
  const { toast } = useToast();

  const { data: service, isLoading, isError } = useQuery<Service>({
    queryKey: [`/api/services/${slug}`],
    enabled: !!slug,
  });

  const handleAddToCart = async () => {
    if (!service) return;

    try {
      const qty = parseInt(quantity);
      if (isNaN(qty) || qty < 1) {
        toast({
          variant: "destructive",
          title: "Invalid quantity",
          description: "Please select a valid quantity",
        });
        return;
      }

      await addToCart(service.id, qty);
      toast({
        title: "Added to cart",
        description: `${service.name} (${qty}) added to your cart`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to add to cart",
        description: "Please try again later",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <main className="flex-1">
          <div className="mx-auto max-w-5xl px-4 lg:px-8 py-12">
            <Skeleton className="h-12 w-3/4 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-48 w-full" />
              </div>
              <div>
                <Skeleton className="h-96 w-full" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isError || !service) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <main className="flex-1">
          <div className="mx-auto max-w-5xl px-4 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Service not found</h1>
              <Button onClick={() => navigate("/services")} data-testid="button-back-to-services">
                Back to Services
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const Icon = getIconComponent(service.icon);
  const price = parseFloat(service.basePriceInr);

  if (isNaN(price)) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <main className="flex-1">
          <div className="mx-auto max-w-5xl px-4 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Service data error</h1>
              <p className="text-muted-foreground mb-4">Invalid price information</p>
              <Button onClick={() => navigate("/services")} data-testid="button-back-to-services">
                Back to Services
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-1">
        <div className="bg-zinc-50 dark:bg-zinc-950 py-8">
          <div className="mx-auto max-w-5xl px-4 lg:px-8">
            <Button
              variant="ghost"
              onClick={() => navigate("/services")}
              className="mb-4"
              data-testid="button-back"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Services
            </Button>

            <div className="flex items-start gap-6">
              <div className="p-4 rounded-xl bg-orange-500/10">
                <Icon className="h-12 w-12 text-orange-600" data-testid="icon-service" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl lg:text-4xl font-bold font-heading mb-3" data-testid="text-service-name">
                  {service.name}
                </h1>
                <p className="text-lg text-muted-foreground mb-4" data-testid="text-service-summary">
                  {service.summary}
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2 text-2xl font-bold">
                    <IndianRupee className="h-6 w-6" />
                    <span data-testid="text-service-price">{price.toLocaleString("en-IN")}</span>
                  </div>
                  <Badge variant="secondary" className="gap-1" data-testid="badge-service-eta">
                    <Clock className="h-4 w-4" />
                    {service.etaDays} days
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-4 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {service.longDescription && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground whitespace-pre-line" data-testid="text-service-description">
                      {service.longDescription}
                    </p>
                  </CardContent>
                </Card>
              )}

              {service.problem && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <AlertCircle className="h-5 w-5" />
                      Problem This Solves
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground" data-testid="text-service-problem">{service.problem}</p>
                  </CardContent>
                </Card>
              )}

              {service.outcome && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Check className="h-5 w-5" />
                      What You'll Get
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground" data-testid="text-service-outcome">{service.outcome}</p>
                  </CardContent>
                </Card>
              )}

              {service.includes && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <FileCheck className="h-5 w-5" />
                      What's Included
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {service.includes.split("•").filter(Boolean).map((item, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <Check className="h-3 w-3 text-orange-600" />
                          <span className="text-sm text-muted-foreground">{item.trim()}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {service.prerequisites && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <AlertCircle className="h-5 w-5" />
                      Prerequisites
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground" data-testid="text-service-prerequisites">{service.prerequisites}</p>
                  </CardContent>
                </Card>
              )}

              {service.timeline && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Calendar className="h-5 w-5" />
                      Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground" data-testid="text-service-timeline">{service.timeline}</p>
                  </CardContent>
                </Card>
              )}

              {service.faqs && Array.isArray(service.faqs) && service.faqs.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <HelpCircle className="h-5 w-5" />
                      Frequently Asked Questions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {(service.faqs as Array<{ question: string; answer: string }>).map((faq, index) => {
                        if (!faq || !faq.question || !faq.answer) {
                          return null;
                        }
                        return (
                          <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger className="text-left hover:no-underline">
                              {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                              {faq.answer}
                            </AccordionContent>
                          </AccordionItem>
                        );
                      })}
                    </Accordion>
                  </CardContent>
                </Card>
              )}
            </div>

            <div>
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="text-xl">Add to Cart</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Quantity</label>
                    <Select value={quantity} onValueChange={setQuantity}>
                      <SelectTrigger data-testid="select-quantity">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Subtotal</span>
                      <span className="font-semibold">
                        ₹{(price * parseInt(quantity)).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">GST (18%)</span>
                      <span className="font-semibold">
                        ₹{((price * parseInt(quantity)) * 0.18).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="pt-2 border-t flex items-center justify-between">
                      <span className="font-semibold">Total</span>
                      <span className="text-xl font-bold">
                        ₹{((price * parseInt(quantity)) * 1.18).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={handleAddToCart}
                    className="w-full"
                    size="lg"
                    data-testid="button-add-to-cart"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart
                  </Button>

                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Check className="h-3 w-3 text-primary" />
                      <span>Delivery in {service.etaDays} days</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-3 w-3 text-primary" />
                      <span>Expert assistance included</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-3 w-3 text-primary" />
                      <span>100% compliance guaranteed</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
