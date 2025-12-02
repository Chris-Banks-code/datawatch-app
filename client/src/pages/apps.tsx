import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Search } from "lucide-react";
import { Link } from "wouter";
import AppUsageList from "@/components/app-usage-list";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import type { AppUsage } from "@shared/schema";

export default function Apps() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: apps, isLoading } = useQuery<AppUsage[]>({
    queryKey: ["/api/apps/top"],
  });

  const filteredApps = apps?.filter(app =>
    app.appName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
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
        <h1 className="text-lg font-semibold">App Usage</h1>
      </header>

      <main className="p-4 space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search apps..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Usage Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Usage Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {apps?.length || 0}
                </div>
                <div className="text-sm text-slate-500">Total Apps</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">
                  {apps ? `${(apps.reduce((sum, app) => sum + app.usageMB, 0) / 1024).toFixed(1)} GB` : "0 GB"}
                </div>
                <div className="text-sm text-slate-500">Total Usage</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Apps List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">All Apps</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <AppUsageList apps={filteredApps} showAll={true} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
