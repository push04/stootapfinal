import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Mail, Phone, User, MapPin, Clock, Send } from "lucide-react";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  role: z.enum(["student", "business"], { required_error: "Please select your role" }),
  message: z.string().min(10, "Message must be at least 10 characters"),
  services: z.array(z.string()).min(1, "Please select at least one service"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: services = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/services"],
  });

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
      services: [],
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          role: data.role,
          message: data.message,
          kind: "service_inquiry",
          metadata: {
            selectedServices: data.services,
            source: "contact_page",
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit");
      }

      toast({
        title: "Thank you for contacting us!",
        description: "We've received your inquiry and will get back to you within 24 hours.",
      });

      form.reset();
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-1">
        <section className="py-16 lg:py-24 bg-gradient-to-b from-orange-500/5 to-background">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl lg:text-5xl font-bold font-heading mb-4">
                Get in Touch
              </h1>
              <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
                Have questions about our services? We're here to help you succeed.
                Fill out the form below and our team will get back to you shortly.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="inline-flex p-4 rounded-2xl bg-orange-500/10 mb-4">
                  <Mail className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Email Us</h3>
                <p className="text-muted-foreground mb-2">
                  Send us an email anytime
                </p>
                <a href="mailto:info@stootap.com" className="text-primary hover:underline">
                  info@stootap.com
                </a>
              </Card>

              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="inline-flex p-4 rounded-2xl bg-orange-500/10 mb-4">
                  <Phone className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Call Us</h3>
                <p className="text-muted-foreground mb-2">
                  Mon-Fri from 9am to 6pm IST
                </p>
                <a href="tel:+918949480566" className="text-primary hover:underline">
                  +91 8949480566
                </a>
              </Card>

              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="inline-flex p-4 rounded-2xl bg-orange-500/10 mb-4">
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Business Hours</h3>
                <p className="text-muted-foreground mb-2">
                  Monday - Friday
                </p>
                <p className="text-primary font-medium">
                  9:00 AM - 6:00 PM IST
                </p>
              </Card>
            </div>

            <Card className="max-w-5xl mx-auto p-8 lg:p-12 shadow-xl">
              <div className="mb-8 text-center">
                <h2 className="text-2xl lg:text-3xl font-bold mb-2">Send Us a Message</h2>
                <p className="text-muted-foreground">
                  Fill out the form below and we'll respond within 24 hours
                </p>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input className="pl-9" placeholder="Enter your full name" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input className="pl-9" type="email" placeholder="your@email.com" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input className="pl-9" placeholder="+91 9876543210" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>I am a *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="student">Student</SelectItem>
                              <SelectItem value="business">Business Owner</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="services"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base">Services of Interest *</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Select all services you would like to know more about
                          </p>
                        </div>
                        {isLoading ? (
                          <div className="text-sm text-muted-foreground">Loading services...</div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-2 border rounded-lg p-4 bg-muted/10">
                            {services.map((service: any) => (
                              <FormField
                                key={service.id}
                                control={form.control}
                                name="services"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={service.id}
                                      className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 hover:bg-muted/50 transition-colors bg-background"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(service.id)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value, service.id])
                                              : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== service.id
                                                )
                                              );
                                          }}
                                        />
                                      </FormControl>
                                      <div className="space-y-1 leading-none flex-1">
                                        <FormLabel className="text-sm font-medium cursor-pointer">
                                          {service.name}
                                        </FormLabel>
                                        {service.summary && (
                                          <p className="text-xs text-muted-foreground line-clamp-2">
                                            {service.summary}
                                          </p>
                                        )}
                                      </div>
                                    </FormItem>
                                  );
                                }}
                              />
                            ))}
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Message *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us about your requirements and how we can help you grow your business..."
                            className="min-h-[150px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-center">
                    <Button type="submit" size="lg" className="w-full md:w-auto px-12" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <span className="inline-block animate-spin mr-2">⏳</span>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Submit Inquiry
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </Card>

            <div className="mt-12 text-center">
              <p className="text-sm text-muted-foreground">
                By submitting this form, you agree to our{" "}
                <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                {" "}and{" "}
                <a href="#" className="text-primary hover:underline">Terms of Service</a>
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
