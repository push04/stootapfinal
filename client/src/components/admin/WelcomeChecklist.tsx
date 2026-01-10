import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { X, CheckCircle2, Circle } from "lucide-react";

interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  completed: boolean;
}

export function WelcomeChecklist({ onDismiss }: { onDismiss: () => void }) {
  const [items, setItems] = useState<ChecklistItem[]>([
    {
      id: "explore",
      label: "Explore the Dashboard",
      description: "Familiarize yourself with KPI cards, filters, and navigation",
      completed: false,
    },
    {
      id: "customize",
      label: "Customize Your View",
      description: "Click the settings icon to choose which cards you see first",
      completed: false,
    },
    {
      id: "filters",
      label: "Try Saved Filters",
      description: "Create and save your first custom filter preset",
      completed: false,
    },
    {
      id: "shortcuts",
      label: "Learn Keyboard Shortcuts",
      description: "Press '?' to see all available keyboard shortcuts",
      completed: false,
    },
  ]);

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const allCompleted = items.every((item) => item.completed);

  return (
    <Card className="border-primary/50 bg-gradient-to-br from-primary/5 to-primary/10">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Welcome to Your Admin Dashboard!</CardTitle>
              <CardDescription>
                Complete these steps to get started
              </CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDismiss}
            className="h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-background/50 transition-colors cursor-pointer"
            onClick={() => toggleItem(item.id)}
          >
            <Checkbox
              checked={item.completed}
              onCheckedChange={() => toggleItem(item.id)}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                {item.completed ? (
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground" />
                )}
                <p className={`font-medium ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                  {item.label}
                </p>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {item.description}
              </p>
            </div>
          </div>
        ))}
        {allCompleted && (
          <div className="mt-4 p-3 bg-primary/10 rounded-lg text-center">
            <p className="text-sm font-medium text-primary">
              🎉 All set! You're ready to manage your platform effectively.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={onDismiss}
              className="mt-2"
            >
              Dismiss Checklist
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
