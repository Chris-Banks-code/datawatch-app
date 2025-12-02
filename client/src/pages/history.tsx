import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import RealTimeChart from "@/components/real-time-chart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { DataUsage, RealtimeData } from "@shared/schema";

export default function History() {
  const { data: usage, isLoading: usageLoading } = useQuery<DataUsage>({
    queryKey: ["/api/usage/current"],
  });

  const { data: realtimeData, isLoading: realtimeLoading } = useQuery<RealtimeData[]>({
    queryKey: ["/api/realtime"],
  });

  if (usageLoading || realtimeLoading) {
    return (
      <div className="p-4 space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  const totalUsageGB = usage ? (usage.usedMB / 1024).toFixed(1) : "0";
  const avgDailyMB = usage ? Math.round(usage.usedMB / 30) : 0;

  return (
    <div className="pb-20">
      {/* Header */}
      <header className="bg-primary text-white p-4 flex items-center space-x-3">
        <Link href="/">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-lg font-semibold">Usage History</h1>
      </header>

      <main className="p-4 space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-4 text-center">
            <div className="text-primary text-xl font-semibold">{totalUsageGB} GB</div>
            <div className="text-xs text-slate-500">Total Usage</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-secondary text-xl font-semibold">{avgDailyMB} MB</div>
            <div className="text-xs text-slate-500">Daily Average</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-accent text-xl font-semibold">{realtimeData?.length || 0}</div>
            <div className="text-xs text-slate-500">Data Points</div>
          </Card>
        </div>

        {/* Charts */}
        <Tabs defaultValue="realtime" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="realtime">Real-time</TabsTrigger>
            <TabsTrigger value="daily">Daily Trends</TabsTrigger>
          </TabsList>
          
          <TabsContent value="realtime" className="space-y-4">
            <RealTimeChart />
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Usage Insights</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Peak Usage Time</span>
                    <span className="font-semibold">6:00 PM - 9:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Average Speed</span>
                    <span className="font-semibold">
                      {realtimeData ? `${(realtimeData.reduce((sum, d) => sum + (d.speedMBPS || 0), 0) / realtimeData.length).toFixed(1)} Mbps` : "0 Mbps"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Data Efficiency</span>
                    <span className="font-semibold text-secondary">Good</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="daily" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Daily Usage Pattern</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center text-slate-500">
                    <Calendar className="h-12 w-12 mx-auto mb-2" />
                    <p>Daily usage charts will be available with more data points.</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-lg font-semibold text-secondary">
                        {usage?.dailyUsageMB ? `${Math.round(usage.dailyUsageMB)} MB` : "0 MB"}
                      </div>
                      <div className="text-sm text-slate-500">Today's Usage</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-accent">
                        {usage ? `${Math.round(usage.usedMB / 7)} MB` : "0 MB"}
                      </div>
                      <div className="text-sm text-slate-500">Weekly Average</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
