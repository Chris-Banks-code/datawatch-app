import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

export function useRealTimeData() {
  const { data: realtimeData } = useQuery({
    queryKey: ["/api/realtime"],
  });

  useEffect(() => {
    const generateDataPoint = async () => {
      try {
        await apiRequest("POST", "/api/simulate", {});
        // Invalidate and refetch real-time data
        queryClient.invalidateQueries({ queryKey: ["/api/realtime"] });
      } catch (error) {
        console.error("Failed to generate real-time data:", error);
      }
    };

    // Generate new data point every 5 seconds
    const interval = setInterval(generateDataPoint, 5000);

    return () => clearInterval(interval);
  }, []);

  return realtimeData;
}
