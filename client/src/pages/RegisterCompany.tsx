
import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Building2, Mail, Phone, Globe, User, Briefcase } from "lucide-react";
import { fetchWithAuth } from "@/lib/api-client";

const companySchema = z.object({
    companyName: z.string().min(2, "Company name is required"),
    contactName: z.string().min(2, "Contact person name is required"),
    contactEmail: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    businessType: z.string().min(1, "Business type is required"),
    websiteUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
    description: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
});

export default function RegisterCompany() {
    const [, navigate] = useLocation();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof companySchema>>({
        resolver: zodResolver(companySchema),
        defaultValues: {
            companyName: "",
            contactName: "",
            contactEmail: "",
            phone: "",
            businessType: "",
            websiteUrl: "",
            description: "",
            city: "",
            state: "",
        },
    });

    const registerMutation = useMutation({
        mutationFn: async (data: z.infer<typeof companySchema>) => {
            const res = await fetchWithAuth("/api/opportunities/companies", {
                method: "POST",
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Failed to register company");
            }
            return res.json();
        },
        onSuccess: () => {
            toast({
                title: "Company Registered!",
                description: "Your company profile has been created. You can now post jobs.",
            });
            navigate("/company/dashboard");
        },
        onError: (error: Error) => {
            toast({
                variant: "destructive",
                title: "Registration Failed",
                description: error.message,
            });
        },
    });

    function onSubmit(data: z.infer<typeof companySchema>) {
        registerMutation.mutate(data);
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            <Navigation />

            <main className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold flex items-center gap-2">
                                <Building2 className="h-6 w-6 text-orange-600" />
                                Register Your Company
                            </CardTitle>
                            <CardDescription>
                                Create a company profile to start posting jobs and internships.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Company Details</h3>

                                        <FormField
                                            control={form.control}
                                            name="companyName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Company Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Acme Corp" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="grid md:grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="businessType"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Business Type</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select type" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="Technology">Technology</SelectItem>
                                                                <SelectItem value="Healthcare">Healthcare</SelectItem>
                                                                <SelectItem value="Education">Education</SelectItem>
                                                                <SelectItem value="Finance">Finance</SelectItem>
                                                                <SelectItem value="Retail">Retail</SelectItem>
                                                                <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                                                                <SelectItem value="Other">Other</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="websiteUrl"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Website (Optional)</FormLabel>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <Globe className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                                <Input className="pl-9" placeholder="https://example.com" {...field} />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="description"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>About Company</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Brief description of your company..."
                                                            className="resize-none"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Contact Information</h3>

                                        <FormField
                                            control={form.control}
                                            name="contactName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Contact Person Name</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                            <Input className="pl-9" placeholder="John Doe" {...field} />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="grid md:grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="contactEmail"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Contact Email</FormLabel>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                                <Input className="pl-9" placeholder="contact@company.com" {...field} />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="phone"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Phone Number (Optional)</FormLabel>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                                <Input className="pl-9" placeholder="+91 98765 43210" {...field} />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="city"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>City (Optional)</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Mumbai" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="state"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>State (Optional)</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Maharashtra" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
                                        {registerMutation.isPending ? "Registering..." : "Register Company"}
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    );
}
