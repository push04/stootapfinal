import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ShoppingBag, TrendingUp, Package, CreditCard, Calendar, Building2, ArrowRight } from "lucide-react";
import { format } from "date-fns";

interface BusinessProfileProps {
    profile: {
        fullName: string;
        email: string;
        phone: string | null;
        createdAt: string;
    };
    orders?: any[];
}

export function BusinessProfile({ profile, orders = [] }: BusinessProfileProps) {
    const totalSpent = orders.reduce((sum, o) => sum + parseFloat(o.totalInr || "0"), 0);
    const completedOrders = orders.filter(o => o.status === 'completed' || o.status === 'paid');

    return (
        <div className="space-y-6">
            {/* Business Stats */}
            <div className="grid md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                                <ShoppingBag className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{orders.length}</p>
                                <p className="text-sm text-muted-foreground">Total Orders</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                <Package className="h-5 w-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{completedOrders.length}</p>
                                <p className="text-sm text-muted-foreground">Completed</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                                <CreditCard className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">₹{totalSpent.toFixed(0)}</p>
                                <p className="text-sm text-muted-foreground">Total Spent</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                                <Calendar className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div>
                                <p className="text-lg font-bold">
                                    {format(new Date(profile.createdAt), 'MMM yyyy')}
                                </p>
                                <p className="text-sm text-muted-foreground">Member Since</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Business Services</CardTitle>
                    <CardDescription>Explore services to grow your business</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3">
                    <Link href="/services">
                        <Button>
                            <Package className="h-4 w-4 mr-2" />
                            Browse Services
                        </Button>
                    </Link>
                    <Link href="/contact">
                        <Button variant="outline">
                            <Building2 className="h-4 w-4 mr-2" />
                            Contact Support
                        </Button>
                    </Link>
                </CardContent>
            </Card>

            {/* Want to Hire? */}
            <Card className="bg-gradient-to-br from-orange-500 to-zinc-600 text-white border-0">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        Looking to Hire Talent?
                    </CardTitle>
                    <CardDescription className="text-white/80">
                        Register as a company to post jobs and find qualified candidates
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2 text-sm mb-4">
                        <li className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            <span>2-month free trial for new companies</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            <span>Access to verified student candidates</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            <span>Dedicated dashboard to manage applications</span>
                        </li>
                    </ul>
                    <Link href="/company/register">
                        <Button variant="secondary" className="w-full sm:w-auto">
                            Register as Company
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </CardContent>
            </Card>

            {/* Service Recommendations */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Recommended for Your Business
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                        <h4 className="font-semibold mb-1">Business Registration</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                            Complete company registration and compliance services
                        </p>
                        <Badge variant="outline">Popular</Badge>
                    </div>
                    <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                        <h4 className="font-semibold mb-1">Digital Marketing</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                            Boost your online presence and reach more customers
                        </p>
                        <Badge variant="outline">Trending</Badge>
                    </div>
                    <Link href="/services">
                        <Button variant="outline" className="w-full mt-2">
                            View All Services
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
}
