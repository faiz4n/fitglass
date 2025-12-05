"use client"

import { useEffect } from "react"
import { FloatingOrbs } from "@/components/floating-orbs"
import { BottomNav } from "@/components/bottom-nav"
import { DesktopSidebar } from "@/components/desktop-sidebar"
import { HomeDashboard } from "@/components/screens/home-dashboard"
import { DailyInput } from "@/components/screens/daily-input"
import { ProgressScreen } from "@/components/screens/progress-screen"
import { ProgressDetail } from "@/components/screens/progress-detail"
import { HistoryScreen } from "@/components/screens/history-screen"
import { SettingsScreen } from "@/components/screens/settings-screen"
import { Onboarding } from "@/components/screens/onboarding"
import { LoginScreen } from "@/components/screens/login-screen"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider, useAuth } from "@/lib/auth-context"
import { useFitnessStore } from "@/lib/fitness-store"
import { Loader2 } from "lucide-react"

function AppContent() {
  const { user, loading: authLoading } = useAuth()
  const {
    isOnboarded,
    currentView,
    isSyncing,
    initializeFromFirebase,
    subscribeToFirebase,
    unsubscribeFromFirebase,
    setUserId,
    resetToDefaults,
  } = useFitnessStore()

  // Handle user authentication state changes
  useEffect(() => {
    if (user) {
      setUserId(user.uid)
      initializeFromFirebase(user.uid).then(() => {
        subscribeToFirebase(user.uid)
      })
    } else {
      unsubscribeFromFirebase()
      setUserId(null)
      resetToDefaults()
    }

    return () => {
      unsubscribeFromFirebase()
    }
  }, [user])

  const renderScreen = () => {
    switch (currentView) {
      case "home":
        return <HomeDashboard />
      case "input":
        return <DailyInput />
      case "progress":
        return <ProgressScreen />
      case "progress-detail":
        return <ProgressDetail />
      case "history":
        return <HistoryScreen />
      case "settings":
        return <SettingsScreen />
      default:
        return <HomeDashboard />
    }
  }

  // Show loading state while checking auth
  if (authLoading || isSyncing) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <FloatingOrbs />
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-muted-foreground">Loading your data...</p>
        </div>
      </main>
    )
  }

  // Show login screen if not authenticated
  if (!user) {
    return (
      <main className="min-h-screen bg-background overflow-hidden">
        <FloatingOrbs />
        <LoginScreen />
      </main>
    )
  }

  // Show onboarding if not completed
  if (!isOnboarded) {
    return (
      <main className="min-h-screen bg-background overflow-hidden">
        <FloatingOrbs />
        <Onboarding />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background overflow-x-hidden lg:flex">
      <FloatingOrbs />

      {/* Desktop sidebar - hidden on mobile */}
      <DesktopSidebar />

      {/* Main content area */}
      <div className="flex-1 lg:ml-64 xl:ml-72">
        <div className="max-w-3xl mx-auto">{renderScreen()}</div>
      </div>

      {/* Mobile bottom nav - hidden on desktop */}
      <div className="lg:hidden">
        <BottomNav />
      </div>
    </main>
  )
}

export default function FitGlassApp() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  )
}
