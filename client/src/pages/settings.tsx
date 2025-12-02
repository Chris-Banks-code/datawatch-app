import { useQuery, useMutation } from "@tanstack/react-query";
import { ArrowLeft, Bell, Download, Shield, Smartphone } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useState } from "react";
import type { UserSettings } from "@shared/schema";

export default function Settings() {
  const { toast } = useToast();
  const [localSettings, setLocalSettings] = useState<Partial<UserSettings>>({});

  const { data: settings, isLoading } = useQuery<UserSettings>({
    queryKey: ["/api/settings"],
    onSuccess: (data) => {
      setLocalSettings(data);
    },
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (data: Partial<UserSettings>) => {
      const response = await apiRequest("PATCH", "/api/settings", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: "Settings saved",
        description: "Your preferences have been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    updateSettingsMutation.mutate(localSettings);
  };

  const handleExport = () => {
    // Simulate export functionality
    const exportData = {
      timestamp: new Date().toISOString(),
      settings: settings,
      exportType: "user_data",
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `datawatch-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export completed",
      description: "Your data has been exported successfully.",
    });
  };

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Header */}
      <header className="bg-primary text-white p-4 flex items-center space-x-3">
        <Link href="/">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-lg font-semibold">Settings</h1>
      </header>

      <main className="p-4 space-y-6">
        {/* Data Limit Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Data Limits</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dataLimit">Monthly Data Limit (GB)</Label>
              <Input
                id="dataLimit"
                type="number"
                value={localSettings.dataLimitMB ? (localSettings.dataLimitMB / 1024).toFixed(1) : "10"}
                onChange={(e) => {
                  const gb = parseFloat(e.target.value) || 10;
                  setLocalSettings({ ...localSettings, dataLimitMB: gb * 1024 });
                }}
                min="1"
                max="100"
                step="0.1"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Alert Threshold: {Math.round((localSettings.alertThreshold || 0.8) * 100)}%</Label>
              <Slider
                value={[localSettings.alertThreshold || 0.8]}
                onValueChange={([value]) => {
                  setLocalSettings({ ...localSettings, alertThreshold: value });
                }}
                max={1}
                min={0.1}
                step={0.05}
                className="w-full"
              />
              <div className="text-sm text-slate-500">
                Get notified when you reach this percentage of your data limit
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Notifications</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <div className="text-sm text-slate-500">
                  Receive alerts about your data usage
                </div>
              </div>
              <Switch
                checked={localSettings.notificationsEnabled ?? true}
                onCheckedChange={(checked) => {
                  setLocalSettings({ ...localSettings, notificationsEnabled: checked });
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* App Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Smartphone className="h-5 w-5" />
              <span>App Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Version</span>
                <span>1.0.0</span>
              </div>
              <div className="flex justify-between mt-2">
                <span>Last Updated</span>
                <span>July 11, 2025</span>
              </div>
              <div className="flex justify-between mt-2">
                <span>PWA Status</span>
                <span className="text-green-600">Active</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Export */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Download className="h-5 w-5" />
              <span>Data Export</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-slate-600">
                Export your usage data and settings for backup or analysis.
              </div>
              <Button onClick={handleExport} variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button 
          onClick={handleSave} 
          className="w-full"
          disabled={updateSettingsMutation.isPending}
        >
          {updateSettingsMutation.isPending ? "Saving..." : "Save Settings"}
        </Button>
      </main>
    </div>
  );
}
