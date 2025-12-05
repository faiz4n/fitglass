"use client"

import { cn } from "@/lib/utils"
import { useFitnessStore } from "@/lib/fitness-store"
import { Home, PlusCircle, TrendingUp, History, Settings, Dumbbell } from "lucide-react"

const navItems = [
  { id: "home" as const, icon: Home, label: "Dashboard" },
  { id: "input" as const, icon: PlusCircle, label: "Log Today" },
  { id: "progress" as const, icon: TrendingUp, label: "Progress" },
  { id: "history" as const, icon: History, label: "History" },
  { id: "settings" as const, icon: Settings, label: "Settings" },
]

export function DesktopSidebar() {
  const { currentView, setCurrentView, profile } = useFitnessStore()

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 xl:w-72 z-40 flex-col bg-card/95 backdrop-blur-xl border-r border-border">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/20 border border-primary/30">
            <Dumbbell className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">FitGlass</h1>
            <p className="text-xs text-muted-foreground">Track your fitness</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = currentView === item.id
          const Icon = item.icon

          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
                isActive
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
              )}
            >
              <Icon size={20} className="transition-all duration-300" />
              <span className="font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* User info */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/30 border border-border">
          <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold">
            {profile.name.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-foreground">{profile.name}</p>
            <p className="text-xs text-muted-foreground">
              {profile.weight}kg | Goal: {profile.goalFatMass}kg fat
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}
