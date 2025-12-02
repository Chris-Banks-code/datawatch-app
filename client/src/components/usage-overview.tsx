import { Card, CardContent } from "@/components/ui/card";
import ProgressRing from "./progress-ring";
import type { DataUsage } from "@shared/schema";

interface UsageOverviewProps {
  usage?: DataUsage;
}

export default function UsageOverview({ usage }: UsageOverviewProps) {
  if (!usage) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded-full w-32 mx-auto mb-6"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Card>
    );
  }

  const percentage = (usage.usedMB / usage.totalMB) * 100;
  const usedGB = (usage.usedMB / 1024).toFixed(1);
  const remainingGB = ((usage.totalMB - usage.usedMB) / 1024).toFixed(1);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Current Usage</h2>
        <span className="text-sm text-slate-500">This month</span>
      </div>
      
      <div className="flex items-center justify-center mb-6">
        <ProgressRing percentage={percentage} />
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-center">
        <div>
          <div className="text-xl font-semibold">{usedGB} GB</div>
          <div className="text-sm text-slate-500">Used</div>
        </div>
        <div>
          <div className="text-xl font-semibold">{remainingGB} GB</div>
          <div className="text-sm text-slate-500">Remaining</div>
        </div>
      </div>
    </Card>
  );
}
