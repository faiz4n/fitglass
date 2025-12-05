"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { useFitnessStore } from "@/lib/fitness-store"
import { Button } from "@/components/ui/button"
import { Flame, Drumstick, Footprints, Zap, Save, X, ChevronLeft, ChevronRight, CalendarDays } from "lucide-react"
import { cn } from "@/lib/utils"
import { AppHeader } from "@/components/ui/app-header"

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
  
  // Reset date to today when component unmounts
  useEffect(() => {
    return () => {
      setSelectedDate(new Date().toISOString().split("T")[0])
    }
  }, [setSelectedDate])

  const handleSave = () => {
    updateLogForDate(selectedDate, { calories, protein, steps, hiit })
    setSelectedDate(new Date().toISOString().split("T")[0])
    setCurrentView("home")
  }

  const handleClose = () => {
    setSelectedDate(new Date().toISOString().split("T")[0])
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

  const handleInputChange = (value: string, field: "calories" | "protein" | "steps") => {
    const numValue = value === "" ? 0 : Number.parseInt(value)
    if (isNaN(numValue)) return

    if (field === "calories") setCalories(numValue)
    if (field === "protein") setProtein(numValue)
    if (field === "steps") setSteps(numValue)
  }

  return (
    <div className="min-h-screen pb-24 relative z-10">
      {/* Header */}
      <AppHeader title="Log Entry" subtitle="Track your daily intake">
        <button
          onClick={handleClose}
          className="p-2 rounded-full hover:bg-muted/20 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </AppHeader>

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
          onClick={() => setActiveInput("calories")}
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/20 border border-primary/30">
              <Flame className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">Calories Consumed</p>
              <div className="flex items-baseline gap-2">
                <input
                  type="number"
                  inputMode="decimal"
                  value={calories || ""}
                  onChange={(e) => handleInputChange(e.target.value, "calories")}
                  placeholder="0"
                  className={cn(
                    "bg-transparent border-none p-0 text-2xl font-bold focus:outline-none focus:ring-0 w-24",
                    activeInput === "calories" && "text-primary",
                  )}
                  onFocus={() => setActiveInput("calories")}
                />
                <span className="text-lg text-muted-foreground font-normal">kcal</span>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Protein Input */}
        <GlassCard
          variant={activeInput === "protein" ? "highlight" : "default"}
          className="cursor-pointer transition-all"
          onClick={() => setActiveInput("protein")}
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/20 border border-primary/30">
              <Drumstick className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">Protein Intake</p>
              <div className="flex items-baseline gap-2">
                <input
                  type="number"
                  inputMode="decimal"
                  value={protein || ""}
                  onChange={(e) => handleInputChange(e.target.value, "protein")}
                  placeholder="0"
                  className={cn(
                    "bg-transparent border-none p-0 text-2xl font-bold focus:outline-none focus:ring-0 w-24",
                    activeInput === "protein" && "text-primary",
                  )}
                  onFocus={() => setActiveInput("protein")}
                />
                <span className="text-lg text-muted-foreground font-normal">/ {profile.proteinGoal}g</span>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Steps Input */}
        <GlassCard
          variant={activeInput === "steps" ? "highlight" : "default"}
          className="cursor-pointer transition-all"
          onClick={() => setActiveInput("steps")}
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/20 border border-primary/30">
              <Footprints className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">Steps Count</p>
              <div className="flex items-baseline gap-2">
                <input
                  type="number"
                  inputMode="decimal"
                  value={steps || ""}
                  onChange={(e) => handleInputChange(e.target.value, "steps")}
                  placeholder="0"
                  className={cn(
                    "bg-transparent border-none p-0 text-2xl font-bold focus:outline-none focus:ring-0 w-32",
                    activeInput === "steps" && "text-primary",
                  )}
                  onFocus={() => setActiveInput("steps")}
                />
                <span className="text-lg text-muted-foreground font-normal">
                  / {(profile.stepGoal / 1000).toFixed(0)}k
                </span>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* HIIT Toggle */}
        {profile.hiitEnabled && (
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
                  <p className="text-sm text-muted-foreground">{profile.hiitDuration}-Minute HIIT</p>
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
        )}

        {/* Spacing for keyboard */}
        <div className="h-48 lg:hidden" />

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
