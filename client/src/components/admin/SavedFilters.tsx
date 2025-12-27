import { useState } from "react";
import { Filter, Save, Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface SavedFilter {
  id: string;
  name: string;
  filters: Record<string, any>;
  favorite: boolean;
}

interface SavedFiltersProps {
  currentFilters: Record<string, any>;
  onApplyFilter: (filters: Record<string, any>) => void;
}

export function SavedFilters({ currentFilters, onApplyFilter }: SavedFiltersProps) {
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([
    {
      id: "1",
      name: "Pending Orders",
      filters: { status: "pending" },
      favorite: true,
    },
    {
      id: "2",
      name: "This Month",
      filters: { dateRange: "thisMonth" },
      favorite: false,
    },
  ]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [filterName, setFilterName] = useState("");

  const saveCurrentFilter = () => {
    if (!filterName.trim()) return;
    
    const newFilter: SavedFilter = {
      id: Date.now().toString(),
      name: filterName,
      filters: currentFilters,
      favorite: false,
    };
    
    setSavedFilters([...savedFilters, newFilter]);
    setFilterName("");
    setShowSaveDialog(false);
  };

  const deleteFilter = (id: string) => {
    setSavedFilters(savedFilters.filter((f) => f.id !== id));
  };

  const toggleFavorite = (id: string) => {
    setSavedFilters(
      savedFilters.map((f) =>
        f.id === id ? { ...f, favorite: !f.favorite } : f
      )
    );
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Saved Filters
            {savedFilters.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {savedFilters.length}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Your Saved Filters</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {savedFilters.length === 0 ? (
            <div className="px-2 py-4 text-center text-sm text-muted-foreground">
              No saved filters yet
            </div>
          ) : (
            savedFilters.map((filter) => (
              <DropdownMenuItem
                key={filter.id}
                className="flex items-center justify-between group"
                onClick={() => onApplyFilter(filter.filters)}
              >
                <div className="flex items-center gap-2 flex-1">
                  {filter.favorite && (
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  )}
                  <span className="truncate">{filter.name}</span>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(filter.id);
                    }}
                  >
                    <Star className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteFilter(filter.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </DropdownMenuItem>
            ))
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowSaveDialog(true)}>
            <Save className="h-4 w-4 mr-2" />
            Save Current Filters
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Current Filters</DialogTitle>
            <DialogDescription>
              Give this filter combination a name so you can quickly apply it later.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="filter-name">Filter Name</Label>
              <Input
                id="filter-name"
                placeholder="e.g., High Priority Orders"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveCurrentFilter();
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={saveCurrentFilter} disabled={!filterName.trim()}>
              <Save className="h-4 w-4 mr-2" />
              Save Filter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
