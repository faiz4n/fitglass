"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { useFitnessStore } from "@/lib/fitness-store"
import { Button } from "@/components/ui/button"
import { Flame, Drumstick, Footprints, Zap, Save, X, ChevronLeft, ChevronRight, CalendarDays } from "lucide-react"
import { cn } from "@/lib/utils"

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])
  return isMobile
}

function formatDateDisplay(dateStr: string): string {
  const date = new Date(dateStr)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const todayStr = today.toISOString().split("T")[0]
  const yesterdayStr = yesterday.toISOString().split("T")[0]

  if (dateStr === todayStr) return "Today"
  if (dateStr === yesterdayStr) return "Yesterday"
  return date.toLocaleDateString("en", { weekday: "short", month: "short", day: "numeric" })
}

export function DailyInput() {
  const { profile, selectedDate, setSelectedDate, getLogForDate, updateLogForDate, setCurrentView } = useFitnessStore()
  const currentLog = getLogForDate(selectedDate)
  const isMobile = useIsMobile()

  const [calories, setCalories] = useState(currentLog?.calories || 0)
  const [protein, setProtein] = useState(currentLog?.protein || 0)
  const [steps, setSteps] = useState(currentLog?.steps || 0)
  const [hiit, setHiit] = useState(currentLog?.hiit || false)
  const [activeInput, setActiveInput] = useState<"calories" | "protein" | "steps" | null>(null)

  useEffect(() => {
    const log = getLogForDate(selectedDate)
    if (log) {
      setCalories(log.calories)
      setProtein(log.protein)
      setSteps(log.steps)
      setHiit(log.hiit)
    } else {
      setCalories(0)
      setProtein(0)
      setSteps(0)
      setHiit(false)
    }
  }, [selectedDate, getLogForDate])

  const handleSave = () => {
    updateLogForDate(selectedDate, { calories, protein, steps, hiit })
    setCurrentView("home")
  }

  const goToPreviousDay = () => {
    const date = new Date(selectedDate)
    date.setDate(date.getDate() - 1)
    setSelectedDate(date.toISOString().split("T")[0])
  }

  const goToNextDay = () => {
    const date = new Date(selectedDate)
    const today = new Date()
    date.setDate(date.getDate() + 1)
    // Don't allow future dates beyond today
    if (date <= today) {
      setSelectedDate(date.toISOString().split("T")[0])
    }
  }

  const goToToday = () => {
    setSelectedDate(new Date().toISOString().split("T")[0])
  }

  const isToday = selectedDate === new Date().toISOString().split("T")[0]

  const numpadKeys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "⌫"]

  const handleNumpadClick = (key: string) => {
    if (!activeInput) return

    const setter = activeInput === "calories" ? setCalories : activeInput === "protein" ? setProtein : setSteps
    const current = activeInput === "calories" ? calories : activeInput === "protein" ? protein : steps

    if (key === "C") {
      setter(0)
    } else if (key === "⌫") {
      setter(Math.floor(current / 10))
    } else {
      const newValue = current * 10 + Number.parseInt(key)
      const maxValue = activeInput === "calories" ? 10000 : activeInput === "protein" ? 500 : 100000
      if (newValue <= maxValue) {
        setter(newValue)
      }
    }
  }

  const handleDesktopInputChange = (field: "calories" | "protein" | "steps", value: string) => {
    const numValue = Number.parseInt(value) || 0
    const maxValue = field === "calories" ? 10000 : field === "protein" ? 500 : 100000
    const clampedValue = Math.min(numValue, maxValue)
    if (field === "calories") setCalories(clampedValue)
    else if (field === "protein") setProtein(clampedValue)
    else setSteps(clampedValue)
  }

  const inputClass =
    "w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-foreground text-2xl font-bold text-right focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"

  return (
    <div className="min-h-screen pb-24 relative z-10">
      {/* Header */}
      <header className="px-5 pt-12 pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Log Entry</h1>
          <p className="text-sm text-muted-foreground">Track your daily intake</p>
        </div>
        <button
          onClick={() => setCurrentView("home")}
          className="p-2 rounded-xl bg-muted/30 border border-border hover:bg-muted/50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      <div className="px-5 space-y-4">
        <GlassCard className="animate-slide-up">
          <div className="flex items-center justify-between">
            <button
              onClick={goToPreviousDay}
              className="p-2 rounded-xl bg-muted/30 border border-border hover:bg-muted/50 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-primary" />
                <span className="font-semibold text-lg">{formatDateDisplay(selectedDate)}</span>
              </div>
              {!isToday && (
                <button onClick={goToToday} className="text-xs text-primary hover:underline">
                  Go to Today
                </button>
              )}
            </div>

            <button
              onClick={goToNextDay}
              disabled={isToday}
              className={cn(
                "p-2 rounded-xl bg-muted/30 border border-border transition-colors",
                isToday ? "opacity-30 cursor-not-allowed" : "hover:bg-muted/50",
              )}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </GlassCard>

        {/* Calories Input */}
        <GlassCard
          variant={activeInput === "calories" ? "highlight" : "default"}
          className="cursor-pointer transition-all"
          onClick={() => isMobile && setActiveInput("calories")}
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/20 border border-primary/30">
              <Flame className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Calories Consumed</p>
              {isMobile ? (
                <p className={cn("text-3xl font-bold transition-all", activeInput === "calories" && "text-primary")}>
                  {calories} <span className="text-lg text-muted-foreground font-normal">kcal</span>
                </p>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={calories || ""}
                    onChange={(e) => handleDesktopInputChange("calories", e.target.value)}
                    placeholder="0"
                    className={inputClass}
                  />
                  <span className="text-lg text-muted-foreground font-normal">kcal</span>
                </div>
              )}
            </div>
          </div>
        </GlassCard>

        {/* Protein Input */}
        <GlassCard
          variant={activeInput === "protein" ? "highlight" : "default"}
          className="cursor-pointer transition-all"
          onClick={() => isMobile && setActiveInput("protein")}
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-accent/20 border border-accent/30">
              <Drumstick className="w-6 h-6 text-accent" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Protein Intake</p>
              {isMobile ? (
                <p className={cn("text-3xl font-bold transition-all", activeInput === "protein" && "text-accent")}>
                  {protein} <span className="text-lg text-muted-foreground font-normal">/ {profile.proteinGoal}g</span>
                </p>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={protein || ""}
                    onChange={(e) => handleDesktopInputChange("protein", e.target.value)}
                    placeholder="0"
                    className={inputClass}
                  />
                  <span className="text-lg text-muted-foreground font-normal">/ {profile.proteinGoal}g</span>
                </div>
              )}
            </div>
          </div>
        </GlassCard>

        {/* Steps Input */}
        <GlassCard
          variant={activeInput === "steps" ? "highlight" : "default"}
          className="cursor-pointer transition-all"
          onClick={() => isMobile && setActiveInput("steps")}
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-chart-4/20 border border-chart-4/30">
              <Footprints className="w-6 h-6 text-chart-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Steps Count</p>
              {isMobile ? (
                <p className={cn("text-3xl font-bold transition-all", activeInput === "steps" && "text-chart-4")}>
                  {steps.toLocaleString()}{" "}
                  <span className="text-lg text-muted-foreground font-normal">
                    / {(profile.stepGoal / 1000).toFixed(0)}k
                  </span>
                </p>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={steps || ""}
                    onChange={(e) => handleDesktopInputChange("steps", e.target.value)}
                    placeholder="0"
                    className={inputClass}
                  />
                  <span className="text-lg text-muted-foreground font-normal">
                    / {(profile.stepGoal / 1000).toFixed(0)}k
                  </span>
                </div>
              )}
            </div>
          </div>
        </GlassCard>

        {/* HIIT Toggle */}
        <GlassCard
          variant={hiit ? "highlight" : "default"}
          className={cn("cursor-pointer transition-all", hiit && "animate-pulse-soft")}
          onClick={() => setHiit(!hiit)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "p-3 rounded-xl transition-colors border",
                  hiit ? "bg-primary/30 border-primary/30" : "bg-muted/30 border-border",
                )}
              >
                <Zap className={cn("w-6 h-6 transition-colors", hiit ? "text-primary" : "text-muted-foreground")} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">5-Minute HIIT</p>
                <p className="font-medium">Did you complete your workout?</p>
              </div>
            </div>
            <div
              className={cn(
                "w-14 h-8 rounded-full p-1 transition-all duration-300 border",
                hiit ? "bg-primary border-primary/50" : "bg-muted/50 border-border",
              )}
            >
              <div
                className={cn(
                  "w-6 h-6 rounded-full bg-foreground transition-transform duration-300",
                  hiit && "translate-x-6",
                )}
              />
            </div>
          </div>
        </GlassCard>

        {isMobile && activeInput && (
          <GlassCard variant="strong" className="animate-slide-up">
            <div className="grid grid-cols-3 gap-3">
              {numpadKeys.map((key) => (
                <button
                  key={key}
                  onClick={() => handleNumpadClick(key)}
                  className={cn(
                    "h-14 rounded-xl font-bold text-xl transition-all border border-border",
                    "bg-muted/30 hover:bg-muted/50 active:scale-95",
                    key === "C" && "text-destructive",
                    key === "⌫" && "text-warning",
                  )}
                >
                  {key}
                </button>
              ))}
            </div>
          </GlassCard>
        )}

        {/* Save Button */}
        <Button
          onClick={handleSave}
          className="w-full h-14 text-lg font-semibold rounded-2xl bg-primary hover:bg-primary/90 transition-all active:scale-[0.98]"
        >
          <Save className="w-5 h-5 mr-2" />
          Save {formatDateDisplay(selectedDate)}
        </Button>
      </div>
    </div>
  )
}
