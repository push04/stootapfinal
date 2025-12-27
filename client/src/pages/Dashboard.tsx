import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingBag, FileText, Upload, HeadphonesIcon, CheckCircle2, Clock, XCircle } from "lucide-react";

const mockOrders = [
  { id: "ORD001", service: "LLP Incorporation", status: "completed", amount: 8999, date: "2024-10-15" },
  { id: "ORD002", service: "GST Registration", status: "in_progress", amount: 2499, date: "2024-10-20" },
  { id: "ORD003", service: "Trademark Registration", status: "pending", amount: 5999, date: "2024-10-25" },
];

const mockServices = [
  { id: 1, name: "LLP Incorporation", purchasedOn: "2024-10-15", status: "active" },
  { id: 2, name: "GST Registration", purchasedOn: "2024-10-20", status: "active" },
];

const mockDocuments = [
  { id: 1, name: "LLP_Certificate.pdf", uploadedOn: "2024-10-16", type: "Certificate" },
  { id: 2, name: "GST_Application.pdf", uploadedOn: "2024-10-21", type: "Application" },
];

const statusConfig = {
  completed: { label: "Completed", icon: CheckCircle2, color: "text-accent" },
  in_progress: { label: "In Progress", icon: Clock, color: "text-orange-500" },
  pending: { label: "Pending", icon: Clock, color: "text-muted-foreground" },
  failed: { label: "Failed", icon: XCircle, color: "text-destructive" },
};

export default function Dashboard() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-1 bg-zinc-50 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold font-heading mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's your business overview.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockOrders.length}</div>
                <p className="text-xs text-muted-foreground">+2 from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Services</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockServices.length}</div>
                <p className="text-xs text-muted-foreground">All services active</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{mockOrders.reduce((sum, o) => sum + o.amount, 0).toLocaleString("en-IN")}</div>
                <p className="text-xs text-muted-foreground">Across all services</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Documents</CardTitle>
                <Upload className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockDocuments.length}</div>
                <p className="text-xs text-muted-foreground">Uploaded files</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="orders" className="space-y-6">
            <TabsList>
              <TabsTrigger value="orders" data-testid="tab-orders">Orders</TabsTrigger>
              <TabsTrigger value="services" data-testid="tab-services">Services</TabsTrigger>
              <TabsTrigger value="documents" data-testid="tab-documents">Documents</TabsTrigger>
              <TabsTrigger value="support" data-testid="tab-support">Support</TabsTrigger>
            </TabsList>

            <TabsContent value="orders" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockOrders.map((order) => {
                      const StatusIcon = statusConfig[order.status as keyof typeof statusConfig].icon;
                      return (
                        <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg" data-testid={`order-${order.id}`}>
                          <div className="flex-1">
                            <p className="font-semibold">{order.service}</p>
                            <p className="text-sm text-muted-foreground">Order #{order.id} • {order.date}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <Badge variant="secondary" className="gap-1">
                              <StatusIcon className={`h-3 w-3 ${statusConfig[order.status as keyof typeof statusConfig].color}`} />
                              {statusConfig[order.status as keyof typeof statusConfig].label}
                            </Badge>
                            <p className="font-semibold">₹{order.amount.toLocaleString("en-IN")}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="services" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Purchased Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockServices.map((service) => (
                      <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg" data-testid={`service-${service.id}`}>
                        <div>
                          <p className="font-semibold">{service.name}</p>
                          <p className="text-sm text-muted-foreground">Purchased on {service.purchasedOn}</p>
                        </div>
                        <Badge className="bg-accent text-accent-foreground">Active</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Your Documents</CardTitle>
                  <Button data-testid="button-upload-document">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockDocuments.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg" data-testid={`document-${doc.id}`}>
                        <div className="flex items-center gap-3">
                          <HeadphonesIcon className="h-8 w-8 text-orange-600 mt-1" />
                          <div>
                            <p className="font-semibold">{doc.name}</p>
                            <p className="text-sm text-muted-foreground">{doc.type} • Uploaded {doc.uploadedOn}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" data-testid={`button-download-${doc.id}`}>Download</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="support" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-4 p-4 border rounded-lg">
                    <HeadphonesIcon className="h-8 w-8 text-primary mt-1" />
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">Contact Support</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Our team is here to help you with any questions or issues.
                      </p>
                      <Button data-testid="button-contact-support">Start Chat</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
