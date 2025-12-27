import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, User, Briefcase, Building2 } from "lucide-react";

interface ProfileSwitcherProps {
    currentRole: string;
}

export function ProfileSwitcher({ currentRole }: ProfileSwitcherProps) {
    const [open, setOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState(currentRole);
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const switchRoleMutation = useMutation({
        mutationFn: async (newRole: string) => {
            const res = await fetchWithAuth("/api/me/role", {
                method: "PUT",
                body: JSON.stringify({ role: newRole }),
            });
            if (!res.ok) {
                let errorMessage = "Failed to switch role";
                try {
                    const error = await res.json();
                    errorMessage = error.error || errorMessage;
                } catch (e) {
                    // If response is not JSON (e.g. 404 HTML or 500 text), use status text
                    errorMessage = `Server Error: ${res.status} ${res.statusText}`;
                }
                throw new Error(errorMessage);
            }
            return res.json();
        },
        onSuccess: () => {
            // Invalidate all queries to refetch with new role
            queryClient.invalidateQueries();

            toast({
                title: "Profile Switched!",
                description: `You are now using the ${selectedRole} profile.`,
            });

            setOpen(false);

            // Reload page to update navigation
            window.location.reload();
        },
        onError: (error: Error) => {
            toast({
                title: "Switch Failed",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    const handleSwitch = () => {
        if (selectedRole === currentRole) {
            toast({
                title: "Same Role",
                description: "You're already using this profile.",
                variant: "destructive",
            });
            return;
        }

        switchRoleMutation.mutate(selectedRole);
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case "student":
                return <User className="h-4 w-4" />;
            case "business":
                return <Briefcase className="h-4 w-4" />;
            case "company":
                return <Building2 className="h-4 w-4" />;
            default:
                return <User className="h-4 w-4" />;
        }
    };

    const getRoleLabel = (role: string) => {
        switch (role) {
            case "student":
                return "Student";
            case "business":
                return "Business";
            case "company":
                return "Company";
            default:
                return role;
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Switch Profile
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Switch Profile Type</DialogTitle>
                    <DialogDescription>
                        Choose which type of profile you want to use. Your data will be preserved.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <RadioGroup value={selectedRole} onValueChange={setSelectedRole}>
                        <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
                            <RadioGroupItem value="student" id="student" />
                            <Label htmlFor="student" className="flex items-center gap-2 cursor-pointer flex-1">
                                <User className="h-5 w-5 text-orange-600" />
                                <div>
                                    <p className="font-medium">Student</p>
                                    <p className="text-sm text-muted-foreground">Apply for jobs and internships</p>
                                </div>
                            </Label>
                        </div>

                        <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
                            <RadioGroupItem value="business" id="business" />
                            <Label htmlFor="business" className="flex items-center gap-2 cursor-pointer flex-1">
                                <Briefcase className="h-5 w-5 text-blue-600" />
                                <div>
                                    <p className="font-medium">Business</p>
                                    <p className="text-sm text-muted-foreground">Access business services and solutions</p>
                                </div>
                            </Label>
                        </div>

                        <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
                            <RadioGroupItem value="company" id="company" />
                            <Label htmlFor="company" className="flex items-center gap-2 cursor-pointer flex-1">
                                <Building2 className="h-5 w-5 text-green-600" />
                                <div>
                                    <p className="font-medium">Company</p>
                                    <p className="text-sm text-muted-foreground">Post jobs and hire talent</p>
                                </div>
                            </Label>
                        </div>
                    </RadioGroup>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSwitch}
                        disabled={switchRoleMutation.isPending}
                    >
                        {switchRoleMutation.isPending ? "Switching..." : "Switch Profile"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
