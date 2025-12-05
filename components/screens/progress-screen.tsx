"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { useFitnessStore } from "@/lib/fitness-store"
import { Button } from "@/components/ui/button"
import { TrendingDown, Flame, Drumstick, Calendar, Award, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { AppHeader } from "@/components/ui/app-header"

export function ProgressScreen() {
  const { profile, getTotalFatLost, getWeeklyLogs, logs, setCurrentView } = useFitnessStore()
  const totalFatLost = getTotalFatLost()
  const weeklyLogs = getWeeklyLogs()

  const fatLossGoal = profile.currentFatMass - profile.goalFatMass
  const percentComplete = (totalFatLost / fatLossGoal) * 100
  const currentFat = profile.currentFatMass - totalFatLost

  // Calculate streaks
  const proteinStreak = logs.filter((l) => l.protein >= profile.proteinGoal).length
  const calorieStreak = logs.filter((l) => l.calories <= profile.calorieGoal + 100).length
  const hiitStreak = logs.filter((l) => l.hiit).length

  const maxCalories = Math.max(...weeklyLogs.map((l) => l.calories), profile.calorieGoal, 1)
  const maxProtein = Math.max(...weeklyLogs.map((l) => l.protein), profile.proteinGoal, 1)

  return (
    <div className="min-h-screen pb-24 relative z-10">
      {/* Header */}
      {/* Header */}
      <AppHeader title="Progress" subtitle="Track your fat loss journey" />

      <div className="px-5 space-y-4">
        {/* Fat Mass Progress Card */}
        <GlassCard variant="highlight" className="animate-slide-up">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-success/20">
              <TrendingDown className="w-5 h-5 text-success" />
            </div>
            <span className="font-semibold">Fat Mass Progress</span>
          </div>

          <div className="relative h-12 rounded-2xl bg-muted/30 overflow-hidden mb-4">
            <div
              className="absolute inset-y-0 left-0 rounded-2xl transition-all duration-1000"
              style={{
                width: `${Math.min(percentComplete, 100)}%`,
                background: "linear-gradient(90deg, var(--success), var(--primary))",
              }}
            />
            <div className="absolute inset-0 flex items-center justify-between px-4">
              <span className="text-sm font-medium z-10">{profile.currentFatMass} kg</span>
              <span className="text-sm font-medium z-10">{profile.goalFatMass} kg</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-success">{totalFatLost.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">kg lost</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{currentFat.toFixed(1)}</p>
              <p className="text-xs text-muted-foreground">kg current</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">{percentComplete.toFixed(1)}%</p>
              <p className="text-xs text-muted-foreground">complete</p>
            </div>
          </div>
        </GlassCard>

        {/* Weekly Chart */}
        <GlassCard className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-primary/20 border border-primary/30">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <span className="font-semibold">Weekly Overview</span>
          </div>

          {weeklyLogs.length > 0 ? (
            <div className="space-y-4">
              {/* Calories Chart */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Flame className="w-3 h-3" /> Calories
                  </p>
                  <p className="text-xs text-muted-foreground">Goal: {profile.calorieGoal}</p>
                </div>
                <div className="flex items-end gap-1 h-24 bg-muted/20 rounded-lg p-2">
                  {weeklyLogs.map((log, i) => {
                    const height = log.calories > 0 ? Math.max((log.calories / maxCalories) * 100, 4) : 4
                    const isOnTarget = log.calories <= profile.calorieGoal + 100 && log.calories > 0
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                        <div
                          className={cn(
                            "w-full rounded-t-md transition-all duration-500 min-h-[4px]",
                            log.calories === 0 ? "bg-muted/50" : isOnTarget ? "bg-success" : "bg-destructive/70",
                          )}
                          style={{ height: `${height}%` }}
                        />
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(log.date).toLocaleDateString("en", { weekday: "narrow" })}
                        </span>
                      </div>
                    )
                  })}
                </div>
                <div className="flex items-center justify-center gap-4 mt-2 text-[10px] text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-sm bg-success" />
                    <span>On target</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-sm bg-destructive/70" />
                    <span>Over limit</span>
                  </div>
                </div>
              </div>

              {/* Protein Chart */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Drumstick className="w-3 h-3" /> Protein
                  </p>
                  <p className="text-xs text-muted-foreground">Goal: {profile.proteinGoal}g</p>
                </div>
                <div className="flex items-end gap-1 h-24 bg-muted/20 rounded-lg p-2">
                  {weeklyLogs.map((log, i) => {
                    const height = log.protein > 0 ? Math.max((log.protein / maxProtein) * 100, 4) : 4
                    const isOnTarget = log.protein >= profile.proteinGoal
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                        <div
                          className={cn(
                            "w-full rounded-t-md transition-all duration-500 min-h-[4px]",
                            log.protein === 0 ? "bg-muted/50" : isOnTarget ? "bg-accent" : "bg-muted/50",
                          )}
                          style={{ height: `${height}%` }}
                        />
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(log.date).toLocaleDateString("en", { weekday: "narrow" })}
                        </span>
                      </div>
                    )
                  })}
                </div>
                <div className="flex items-center justify-center gap-4 mt-2 text-[10px] text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-sm bg-accent" />
                    <span>Goal met</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-sm bg-muted/50" />
                    <span>Below goal</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No data yet this week</p>
              <p className="text-sm">Start logging to see your progress!</p>
            </div>
          )}
        </GlassCard>

        {/* Streaks */}
        <GlassCard className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-warning/20">
              <Award className="w-5 h-5 text-warning" />
            </div>
            <span className="font-semibold">Achievements</span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 rounded-xl bg-accent/10">
              <p className="text-2xl font-bold text-accent">{proteinStreak}</p>
              <p className="text-xs text-muted-foreground">Protein Days</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-success/10">
              <p className="text-2xl font-bold text-success">{calorieStreak}</p>
              <p className="text-xs text-muted-foreground">Calorie Days</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-primary/10">
              <p className="text-2xl font-bold text-primary">{hiitStreak}</p>
              <p className="text-xs text-muted-foreground">HIIT Days</p>
            </div>
          </div>
        </GlassCard>

        {/* Estimated Progress */}
        <GlassCard className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <p className="text-sm text-muted-foreground mb-2">Daily Fat Loss Estimate</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-primary">
              {weeklyLogs.length > 0
                ? ((weeklyLogs.reduce((sum, l) => sum + l.fatLost, 0) / weeklyLogs.length) * 1000).toFixed(0)
                : 0}
            </span>
            <span className="text-muted-foreground">grams/day average</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            At this rate, you{"'"}ll reach your goal in approximately{" "}
            <span className="text-foreground font-medium">
              {weeklyLogs.length > 0
                ? Math.ceil(
                    (fatLossGoal - totalFatLost) /
                      (weeklyLogs.reduce((sum, l) => sum + l.fatLost, 0) / weeklyLogs.length),
                  )
                : "?"}
            </span>{" "}
            days
          </p>
        </GlassCard>

        <Button
          onClick={() => setCurrentView("progress-detail")}
          variant="outline"
          className="w-full h-14 rounded-2xl border-glass-border hover:bg-muted/30 flex items-center justify-between px-5"
        >
          <span className="font-semibold">View Detailed Progress</span>
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}
