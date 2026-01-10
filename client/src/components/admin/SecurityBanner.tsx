import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertTriangle } from "lucide-react";

export function SecurityBanner() {
  return (
    <Alert className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800 mb-4">
      <div className="flex items-start gap-3">
        <Shield className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
        <div className="flex-1">
          <AlertDescription className="text-amber-800 dark:text-amber-200">
            <strong className="font-semibold">Security Notice:</strong> This repository contains sensitive credentials and is kept private by policy. 
            Do not share access or push to public repositories.
          </AlertDescription>
        </div>
        <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
      </div>
    </Alert>
  );
}
