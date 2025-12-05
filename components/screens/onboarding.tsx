"use client"

import { useState } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { useFitnessStore } from "@/lib/fitness-store"
import { ChevronRight, ChevronLeft, Sparkles, Scale, Target, Flame, Drumstick, Check } from "lucide-react"
import { cn } from "@/lib/utils"

const steps = [
  { id: "welcome", title: "Welcome", icon: Sparkles },
  { id: "body", title: "Body Stats", icon: Scale },
  { id: "goals", title: "Fat Goals", icon: Target },
  { id: "nutrition", title: "Nutrition", icon: Flame },
  { id: "complete", title: "Ready!", icon: Check },
]

export function Onboarding() {
  const { profile, setProfile, setOnboarded } = useFitnessStore()
  const [currentStep, setCurrentStep] = useState(0)

  const [name, setName] = useState(profile.name)
  const [age, setAge] = useState(profile.age.toString())
  const [height, setHeight] = useState(profile.height.toString())
  const [weight, setWeight] = useState(profile.weight.toString())
  const [currentFatMass, setCurrentFatMass] = useState(profile.currentFatMass.toString())
  const [goalFatMass, setGoalFatMass] = useState(profile.goalFatMass.toString())
  const [proteinGoal, setProteinGoal] = useState(profile.proteinGoal.toString())
  const [calorieGoal, setCalorieGoal] = useState(profile.calorieGoal.toString())

  const inputClass =
    "w-full bg-muted/30 border border-glass-border rounded-xl px-4 py-4 text-foreground text-lg placeholder:text-muted-foreground focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/50 transition-all"

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    setProfile({
      name,
      age: Number.parseInt(age) || 25,
      height: Number.parseInt(height) || 175,
      weight: Number.parseInt(weight) || 75,
      currentFatMass: Number.parseFloat(currentFatMass) || 27,
      goalFatMass: Number.parseFloat(goalFatMass) || 20,
      proteinGoal: Number.parseInt(proteinGoal) || 70,
      calorieGoal: Number.parseInt(calorieGoal) || 1400,
    })
    setOnboarded(true)
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="text-center space-y-6">
            <div className="w-24 h-24 mx-auto rounded-3xl bg-primary/20 flex items-center justify-center glow-primary">
              <Sparkles className="w-12 h-12 text-neon-cyan" />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-2">
                Welcome to <span className="text-neon-cyan text-glow">FitGlass</span>
              </h2>
              <p className="text-muted-foreground">
                Your premium fitness tracking companion with a beautiful glassmorphism interface.
              </p>
            </div>
            <div className="space-y-2 text-left">
              <p className="text-sm text-muted-foreground">What{"'"}s your name?</p>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                placeholder="Enter your name"
              />
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-success/20 flex items-center justify-center mb-4">
                <Scale className="w-8 h-8 text-success" />
              </div>
              <h2 className="text-2xl font-bold">Body Stats</h2>
              <p className="text-muted-foreground text-sm">Help us personalize your experience</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className={inputClass}
                  placeholder="25"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Height (cm)</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className={inputClass}
                  placeholder="175"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Weight (kg)</label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className={inputClass}
                  placeholder="75"
                />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-warning/20 flex items-center justify-center mb-4">
                <Target className="w-8 h-8 text-warning" />
              </div>
              <h2 className="text-2xl font-bold">Fat Loss Goals</h2>
              <p className="text-muted-foreground text-sm">Set your body composition targets</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Current Fat Mass (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={currentFatMass}
                  onChange={(e) => setCurrentFatMass(e.target.value)}
                  className={inputClass}
                  placeholder="27"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Goal Fat Mass (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={goalFatMass}
                  onChange={(e) => setGoalFatMass(e.target.value)}
                  className={inputClass}
                  placeholder="20"
                />
              </div>
              <GlassCard variant="strong" className="mt-4">
                <p className="text-sm text-muted-foreground">
                  You{"'"}ll lose{" "}
                  <span className="text-neon-cyan font-bold">
                    {(Number.parseFloat(currentFatMass) - Number.parseFloat(goalFatMass)).toFixed(1) || 7} kg
                  </span>{" "}
                  of fat
                </p>
              </GlassCard>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/20 flex items-center justify-center mb-4">
                <Flame className="w-8 h-8 text-neon-cyan" />
              </div>
              <h2 className="text-2xl font-bold">Nutrition Goals</h2>
              <p className="text-muted-foreground text-sm">Set your daily targets</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Daily Calorie Goal (kcal)</label>
                <input
                  type="number"
                  value={calorieGoal}
                  onChange={(e) => setCalorieGoal(e.target.value)}
                  className={inputClass}
                  placeholder="1400"
                />
                <p className="text-xs text-muted-foreground mt-1">Recommended: 1300-1500 for fat loss</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                  <Drumstick className="w-3 h-3" /> Daily Protein Goal (g)
                </label>
                <input
                  type="number"
                  value={proteinGoal}
                  onChange={(e) => setProteinGoal(e.target.value)}
                  className={inputClass}
                  placeholder="70"
                />
                <p className="text-xs text-muted-foreground mt-1">Hit your protein first, then calories!</p>
              </div>
            </div>
            <GlassCard variant="strong">
              <p className="text-sm text-muted-foreground">
                <span className="text-foreground font-medium">Pro tip:</span> Eating enough protein preserves muscle
                while losing fat, giving you a leaner look.
              </p>
            </GlassCard>
          </div>
        )

      case 4:
        return (
          <div className="text-center space-y-6">
            <div className="w-24 h-24 mx-auto rounded-3xl bg-success/20 flex items-center justify-center glow-accent animate-pulse-glow">
              <Check className="w-12 h-12 text-success" />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-2">You{"'"}re All Set!</h2>
              <p className="text-muted-foreground">
                Ready to start your transformation, <span className="text-neon-cyan">{name}</span>?
              </p>
            </div>
            <GlassCard variant="strong">
              <div className="space-y-2 text-left text-sm">
                <p>Your Goals:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>
                    Lose {(Number.parseFloat(currentFatMass) - Number.parseFloat(goalFatMass)).toFixed(1)} kg of fat
                  </li>
                  <li>Eat ~{calorieGoal} calories daily</li>
                  <li>Hit {proteinGoal}g protein daily</li>
                  <li>Walk 6,000+ steps</li>
                  <li>Complete 5-min HIIT</li>
                </ul>
              </div>
            </GlassCard>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen flex flex-col relative z-10">
      {/* Progress dots */}
      <div className="flex justify-center gap-2 pt-12 pb-6">
        {steps.map((_, index) => (
          <div
            key={index}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              index === currentStep
                ? "w-6 bg-neon-cyan glow-subtle"
                : index < currentStep
                  ? "bg-neon-cyan/50"
                  : "bg-muted/50",
            )}
          />
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 px-5 pb-32">
        <GlassCard variant="strong" className="animate-slide-up">
          {renderStep()}
        </GlassCard>
      </div>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 p-5 glass-strong border-t border-glass-border">
        <div className="flex gap-3 max-w-lg mx-auto">
          {currentStep > 0 && (
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex-1 h-14 rounded-2xl border-glass-border hover:bg-muted/30 bg-transparent"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back
            </Button>
          )}

          {currentStep < steps.length - 1 ? (
            <Button
              onClick={handleNext}
              className="flex-1 h-14 rounded-2xl bg-primary hover:bg-primary/90 glow-primary"
            >
              Continue
              <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              className="flex-1 h-14 rounded-2xl bg-success hover:bg-success/90 text-lg font-semibold"
              style={{ boxShadow: "0 0 30px var(--success)" }}
            >
              Start Tracking
              <Sparkles className="w-5 h-5 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
