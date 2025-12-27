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
import { Rocket } from "lucide-react";

const startupInquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().regex(/^\+?[1-9]\d{9,14}$/, "Please enter a valid phone number"),
  startupIdea: z.string().min(20, "Please describe your startup idea in at least 20 characters"),
  fundingNeeded: z.string().min(1, "Please specify funding needed"),
  stage: z.enum(["idea", "mvp", "funded"], { errorMap: () => ({ message: "Please select a stage" }) }),
});

type StartupInquiry = z.infer<typeof startupInquirySchema>;

interface StartupContactFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StartupContactForm({ open, onOpenChange }: StartupContactFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<StartupInquiry>({
    resolver: zodResolver(startupInquirySchema),
  });

  const onSubmit = async (data: StartupInquiry) => {
    setIsSubmitting(true);
    try {
      const res = await fetchWithAuth("/api/startup-inquiries", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to submit inquiry");
      }

      toast({
        title: "Success!",
        description: "Your startup inquiry has been submitted. Our team will contact you soon.",
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-primary" />
            <DialogTitle>Launch Your Startup</DialogTitle>
          </div>
          <DialogDescription>
            Tell us about your startup idea and we'll help you get started with funding, legal support, and mentorship.
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
            <Label htmlFor="stage">Current Stage</Label>
            <select
              id="stage"
              {...register("stage")}
              className={`w-full px-3 py-2 border rounded-md text-sm ${errors.stage ? "border-red-500" : "border-input"}`}
            >
              <option value="">Select a stage</option>
              <option value="idea">Just an idea</option>
              <option value="mvp">MVP/Prototype ready</option>
              <option value="funded">Already funded/Generating revenue</option>
            </select>
            {errors.stage && <p className="text-sm text-red-500 mt-1">{errors.stage.message}</p>}
          </div>

          <div>
            <Label htmlFor="startupIdea">Describe Your Startup Idea</Label>
            <Textarea
              id="startupIdea"
              placeholder="Tell us about your startup idea, problem you're solving, and target market..."
              {...register("startupIdea")}
              className={`min-h-24 ${errors.startupIdea ? "border-red-500" : ""}`}
            />
            {errors.startupIdea && <p className="text-sm text-red-500 mt-1">{errors.startupIdea.message}</p>}
          </div>

          <div>
            <Label htmlFor="fundingNeeded">Funding Needed (₹)</Label>
            <Input
              id="fundingNeeded"
              placeholder="e.g., 5,00,000"
              {...register("fundingNeeded")}
              className={errors.fundingNeeded ? "border-red-500" : ""}
            />
            {errors.fundingNeeded && <p className="text-sm text-red-500 mt-1">{errors.fundingNeeded.message}</p>}
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
