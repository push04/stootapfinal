import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Briefcase, BookOpen, GraduationCap, FileText, Star, TrendingUp, Calendar } from "lucide-react";
import { format } from "date-fns";

interface StudentProfileProps {
    profile: {
        fullName: string;
        email: string;
        phone: string | null;
        createdAt: string;
    };
    applications?: any[];
    savedJobs?: any[];
}

export function StudentProfile({ profile, applications = [], savedJobs = [] }: StudentProfileProps) {
    return (
        <div className="space-y-6 page-transition">
            {/* Student Stats */}
            <div className="grid md:grid-cols-3 gap-4 stagger-item">
                <Card className="card-hover border-orange-100 dark:border-orange-900/20">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg group-hover:scale-110 transition-transform duration-300">
                                <Briefcase className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{applications.length}</p>
                                <p className="text-sm text-muted-foreground">Applications</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="card-hover border-zinc-100 dark:border-zinc-800">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg group-hover:scale-110 transition-transform duration-300">
                                <Star className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{savedJobs.length}</p>
                                <p className="text-sm text-muted-foreground">Saved Jobs</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="card-hover border-orange-100 dark:border-orange-900/20">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg group-hover:scale-110 transition-transform duration-300">
                                <TrendingUp className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">
                                    {applications.filter(a => a.status === 'shortlisted' || a.status === 'interview').length}
                                </p>
                                <p className="text-sm text-muted-foreground">Active</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card className="stagger-item card-hover">
                <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                    <CardDescription>Explore opportunities and manage your job search</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3">
                    <Link href="/opportunities">
                        <Button className="hover:scale-105 transition-transform duration-200">
                            <Briefcase className="h-4 w-4 mr-2" />
                            Browse Jobs
                        </Button>
                    </Link>
                    <Link href="/opportunities">
                        <Button variant="outline">
                            <Star className="h-4 w-4 mr-2" />
                            Saved Jobs
                        </Button>
                    </Link>
                </CardContent>
            </Card>

            {/* Recent Applications */}
            <Card className="stagger-item">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Recent Applications
                    </CardTitle>
                    <CardDescription>Track your job application status</CardDescription>
                </CardHeader>
                <CardContent>
                    {applications.length > 0 ? (
                        <div className="space-y-3">
                            {applications.slice(0, 5).map((app: any) => (
                                <div key={app.id} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div>
                                        <p className="font-medium">{app.job?.title || 'Job Position'}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {app.company?.companyName || 'Company'}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Applied {format(new Date(app.createdAt), 'MMM d, yyyy')}
                                        </p>
                                    </div>
                                    <Badge className={
                                        app.status === 'offered' ? 'bg-green-100 text-green-800' :
                                            app.status === 'interview' ? 'bg-orange-100 text-orange-800' :
                                                app.status === 'shortlisted' ? 'bg-blue-100 text-blue-800' :
                                                    app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                        'bg-zinc-100 text-zinc-800'
                                    }>
                                        {app.status}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <Briefcase className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                            <p className="text-muted-foreground mb-4">No applications yet</p>
                            <Button asChild>
                                <Link href="/opportunities">Browse Opportunities</Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Career Tips */}
            <Card className="bg-gradient-to-br from-orange-50 to-zinc-50 dark:from-orange-950/20 dark:to-zinc-950 border-orange-200 dark:border-orange-900">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                        Student Resources
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <p className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                        <span>Keep your profile updated with latest skills and projects</span>
                    </p>
                    <p className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                        <span>Upload an updated CV to improve application chances</span>
                    </p>
                    <p className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                        <span>Apply early - internships fill up quickly!</span>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
