"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { CircularProgress } from "@/components/ui/circular-progress"
import { ProgressBar } from "@/components/ui/progress-bar"
import { useFitnessStore } from "@/lib/fitness-store"
import { Flame, Drumstick, Footprints, Zap, Trophy, TrendingDown, TrendingUp, Route } from "lucide-react"
import { cn } from "@/lib/utils"
import { AppHeader } from "@/components/ui/app-header"

export function HomeDashboard() {
  const { profile, getTodayLog, getTotalFatLost, setCurrentView } = useFitnessStore()
  const todayLog = getTodayLog()
  const totalFatLost = getTotalFatLost()

  const calories = todayLog?.calories || 0
  const protein = todayLog?.protein || 0
  const steps = todayLog?.steps || 0
  const hiit = todayLog?.hiit || false
  const score = todayLog?.score || 0

  // Calculate burn and deficit
  const totalBurn = profile.tdee + steps * 0.035 + (hiit ? 60 : 0)
  const deficit = totalBurn - calories
  const isDeficit = deficit > 0

  const calorieScore =
    calories > 0 ? (calories >= profile.calorieGoal - 100 && calories <= profile.calorieGoal + 100 ? 30 : 25) : 0

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="min-h-screen pb-24 lg:pb-8 relative z-10">
      {/* Header */}
      <AppHeader
        title={
          <span>
            Welcome, <span className="text-primary">{profile.name}</span>
          </span>
        }
        subtitle={currentDate}
      />

      <div className="px-4 space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
        <GlassCard
          variant="highlight"
          className="animate-slide-up cursor-pointer hover:scale-[1.02] transition-transform lg:col-span-2"
          onClick={() => setCurrentView("input")}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 rounded-xl bg-primary/20 border border-primary/30">
                  <Flame className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">Calories</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">{calories}</span>
                  <span className="text-muted-foreground">consumed</span>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{Math.round(totalBurn)} burned</span>
                  </div>
                  <div
                    className={cn(
                      "flex items-center gap-1 font-medium",
                      isDeficit ? "text-success" : "text-destructive",
                    )}
                  >
                    {isDeficit ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                    <span>
                      {Math.abs(Math.round(deficit))} {isDeficit ? "deficit" : "surplus"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <CircularProgress
              value={calories}
              max={profile.calorieGoal}
              size={90}
              strokeWidth={8}
              color="var(--primary)"
            >
              <div className="text-center">
                <span className="text-lg font-bold">
                  {Math.min(Math.round((calories / profile.calorieGoal) * 100), 100)}%
                </span>
              </div>
            </CircularProgress>
          </div>
        </GlassCard>

        {/* Protein Card */}
        <GlassCard
          className="animate-slide-up cursor-pointer hover:scale-[1.02] transition-transform"
          style={{ animationDelay: "0.1s" }}
          onClick={() => setCurrentView("input")}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-1.5 rounded-xl bg-accent/20 border border-accent/30">
              <Drumstick className="w-5 h-5 text-accent" />
            </div>
            <div>
              <span className="text-sm font-medium">Protein</span>
              <p className="text-xs text-muted-foreground">Hit your protein first, then calories.</p>
            </div>
          </div>
          <ProgressBar
            value={protein}
            max={profile.proteinGoal}
            color="var(--accent)"
            label={`${protein}g / ${profile.proteinGoal}g`}
            showLabel={false}
          />
          <div className="flex justify-between mt-2 text-sm">
            <span className="text-muted-foreground">{protein}g</span>
            <span className={cn("font-medium", protein >= profile.proteinGoal ? "text-success" : "text-foreground")}>
              {protein >= profile.proteinGoal ? "Goal reached!" : `${profile.proteinGoal - protein}g to go`}
            </span>
          </div>
        </GlassCard>

        {/* Score Card */}
        <GlassCard variant="strong" className="animate-slide-up" style={{ animationDelay: "0.15s" }}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-xl bg-primary/20 border border-primary/30">
                  <Trophy className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm font-medium">Today's Score</span>
              </div>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>
                  Protein: {protein >= profile.proteinGoal ? 40 : Math.floor((protein / profile.proteinGoal) * 40)}/40
                </p>
                <p>Calories: {calorieScore}/30</p>
                <p>Steps: {steps >= profile.stepGoal ? (profile.hiitEnabled ? 20 : 30) : Math.floor((steps / profile.stepGoal) * (profile.hiitEnabled ? 20 : 30))}/{profile.hiitEnabled ? 20 : 30}</p>
                {profile.hiitEnabled && <p>HIIT: {hiit ? 10 : 0}/10</p>}
              </div>
            </div>
            <div className="text-center">
              <span
                className={cn(
                  "text-4xl font-bold",
                  score >= 80 ? "text-primary" : score >= 50 ? "text-primary/80" : "text-muted-foreground",
                )}
              >
                {score}
              </span>
              <p className="text-sm text-muted-foreground">/100</p>
            </div>
          </div>
        </GlassCard>

        {/* Steps & HIIT/Distance Row */}
        <div className="grid grid-cols-2 gap-4 lg:col-span-2">
          {/* Steps Card */}
          <GlassCard
            className="animate-slide-up cursor-pointer hover:scale-[1.02] transition-transform"
            style={{ animationDelay: "0.2s" }}
            onClick={() => setCurrentView("input")}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-xl bg-accent/20 border border-accent/30">
                <Footprints className="w-4 h-4 text-accent" />
              </div>
              <span className="text-sm font-medium">Steps</span>
            </div>
            <div className="flex justify-center">
              <CircularProgress value={steps} max={profile.stepGoal} size={70} strokeWidth={6} color="var(--accent)">
                <span className="text-sm font-bold">{(steps / 1000).toFixed(1)}k</span>
              </CircularProgress>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">
              {steps >= profile.stepGoal ? "Goal reached!" : `${((profile.stepGoal - steps) / 1000).toFixed(1)}k to go`}
            </p>
          </GlassCard>

          {/* HIIT or Distance Card */}
          {profile.hiitEnabled ? (
            <GlassCard
              variant={hiit ? "highlight" : "default"}
              className={cn(
                "animate-slide-up cursor-pointer hover:scale-[1.02] transition-transform",
                hiit && "animate-pulse-soft",
              )}
              style={{ animationDelay: "0.3s" }}
              onClick={() => setCurrentView("input")}
            >
              <div className="flex items-center gap-2 mb-3">
                <div
                  className={cn(
                    "p-1.5 rounded-xl border",
                    hiit ? "bg-primary/30 border-primary/30" : "bg-muted/30 border-border",
                  )}
                >
                  <Zap className={cn("w-4 h-4", hiit ? "text-primary" : "text-muted-foreground")} />
                </div>
                <span className="text-sm font-medium">HIIT</span>
              </div>
              <div className="flex flex-col items-center justify-center py-2">
                <span className={cn("text-2xl font-bold", hiit ? "text-primary" : "text-muted-foreground")}>
                  {hiit ? "Done!" : "Not Yet"}
                </span>
                <p className="text-xs text-muted-foreground mt-1">{profile.hiitDuration}-min workout</p>
              </div>
            </GlassCard>
          ) : (
            <GlassCard
              className="animate-slide-up cursor-pointer hover:scale-[1.02] transition-transform"
              style={{ animationDelay: "0.3s" }}
              onClick={() => setCurrentView("input")}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 rounded-xl bg-accent/20 border border-accent/30">
                  <Route className="w-4 h-4 text-accent" />
                </div>
                <span className="text-sm font-medium">Distance</span>
              </div>
              <div className="flex flex-col items-center justify-center py-2">
                <span className="text-3xl font-bold">{(steps * 0.0008).toFixed(1)}</span>
                <p className="text-xs text-muted-foreground mt-1">km estimated</p>
              </div>
            </GlassCard>
          )}
        </div>

        {/* Fat Loss Summary */}
        <GlassCard className="animate-slide-up lg:col-span-2" style={{ animationDelay: "0.5s" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Fat Lost</p>
              <p className="text-2xl font-bold text-success">{totalFatLost.toFixed(2)} kg</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">Current Fat</p>
              <p className="text-xl font-semibold">{(profile.currentFatMass - totalFatLost).toFixed(1)} kg</p>
            </div>
          </div>
          <div className="mt-3">
            <ProgressBar
              value={totalFatLost}
              max={profile.currentFatMass - profile.goalFatMass}
              color="var(--success)"
              showLabel={false}
            />
            <p className="text-xs text-muted-foreground text-center mt-2">
              {(profile.currentFatMass - profile.goalFatMass - totalFatLost).toFixed(1)} kg remaining to goal
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
