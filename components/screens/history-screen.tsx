"use client"

import { useState } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { useFitnessStore } from "@/lib/fitness-store"
import { Flame, Drumstick, Footprints, Zap, Trophy, Trash2, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { AppHeader } from "@/components/ui/app-header"

export function HistoryScreen() {
  const { logs, profile, deleteLog } = useFitnessStore()
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const sortedLogs = [...logs].sort((a, b) => b.date.localeCompare(a.date))

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (dateStr === today.toISOString().split("T")[0]) return "Today"
    if (dateStr === yesterday.toISOString().split("T")[0]) return "Yesterday"

    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  const handleDelete = (date: string) => {
    deleteLog(date)
    setDeleteConfirm(null)
  }

  return (
    <div className="min-h-screen pb-24 relative z-10">
      {/* Header */}
      {/* Header */}
      <AppHeader title="History" subtitle={`${logs.length} days logged`} />

      <div className="px-5 space-y-3">
        {sortedLogs.length > 0 ? (
          sortedLogs.map((log, index) => (
            <GlassCard
              key={log.date}
              className="animate-slide-up relative"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-semibold">{formatDate(log.date)}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(log.date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "px-3 py-1 rounded-full text-sm font-bold",
                      log.score >= 80
                        ? "bg-success/20 text-success"
                        : log.score >= 50
                          ? "bg-warning/20 text-warning"
                          : "bg-muted/30 text-muted-foreground",
                    )}
                  >
                    {log.score}/100
                  </div>
                  <button
                    onClick={() => setDeleteConfirm(log.date)}
                    className="p-2 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    aria-label="Delete log"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div className="flex items-center gap-1.5">
                  <Flame
                    className={cn(
                      "w-4 h-4",
                      log.calories <= profile.calorieGoal + 100 ? "text-success" : "text-destructive",
                    )}
                  />
                  <span className="text-sm">{log.calories}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Drumstick
                    className={cn(
                      "w-4 h-4",
                      log.protein >= profile.proteinGoal ? "text-primary" : "text-muted-foreground",
                    )}
                  />
                  <span className="text-sm">{log.protein}g</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Footprints
                    className={cn("w-4 h-4", log.steps >= profile.stepGoal ? "text-primary" : "text-muted-foreground")}
                  />
                  <span className="text-sm">{(log.steps / 1000).toFixed(1)}k</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className={cn("w-4 h-4", log.hiit ? "text-primary" : "text-muted-foreground")} />
                  <span className="text-sm">{log.hiit ? "Yes" : "No"}</span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Fat lost</span>
                <span className="text-success font-medium">-{(log.fatLost * 1000).toFixed(0)}g</span>
              </div>
            </GlassCard>
          ))
        ) : (
          <GlassCard className="text-center py-12">
            <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium">No history yet</p>
            <p className="text-sm text-muted-foreground">Start logging your daily intake to build your history</p>
          </GlassCard>
        )}
      </div>

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <GlassCard className="w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Delete Log</h3>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="p-2 rounded-full hover:bg-muted/50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to delete the log for{" "}
              <span className="font-medium text-foreground">
                {new Date(deleteConfirm).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </Button>
              <Button variant="destructive" className="flex-1" onClick={() => handleDelete(deleteConfirm)}>
                Delete
              </Button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  )
}
