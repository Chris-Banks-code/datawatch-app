import { 
  dataUsage, 
  appUsage, 
  realtimeData, 
  userSettings,
  dailyUsageHistory,
  type DataUsage,
  type AppUsage,
  type RealtimeData,
  type UserSettings,
  type DailyUsageHistory,
  type UsagePrediction,
  type InsertDataUsage,
  type InsertAppUsage,
  type InsertRealtimeData,
  type InsertUserSettings,
  type InsertDailyUsageHistory
} from "@shared/schema";

export interface IStorage {
  // Data Usage
  getCurrentUsage(): Promise<DataUsage | undefined>;
  updateCurrentUsage(data: InsertDataUsage): Promise<DataUsage>;
  
  // App Usage
  getTopApps(): Promise<AppUsage[]>;
  updateAppUsage(appName: string, data: Partial<InsertAppUsage>): Promise<AppUsage>;
  
  // Real-time Data
  getRealtimeData(limit?: number): Promise<RealtimeData[]>;
  addRealtimeData(data: InsertRealtimeData): Promise<RealtimeData>;
  
  // User Settings
  getUserSettings(): Promise<UserSettings>;
  updateUserSettings(data: Partial<InsertUserSettings>): Promise<UserSettings>;
  
  // Daily Usage History
  getDailyUsageHistory(days?: number): Promise<DailyUsageHistory[]>;
  addDailyUsageHistory(data: InsertDailyUsageHistory): Promise<DailyUsageHistory>;
  
  // Predictions
  getUsagePrediction(): Promise<UsagePrediction>;
}

export class MemStorage implements IStorage {
  private currentUsage: DataUsage | undefined;
  private topApps: Map<string, AppUsage>;
  private realtimeDataPoints: RealtimeData[];
  private dailyHistory: DailyUsageHistory[];
  private settings: UserSettings;
  private currentId: number;
  private billingCycleStartDay: number = 1;

  constructor() {
    this.currentId = 1;
    this.topApps = new Map();
    this.realtimeDataPoints = [];
    this.dailyHistory = [];
    
    // Initialize with default settings
    this.settings = {
      id: this.currentId++,
      dataLimitMB: 10240, // 10GB
      alertThreshold: 0.8,
      notificationsEnabled: true,
    };

    // Initialize with mock data
    this.initializeMockData();
  }

  private initializeMockData() {
    // Initialize current usage
    this.currentUsage = {
      id: this.currentId++,
      date: new Date(),
      usedMB: 6963.2, // 6.8GB
      totalMB: 10240, // 10GB
      dailyUsageMB: 245,
    };

    // Initialize top apps
    const mockApps = [
      { appName: "YouTube", category: "Video Streaming", iconClass: "fab fa-youtube", usageMB: 1228.8, percentage: 18 },
      { appName: "Facebook", category: "Social Media", iconClass: "fab fa-facebook", usageMB: 890, percentage: 13 },
      { appName: "Spotify", category: "Music Streaming", iconClass: "fab fa-spotify", usageMB: 650, percentage: 10 },
      { appName: "Instagram", category: "Social Media", iconClass: "fab fa-instagram", usageMB: 520, percentage: 8 },
      { appName: "Chrome", category: "Web Browser", iconClass: "fas fa-globe", usageMB: 480, percentage: 7 },
    ];

    mockApps.forEach(app => {
      this.topApps.set(app.appName, {
        id: this.currentId++,
        ...app,
        lastUpdated: new Date(),
      });
    });

    // Initialize real-time data with 20 sample points
    const now = new Date();
    for (let i = 19; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 5 * 60 * 1000); // 5-minute intervals
      this.realtimeDataPoints.push({
        id: this.currentId++,
        timestamp,
        usageMB: Math.random() * 50 + 10, // Random usage between 10-60 MB
        speedMBPS: Math.random() * 20 + 5, // Random speed between 5-25 Mbps
      });
    }

    // Initialize daily usage history for the past 30 days
    let cumulativeUsage = 0;
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      // Simulate varying daily usage with some pattern
      let dailyUsage: number;
      if (i === 0) {
        dailyUsage = 245; // Today's usage
      } else if (i === 1) {
        // Yesterday - add a spike to test anomaly detection
        dailyUsage = 580; // Anomaly spike
      } else {
        // Regular days with natural variation
        dailyUsage = 180 + Math.random() * 80; // 180-260 MB
      }
      
      cumulativeUsage += dailyUsage;
      
      this.dailyHistory.push({
        id: this.currentId++,
        date,
        usageMB: dailyUsage,
        cumulativeUsageMB: cumulativeUsage,
      });
    }
  }

  async getCurrentUsage(): Promise<DataUsage | undefined> {
    return this.currentUsage;
  }

  async updateCurrentUsage(data: InsertDataUsage): Promise<DataUsage> {
    this.currentUsage = {
      id: this.currentUsage?.id || this.currentId++,
      date: new Date(),
      ...data,
    };
    return this.currentUsage;
  }

  async getTopApps(): Promise<AppUsage[]> {
    return Array.from(this.topApps.values())
      .sort((a, b) => b.usageMB - a.usageMB);
  }

  async updateAppUsage(appName: string, data: Partial<InsertAppUsage>): Promise<AppUsage> {
    const existing = this.topApps.get(appName);
    if (existing) {
      const updated = { ...existing, ...data, lastUpdated: new Date() };
      this.topApps.set(appName, updated);
      return updated;
    }

    const newApp: AppUsage = {
      id: this.currentId++,
      appName,
      category: data.category || "Other",
      iconClass: data.iconClass || "fas fa-mobile-alt",
      usageMB: data.usageMB || 0,
      percentage: data.percentage || 0,
      lastUpdated: new Date(),
    };
    
    this.topApps.set(appName, newApp);
    return newApp;
  }

  async getRealtimeData(limit: number = 20): Promise<RealtimeData[]> {
    return this.realtimeDataPoints
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  async addRealtimeData(data: InsertRealtimeData): Promise<RealtimeData> {
    const newData: RealtimeData = {
      id: this.currentId++,
      timestamp: new Date(),
      usageMB: data.usageMB,
      speedMBPS: data.speedMBPS ?? null,
    };
    
    this.realtimeDataPoints.push(newData);
    
    // Keep only last 100 data points
    if (this.realtimeDataPoints.length > 100) {
      this.realtimeDataPoints = this.realtimeDataPoints.slice(-100);
    }
    
    return newData;
  }

  async getUserSettings(): Promise<UserSettings> {
    return this.settings;
  }

  async updateUserSettings(data: Partial<InsertUserSettings>): Promise<UserSettings> {
    this.settings = { ...this.settings, ...data };
    return this.settings;
  }

  async getDailyUsageHistory(days: number = 30): Promise<DailyUsageHistory[]> {
    return this.dailyHistory
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, days);
  }

  async addDailyUsageHistory(data: InsertDailyUsageHistory): Promise<DailyUsageHistory> {
    const newEntry: DailyUsageHistory = {
      id: this.currentId++,
      ...data,
    };
    this.dailyHistory.push(newEntry);
    return newEntry;
  }

  async getUsagePrediction(): Promise<UsagePrediction> {
    const history = await this.getDailyUsageHistory(30);
    const currentUsage = await this.getCurrentUsage();
    const settings = await this.getUserSettings();
    
    if (!currentUsage || history.length < 3) {
      return {
        projectedRunOutDate: null,
        daysUntilRunOut: null,
        dailyAverageUsage: 0,
        recommendedDailyLimit: settings.dataLimitMB / 30,
        paceStatus: 'on-track',
        pacePercentage: 0,
        anomalyDetected: false,
        anomalyMessage: null,
      };
    }

    // Calculate daily average from history (exclude today)
    const historyExcludingToday = history.slice(1);
    const totalHistoricalUsage = historyExcludingToday.reduce((sum, day) => sum + day.usageMB, 0);
    const dailyAverageUsage = totalHistoricalUsage / historyExcludingToday.length;

    // Calculate remaining data and days in billing cycle
    const remainingData = settings.dataLimitMB - currentUsage.usedMB;
    const today = new Date();
    const daysInMonth = 30;
    const dayOfMonth = today.getDate();
    const daysRemainingInCycle = Math.max(1, daysInMonth - dayOfMonth + 1);

    // Calculate recommended daily limit based on remaining data and days
    // Clamp to minimum of 0 when quota is exceeded
    const recommendedDailyLimit = Math.max(0, remainingData / daysRemainingInCycle);

    // Project run out date based on current average
    let daysUntilRunOut: number | null = null;
    let projectedRunOutDate: string | null = null;

    if (dailyAverageUsage > 0) {
      daysUntilRunOut = Math.floor(remainingData / dailyAverageUsage);
      if (daysUntilRunOut > 0) {
        const runOutDate = new Date();
        runOutDate.setDate(runOutDate.getDate() + daysUntilRunOut);
        projectedRunOutDate = runOutDate.toISOString().split('T')[0];
      } else {
        projectedRunOutDate = "Data limit exceeded";
        daysUntilRunOut = 0;
      }
    }

    // Calculate pace - compare actual vs expected usage
    const expectedUsageAtThisPoint = (dayOfMonth / daysInMonth) * settings.dataLimitMB;
    const pacePercentage = ((currentUsage.usedMB - expectedUsageAtThisPoint) / expectedUsageAtThisPoint) * 100;
    
    let paceStatus: 'on-track' | 'over-pace' | 'under-pace';
    if (pacePercentage > 10) {
      paceStatus = 'over-pace';
    } else if (pacePercentage < -10) {
      paceStatus = 'under-pace';
    } else {
      paceStatus = 'on-track';
    }

    // Anomaly detection - check if today's or yesterday's usage is significantly higher than average
    let anomalyDetected = false;
    let anomalyMessage: string | null = null;

    if (history.length >= 7) {
      // Calculate average of last 7 days excluding most recent day
      const recentHistory = history.slice(1, 8);
      const recentAverage = recentHistory.reduce((sum, day) => sum + day.usageMB, 0) / recentHistory.length;
      const stdDeviation = Math.sqrt(
        recentHistory.reduce((sum, day) => sum + Math.pow(day.usageMB - recentAverage, 2), 0) / recentHistory.length
      );

      // Check yesterday's usage (most recent full day)
      const yesterdayUsage = history[1]?.usageMB || 0;
      
      // Anomaly if usage is more than 2 standard deviations above average
      const anomalyThreshold = recentAverage + (stdDeviation * 2);
      
      if (yesterdayUsage > anomalyThreshold && yesterdayUsage > recentAverage * 1.5) {
        anomalyDetected = true;
        const percentageIncrease = Math.round(((yesterdayUsage - recentAverage) / recentAverage) * 100);
        anomalyMessage = `Yesterday's usage (${Math.round(yesterdayUsage)} MB) was ${percentageIncrease}% higher than your average (${Math.round(recentAverage)} MB)`;
      }
    }

    return {
      projectedRunOutDate,
      daysUntilRunOut,
      dailyAverageUsage: Math.round(dailyAverageUsage),
      recommendedDailyLimit: Math.round(recommendedDailyLimit),
      paceStatus,
      pacePercentage: Math.round(pacePercentage),
      anomalyDetected,
      anomalyMessage,
    };
  }
}

export const storage = new MemStorage();
