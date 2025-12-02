import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Minus, Calendar, Target, AlertTriangle } from "lucide-react";
import type { UsagePrediction } from "@shared/schema";

export default function UsagePredictions() {
  const { data: predictions, isLoading } = useQuery<UsagePrediction>({
    queryKey: ["/api/predictions"],
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
      </Card>
    );
  }

  if (!predictions) {
    return null;
  }

  const getPaceIcon = () => {
    switch (predictions.paceStatus) {
      case 'over-pace':
        return <TrendingUp className="h-5 w-5 text-red-500" />;
      case 'under-pace':
        return <TrendingDown className="h-5 w-5 text-green-500" />;
      default:
        return <Minus className="h-5 w-5 text-blue-500" />;
    }
  };

  const getPaceColor = () => {
    switch (predictions.paceStatus) {
      case 'over-pace':
        return 'text-red-500';
      case 'under-pace':
        return 'text-green-500';
      default:
        return 'text-blue-500';
    }
  };

  const getPaceText = () => {
    switch (predictions.paceStatus) {
      case 'over-pace':
        return 'Over pace';
      case 'under-pace':
        return 'Under pace';
      default:
        return 'On track';
    }
  };

  const getPaceDescription = () => {
    const absPercentage = Math.abs(predictions.pacePercentage);
    switch (predictions.paceStatus) {
      case 'over-pace':
        return `You're using ${absPercentage}% more data than expected`;
      case 'under-pace':
        return `You're using ${absPercentage}% less data than expected`;
      default:
        return 'Your usage is aligned with your monthly limit';
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr || dateStr === "Data limit exceeded") {
      return dateStr || "N/A";
    }
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Card data-testid="predictions-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Usage Forecast
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3" data-testid="run-out-date">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs mb-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>Runs out on</span>
            </div>
            <div className="text-lg font-semibold">
              {predictions.projectedRunOutDate === "Data limit exceeded" ? (
                <span className="text-red-500">Exceeded!</span>
              ) : (
                formatDate(predictions.projectedRunOutDate)
              )}
            </div>
            {predictions.daysUntilRunOut !== null && predictions.daysUntilRunOut > 0 && (
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {predictions.daysUntilRunOut} days left
              </div>
            )}
          </div>

          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3" data-testid="daily-recommendation">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs mb-1">
              <Target className="h-3.5 w-3.5" />
              <span>Daily budget</span>
            </div>
            {predictions.recommendedDailyLimit === 0 ? (
              <>
                <div className="text-lg font-semibold text-red-500">
                  0 MB
                </div>
                <div className="text-xs text-red-500">
                  Limit exceeded
                </div>
              </>
            ) : (
              <>
                <div className="text-lg font-semibold text-primary">
                  {predictions.recommendedDailyLimit} MB
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  To stay within limit
                </div>
              </>
            )}
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3" data-testid="pace-status">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {getPaceIcon()}
              <span className={`font-semibold ${getPaceColor()}`}>
                {getPaceText()}
              </span>
            </div>
            <span className={`text-sm font-medium ${getPaceColor()}`}>
              {predictions.pacePercentage > 0 ? '+' : ''}{predictions.pacePercentage}%
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {getPaceDescription()}
          </p>
          <div className="mt-2">
            <Progress 
              value={Math.min(100, Math.max(0, 50 + predictions.pacePercentage / 2))} 
              className="h-2"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>Under</span>
              <span>On track</span>
              <span>Over</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 pt-2 border-t">
          <span>Your daily average</span>
          <span className="font-medium text-slate-700 dark:text-slate-300">
            {predictions.dailyAverageUsage} MB
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
