import { useQuery } from "@tanstack/react-query";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { UsagePrediction } from "@shared/schema";

export default function AnomalyAlert() {
  const [dismissed, setDismissed] = useState(false);
  
  const { data: predictions } = useQuery<UsagePrediction>({
    queryKey: ["/api/predictions"],
    refetchInterval: 30000,
  });

  if (!predictions?.anomalyDetected || dismissed) {
    return null;
  }

  return (
    <Alert 
      className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800 relative"
      data-testid="anomaly-alert"
    >
      <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-6 w-6"
        onClick={() => setDismissed(true)}
        data-testid="dismiss-anomaly-alert"
      >
        <X className="h-4 w-4" />
      </Button>
      <AlertTitle className="text-amber-700 dark:text-amber-300">
        Unusual Usage Detected
      </AlertTitle>
      <AlertDescription className="text-amber-600 dark:text-amber-400 pr-8">
        {predictions.anomalyMessage}
      </AlertDescription>
    </Alert>
  );
}
