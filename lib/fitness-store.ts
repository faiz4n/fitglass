"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import {
  saveUserProfile,
  saveUserSettings,
  saveDailyLog,
  deleteDailyLog as deleteFirestoreLog,
  getDailyLogs,
  getUserProfile,
  getUserSettings,
  subscribeToLogs,
  subscribeToProfile,
  subscribeToSettings,
} from "./firestore-sync"
import { calculateDailyFatLoss } from "./fitness-calculations"

export type AccentTheme = "teal" | "blue" | "rose" | "orange"
export type ColorMode = "light" | "dark"

export interface DailyLog {
  date: string
  calories: number
  protein: number
  steps: number
  hiit: boolean
  score: number
  fatLost: number
  // New fields for scientific calculations
  deficit: number
  fatLostGrams: number
  tdee: number
}

export interface UserProfile {
  name: string
  gender: "male" | "female"
  age: number
  height: number
  weight: number
  currentFatMass: number
  goalFatMass: number
  proteinGoal: number
  calorieGoal: number
  stepGoal: number
  tdee: number
  activityLevel: "sedentary" | "light" | "moderate" | "active"
  hiitEnabled: boolean
  hiitDuration: number
}

interface FitnessState {
  isOnboarded: boolean
  profile: UserProfile
  logs: DailyLog[]
  currentView: "home" | "input" | "progress" | "progress-detail" | "history" | "settings"
  accentTheme: AccentTheme
  colorMode: ColorMode
  selectedDate: string
  userId: string | null
  isSyncing: boolean
  unsubscribers: (() => void)[]

  // Actions
  setOnboarded: (value: boolean) => void
  setProfile: (profile: Partial<UserProfile>) => void
  addLog: (log: DailyLog) => void
  updateTodayLog: (log: Partial<DailyLog>) => void
  updateLogForDate: (date: string, log: Partial<DailyLog>) => void
  deleteLog: (date: string) => void
  setCurrentView: (view: FitnessState["currentView"]) => void
  getTodayLog: () => DailyLog | undefined
  getLogForDate: (date: string) => DailyLog | undefined
  getTotalFatLost: () => number
  getWeeklyLogs: () => DailyLog[]
  setAccentTheme: (theme: AccentTheme) => void
  setColorMode: (mode: ColorMode) => void
  setSelectedDate: (date: string) => void

  // Firebase sync
  setUserId: (userId: string | null) => void
  initializeFromFirebase: (userId: string) => Promise<void>
  subscribeToFirebase: (userId: string) => void
  unsubscribeFromFirebase: () => void
  resetToDefaults: () => void
}

const getDateString = () => new Date().toISOString().split("T")[0]

const defaultProfile: UserProfile = {
  name: "",
  gender: "male",
  age: 25,
  height: 175,
  weight: 75,
  currentFatMass: 27,
  goalFatMass: 20,
  proteinGoal: 70,
  calorieGoal: 1400,
  stepGoal: 6000,
  tdee: 1950,
  activityLevel: "sedentary",
  hiitEnabled: false,
  hiitDuration: 15,
}

const calculateScore = (log: Partial<DailyLog>, profile: UserProfile): number => {
  let score = 0

  // Protein score (40 points max)
  if ((log.protein || 0) >= profile.proteinGoal) score += 40
  else score += Math.floor(((log.protein || 0) / profile.proteinGoal) * 40)

  const calories = log.calories || 0
  const calorieTarget = profile.calorieGoal
  if (calories > 0) {
    if (calories >= calorieTarget - 100 && calories <= calorieTarget + 100) score += 30
    else if (calories < calorieTarget) score += 25
    else score += Math.max(0, 30 - Math.floor((calories - calorieTarget) / 50) * 5)
  }

  // Steps score (20 points max normally, 30 if HIIT disabled)
  const stepWeight = profile.hiitEnabled ? 20 : 30
  if ((log.steps || 0) >= profile.stepGoal) score += stepWeight
  else score += Math.floor(((log.steps || 0) / profile.stepGoal) * stepWeight)

  // HIIT score (10 points)
  if (profile.hiitEnabled && log.hiit) score += 10

  return Math.min(100, score)
}

const calculateFatLost = (log: Partial<DailyLog>, profile: UserProfile): { fatLost: number; deficit: number; fatLostGrams: number; tdee: number } => {
  const result = calculateDailyFatLoss({
    weightKg: profile.weight,
    heightCm: profile.height,
    ageYears: profile.age,
    sex: profile.gender,
    steps: log.steps || 0,
    didHIIT: log.hiit || false,
    caloriesConsumed: log.calories || 0,
  })

  return {
    fatLost: result.deficitResult.fatLostKg,
    deficit: result.deficitResult.deficit,
    fatLostGrams: result.deficitResult.fatLostGrams,
    tdee: result.tdeeResult.tdee,
  }
}

export const useFitnessStore = create<FitnessState>()(
  persist(
    (set, get) => ({
      isOnboarded: false,
      profile: defaultProfile,
      logs: [],
      currentView: "home",
      accentTheme: "blue",
      colorMode: "light",
      selectedDate: getDateString(),
      userId: null,
      isSyncing: false,
      unsubscribers: [],

      setOnboarded: (value) => {
        set({ isOnboarded: value })
        const { userId } = get()
        if (userId) {
          saveUserSettings(userId, {
            isOnboarded: value,
            accentTheme: get().accentTheme,
            colorMode: get().colorMode,
          })
        }
      },

      setProfile: (profile) => {
        set((state) => ({
          profile: { ...state.profile, ...profile },
        }))
        const { userId } = get()
        if (userId) {
          saveUserProfile(userId, get().profile)
        }
      },

      addLog: (log) => {
        set((state) => ({
          logs: [...state.logs.filter((l) => l.date !== log.date), log],
        }))
        const { userId } = get()
        if (userId) {
          saveDailyLog(userId, log)
        }
      },

      updateTodayLog: (partialLog) => {
        const state = get()
        const today = getDateString()
        const existingLog = state.logs.find((l) => l.date === today)

        const updatedLog: DailyLog = {
          date: today,
          calories: partialLog.calories ?? existingLog?.calories ?? 0,
          protein: partialLog.protein ?? existingLog?.protein ?? 0,
          steps: partialLog.steps ?? existingLog?.steps ?? 0,
          hiit: partialLog.hiit ?? existingLog?.hiit ?? false,
          score: 0,
          fatLost: 0,
          deficit: 0,
          fatLostGrams: 0,
          tdee: 0,
        }

        updatedLog.score = calculateScore(updatedLog, state.profile)
        const fatResults = calculateFatLost(updatedLog, state.profile)
        updatedLog.fatLost = fatResults.fatLost
        updatedLog.deficit = fatResults.deficit
        updatedLog.fatLostGrams = fatResults.fatLostGrams
        updatedLog.tdee = fatResults.tdee

        set({
          logs: [...state.logs.filter((l) => l.date !== today), updatedLog],
        })

        const { userId } = get()
        if (userId) {
          saveDailyLog(userId, updatedLog)
        }
      },

      updateLogForDate: (date, partialLog) => {
        const state = get()
        const existingLog = state.logs.find((l) => l.date === date)

        const updatedLog: DailyLog = {
          date: date,
          calories: partialLog.calories ?? existingLog?.calories ?? 0,
          protein: partialLog.protein ?? existingLog?.protein ?? 0,
          steps: partialLog.steps ?? existingLog?.steps ?? 0,
          hiit: partialLog.hiit ?? existingLog?.hiit ?? false,
          score: 0,
          fatLost: 0,
          deficit: 0,
          fatLostGrams: 0,
          tdee: 0,
        }

        updatedLog.score = calculateScore(updatedLog, state.profile)
        const fatResults = calculateFatLost(updatedLog, state.profile)
        updatedLog.fatLost = fatResults.fatLost
        updatedLog.deficit = fatResults.deficit
        updatedLog.fatLostGrams = fatResults.fatLostGrams
        updatedLog.tdee = fatResults.tdee

        set({
          logs: [...state.logs.filter((l) => l.date !== date), updatedLog],
        })

        const { userId } = get()
        if (userId) {
          saveDailyLog(userId, updatedLog)
        }
      },

      deleteLog: (date) => {
        set((state) => ({
          logs: state.logs.filter((l) => l.date !== date),
        }))
        const { userId } = get()
        if (userId) {
          deleteFirestoreLog(userId, date)
        }
      },

      setCurrentView: (view) => {
        if (typeof window !== "undefined") {
          window.scrollTo({ top: 0, behavior: "smooth" })
        }
        set({ currentView: view })
      },

      getTodayLog: () => {
        const today = getDateString()
        return get().logs.find((l) => l.date === today)
      },

      getLogForDate: (date) => {
        return get().logs.find((l) => l.date === date)
      },

      getTotalFatLost: () => {
        return get().logs.reduce((sum, log) => sum + log.fatLost, 0)
      },

      getWeeklyLogs: () => {
        const logs = get().logs
        const today = new Date()
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
        return logs.filter((l) => new Date(l.date) >= weekAgo).sort((a, b) => a.date.localeCompare(b.date))
      },

      setAccentTheme: (theme) => {
        set({ accentTheme: theme })
        const { userId } = get()
        if (userId) {
          saveUserSettings(userId, {
            isOnboarded: get().isOnboarded,
            accentTheme: theme,
            colorMode: get().colorMode,
          })
        }
      },

      setColorMode: (mode) => {
        set({ colorMode: mode })
        const { userId } = get()
        if (userId) {
          saveUserSettings(userId, {
            isOnboarded: get().isOnboarded,
            accentTheme: get().accentTheme,
            colorMode: mode,
          })
        }
      },

      setSelectedDate: (date) => set({ selectedDate: date }),

      setUserId: (userId) => set({ userId }),

      initializeFromFirebase: async (userId) => {
        set({ isSyncing: true })
        try {
          const [profile, settings, logs] = await Promise.all([
            getUserProfile(userId),
            getUserSettings(userId),
            getDailyLogs(userId),
          ])

          set({
            profile: profile || defaultProfile,
            isOnboarded: settings?.isOnboarded ?? false,
            accentTheme: settings?.accentTheme ?? "teal",
            colorMode: settings?.colorMode ?? "light",
            logs: logs || [],
            userId,
          })
        } catch (error) {
          console.error("Error initializing from Firebase:", error)
        } finally {
          set({ isSyncing: false })
        }
      },

      subscribeToFirebase: (userId) => {
        const unsubLogs = subscribeToLogs(userId, (logs) => {
          set({ logs })
        })

        const unsubProfile = subscribeToProfile(userId, (profile) => {
          if (profile) {
            set({ profile })
          }
        })

        const unsubSettings = subscribeToSettings(userId, (settings) => {
          if (settings) {
            set({
              isOnboarded: settings.isOnboarded,
              accentTheme: settings.accentTheme,
              colorMode: settings.colorMode,
            })
          }
        })

        set({ unsubscribers: [unsubLogs, unsubProfile, unsubSettings] })
      },

      unsubscribeFromFirebase: () => {
        const { unsubscribers } = get()
        unsubscribers.forEach((unsub) => unsub())
        set({ unsubscribers: [] })
      },

      resetToDefaults: () => {
        set({
          isOnboarded: false,
          profile: defaultProfile,
          logs: [],
          currentView: "home",
          userId: null,
        })
      },
    }),
    {
      name: "fitglass-storage",
      partialize: (state) => ({
        // Only persist these fields locally as backup
        accentTheme: state.accentTheme,
        colorMode: state.colorMode,
      }),
    },
  ),
)
