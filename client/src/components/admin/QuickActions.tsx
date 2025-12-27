import { Plus, CheckCircle, UserPlus, Package, Mail, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface QuickActionsProps {
  onAction: (action: string) => void;
}

export function QuickActions({ onAction }: QuickActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Quick Actions
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Common Tasks</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onAction("add-service")}>
          <Package className="h-4 w-4 mr-2" />
          Add New Service
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAction("add-user")}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add New User
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAction("approve-pending")}>
          <CheckCircle className="h-4 w-4 mr-2" />
          Approve Pending Orders
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Reports</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onAction("export-orders")}>
          <Download className="h-4 w-4 mr-2" />
          Export Orders (CSV)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAction("export-leads")}>
          <Download className="h-4 w-4 mr-2" />
          Export Leads (CSV)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAction("send-digest")}>
          <Mail className="h-4 w-4 mr-2" />
          Send Email Digest
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
