import { useState, useEffect } from "react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Phone, Upload, Lock, AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Profile() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile, setProfile] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    role: "business",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/me", {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setProfile({
            id: data.id,
            name: data.fullName,
            email: data.email,
            phone: data.phone || "",
            role: data.role,
          });
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <main className="flex-1 flex items-center justify-center px-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                Authentication Required
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertDescription className="mb-4">
                  Please log in or register to view your profile.
                </AlertDescription>
              </Alert>
              <div className="flex gap-4 mt-6">
                <Button asChild className="flex-1">
                  <Link href="/login">Log In</Link>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/register">Register</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const handleSave = () => {
    console.log("Saving profile:", profile);
    toast({
      title: "Success!",
      description: "Your profile has been updated.",
    });
    setIsEditing(false);
  };

  const handleAvatarUpload = () => {
    console.log("Upload avatar triggered");
    toast({
      title: "Upload started",
      description: "Your profile picture is being uploaded.",
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-1 bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold font-heading mb-2">Profile Settings</h1>
            <p className="text-muted-foreground">Manage your account information and preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-32 w-32 mb-4 border-4 border-background shadow-xl">
                    <AvatarImage src="" alt={profile.name} />
                    <AvatarFallback className="text-2xl">
                      {profile.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-semibold mb-1">{profile.name}</h2>
                  <Badge className="mb-4">
                    {profile.role === "student" ? "Student" : "Business Owner"}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={handleAvatarUpload}
                    data-testid="button-upload-avatar"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Change Avatar
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Personal Information</CardTitle>
                <Button
                  variant={isEditing ? "default" : "outline"}
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  data-testid="button-edit-profile"
                >
                  {isEditing ? "Save Changes" : "Edit Profile"}
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    disabled={!isEditing}
                    data-testid="input-name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    disabled={!isEditing}
                    data-testid="input-email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    disabled={!isEditing}
                    data-testid="input-phone"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={profile.role}
                    onValueChange={(value) => setProfile({ ...profile, role: value })}
                    disabled={!isEditing}
                  >
                    <SelectTrigger id="role" data-testid="select-role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="business">Business Owner</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-semibold">Password</p>
                      <p className="text-sm text-muted-foreground">Last changed 30 days ago</p>
                    </div>
                    <Button variant="outline" data-testid="button-change-password">
                      Change Password
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-semibold">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                    </div>
                    <Button variant="outline" data-testid="button-enable-2fa">
                      Enable
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
