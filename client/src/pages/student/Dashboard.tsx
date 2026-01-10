
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearch } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, Rocket, FileText, CheckCircle, Clock, XCircle, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function StudentDashboard() {
    // Read tab from URL query parameter (e.g. /student?tab=startup)
    const searchString = useSearch();
    const urlParams = new URLSearchParams(searchString);
    const tabFromUrl = urlParams.get("tab");

    const [activeTab, setActiveTab] = useState(tabFromUrl || "overview");
    const { toast } = useToast();

    // Update tab when URL changes
    useEffect(() => {
        if (tabFromUrl && ["overview", "applications", "startup"].includes(tabFromUrl)) {
            setActiveTab(tabFromUrl);
        }
    }, [tabFromUrl]);

    const { data: applications, isLoading: loadingApps } = useQuery({
        queryKey: ["/api/opportunities/my-applications"],
    });

    const { data: savedJobs } = useQuery({
        queryKey: ["/api/opportunities/saved-jobs"],
    });

    const handleDownloadPDF = () => {
        // PDF template coming soon - for now show message
        toast({
            title: "Coming Soon",
            description: "The Stootap Idea Submission PDF template will be available soon. For now, please contact us directly."
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            {/* Header Section */}
            <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white overflow-hidden pb-16 pt-12 px-6 shadow-xl">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                <div className="relative z-10 max-w-7xl mx-auto">
                    <h1 className="text-4xl font-extrabold tracking-tight mb-2">Student Dashboard</h1>
                    <p className="text-indigo-100 text-lg">Manage your career journey and startup ambitions.</p>
                </div>
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white/10 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 rounded-full bg-purple-500/20 blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-1 rounded-xl shadow-lg border border-indigo-100 dark:border-indigo-900/50 w-full md:w-auto inline-flex h-auto">
                        <TabsTrigger value="overview" className="py-3 px-6 rounded-lg data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all text-base"><Briefcase className="w-5 h-5 mr-2" /> Overview</TabsTrigger>
                        <TabsTrigger value="applications" className="py-3 px-6 rounded-lg data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all text-base"><FileText className="w-5 h-5 mr-2" /> Applications</TabsTrigger>
                        <TabsTrigger value="startup" className="py-3 px-6 rounded-lg data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all text-base"><Rocket className="w-5 h-5 mr-2" /> Startup Idea</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <motion.div whileHover={{ y: -5 }} className="h-full">
                                <Card className="h-full border-none shadow-lg bg-white dark:bg-slate-900 overflow-hidden relative group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 group-hover:from-blue-500/10 group-hover:to-indigo-500/10 transition-colors"></div>
                                    <CardHeader className="relative">
                                        <CardTitle className="flex items-center text-xl text-slate-800 dark:text-slate-100">
                                            <Search className="w-6 h-6 mr-3 text-blue-600" />
                                            Find Jobs
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="relative">
                                        <p className="text-slate-500 dark:text-slate-400 mb-6">Explore internships and job opportunities tailored for students.</p>
                                        <Link href="/opportunities">
                                            <Button className="w-full bg-blue-600 hover:bg-blue-700 shadow-blue-200 shadow-lg">Browse Opportunities</Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            <motion.div whileHover={{ y: -5 }} className="h-full">
                                <Card className="h-full border-none shadow-lg bg-white dark:bg-slate-900 overflow-hidden relative group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 group-hover:from-purple-500/10 group-hover:to-pink-500/10 transition-colors"></div>
                                    <CardHeader className="relative">
                                        <CardTitle className="flex items-center text-xl text-slate-800 dark:text-slate-100">
                                            <Rocket className="w-6 h-6 mr-3 text-purple-600" />
                                            Launch Startup
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="relative">
                                        <p className="text-slate-500 dark:text-slate-400 mb-6">Have a brilliant idea? Submit your concept and get support.</p>
                                        <Button onClick={() => setActiveTab("startup")} className="w-full bg-purple-600 hover:bg-purple-700 shadow-purple-200 shadow-lg">Submit Idea</Button>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            <motion.div whileHover={{ y: -5 }} className="h-full">
                                <Card className="h-full border-none shadow-lg bg-white dark:bg-slate-900 overflow-hidden relative group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 group-hover:from-emerald-500/10 group-hover:to-teal-500/10 transition-colors"></div>
                                    <CardHeader className="relative">
                                        <CardTitle className="flex items-center text-xl text-slate-800 dark:text-slate-100">
                                            <FileText className="w-6 h-6 mr-3 text-emerald-600" />
                                            Active Applications
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="relative">
                                        <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">{applications?.length || 0}</div>
                                        <p className="text-slate-500 dark:text-slate-400">Applications submitted</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>

                        {/* Saved Jobs Quick View (Optional) */}
                        {savedJobs && savedJobs.length > 0 && (
                            <div className="mt-8">
                                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Saved Jobs</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {savedJobs.map((item: any) => (
                                        <Link key={item.id} href={`/opportunities/${item.job.slug}`}>
                                            <Card className="cursor-pointer hover:shadow-md transition-shadow">
                                                <CardContent className="p-4 flex items-center space-x-4">
                                                    <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center">
                                                        {item.company?.logoUrl ? <img src={item.company.logoUrl} className="w-8 h-8" /> : <Briefcase className="w-6 h-6 text-slate-400" />}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-slate-800">{item.job.title}</h4>
                                                        <p className="text-sm text-slate-500">{item.company?.companyName}</p>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="applications">
                        <Card className="border-none shadow-lg">
                            <CardHeader>
                                <CardTitle>My Applications</CardTitle>
                                <CardDescription>Track status of your job applications</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {!applications || applications.length === 0 ? (
                                    <div className="text-center py-10 text-slate-500">
                                        <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                        <p>You haven't applied to any jobs yet.</p>
                                        <Link href="/opportunities">
                                            <Button variant="link" className="text-indigo-600 mt-2">Browse Jobs</Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {applications.map((app: any) => (
                                            <div key={app.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
                                                <div className="flex items-center space-x-4">
                                                    <div className="h-12 w-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-lg">
                                                        {app.company?.companyName?.[0] || 'C'}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-slate-900 dark:text-slate-100">{app.job?.title || 'Unknown Role'}</h3>
                                                        <p className="text-sm text-slate-500">{app.company?.companyName || 'Unknown Company'}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-4">
                                                    <Badge className={`px-3 py-1 rounded-full ${app.status === 'shortlisted' ? 'bg-emerald-100 text-emerald-700' :
                                                        app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                            'bg-blue-100 text-blue-700'
                                                        }`}>
                                                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                                    </Badge>
                                                    <span className="text-xs text-slate-400 hidden md:inline-block">
                                                        Applied {new Date(app.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="startup">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <Card className="border-none shadow-xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white">
                                <CardHeader>
                                    <CardTitle className="text-2xl">Submit Your Vision</CardTitle>
                                    <CardDescription className="text-purple-100">
                                        We support student entrepreneurs. Follow these steps to submit your idea.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-start space-x-4 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                                        <div className="w-8 h-8 rounded-full bg-white text-purple-600 flex items-center justify-center font-bold">1</div>
                                        <div>
                                            <h4 className="font-semibold text-lg">Download Template</h4>
                                            <p className="text-sm text-purple-100 mt-1">Get the official Stootap Idea Submission PDF.</p>
                                            <Button variant="secondary" onClick={handleDownloadPDF} className="mt-3 bg-white text-purple-700 hover:bg-purple-50">Download PDF</Button>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-4 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                                        <div className="w-8 h-8 rounded-full bg-white text-purple-600 flex items-center justify-center font-bold">2</div>
                                        <div>
                                            <h4 className="font-semibold text-lg">Fill & Upload</h4>
                                            <p className="text-sm text-purple-100 mt-1">Print, fill (or fill digitally), and upload the completed form here.</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-lg">
                                <CardHeader>
                                    <CardTitle>Upload Submission</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Startup Name (Tentative)</label>
                                            <input type="text" className="w-full p-2 rounded-md border border-slate-200 dark:border-slate-700 bg-transparent" placeholder="e.g. NextGen AI" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                                            <select className="w-full p-2 rounded-md border border-slate-200 dark:border-slate-700 bg-transparent">
                                                <option>Technology</option>
                                                <option>E-commerce</option>
                                                <option>Social Impact</option>
                                                <option>Health</option>
                                            </select>
                                        </div>
                                        <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg p-8 text-center hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer">
                                            <FileText className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                                            <p className="text-sm text-slate-500">Drag & drop your filled PDF here</p>
                                            <p className="text-xs text-slate-400 mt-1">Or click to browse</p>
                                        </div>
                                        <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600">Submit Idea</Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
