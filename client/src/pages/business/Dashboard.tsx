
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutGrid, ShoppingBag, Clock, CheckCircle, Package, ArrowRight, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function BusinessDashboard() {
    const { data: orders } = useQuery({
        queryKey: ["/api/orders/my-orders"],
    });

    const { data: services } = useQuery({
        queryKey: ["/api/services"],
    });

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            {/* Header Section */}
            <div className="relative bg-gradient-to-r from-orange-500 to-amber-600 text-white overflow-hidden pb-16 pt-12 px-6 shadow-xl">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                <div className="relative z-10 max-w-7xl mx-auto">
                    <h1 className="text-4xl font-extrabold tracking-tight mb-2">Business Dashboard</h1>
                    <p className="text-orange-100 text-lg">Scale your operations with premium services.</p>
                </div>
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white/10 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 rounded-full bg-orange-400/20 blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">
                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-1 rounded-xl shadow-lg border border-orange-100 dark:border-orange-900/50 w-full md:w-auto inline-flex h-auto">
                        <TabsTrigger value="overview" className="py-3 px-6 rounded-lg data-[state=active]:bg-orange-600 data-[state=active]:text-white transition-all text-base"><LayoutGrid className="w-5 h-5 mr-2" /> Overview</TabsTrigger>
                        <TabsTrigger value="marketplace" className="py-3 px-6 rounded-lg data-[state=active]:bg-orange-600 data-[state=active]:text-white transition-all text-base"><ShoppingBag className="w-5 h-5 mr-2" /> Marketplace</TabsTrigger>
                        <TabsTrigger value="orders" className="py-3 px-6 rounded-lg data-[state=active]:bg-orange-600 data-[state=active]:text-white transition-all text-base"><Package className="w-5 h-5 mr-2" /> Orders</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <motion.div whileHover={{ y: -5 }} className="h-full">
                                <Card className="h-full border-none shadow-lg bg-white dark:bg-slate-900 overflow-hidden relative group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-amber-500/5 group-hover:from-orange-500/10 group-hover:to-amber-500/10 transition-colors"></div>
                                    <CardHeader>
                                        <CardTitle className="flex items-center text-xl text-slate-800 dark:text-slate-100">
                                            <TrendingUp className="w-6 h-6 mr-3 text-orange-600" />
                                            Grow Fast
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-slate-500 dark:text-slate-400 mb-6">Access 300+ services from registration to marketing.</p>
                                        <Link href="/services">
                                            <Button className="w-full bg-orange-600 hover:bg-orange-700 shadow-orange-200 shadow-lg">Explore Services</Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            <motion.div whileHover={{ y: -5 }} className="h-full">
                                <Card className="h-full border-none shadow-lg bg-white dark:bg-slate-900 overflow-hidden relative group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 group-hover:from-blue-500/10 group-hover:to-cyan-500/10 transition-colors"></div>
                                    <CardHeader>
                                        <CardTitle className="flex items-center text-xl text-slate-800 dark:text-slate-100">
                                            <Clock className="w-6 h-6 mr-3 text-blue-600" />
                                            Active Orders
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                                            {orders?.filter((o: any) => o.status !== 'completed').length || 0}
                                        </div>
                                        <p className="text-slate-500 dark:text-slate-400">Orders in progress</p>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            <motion.div whileHover={{ y: -5 }} className="h-full">
                                <Card className="h-full border-none shadow-lg bg-gradient-to-br from-slate-900 to-slate-800 text-white">
                                    <CardHeader>
                                        <CardTitle className="flex items-center text-xl">
                                            Need Support?
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-slate-300 mb-6">Our business experts are here to help you choose the right package.</p>
                                        <Link href="/contact">
                                            <Button variant="outline" className="w-full border-slate-600 text-slate-200 hover:bg-slate-700 hover:text-white">Contact Support</Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>

                        {/* Recommended Services Carousel (Simplified Grid) */}
                        <div className="mt-8">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Recommended for You</h2>
                                <Link href="/services">
                                    <Button variant="ghost" className="text-orange-600 hover:text-orange-700 hover:bg-orange-50">View All <ArrowRight className="w-4 h-4 ml-1" /></Button>
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {services?.slice(0, 4).map((service: any) => (
                                    <Link key={service.id} href={`/services/${service.slug}`}>
                                        <Card className="h-full hover:-translate-y-1 transition-transform duration-300 border-none shadow-md overflow-hidden">
                                            <div className="h-32 bg-slate-100 flex items-center justify-center">
                                                <Package className="w-10 h-10 text-slate-400 opacity-50" />
                                            </div>
                                            <CardContent className="p-4">
                                                <h3 className="font-bold text-slate-900 dark:text-slate-100 truncate">{service.name}</h3>
                                                <p className="text-sm text-slate-500 mt-1 line-clamp-2">{service.summary}</p>
                                                <div className="mt-4 flex items-center justify-between">
                                                    <span className="font-semibold text-orange-600">₹{service.basePriceInr}</span>
                                                    <Button size="sm" variant="secondary" className="h-8">Details</Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="orders">
                        <Card className="border-none shadow-lg">
                            <CardHeader>
                                <CardTitle>Order History</CardTitle>
                                <CardDescription>View and track all your business purchases</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {!orders || orders.length === 0 ? (
                                    <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                                        <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                                        <h3 className="text-lg font-medium text-slate-900">No orders yet</h3>
                                        <p className="text-slate-500 mb-4">You haven't purchased any services.</p>
                                        <Link href="/services">
                                            <Button className="bg-orange-600 hover:bg-orange-700">Browse Services</Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {orders.map((order: any) => (
                                            <div key={order.id} className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                                                <div className="flex items-start space-x-4 mb-4 md:mb-0">
                                                    <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                                                        <Package className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-900 dark:text-slate-100">Order #{order.id.slice(0, 8).toUpperCase()}</h4>
                                                        <p className="text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString()} • {order.items?.length || 1} items</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-6">
                                                    <div className="text-right">
                                                        <div className="font-bold text-slate-900 dark:text-slate-100">₹{order.totalInr}</div>
                                                        <Badge className={`mt-1 ${order.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                                                                order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                                    'bg-slate-100 text-slate-700'
                                                            }`}>
                                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                        </Badge>
                                                    </div>
                                                    <Button variant="outline" size="sm">View</Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="marketplace">
                        {/* Reuse Services Page content or redirect */}
                        <div className="text-center py-20">
                            <h2 className="text-2xl font-bold mb-4">Redirecting to Marketplace...</h2>
                            <Link href="/services">
                                <Button size="lg" className="bg-orange-600">Go to Full Marketplace</Button>
                            </Link>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
