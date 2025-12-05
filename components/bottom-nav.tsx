"use client"

import { cn } from "@/lib/utils"
import { useFitnessStore } from "@/lib/fitness-store"
import { Home, PlusCircle, TrendingUp, History, Settings } from "lucide-react"

const navItems = [
  { id: "home" as const, icon: Home, label: "Home" },
  { id: "progress" as const, icon: TrendingUp, label: "Progress" },
  { id: "input" as const, icon: PlusCircle, label: "Log" },
  { id: "history" as const, icon: History, label: "History" },
  { id: "settings" as const, icon: Settings, label: "Settings" },
]

export function BottomNav() {
  const { currentView, setCurrentView } = useFitnessStore()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-t border-border safe-area-inset-bottom">
      <div className="flex items-center justify-around py-2 px-4 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = currentView === item.id
          const Icon = item.icon

          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={cn(
                "flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all duration-300",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon size={item.id === "input" ? 28 : 22} className="transition-all duration-300" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
