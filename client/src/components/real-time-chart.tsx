import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRealTimeData } from "@/hooks/use-real-time-data";
import type { RealtimeData } from "@shared/schema";

export default function RealTimeChart() {
  const { data: realtimeData, isLoading } = useQuery<RealtimeData[]>({
    queryKey: ["/api/realtime"],
  });

  // Use real-time data hook for live updates
  useRealTimeData();

  if (isLoading || !realtimeData) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-48 bg-gray-200 rounded"></div>
        </div>
      </Card>
    );
  }

  const maxUsage = Math.max(...realtimeData.map(d => d.usageMB));
  const minUsage = Math.min(...realtimeData.map(d => d.usageMB));
  const range = maxUsage - minUsage || 1;

  return (
    <Card className="p-6">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg font-semibold">Real-Time Usage</span>
          <span className="flex items-center text-sm text-secondary">
            <span className="w-2 h-2 bg-secondary rounded-full mr-2 animate-pulse"></span>
            Live
          </span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="px-0 pb-0">
        <div className="h-48 flex items-end justify-between space-x-1">
          {realtimeData.slice(-20).map((point, index) => {
            const height = ((point.usageMB - minUsage) / range) * 100;
            const opacity = 0.3 + (index / realtimeData.length) * 0.7;
            
            return (
              <div
                key={point.id}
                className="bg-primary rounded-t transition-all duration-300 ease-in-out"
                style={{
                  height: `${Math.max(height, 5)}%`,
                  width: `${100 / 20}%`,
                  opacity,
                }}
                title={`${point.usageMB.toFixed(1)} MB at ${new Date(point.timestamp).toLocaleTimeString()}`}
              />
            );
          })}
        </div>
        
        <div className="flex justify-between text-xs text-slate-500 mt-2">
          <span>
            {realtimeData.length > 0 
              ? new Date(realtimeData[realtimeData.length - 20]?.timestamp || realtimeData[0].timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : "Start"
            }
          </span>
          <span>
            {realtimeData.length > 10 
              ? new Date(realtimeData[realtimeData.length - 10]?.timestamp || realtimeData[0].timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : "Mid"
            }
          </span>
          <span>Now</span>
        </div>
      </CardContent>
    </Card>
  );
}
