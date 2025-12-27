import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Edit, Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CategoryManagementProps {
  categories: any[];
  services: any[];
  onUpdate: () => void;
}

export default function CategoryManagement({ categories, services, onUpdate }: CategoryManagementProps) {
  const { toast } = useToast();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    sortOrder: "0",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      sortOrder: "0",
    });
  };

  const handleCreate = async () => {
    setSubmitting(true);
    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          sortOrder: parseInt(formData.sortOrder),
        }),
      });

      if (response.ok) {
        toast({
          title: "Category Created",
          description: "The category has been created successfully.",
        });
        setCreateDialogOpen(false);
        resetForm();
        onUpdate();
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Failed to create category",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "An error occurred while creating the category",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async () => {
    if (!selectedCategory) return;
    setSubmitting(true);
    try {
      const response = await fetch(`/api/admin/categories/${selectedCategory.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          sortOrder: parseInt(formData.sortOrder),
        }),
      });

      if (response.ok) {
        toast({
          title: "Category Updated",
          description: "The category has been updated successfully.",
        });
        setEditDialogOpen(false);
        setSelectedCategory(null);
        resetForm();
        onUpdate();
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Failed to update category",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "An error occurred while updating the category",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;

    const servicesInCategory = (services || []).filter(s => s.categoryId === selectedCategory.id).length;
    if (servicesInCategory > 0) {
      toast({
        title: "Cannot Delete Category",
        description: `This category has ${servicesInCategory} service(s). Please move or delete them first.`,
        variant: "destructive",
      });
      setDeleteDialogOpen(false);
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`/api/admin/categories/${selectedCategory.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Category Deleted",
          description: "The category has been deleted successfully.",
        });
        setDeleteDialogOpen(false);
        setSelectedCategory(null);
        onUpdate();
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Failed to delete category",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "An error occurred while deleting the category",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const openEditDialog = (category: any) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      sortOrder: category.sortOrder?.toString() || "0",
    });
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (category: any) => {
    setSelectedCategory(category);
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
            <CardTitle>Categories Management</CardTitle>
            <CardDescription>
              Manage service categories and their display order
            </CardDescription>
          </div>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Category</DialogTitle>
                <DialogDescription>
                  Add a new category to organize your services
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="create-name">Category Name *</Label>
                    <Input
                      id="create-name"
                      value={formData.name}
                      onChange={(e) => {
                        const name = e.target.value;
                        setFormData({ ...formData, name, slug: generateSlug(name) });
                      }}
                      placeholder="e.g., Compliance Services"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="create-slug">Slug *</Label>
                    <Input
                      id="create-slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="e.g., compliance-services"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-description">Description *</Label>
                  <Textarea
                    id="create-description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of this category"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-sort">Sort Order</Label>
                  <Input
                    id="create-sort"
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: e.target.value })}
                    placeholder="0"
                  />
                  <p className="text-xs text-muted-foreground">
                    Lower numbers appear first
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreate} disabled={submitting}>
                  {submitting ? "Creating..." : "Create Category"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Sort Order</TableHead>
              <TableHead>Services</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell className="font-mono text-sm">{category.slug}</TableCell>
                <TableCell>{category.sortOrder || 0}</TableCell>
                <TableCell>
                  {(services || []).filter((s) => s.categoryId === category.id).length} services
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => openEditDialog(category)}>
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => openDeleteDialog(category)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update category details and settings
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Category Name *</Label>
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
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description *</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-sort">Sort Order</Label>
              <Input
                id="edit-sort"
                type="number"
                value={formData.sortOrder}
                onChange={(e) => setFormData({ ...formData, sortOrder: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Lower numbers appear first
              </p>
            </div>
          </div>
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
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedCategory?.name}"? This action cannot be undone.
              {selectedCategory && (services || []).filter(s => s.categoryId === selectedCategory.id).length > 0 && (
                <span className="block mt-2 text-destructive font-semibold">
                  Warning: This category has {(services || []).filter(s => s.categoryId === selectedCategory.id).length} service(s).
                  Please move or delete them first.
                </span>
              )}
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
