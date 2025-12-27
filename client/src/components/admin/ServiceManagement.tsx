import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Edit, Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";

interface ServiceManagementProps {
  services: any[];
  categories: any[];
  onUpdate: () => void;
}

export default function ServiceManagement({ services, categories, onUpdate }: ServiceManagementProps) {
  const { toast } = useToast();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    categoryId: "",
    basePriceInr: "",
    etaDays: "",
    summary: "",
    longDescription: "",
    sku: "",
    active: true,
  });

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      categoryId: "",
      basePriceInr: "",
      etaDays: "",
      summary: "",
      longDescription: "",
      sku: "",
      active: true,
    });
  };

  const handleCreate = async () => {
    setSubmitting(true);
    try {
      const response = await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          basePriceInr: parseFloat(formData.basePriceInr),
          etaDays: parseInt(formData.etaDays),
        }),
      });

      if (response.ok) {
        toast({
          title: "Service Created",
          description: "The service has been created successfully.",
        });
        setCreateDialogOpen(false);
        resetForm();
        onUpdate();
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Failed to create service",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "An error occurred while creating the service",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async () => {
    if (!selectedService) return;
    setSubmitting(true);
    try {
      const response = await fetch(`/api/admin/services/${selectedService.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          basePriceInr: parseFloat(formData.basePriceInr),
          etaDays: parseInt(formData.etaDays),
        }),
      });

      if (response.ok) {
        toast({
          title: "Service Updated",
          description: "The service has been updated successfully.",
        });
        setEditDialogOpen(false);
        setSelectedService(null);
        resetForm();
        onUpdate();
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Failed to update service",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "An error occurred while updating the service",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedService) return;
    setSubmitting(true);
    try {
      const response = await fetch(`/api/admin/services/${selectedService.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Service Deleted",
          description: "The service has been deleted successfully.",
        });
        setDeleteDialogOpen(false);
        setSelectedService(null);
        onUpdate();
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Failed to delete service",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "An error occurred while deleting the service",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const openEditDialog = (service: any) => {
    setSelectedService(service);
    setFormData({
      name: service.name || "",
      slug: service.slug || "",
      categoryId: service.categoryId || "",
      basePriceInr: service.basePriceInr ? service.basePriceInr.toString() : "",
      etaDays: service.etaDays ? service.etaDays.toString() : "",
      summary: service.summary || "",
      longDescription: service.longDescription || "",
      sku: service.sku || "",
      active: service.active ?? true,
    });
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (service: any) => {
    setSelectedService(service);
    setDeleteDialogOpen(true);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Services Management</CardTitle>
            <CardDescription>
              Manage all services, prices, and availability
            </CardDescription>
          </div>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Add Service
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh]">
              <DialogHeader>
                <DialogTitle>Create New Service</DialogTitle>
                <DialogDescription>
                  Add a new service to your platform
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="max-h-[70vh]">
                <div className="space-y-4 p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="create-name">Service Name *</Label>
                      <Input
                        id="create-name"
                        value={formData.name}
                        onChange={(e) => {
                          const name = e.target.value;
                          setFormData({ ...formData, name, slug: generateSlug(name) });
                        }}
                        placeholder="e.g., GST Registration"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="create-slug">Slug *</Label>
                      <Input
                        id="create-slug"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        placeholder="e.g., gst-registration"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="create-category">Category *</Label>
                      <Select
                        value={formData.categoryId}
                        onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                      >
                        <SelectTrigger id="create-category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="create-price">Price (INR) *</Label>
                      <Input
                        id="create-price"
                        type="number"
                        value={formData.basePriceInr}
                        onChange={(e) => setFormData({ ...formData, basePriceInr: e.target.value })}
                        placeholder="e.g., 2999"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="create-eta">ETA (Days) *</Label>
                      <Input
                        id="create-eta"
                        type="number"
                        value={formData.etaDays}
                        onChange={(e) => setFormData({ ...formData, etaDays: e.target.value })}
                        placeholder="e.g., 7"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="create-sku">SKU</Label>
                      <Input
                        id="create-sku"
                        value={formData.sku}
                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                        placeholder="e.g., GST-REG-001"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="create-summary">Summary *</Label>
                    <Input
                      id="create-summary"
                      value={formData.summary}
                      onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                      placeholder="Brief description of the service"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="create-description">Long Description</Label>
                    <Textarea
                      id="create-description"
                      value={formData.longDescription}
                      onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                      placeholder="Detailed description of the service"
                      rows={4}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="create-active"
                      checked={formData.active}
                      onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                    />
                    <Label htmlFor="create-active" className="cursor-pointer">
                      Active (visible to customers)
                    </Label>
                  </div>
                </div>
              </ScrollArea>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreate} disabled={submitting}>
                  {submitting ? "Creating..." : "Create Service"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">{service.name}</TableCell>
                  <TableCell>
                    {categories.find((c) => c.id === service.categoryId)?.name || "Unknown"}
                  </TableCell>
                  <TableCell>₹{service.basePriceInr}</TableCell>
                  <TableCell>
                    <Badge variant={service.active ? "default" : "secondary"}>
                      {service.active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEditDialog(service)}>
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => openDeleteDialog(service)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
            <DialogDescription>
              Update service details, pricing, and availability
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh]">
            <div className="space-y-4 p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Service Name *</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-slug">Slug *</Label>
                  <Input
                    id="edit-slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category *</Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                  >
                    <SelectTrigger id="edit-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-price">Price (INR) *</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    value={formData.basePriceInr}
                    onChange={(e) => setFormData({ ...formData, basePriceInr: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-eta">ETA (Days) *</Label>
                  <Input
                    id="edit-eta"
                    type="number"
                    value={formData.etaDays}
                    onChange={(e) => setFormData({ ...formData, etaDays: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-sku">SKU</Label>
                  <Input
                    id="edit-sku"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-summary">Summary *</Label>
                <Input
                  id="edit-summary"
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Long Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.longDescription}
                  onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-active"
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                />
                <Label htmlFor="edit-active" className="cursor-pointer">
                  Active (visible to customers)
                </Label>
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit} disabled={submitting}>
              {submitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Service</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedService?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={submitting}>
              {submitting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
