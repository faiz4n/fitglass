"use client"

import { useState } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { useFitnessStore } from "@/lib/fitness-store"
import { ChevronRight, ChevronLeft, Sparkles, Scale, Target, Flame, Drumstick, Check, Users, Info, Timer, Footprints, Activity } from "lucide-react"
import { cn } from "@/lib/utils"

const steps = [
  { id: "welcome", title: "Welcome", icon: Sparkles },
  { id: "gender", title: "Gender", icon: Users },
  { id: "body", title: "Body Stats", icon: Scale },
  { id: "goals", title: "Fat Goals", icon: Target },
  { id: "activity-level", title: "Activity Level", icon: Activity },
  { id: "activity", title: "Step Goal", icon: Footprints },
  { id: "hiit", title: "HIIT", icon: Timer },
  { id: "nutrition", title: "Nutrition", icon: Flame },
  { id: "complete", title: "Ready!", icon: Check },
]

export function Onboarding() {
  const { profile, setProfile, setOnboarded } = useFitnessStore()
  const [currentStep, setCurrentStep] = useState(0)

  const [name, setName] = useState(profile.name)
  const [gender, setGender] = useState<"male" | "female">(profile.gender || "male")
  const [age, setAge] = useState("")
  const [height, setHeight] = useState("")
  const [weight, setWeight] = useState("")
  const [currentFatMass, setCurrentFatMass] = useState("")
  const [goalFatMass, setGoalFatMass] = useState("")
  const [activityLevel, setActivityLevel] = useState<"sedentary" | "light" | "moderate" | "active">("sedentary")
  const [stepGoal, setStepGoal] = useState("6000")
  const [hiitEnabled, setHiitEnabled] = useState<boolean | null>(null)
  const [hiitDuration, setHiitDuration] = useState("15")
  const [proteinGoal, setProteinGoal] = useState(profile.proteinGoal.toString())
  const [calorieGoal, setCalorieGoal] = useState(profile.calorieGoal.toString())
  const [tdee, setTdee] = useState(0)

  const inputClass =
    "w-full bg-muted/30 border border-glass-border rounded-xl px-4 py-3 text-foreground text-base placeholder:text-muted-foreground focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/50 transition-all"

  const calculateSuggestions = () => {
    const w = Number.parseFloat(weight)
    const h = Number.parseFloat(height)
    const a = Number.parseFloat(age)

    if (!w || !h || !a) return

    // Mifflin-St Jeor Equation
    let bmr = 10 * w + 6.25 * h - 5 * a + 5
    if (gender === "female") {
      bmr = 10 * w + 6.25 * h - 5 * a - 161
    }

    // TDEE based on Activity Level
    let multiplier = 1.2
    if (activityLevel === "light") multiplier = 1.375
    if (activityLevel === "moderate") multiplier = 1.55
    if (activityLevel === "active") multiplier = 1.725

    const calculatedTdee = Math.round(bmr * multiplier)
    setTdee(calculatedTdee)

    // Suggestions
    // Calorie Deficit for Fat Loss (~500kcal)
    const suggestedCalories = Math.max(1200, calculatedTdee - 500)
    setCalorieGoal(suggestedCalories.toString())

    // Protein: 1.6g - 2.0g per kg of bodyweight
    // Using 1.8g as a balanced high-protein start
    const suggestedProtein = Math.round(w * 1.8)
    setProteinGoal(suggestedProtein.toString())
  }

  const handleNext = () => {
    if (currentStep === 2) {
      // Calculate when leaving Body Stats step (now step 2)
      calculateSuggestions()
    }
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
      gender,
      age: Number.parseInt(age) || 25,
      height: Number.parseInt(height) || 175,
      weight: Number.parseInt(weight) || 75,
      currentFatMass: Number.parseFloat(currentFatMass) || 27,
      goalFatMass: Number.parseFloat(goalFatMass) || 20,
      stepGoal: Number.parseInt(stepGoal) || 6000,
      activityLevel,
      proteinGoal: Number.parseInt(proteinGoal) || 70,
      calorieGoal: Number.parseInt(calorieGoal) || 1400,
      tdee: tdee || 2000,
      hiitEnabled: hiitEnabled || false,
      hiitDuration: Number.parseInt(hiitDuration) || 15,
    })
    
    // Set theme based on gender
    useFitnessStore.getState().setAccentTheme(gender === "female" ? "rose" : "blue")
    
    setOnboarded(true)
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 0: // Welcome
        return name.trim().length > 0
      case 1: // Gender
        return true // Always has a default or selection
      case 2: // Body Stats
        return age.length > 0 && height.length > 0 && weight.length > 0
      case 3: // Fat Goals
        return currentFatMass.length > 0 && goalFatMass.length > 0
      case 4: // Activity Level
        return true // Always has a default
      case 5: // Step Goal
        return stepGoal.length > 0
      case 6: // HIIT
        return hiitEnabled !== null && (hiitEnabled ? hiitDuration.length > 0 : true)
      case 7: // Nutrition
        return calorieGoal.length > 0 && proteinGoal.length > 0
      default:
        return true
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-primary/20 flex items-center justify-center glow-primary">
              <Sparkles className="w-12 h-12 text-neon-cyan" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">
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
              <div className="w-12 h-12 mx-auto rounded-2xl bg-primary/20 flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-neon-cyan" />
              </div>
              <h2 className="text-2xl font-bold">Gender</h2>
              <p className="text-muted-foreground text-sm">Required for accurate calorie calculations</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setGender("male")}
                className={cn(
                  "p-4 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-3",
                  gender === "male"
                    ? "bg-primary/20 border-primary glow-primary"
                    : "bg-muted/10 border-glass-border hover:bg-muted/20",
                )}
              >
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-2xl">👨</span>
                </div>
                <span className="font-medium">Male</span>
              </button>
              <button
                onClick={() => setGender("female")}
                className={cn(
                  "p-4 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-3",
                  gender === "female"
                    ? "bg-primary/20 border-primary glow-primary"
                    : "bg-muted/10 border-glass-border hover:bg-muted/20",
                )}
              >
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                  <span className="text-2xl">👩</span>
                </div>
                <span className="font-medium">Female</span>
              </button>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-primary/20 flex items-center justify-center mb-4">
                <Scale className="w-8 h-8 text-primary" />
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

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-primary/20 flex items-center justify-center mb-4">
                <Target className="w-8 h-8 text-primary" />
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
                    {((Number.parseFloat(currentFatMass) - Number.parseFloat(goalFatMass)) || 0).toFixed(1)} kg
                  </span>{" "}
                  of fat
                </p>
              </GlassCard>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-primary/20 flex items-center justify-center mb-4">
                <Activity className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Activity Level</h2>
              <p className="text-muted-foreground text-sm">What is your daily activity level?</p>
            </div>
            <div className="space-y-3">
              {[
                {
                  id: "sedentary",
                  label: "Sedentary",
                  desc: "Little to no exercise, office work (<3k steps)",
                  mult: "1.2x",
                },
                {
                  id: "light",
                  label: "Lightly Active",
                  desc: "Light movement, 3k-6k steps/day",
                  mult: "1.375x",
                },
                {
                  id: "moderate",
                  label: "Moderately Active",
                  desc: "Exercise 3-4x/week, 6k-10k steps/day",
                  mult: "1.55x",
                },
                {
                  id: "active",
                  label: "Very Active",
                  desc: "Intense exercise, physical work (>10k steps)",
                  mult: "1.725x",
                },
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => setActivityLevel(option.id as any)}
                  className={cn(
                    "w-full p-4 rounded-xl border text-left transition-all duration-300",
                    activityLevel === option.id
                      ? "bg-accent/20 border-accent glow-accent"
                      : "bg-muted/10 border-glass-border hover:bg-muted/20",
                  )}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold">{option.label}</span>
                    <span className="text-xs font-mono bg-background/50 px-2 py-1 rounded-md text-muted-foreground">
                      {option.mult}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{option.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-primary/20 flex items-center justify-center mb-4">
                <Footprints className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Daily Activity</h2>
              <p className="text-muted-foreground text-sm">Set your movement goals</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Daily Step Goal</label>
                <input
                  type="number"
                  value={stepGoal}
                  onChange={(e) => setStepGoal(e.target.value)}
                  className={inputClass}
                  placeholder="6000"
                />
                <p className="text-xs text-muted-foreground mt-1">Recommended: 6,000 - 10,000 steps</p>
              </div>
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-primary/20 flex items-center justify-center mb-4">
                <Timer className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">HIIT Cardio</h2>
              <p className="text-muted-foreground text-sm">High Intensity Interval Training</p>
            </div>

            <GlassCard variant="strong" className="bg-primary/5 border-primary/20">
              <div className="flex items-start gap-3">
                <div className="mt-1 p-1.5 rounded-full bg-primary/20 text-primary">
                  <Info className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">Why HIIT?</h4>
                  <p className="text-xs text-muted-foreground">
                    Short bursts of intense exercise followed by rest. It burns more fat in less time than steady cardio.
                  </p>
                </div>
              </div>
            </GlassCard>

            <div className="space-y-4">
              <p className="text-sm font-medium text-center">Include HIIT in your daily routine?</p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setHiitEnabled(true)}
                  className={cn(
                    "p-4 rounded-xl border transition-all duration-300",
                    hiitEnabled === true
                      ? "bg-primary/20 border-primary text-primary"
                      : "bg-muted/10 border-glass-border hover:bg-muted/20",
                  )}
                >
                  Yes, let{"'"}s do it!
                </button>
                <button
                  onClick={() => setHiitEnabled(false)}
                  className={cn(
                    "p-4 rounded-xl border transition-all duration-300",
                    hiitEnabled === false
                      ? "bg-muted/30 border-muted-foreground text-muted-foreground"
                      : "bg-muted/10 border-glass-border hover:bg-muted/20",
                  )}
                >
                  No, maybe later
                </button>
              </div>

              {hiitEnabled && (
                <div className="animate-slide-up pt-2">
                  <label className="text-sm text-muted-foreground mb-2 block">Daily Goal (minutes)</label>
                  <input
                    type="number"
                    value={hiitDuration}
                    onChange={(e) => setHiitDuration(e.target.value)}
                    className={inputClass}
                    placeholder="15"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Recommended: 15-20 minutes</p>
                </div>
              )}
            </div>
          </div>
        )

      case 7:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-primary/20 flex items-center justify-center mb-4">
                <Flame className="w-8 h-8 text-neon-cyan" />
              </div>
              <h2 className="text-2xl font-bold">Nutrition Goals</h2>
              <p className="text-muted-foreground text-sm">Smart suggestions based on your stats</p>
            </div>

            {tdee > 0 && (
              <GlassCard variant="strong" className="bg-primary/5 border-primary/20">
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-1.5 rounded-full bg-primary/20 text-primary-foreground">
                    <Info className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-1">Your TDEE is ~{tdee} kcal</h4>
                    <p className="text-xs text-muted-foreground">
                      Total Daily Energy Expenditure: The calories you burn daily. We've suggested a deficit for fat
                      loss.
                    </p>
                  </div>
                </div>
              </GlassCard>
            )}

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
          </div>
        )

      case 8:
        return (
          <div className="text-center space-y-6">
            <div className="w-24 h-24 mx-auto rounded-3xl bg-primary/20 flex items-center justify-center glow-accent animate-pulse-glow">
              <Check className="w-12 h-12 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">You{"'"}re All Set!</h2>
              <p className="text-muted-foreground">
                Ready to start your transformation, <span className="text-neon-cyan">{name}</span>?
              </p>
            </div>
            <GlassCard variant="strong">
              <div className="space-y-2 text-left text-sm">
                <p>Your Goals:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>
                    Lose {((Number.parseFloat(currentFatMass) - Number.parseFloat(goalFatMass)) || 0).toFixed(1)} kg of fat
                  </li>
                  <li>Eat ~{calorieGoal} calories daily</li>
                  <li>Hit {proteinGoal}g protein daily</li>
                  <li>Walk {stepGoal} steps</li>
                  {hiitEnabled && <li>Complete {hiitDuration} min HIIT</li>}
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
      <div className="flex-1 px-4 pb-32">
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
              className="flex-1 h-12 rounded-2xl border-glass-border hover:bg-muted/30 bg-transparent"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back
            </Button>
          )}

          {currentStep < steps.length - 1 ? (
            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="flex-1 h-12 rounded-2xl bg-primary hover:bg-primary/90 glow-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
              <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              className="flex-1 h-12 rounded-2xl bg-success hover:bg-success/90 text-lg font-semibold"
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
