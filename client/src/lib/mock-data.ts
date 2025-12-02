import type { AppUsage, DataUsage, RealtimeData } from "@shared/schema";

export const mockCurrentUsage: DataUsage = {
  id: 1,
  date: new Date(),
  usedMB: 6963.2, // 6.8GB
  totalMB: 10240, // 10GB
  dailyUsageMB: 245,
};

export const mockTopApps: AppUsage[] = [
  {
    id: 1,
    appName: "YouTube",
    category: "Video Streaming",
    iconClass: "fab fa-youtube",
    usageMB: 1228.8,
    percentage: 18,
    lastUpdated: new Date(),
  },
  {
    id: 2,
    appName: "Facebook",
    category: "Social Media",
    iconClass: "fab fa-facebook",
    usageMB: 890,
    percentage: 13,
    lastUpdated: new Date(),
  },
  {
    id: 3,
    appName: "Spotify",
    category: "Music Streaming",
    iconClass: "fab fa-spotify",
    usageMB: 650,
    percentage: 10,
    lastUpdated: new Date(),
  },
  {
    id: 4,
    appName: "Instagram",
    category: "Social Media",
    iconClass: "fab fa-instagram",
    usageMB: 520,
    percentage: 8,
    lastUpdated: new Date(),
  },
  {
    id: 5,
    appName: "Chrome",
    category: "Web Browser",
    iconClass: "fas fa-globe",
    usageMB: 480,
    percentage: 7,
    lastUpdated: new Date(),
  },
];

export const generateMockRealtimeData = (count: number = 20): RealtimeData[] => {
  const data: RealtimeData[] = [];
  const now = new Date();
  
  for (let i = count - 1; i >= 0; i--) {
    data.push({
      id: count - i,
      timestamp: new Date(now.getTime() - i * 5 * 60 * 1000), // 5-minute intervals
      usageMB: Math.random() * 50 + 10, // Random usage between 10-60 MB
      speedMBPS: Math.random() * 20 + 5, // Random speed between 5-25 Mbps
    });
  }
  
  return data;
};
