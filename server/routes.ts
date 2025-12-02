import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSettingsSchema, insertRealtimeDataSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get current data usage
  app.get("/api/usage/current", async (req, res) => {
    try {
      const usage = await storage.getCurrentUsage();
      if (!usage) {
        return res.status(404).json({ message: "No usage data found" });
      }
      res.json(usage);
    } catch (error) {
      res.status(500).json({ message: "Failed to get current usage" });
    }
  });

  // Get top apps
  app.get("/api/apps/top", async (req, res) => {
    try {
      const apps = await storage.getTopApps();
      res.json(apps);
    } catch (error) {
      res.status(500).json({ message: "Failed to get top apps" });
    }
  });

  // Get real-time data
  app.get("/api/realtime", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const data = await storage.getRealtimeData(limit);
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to get real-time data" });
    }
  });

  // Add real-time data point (simulates real-time updates)
  app.post("/api/realtime", async (req, res) => {
    try {
      const validatedData = insertRealtimeDataSchema.parse(req.body);
      const newData = await storage.addRealtimeData(validatedData);
      res.json(newData);
    } catch (error) {
      res.status(400).json({ message: "Invalid real-time data" });
    }
  });

  // Get user settings
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getUserSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user settings" });
    }
  });

  // Update user settings
  app.patch("/api/settings", async (req, res) => {
    try {
      const validatedData = insertUserSettingsSchema.partial().parse(req.body);
      const updatedSettings = await storage.updateUserSettings(validatedData);
      res.json(updatedSettings);
    } catch (error) {
      res.status(400).json({ message: "Invalid settings data" });
    }
  });

  // Simulate real-time data generation
  app.post("/api/simulate", async (req, res) => {
    try {
      // Generate a new real-time data point
      const usageMB = Math.random() * 50 + 10;
      const speedMBPS = Math.random() * 20 + 5;
      
      const newData = await storage.addRealtimeData({
        usageMB,
        speedMBPS,
      });
      
      res.json(newData);
    } catch (error) {
      res.status(500).json({ message: "Failed to simulate data" });
    }
  });

  // Get usage predictions and anomaly detection
  app.get("/api/predictions", async (req, res) => {
    try {
      const predictions = await storage.getUsagePrediction();
      res.json(predictions);
    } catch (error) {
      res.status(500).json({ message: "Failed to get predictions" });
    }
  });

  // Get daily usage history
  app.get("/api/usage/history", async (req, res) => {
    try {
      const days = parseInt(req.query.days as string) || 30;
      const history = await storage.getDailyUsageHistory(days);
      res.json(history);
    } catch (error) {
      res.status(500).json({ message: "Failed to get usage history" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
