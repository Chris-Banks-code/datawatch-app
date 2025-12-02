import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import type { AppUsage } from "@shared/schema";

interface AppUsageListProps {
  apps?: AppUsage[];
  showAll?: boolean;
}

const getAppIcon = (iconClass: string, appName: string) => {
  const iconMap: Record<string, string> = {
    "fab fa-youtube": "🎥",
    "fab fa-facebook": "📘",
    "fab fa-spotify": "🎵",
    "fab fa-instagram": "📷",
    "fas fa-globe": "🌐",
    "fas fa-mobile-alt": "📱",
  };
  
  return iconMap[iconClass] || iconMap["fas fa-mobile-alt"];
};

const getAppColor = (appName: string) => {
  const colorMap: Record<string, string> = {
    "YouTube": "bg-red-500",
    "Facebook": "bg-blue-500",
    "Spotify": "bg-green-500",
    "Instagram": "bg-purple-500",
    "Chrome": "bg-orange-500",
  };
  
  return colorMap[appName] || "bg-slate-500";
};

export default function AppUsageList({ apps, showAll = false }: AppUsageListProps) {
  if (!apps || apps.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center text-slate-500">
          <div className="text-4xl mb-2">📱</div>
          <div>No app usage data available</div>
        </div>
      </Card>
    );
  }

  const displayApps = showAll ? apps : apps.slice(0, 5);

  return (
    <Card className={showAll ? "" : "p-6"}>
      {!showAll && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Top Apps</h3>
          <Link href="/apps">
            <Button variant="ghost" size="sm" className="text-primary">
              View All
            </Button>
          </Link>
        </div>
      )}
      
      <div className={`space-y-4 ${showAll ? "p-6" : ""}`}>
        {displayApps.map((app) => (
          <div key={app.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 ${getAppColor(app.appName)} rounded-lg flex items-center justify-center text-white text-lg`}>
                {getAppIcon(app.iconClass, app.appName)}
              </div>
              <div>
                <div className="font-medium">{app.appName}</div>
                <div className="text-sm text-slate-500">{app.category}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold">
                {app.usageMB >= 1024 
                  ? `${(app.usageMB / 1024).toFixed(1)} GB`
                  : `${Math.round(app.usageMB)} MB`
                }
              </div>
              <div className="text-sm text-slate-500">{app.percentage}%</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
