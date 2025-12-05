"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { useFitnessStore } from "@/lib/fitness-store"
import { ArrowLeft, Flame, Drumstick, Footprints, Zap, TrendingDown, Calendar, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

function useChartColors() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Return explicit colors based on theme - bright colors for dark mode
  const isDark = mounted && resolvedTheme === "dark"

  return {
    // Grid and axis colors
    border: isDark ? "hsl(220 13% 30%)" : "hsl(220 13% 85%)",
    mutedForeground: isDark ? "hsl(220 9% 65%)" : "hsl(220 9% 46%)",
    // Tooltip colors
    popover: isDark ? "hsl(224 30% 15%)" : "hsl(0 0% 100%)",
    popoverForeground: isDark ? "hsl(0 0% 95%)" : "hsl(224 71% 4%)",
    // Chart colors - bright and visible in both modes
    primary: isDark ? "hsl(174 90% 50%)" : "hsl(174 84% 40%)",
    accent: isDark ? "hsl(280 90% 70%)" : "hsl(280 85% 55%)",
    success: isDark ? "hsl(142 80% 55%)" : "hsl(142 71% 45%)",
    warning: isDark ? "hsl(38 95% 60%)" : "hsl(38 92% 50%)",
    chart4: isDark ? "hsl(43 100% 65%)" : "hsl(43 96% 50%)",
  }
}

export function ProgressDetail() {
  const { profile, logs, setCurrentView, getTotalFatLost } = useFitnessStore()
  const totalFatLost = getTotalFatLost()
  const chartColors = useChartColors()

  // Sort logs by date descending
  const sortedLogs = [...logs].sort((a, b) => b.date.localeCompare(a.date))
  // For charts, we want ascending order
  const chartLogs = [...logs].sort((a, b) => a.date.localeCompare(b.date))

  // Calculate weekly averages
  const last7Days = sortedLogs.slice(0, 7)
  const last30Days = sortedLogs.slice(0, 30)

  const avgCalories7d = last7Days.length > 0 ? last7Days.reduce((s, l) => s + l.calories, 0) / last7Days.length : 0
  const avgProtein7d = last7Days.length > 0 ? last7Days.reduce((s, l) => s + l.protein, 0) / last7Days.length : 0
  const avgSteps7d = last7Days.length > 0 ? last7Days.reduce((s, l) => s + l.steps, 0) / last7Days.length : 0
  const hiitCount7d = last7Days.filter((l) => l.hiit).length
  const avgFatLost7d =
    last7Days.length > 0 ? (last7Days.reduce((s, l) => s + l.fatLost, 0) / last7Days.length) * 1000 : 0

  const avgCalories30d = last30Days.length > 0 ? last30Days.reduce((s, l) => s + l.calories, 0) / last30Days.length : 0
  const avgProtein30d = last30Days.length > 0 ? last30Days.reduce((s, l) => s + l.protein, 0) / last30Days.length : 0
  const avgSteps30d = last30Days.length > 0 ? last30Days.reduce((s, l) => s + l.steps, 0) / last30Days.length : 0
  const hiitCount30d = last30Days.filter((l) => l.hiit).length
  const avgFatLost30d =
    last30Days.length > 0 ? (last30Days.reduce((s, l) => s + l.fatLost, 0) / last30Days.length) * 1000 : 0

  // Max values for bar scaling
  const maxCalories = Math.max(...logs.map((l) => l.calories), profile.calorieGoal)
  const maxProtein = Math.max(...logs.map((l) => l.protein), profile.proteinGoal)
  const maxSteps = Math.max(...logs.map((l) => l.steps), profile.stepGoal)

  const chartData = chartLogs.slice(-30).map((log) => ({
    date: new Date(log.date).toLocaleDateString("en", { month: "short", day: "numeric" }),
    calories: log.calories,
    protein: log.protein,
    steps: log.steps,
    fatLost: Math.round(log.fatLost * 1000),
    score: log.score,
    calorieGoal: profile.calorieGoal,
    proteinGoal: profile.proteinGoal,
    stepGoal: profile.stepGoal,
  }))

  let cumulativeFat = 0
  const fatTrendData = chartLogs.map((log) => {
    cumulativeFat += log.fatLost
    return {
      date: new Date(log.date).toLocaleDateString("en", { month: "short", day: "numeric" }),
      fatLost: Math.round(cumulativeFat * 1000),
    }
  })

  const tooltipStyle = {
    backgroundColor: chartColors.popover,
    color: chartColors.popoverForeground,
    border: `1px solid ${chartColors.border}`,
    borderRadius: "8px",
  }

  return (
    <div className="min-h-screen pb-24 relative z-10">
      {/* Header */}
      <header className="px-5 pt-12 pb-6 flex items-center gap-4">
        <button
          onClick={() => setCurrentView("progress")}
          className="p-2 rounded-xl bg-muted/30 border border-border hover:bg-muted/50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold">Detailed Progress</h1>
          <p className="text-sm text-muted-foreground">In-depth analytics</p>
        </div>
      </header>

      <div className="px-5 space-y-4">
        {/* Summary Stats */}
        <GlassCard variant="highlight" className="animate-slide-up">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-success/20 border border-success/30">
              <TrendingDown className="w-5 h-5 text-success" />
            </div>
            <span className="font-semibold">Overall Summary</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-muted/20 border border-border">
              <p className="text-3xl font-bold text-success">{totalFatLost.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">Total kg lost</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/20 border border-border">
              <p className="text-3xl font-bold">{logs.length}</p>
              <p className="text-sm text-muted-foreground">Days tracked</p>
            </div>
          </div>
        </GlassCard>

        {fatTrendData.length > 1 && (
          <GlassCard className="animate-slide-up" style={{ animationDelay: "0.05s" }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-success/20 border border-success/30">
                <BarChart3 className="w-5 h-5 text-success" />
              </div>
              <span className="font-semibold">Cumulative Fat Loss (grams)</span>
            </div>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={fatTrendData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="fatGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartColors.success} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={chartColors.success} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.border} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10, fill: chartColors.mutedForeground }}
                    stroke={chartColors.border}
                  />
                  <YAxis tick={{ fontSize: 10, fill: chartColors.mutedForeground }} stroke={chartColors.border} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area
                    type="monotone"
                    dataKey="fatLost"
                    stroke={chartColors.success}
                    fill="url(#fatGradient)"
                    strokeWidth={2}
                    name="Total Fat Lost (g)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        )}

        {chartData.length > 1 && (
          <GlassCard className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-primary/20 border border-primary/30">
                <Flame className="w-5 h-5 text-primary" />
              </div>
              <span className="font-semibold">Calories Trend</span>
            </div>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.border} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10, fill: chartColors.mutedForeground }}
                    stroke={chartColors.border}
                  />
                  <YAxis tick={{ fontSize: 10, fill: chartColors.mutedForeground }} stroke={chartColors.border} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ color: chartColors.mutedForeground }} />
                  <Line
                    type="monotone"
                    dataKey="calories"
                    stroke={chartColors.primary}
                    strokeWidth={2}
                    dot={{ r: 3, fill: chartColors.primary }}
                    name="Calories"
                  />
                  <Line
                    type="monotone"
                    dataKey="calorieGoal"
                    stroke={chartColors.mutedForeground}
                    strokeWidth={1}
                    strokeDasharray="5 5"
                    dot={false}
                    name="Goal"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        )}

        {chartData.length > 1 && (
          <GlassCard className="animate-slide-up" style={{ animationDelay: "0.15s" }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-accent/20 border border-accent/30">
                <Drumstick className="w-5 h-5 text-accent" />
              </div>
              <span className="font-semibold">Protein Trend</span>
            </div>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.border} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10, fill: chartColors.mutedForeground }}
                    stroke={chartColors.border}
                  />
                  <YAxis tick={{ fontSize: 10, fill: chartColors.mutedForeground }} stroke={chartColors.border} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ color: chartColors.mutedForeground }} />
                  <Bar dataKey="protein" fill={chartColors.accent} name="Protein (g)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        )}

        {chartData.length > 1 && (
          <GlassCard className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-chart-4/20 border border-chart-4/30">
                <Footprints className="w-5 h-5 text-chart-4" />
              </div>
              <span className="font-semibold">Steps Trend</span>
            </div>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="stepsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartColors.chart4} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={chartColors.chart4} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.border} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10, fill: chartColors.mutedForeground }}
                    stroke={chartColors.border}
                  />
                  <YAxis tick={{ fontSize: 10, fill: chartColors.mutedForeground }} stroke={chartColors.border} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ color: chartColors.mutedForeground }} />
                  <Area
                    type="monotone"
                    dataKey="steps"
                    stroke={chartColors.chart4}
                    fill="url(#stepsGradient)"
                    strokeWidth={2}
                    name="Steps"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        )}

        {chartData.length > 1 && (
          <GlassCard className="animate-slide-up" style={{ animationDelay: "0.25s" }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-warning/20 border border-warning/30">
                <Zap className="w-5 h-5 text-warning" />
              </div>
              <span className="font-semibold">Daily Score Trend</span>
            </div>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.border} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10, fill: chartColors.mutedForeground }}
                    stroke={chartColors.border}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: chartColors.mutedForeground }}
                    domain={[0, 100]}
                    stroke={chartColors.border}
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke={chartColors.warning}
                    strokeWidth={2}
                    dot={{ r: 3, fill: chartColors.warning }}
                    name="Score"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        )}

        {/* 7 Day Averages */}
        <GlassCard className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-primary/20 border border-primary/30">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <span className="font-semibold">Last 7 Days Average</span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="p-3 rounded-xl bg-muted/20 border border-border text-center">
              <Flame className="w-4 h-4 mx-auto mb-1 text-primary" />
              <p className="text-xl font-bold">{Math.round(avgCalories7d)}</p>
              <p className="text-xs text-muted-foreground">kcal</p>
            </div>
            <div className="p-3 rounded-xl bg-muted/20 border border-border text-center">
              <Drumstick className="w-4 h-4 mx-auto mb-1 text-accent" />
              <p className="text-xl font-bold">{Math.round(avgProtein7d)}g</p>
              <p className="text-xs text-muted-foreground">protein</p>
            </div>
            <div className="p-3 rounded-xl bg-muted/20 border border-border text-center">
              <Footprints className="w-4 h-4 mx-auto mb-1 text-chart-4" />
              <p className="text-xl font-bold">{Math.round(avgSteps7d).toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">steps</p>
            </div>
            <div className="p-3 rounded-xl bg-muted/20 border border-border text-center">
              <Zap className="w-4 h-4 mx-auto mb-1 text-warning" />
              <p className="text-xl font-bold">{hiitCount7d}/7</p>
              <p className="text-xs text-muted-foreground">HIIT</p>
            </div>
            <div className="p-3 rounded-xl bg-muted/20 border border-border text-center col-span-2 lg:col-span-1">
              <TrendingDown className="w-4 h-4 mx-auto mb-1 text-success" />
              <p className="text-xl font-bold">{avgFatLost7d.toFixed(0)}g</p>
              <p className="text-xs text-muted-foreground">fat/day</p>
            </div>
          </div>
        </GlassCard>

        {/* 30 Day Averages */}
        <GlassCard className="animate-slide-up" style={{ animationDelay: "0.35s" }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-accent/20 border border-accent/30">
              <Calendar className="w-5 h-5 text-accent" />
            </div>
            <span className="font-semibold">Last 30 Days Average</span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="p-3 rounded-xl bg-muted/20 border border-border text-center">
              <Flame className="w-4 h-4 mx-auto mb-1 text-primary" />
              <p className="text-xl font-bold">{Math.round(avgCalories30d)}</p>
              <p className="text-xs text-muted-foreground">kcal</p>
            </div>
            <div className="p-3 rounded-xl bg-muted/20 border border-border text-center">
              <Drumstick className="w-4 h-4 mx-auto mb-1 text-accent" />
              <p className="text-xl font-bold">{Math.round(avgProtein30d)}g</p>
              <p className="text-xs text-muted-foreground">protein</p>
            </div>
            <div className="p-3 rounded-xl bg-muted/20 border border-border text-center">
              <Footprints className="w-4 h-4 mx-auto mb-1 text-chart-4" />
              <p className="text-xl font-bold">{Math.round(avgSteps30d).toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">steps</p>
            </div>
            <div className="p-3 rounded-xl bg-muted/20 border border-border text-center">
              <Zap className="w-4 h-4 mx-auto mb-1 text-warning" />
              <p className="text-xl font-bold">{hiitCount30d}/30</p>
              <p className="text-xs text-muted-foreground">HIIT</p>
            </div>
            <div className="p-3 rounded-xl bg-muted/20 border border-border text-center col-span-2 lg:col-span-1">
              <TrendingDown className="w-4 h-4 mx-auto mb-1 text-success" />
              <p className="text-xl font-bold">{avgFatLost30d.toFixed(0)}g</p>
              <p className="text-xs text-muted-foreground">fat/day</p>
            </div>
          </div>
        </GlassCard>

        {/* Daily Breakdown */}
        <GlassCard className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-chart-4/20 border border-chart-4/30">
              <Calendar className="w-5 h-5 text-chart-4" />
            </div>
            <span className="font-semibold">Daily Breakdown</span>
          </div>

          {sortedLogs.length > 0 ? (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {sortedLogs.map((log, i) => {
                const date = new Date(log.date)
                const isCalorieGood = log.calories <= profile.calorieGoal + 100
                const isProteinGood = log.protein >= profile.proteinGoal
                const isStepsGood = log.steps >= profile.stepGoal

                return (
                  <div
                    key={log.date}
                    className="p-4 rounded-xl bg-muted/20 border border-border animate-slide-up"
                    style={{ animationDelay: `${0.45 + i * 0.02}s` }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-semibold">
                          {date.toLocaleDateString("en", { weekday: "short", month: "short", day: "numeric" })}
                        </p>
                        <p className="text-xs text-muted-foreground">Score: {log.score}/100</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {log.hiit && (
                          <div className="p-1.5 rounded-lg bg-warning/20 border border-warning/30">
                            <Zap className="w-4 h-4 text-warning" />
                          </div>
                        )}
                        <div className="text-right">
                          <p className="text-sm font-semibold text-success">-{(log.fatLost * 1000).toFixed(0)}g</p>
                          <p className="text-xs text-muted-foreground">fat</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-sm">
                      <div
                        className={cn(
                          "p-2 rounded-lg border",
                          isCalorieGood ? "bg-success/10 border-success/30" : "bg-destructive/10 border-destructive/30",
                        )}
                      >
                        <p className={cn("font-semibold", isCalorieGood ? "text-success" : "text-destructive")}>
                          {log.calories}
                        </p>
                        <p className="text-xs text-muted-foreground">kcal</p>
                      </div>
                      <div
                        className={cn(
                          "p-2 rounded-lg border",
                          isProteinGood ? "bg-success/10 border-success/30" : "bg-destructive/10 border-destructive/30",
                        )}
                      >
                        <p className={cn("font-semibold", isProteinGood ? "text-success" : "text-destructive")}>
                          {log.protein}g
                        </p>
                        <p className="text-xs text-muted-foreground">protein</p>
                      </div>
                      <div
                        className={cn(
                          "p-2 rounded-lg border",
                          isStepsGood ? "bg-success/10 border-success/30" : "bg-destructive/10 border-destructive/30",
                        )}
                      >
                        <p className={cn("font-semibold", isStepsGood ? "text-success" : "text-destructive")}>
                          {log.steps.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">steps</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No logs yet</p>
              <p className="text-sm">Start tracking to see your daily breakdown</p>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  )
}
