"use client"

import { useState } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { useFitnessStore, type AccentTheme } from "@/lib/fitness-store"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import {
  User,
  Scale,
  Target,
  Flame,
  Drumstick,
  Footprints,
  Save,
  RotateCcw,
  Palette,
  Sun,
  Moon,
  LogOut,
  Cloud,
} from "lucide-react"
import { cn } from "@/lib/utils"

const accentOptions: { id: AccentTheme; name: string; color: string }[] = [
  { id: "teal", name: "Teal", color: "bg-[oklch(0.75_0.18_180)]" },
  { id: "blue", name: "Blue", color: "bg-[oklch(0.7_0.18_250)]" },
  { id: "rose", name: "Rose", color: "bg-[oklch(0.75_0.18_350)]" },
  { id: "orange", name: "Orange", color: "bg-[oklch(0.75_0.18_50)]" },
]

export function SettingsScreen() {
  const { profile, setProfile, setOnboarded, accentTheme, colorMode, setAccentTheme, setColorMode } = useFitnessStore()
  const { user, signOut } = useAuth()

  const [name, setName] = useState(profile.name)
  const [age, setAge] = useState(profile.age.toString())
  const [height, setHeight] = useState(profile.height.toString())
  const [weight, setWeight] = useState(profile.weight.toString())
  const [currentFatMass, setCurrentFatMass] = useState(profile.currentFatMass.toString())
  const [goalFatMass, setGoalFatMass] = useState(profile.goalFatMass.toString())
  const [proteinGoal, setProteinGoal] = useState(profile.proteinGoal.toString())
  const [calorieGoal, setCalorieGoal] = useState(profile.calorieGoal.toString())
  const [stepGoal, setStepGoal] = useState(profile.stepGoal.toString())
  const [saved, setSaved] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSave = () => {
    setProfile({
      name,
      age: Number.parseInt(age) || profile.age,
      height: Number.parseInt(height) || profile.height,
      weight: Number.parseInt(weight) || profile.weight,
      currentFatMass: Number.parseFloat(currentFatMass) || profile.currentFatMass,
      goalFatMass: Number.parseFloat(goalFatMass) || profile.goalFatMass,
      proteinGoal: Number.parseInt(proteinGoal) || profile.proteinGoal,
      calorieGoal: Number.parseInt(calorieGoal) || profile.calorieGoal,
      stepGoal: Number.parseInt(stepGoal) || profile.stepGoal,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      await signOut()
    } catch (error) {
      console.error("Error signing out:", error)
    } finally {
      setIsSigningOut(false)
    }
  }

  const inputClass =
    "w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"

  return (
    <div className="min-h-screen pb-24 lg:pb-8 relative z-10">
      {/* Header */}
      <header className="px-5 pt-12 lg:pt-8 pb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">Customize your profile and goals</p>
      </header>

      <div className="px-5 space-y-4 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
        <GlassCard className="animate-slide-up lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-primary/20">
              <Cloud className="w-5 h-5 text-primary" />
            </div>
            <span className="font-semibold">Account</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {user?.photoURL ? (
                <img
                  src={user.photoURL || "/placeholder.svg"}
                  alt={user.displayName || "User"}
                  className="w-12 h-12 rounded-full border-2 border-primary/30"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
              )}
              <div>
                <p className="font-medium text-foreground">{user?.displayName || "User"}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="border-destructive/50 text-destructive hover:bg-destructive/10 bg-transparent"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {isSigningOut ? "Signing out..." : "Sign Out"}
            </Button>
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Cloud className="w-3 h-3" />
              Your data is synced to the cloud and available on all your devices
            </p>
          </div>
        </GlassCard>

        {/* Appearance */}
        <GlassCard className="animate-slide-up lg:col-span-2" style={{ animationDelay: "0.05s" }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-primary/20">
              <Palette className="w-5 h-5 text-primary" />
            </div>
            <span className="font-semibold">Appearance</span>
          </div>

          {/* Color Mode Toggle */}
          <div className="mb-4">
            <label className="text-sm text-muted-foreground mb-2 block">Color Mode</label>
            <div className="flex gap-2">
              <button
                onClick={() => setColorMode("light")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all",
                  colorMode === "light"
                    ? "bg-primary/20 border-primary/50 text-primary"
                    : "border-border text-muted-foreground hover:text-foreground hover:bg-muted/20",
                )}
              >
                <Sun className="w-4 h-4" />
                <span>Light</span>
              </button>
              <button
                onClick={() => setColorMode("dark")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all",
                  colorMode === "dark"
                    ? "bg-primary/20 border-primary/50 text-primary"
                    : "border-border text-muted-foreground hover:text-foreground hover:bg-muted/20",
                )}
              >
                <Moon className="w-4 h-4" />
                <span>Dark</span>
              </button>
            </div>
          </div>

          {/* Accent Theme Selection */}
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Accent Color</label>
            <div className="grid grid-cols-4 gap-2">
              {accentOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setAccentTheme(option.id)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-3 rounded-xl border transition-all",
                    accentTheme === option.id ? "border-primary/50 bg-primary/10" : "border-border hover:bg-muted/20",
                  )}
                >
                  <div className={cn("w-8 h-8 rounded-full", option.color)} />
                  <span className="text-xs">{option.name}</span>
                </button>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Profile Settings */}
        <GlassCard className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-primary/20">
              <User className="w-5 h-5 text-primary" />
            </div>
            <span className="font-semibold">Profile</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                placeholder="Your name"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Age</label>
                <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Height (cm)</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Weight (kg)</label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Body Composition */}
        <GlassCard className="animate-slide-up" style={{ animationDelay: "0.15s" }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-accent/20">
              <Scale className="w-5 h-5 text-accent" />
            </div>
            <span className="font-semibold">Body Composition</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Current Fat (kg)</label>
              <input
                type="number"
                step="0.1"
                value={currentFatMass}
                onChange={(e) => setCurrentFatMass(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Goal Fat (kg)</label>
              <input
                type="number"
                step="0.1"
                value={goalFatMass}
                onChange={(e) => setGoalFatMass(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        </GlassCard>

        {/* Daily Goals */}
        <GlassCard className="animate-slide-up lg:col-span-2" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-primary/20">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <span className="font-semibold">Daily Goals</span>
          </div>

          <div className="space-y-3 lg:grid lg:grid-cols-3 lg:gap-3 lg:space-y-0">
            <div>
              <label className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                <Flame className="w-3 h-3" /> Calorie Goal (kcal)
              </label>
              <input
                type="number"
                value={calorieGoal}
                onChange={(e) => setCalorieGoal(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                <Drumstick className="w-3 h-3" /> Protein Goal (g)
              </label>
              <input
                type="number"
                value={proteinGoal}
                onChange={(e) => setProteinGoal(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                <Footprints className="w-3 h-3" /> Step Goal
              </label>
              <input
                type="number"
                value={stepGoal}
                onChange={(e) => setStepGoal(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        </GlassCard>

        {/* Actions - spans full width */}
        <div className="space-y-3 lg:col-span-2 lg:flex lg:gap-3 lg:space-y-0">
          <Button
            onClick={handleSave}
            className={cn(
              "w-full h-14 text-lg font-semibold rounded-2xl transition-all active:scale-[0.98] lg:flex-1",
              saved ? "bg-green-500 hover:bg-green-500/90" : "bg-primary hover:bg-primary/90",
            )}
          >
            <Save className="w-5 h-5 mr-2" />
            {saved ? "Saved!" : "Save Changes"}
          </Button>

          <Button
            variant="outline"
            onClick={() => setOnboarded(false)}
            className="w-full h-12 lg:h-14 rounded-2xl border-border hover:bg-muted/30 lg:w-auto lg:px-8"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Restart Onboarding
          </Button>
        </div>
      </div>
    </div>
  )
}
