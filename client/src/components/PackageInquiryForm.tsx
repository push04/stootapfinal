import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { fetchWithAuth } from "@/lib/api-client";
import { Package } from "lucide-react";

const packageInquirySchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    phone: z.string().regex(/^\+?[1-9]\d{9,14}$/, "Please enter a valid phone number"),
    packageType: z.string().min(1, "Please select a package"),
    businessStage: z.enum(["idea", "registered", "operating", "scaling"], {
        errorMap: () => ({ message: "Please select your business stage" })
    }),
    message: z.string().optional(),
});

type PackageInquiry = z.infer<typeof packageInquirySchema>;

interface PackageInquiryFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedPackage?: string;
}

export function PackageInquiryForm({ open, onOpenChange, selectedPackage }: PackageInquiryFormProps) {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<PackageInquiry>({
        resolver: zodResolver(packageInquirySchema),
        defaultValues: {
            packageType: selectedPackage || "",
        }
    });

    // Update package when prop changes
    if (selectedPackage) {
        setValue("packageType", selectedPackage);
    }

    const onSubmit = async (data: PackageInquiry) => {
        setIsSubmitting(true);
        try {
            const res = await fetchWithAuth("/api/package-inquiries", {
                method: "POST",
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Failed to submit inquiry");
            }

            toast({
                title: "Inquiry Submitted!",
                description: "Our team will contact you within 24 hours to discuss your requirements.",
            });
            reset();
            onOpenChange(false);
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to submit inquiry",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const packages = [
        { value: "foundation", label: "Foundation Package - ₹65,000" },
        { value: "startup-launch", label: "Startup Launch Package - ₹1,50,000" },
        { value: "growth-systems", label: "Growth & Systems Package - ₹3,00,000" },
        { value: "scale-investor", label: "Scale & Investor Package - ₹5,00,000" },
        { value: "student-essentials", label: "Student Startup Essentials - ₹40,000" },
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-primary" />
                        <DialogTitle>Get Started with Stootap</DialogTitle>
                    </div>
                    <DialogDescription>
                        Tell us about your business and we'll help you choose the right package for your needs.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            placeholder="Your name"
                            {...register("name")}
                            className={errors.name ? "border-red-500" : ""}
                        />
                        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="your@email.com"
                            {...register("email")}
                            className={errors.email ? "border-red-500" : ""}
                        />
                        {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                            id="phone"
                            placeholder="+91 98765 43210"
                            {...register("phone")}
                            className={errors.phone ? "border-red-500" : ""}
                        />
                        {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="packageType">Select Package</Label>
                        <select
                            id="packageType"
                            {...register("packageType")}
                            className={`w-full px-3 py-2 border rounded-md text-sm bg-background ${errors.packageType ? "border-red-500" : "border-input"}`}
                        >
                            <option value="">Select a package</option>
                            {packages.map((pkg) => (
                                <option key={pkg.value} value={pkg.value}>{pkg.label}</option>
                            ))}
                        </select>
                        {errors.packageType && <p className="text-sm text-red-500 mt-1">{errors.packageType.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="businessStage">Current Business Stage</Label>
                        <select
                            id="businessStage"
                            {...register("businessStage")}
                            className={`w-full px-3 py-2 border rounded-md text-sm bg-background ${errors.businessStage ? "border-red-500" : "border-input"}`}
                        >
                            <option value="">Select your stage</option>
                            <option value="idea">Just an Idea</option>
                            <option value="registered">Registered but not operating</option>
                            <option value="operating">Operating but need systems</option>
                            <option value="scaling">Ready to scale/fundraise</option>
                        </select>
                        {errors.businessStage && <p className="text-sm text-red-500 mt-1">{errors.businessStage.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="message">Additional Requirements (Optional)</Label>
                        <Textarea
                            id="message"
                            placeholder="Tell us about your business goals, challenges, or any specific requirements..."
                            {...register("message")}
                            className="min-h-20"
                        />
                    </div>

                    <div className="flex gap-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-primary hover:bg-primary/90 flex-1"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Submitting..." : "Submit Inquiry"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
