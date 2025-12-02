import { pgTable, text, serial, integer, real, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const dataUsage = pgTable("data_usage", {
  id: serial("id").primaryKey(),
  date: timestamp("date").defaultNow().notNull(),
  usedMB: real("used_mb").notNull(),
  totalMB: real("total_mb").notNull(),
  dailyUsageMB: real("daily_usage_mb").notNull(),
});

export const dailyUsageHistory = pgTable("daily_usage_history", {
  id: serial("id").primaryKey(),
  date: timestamp("date").notNull(),
  usageMB: real("usage_mb").notNull(),
  cumulativeUsageMB: real("cumulative_usage_mb").notNull(),
});

export const appUsage = pgTable("app_usage", {
  id: serial("id").primaryKey(),
  appName: text("app_name").notNull(),
  category: text("category").notNull(),
  iconClass: text("icon_class").notNull(),
  usageMB: real("usage_mb").notNull(),
  percentage: real("percentage").notNull(),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
});

export const realtimeData = pgTable("realtime_data", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  usageMB: real("usage_mb").notNull(),
  speedMBPS: real("speed_mbps"),
});

export const userSettings = pgTable("user_settings", {
  id: serial("id").primaryKey(),
  dataLimitMB: real("data_limit_mb").notNull().default(10240), // 10GB default
  alertThreshold: real("alert_threshold").notNull().default(0.8), // 80% default
  notificationsEnabled: boolean("notifications_enabled").notNull().default(true),
});

export const insertDataUsageSchema = createInsertSchema(dataUsage).omit({
  id: true,
  date: true,
});

export const insertAppUsageSchema = createInsertSchema(appUsage).omit({
  id: true,
  lastUpdated: true,
});

export const insertRealtimeDataSchema = createInsertSchema(realtimeData).omit({
  id: true,
  timestamp: true,
});

export const insertUserSettingsSchema = createInsertSchema(userSettings).omit({
  id: true,
});

export const insertDailyUsageHistorySchema = createInsertSchema(dailyUsageHistory).omit({
  id: true,
});

export type InsertDataUsage = z.infer<typeof insertDataUsageSchema>;
export type InsertAppUsage = z.infer<typeof insertAppUsageSchema>;
export type InsertRealtimeData = z.infer<typeof insertRealtimeDataSchema>;
export type InsertUserSettings = z.infer<typeof insertUserSettingsSchema>;
export type InsertDailyUsageHistory = z.infer<typeof insertDailyUsageHistorySchema>;

export type DataUsage = typeof dataUsage.$inferSelect;
export type AppUsage = typeof appUsage.$inferSelect;
export type RealtimeData = typeof realtimeData.$inferSelect;
export type UserSettings = typeof userSettings.$inferSelect;
export type DailyUsageHistory = typeof dailyUsageHistory.$inferSelect;

export interface UsagePrediction {
  projectedRunOutDate: string | null;
  daysUntilRunOut: number | null;
  dailyAverageUsage: number;
  recommendedDailyLimit: number;
  paceStatus: 'on-track' | 'over-pace' | 'under-pace';
  pacePercentage: number;
  anomalyDetected: boolean;
  anomalyMessage: string | null;
}
