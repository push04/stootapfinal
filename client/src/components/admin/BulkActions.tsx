import { useState } from "react";
import { CheckSquare, Trash2, Edit, Send, Archive, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface BulkActionsProps {
  selectedCount: number;
  onAction: (action: string) => Promise<void>;
  actions?: Array<{
    label: string;
    value: string;
    icon: React.ReactNode;
    variant?: "default" | "destructive";
  }>;
}

export function BulkActions({ selectedCount, onAction, actions }: BulkActionsProps) {
  const { toast } = useToast();
  const [lastAction, setLastAction] = useState<{
    action: string;
    count: number;
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const defaultActions = [
    {
      label: "Mark as Completed",
      value: "complete",
      icon: <CheckSquare className="h-4 w-4 mr-2" />,
    },
    {
      label: "Archive Selected",
      value: "archive",
      icon: <Archive className="h-4 w-4 mr-2" />,
    },
    {
      label: "Send Notification",
      value: "notify",
      icon: <Send className="h-4 w-4 mr-2" />,
    },
    {
      label: "Delete Selected",
      value: "delete",
      icon: <Trash2 className="h-4 w-4 mr-2" />,
      variant: "destructive" as const,
    },
  ];

  const availableActions = actions || defaultActions;

  const handleAction = async (actionValue: string) => {
    setIsProcessing(true);
    try {
      await onAction(actionValue);
      setLastAction({ action: actionValue, count: selectedCount });
      
      toast({
        title: "Bulk Action Completed",
        description: `Successfully processed ${selectedCount} items`,
        action: (
          <Button
            variant="outline"
            size="sm"
            onClick={handleUndo}
            className="gap-1"
          >
            <Undo2 className="h-3 w-3" />
            Undo
          </Button>
        ),
      });
    } catch (error) {
      toast({
        title: "Bulk Action Failed",
        description: "Failed to process selected items",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUndo = async () => {
    if (!lastAction) return;
    
    toast({
      title: "Undoing Action",
      description: `Reverting changes to ${lastAction.count} items...`,
    });
    
    // Implement undo logic here
    setLastAction(null);
  };

  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg border border-primary/20">
      <Badge variant="default" className="font-semibold">
        {selectedCount} selected
      </Badge>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" disabled={isProcessing}>
            {isProcessing ? "Processing..." : "Bulk Actions"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Apply to {selectedCount} items</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {availableActions.map((action) => (
            <DropdownMenuItem
              key={action.value}
              onClick={() => handleAction(action.value)}
              className={action.variant === "destructive" ? "text-destructive" : ""}
            >
              {action.icon}
              {action.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {lastAction && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleUndo}
          className="gap-1 ml-auto"
        >
          <Undo2 className="h-3 w-3" />
          Undo Last Action
        </Button>
      )}
    </div>
  );
}
