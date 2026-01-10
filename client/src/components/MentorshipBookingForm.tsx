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
import { Switch } from "@/components/ui/switch";
import { fetchWithAuth } from "@/lib/api-client";
import { Calendar, User } from "lucide-react";

const mentorshipBookingSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    phone: z.string().regex(/^\+?[1-9]\d{9,14}$/, "Please enter a valid phone number"),
    sessionType: z.enum(["standard", "extended-90", "retainer"], {
        errorMap: () => ({ message: "Please select a session type" })
    }),
    isStudent: z.boolean().default(false),
    studentId: z.string().optional(),
    topic: z.string().min(10, "Please describe what you'd like to discuss"),
    preferredDate: z.string().optional(),
    preferredTime: z.string().optional(),
});

type MentorshipBooking = z.infer<typeof mentorshipBookingSchema>;

interface MentorshipBookingFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function MentorshipBookingForm({ open, onOpenChange }: MentorshipBookingFormProps) {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isStudent, setIsStudent] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<MentorshipBooking>({
        resolver: zodResolver(mentorshipBookingSchema),
        defaultValues: {
            isStudent: false,
        }
    });

    const sessionType = watch("sessionType");

    const getPrice = () => {
        const basePrice = sessionType === "extended-90" ? 7500 : sessionType === "retainer" ? 25000 : 5000;
        if (isStudent && sessionType === "standard") {
            return 3750; // 25% off for students on standard session
        }
        return basePrice;
    };

    const handleStudentToggle = (checked: boolean) => {
        setIsStudent(checked);
        setValue("isStudent", checked);
    };

    const onSubmit = async (data: MentorshipBooking) => {
        if (data.isStudent && !data.studentId) {
            toast({
                title: "Student ID Required",
                description: "Please provide your valid Student ID to avail the student discount.",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetchWithAuth("/api/mentorship-bookings", {
                method: "POST",
                body: JSON.stringify({
                    ...data,
                    price: getPrice(),
                }),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Failed to submit booking");
            }

            toast({
                title: "Booking Submitted!",
                description: "We'll confirm your session time within 24 hours. Check your email for updates.",
            });
            reset();
            setIsStudent(false);
            onOpenChange(false);
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to submit booking",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        <DialogTitle>Book Your Mentorship Session</DialogTitle>
                    </div>
                    <DialogDescription>
                        Schedule a 1-on-1 session with Namonarayan Divli for strategic guidance on your business journey.
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
                        <Label htmlFor="sessionType">Session Type</Label>
                        <select
                            id="sessionType"
                            {...register("sessionType")}
                            className={`w-full px-3 py-2 border rounded-md text-sm bg-background ${errors.sessionType ? "border-red-500" : "border-input"}`}
                        >
                            <option value="">Select session type</option>
                            <option value="standard">Standard 60-Min Session - ₹{isStudent ? "3,750" : "5,000"}</option>
                            <option value="extended-90">90-Min Deep Dive - ₹7,500</option>
                            <option value="retainer">Monthly Retainer - ₹25,000/month</option>
                        </select>
                        {errors.sessionType && <p className="text-sm text-red-500 mt-1">{errors.sessionType.message}</p>}
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
                        <div>
                            <Label htmlFor="isStudent" className="font-medium">I'm a Student</Label>
                            <p className="text-sm text-muted-foreground">Get 25% off standard sessions</p>
                        </div>
                        <Switch
                            id="isStudent"
                            checked={isStudent}
                            onCheckedChange={handleStudentToggle}
                        />
                    </div>

                    {isStudent && (
                        <div>
                            <Label htmlFor="studentId">Student ID (Required)</Label>
                            <Input
                                id="studentId"
                                placeholder="Your valid student ID"
                                {...register("studentId")}
                            />
                            <p className="text-xs text-muted-foreground mt-1">Valid student ID will be verified</p>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="preferredDate">Preferred Date</Label>
                            <Input
                                id="preferredDate"
                                type="date"
                                {...register("preferredDate")}
                            />
                        </div>
                        <div>
                            <Label htmlFor="preferredTime">Preferred Time</Label>
                            <Input
                                id="preferredTime"
                                type="time"
                                {...register("preferredTime")}
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="topic">What would you like to discuss?</Label>
                        <Textarea
                            id="topic"
                            placeholder="Describe your business challenge, question, or what you'd like guidance on..."
                            {...register("topic")}
                            className={`min-h-24 ${errors.topic ? "border-red-500" : ""}`}
                        />
                        {errors.topic && <p className="text-sm text-red-500 mt-1">{errors.topic.message}</p>}
                    </div>

                    {sessionType && (
                        <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                            <div className="flex justify-between items-center">
                                <span className="font-medium">Session Fee:</span>
                                <span className="text-2xl font-bold text-primary">₹{getPrice().toLocaleString()}</span>
                            </div>
                            {isStudent && sessionType === "standard" && (
                                <p className="text-sm text-green-600 mt-1">Student discount applied (25% off)</p>
                            )}
                        </div>
                    )}

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
                            {isSubmitting ? "Submitting..." : "Book Session"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
