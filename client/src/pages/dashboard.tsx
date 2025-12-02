import { useQuery } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import UsageOverview from "@/components/usage-overview";
import RealTimeChart from "@/components/real-time-chart";
import AppUsageList from "@/components/app-usage-list";
import UsagePredictions from "@/components/usage-predictions";
import AnomalyAlert from "@/components/anomaly-alert";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Download, History, Settings, Sliders } from "lucide-react";
import type { DataUsage, AppUsage, UserSettings } from "@shared/schema";

export default function Dashboard() {
  const { data: usage, isLoading: usageLoading } = useQuery<DataUsage>({
    queryKey: ["/api/usage/current"],
  });

  const { data: topApps, isLoading: appsLoading } = useQuery<AppUsage[]>({
    queryKey: ["/api/apps/top"],
  });

  const { data: settings } = useQuery<UserSettings>({
    queryKey: ["/api/settings"],
  });

  if (usageLoading || appsLoading) {
    return (
      <div className="p-4 space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  const usagePercentage = usage ? (usage.usedMB / usage.totalMB) * 100 : 0;
  const shouldShowAlert = settings && usagePercentage > settings.alertThreshold * 100;

  return (
    <div className="pb-20">
      {/* Header */}
      <header className="bg-primary text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <i className="fas fa-chart-line text-sm"></i>
          </div>
          <h1 className="text-lg font-semibold">DataWatch</h1>
        </div>
        <button className="w-8 h-8 flex items-center justify-center relative">
          <Bell className="h-4 w-4" />
          {shouldShowAlert && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          )}
        </button>
      </header>

      <main className="p-4 space-y-6">
        {/* Anomaly Alert */}
        <AnomalyAlert />

        {/* Usage Overview */}
        <UsageOverview usage={usage} />

        {/* Usage Predictions */}
        <UsagePredictions />

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-4 text-center">
            <div className="text-secondary text-xl font-semibold">
              {usage?.dailyUsageMB ? `${Math.round(usage.dailyUsageMB)} MB` : "0 MB"}
            </div>
            <div className="text-xs text-slate-500">Today</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-accent text-xl font-semibold">
              {usage ? `${Math.round(usage.usedMB / 30)} MB` : "0 MB"}
            </div>
            <div className="text-xs text-slate-500">Daily Avg</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-danger text-xl font-semibold">
              {usage ? Math.max(0, Math.round(30 - (usage.usedMB / usage.totalMB) * 30)) : "30"}
            </div>
            <div className="text-xs text-slate-500">Days Left</div>
          </Card>
        </div>

        {/* Real-time Chart */}
        <RealTimeChart />

        {/* Top Apps */}
        <AppUsageList apps={topApps?.slice(0, 5)} />

        {/* Data Limit Alert */}
        {shouldShowAlert && (
          <Alert className="bg-amber-50 border-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-700">
              <div className="font-semibold">Data Limit Warning</div>
              <div className="text-sm">
                You've used {Math.round(usagePercentage)}% of your monthly data. Consider reducing usage.
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Quick Actions */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="p-4 h-auto flex-col space-y-2">
              <Sliders className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Set Limit</span>
            </Button>
            <Button variant="outline" className="p-4 h-auto flex-col space-y-2">
              <Download className="h-5 w-5 text-secondary" />
              <span className="text-sm font-medium">Export Data</span>
            </Button>
            <Button variant="outline" className="p-4 h-auto flex-col space-y-2">
              <History className="h-5 w-5 text-accent" />
              <span className="text-sm font-medium">View History</span>
            </Button>
            <Button variant="outline" className="p-4 h-auto flex-col space-y-2">
              <Settings className="h-5 w-5 text-slate-600" />
              <span className="text-sm font-medium">Settings</span>
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
}
