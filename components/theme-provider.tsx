"use client"
import { useEffect } from "react"
import type React from "react"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import { useFitnessStore, type AccentTheme } from "@/lib/fitness-store"

const accentThemes: Record<
  AccentTheme,
  {
    light: { primary: string; accent: string; neonPrimary: string; neonSecondary: string }
    dark: { primary: string; accent: string; neonPrimary: string; neonSecondary: string }
  }
> = {
  teal: {
    light: {
      primary: "oklch(0.55 0.2 180)",
      accent: "oklch(0.6 0.2 170)",
      neonPrimary: "oklch(0.5 0.2 180)",
      neonSecondary: "oklch(0.55 0.18 170)",
    },
    dark: {
      primary: "oklch(0.75 0.18 180)",
      accent: "oklch(0.8 0.2 170)",
      neonPrimary: "oklch(0.85 0.2 180)",
      neonSecondary: "oklch(0.75 0.18 170)",
    },
  },
  blue: {
    light: {
      primary: "oklch(0.55 0.2 250)",
      accent: "oklch(0.6 0.2 240)",
      neonPrimary: "oklch(0.5 0.2 250)",
      neonSecondary: "oklch(0.55 0.18 240)",
    },
    dark: {
      primary: "oklch(0.7 0.18 250)",
      accent: "oklch(0.75 0.2 240)",
      neonPrimary: "oklch(0.8 0.2 250)",
      neonSecondary: "oklch(0.75 0.18 240)",
    },
  },
  rose: {
    light: {
      primary: "oklch(0.6 0.2 350)",
      accent: "oklch(0.65 0.2 340)",
      neonPrimary: "oklch(0.55 0.2 350)",
      neonSecondary: "oklch(0.6 0.18 340)",
    },
    dark: {
      primary: "oklch(0.75 0.18 350)",
      accent: "oklch(0.8 0.2 340)",
      neonPrimary: "oklch(0.85 0.2 350)",
      neonSecondary: "oklch(0.75 0.18 340)",
    },
  },
  orange: {
    light: {
      primary: "oklch(0.6 0.18 50)",
      accent: "oklch(0.65 0.2 40)",
      neonPrimary: "oklch(0.55 0.2 50)",
      neonSecondary: "oklch(0.6 0.18 40)",
    },
    dark: {
      primary: "oklch(0.75 0.18 50)",
      accent: "oklch(0.8 0.2 40)",
      neonPrimary: "oklch(0.85 0.2 50)",
      neonSecondary: "oklch(0.75 0.18 40)",
    },
  },
}

function AccentThemeApplier() {
  const { accentTheme, colorMode } = useFitnessStore()

  useEffect(() => {
    const root = document.documentElement
    const mode = colorMode === "dark" ? "dark" : "light"
    const accent = accentThemes[accentTheme][mode]

    // Apply accent theme CSS variables
    root.style.setProperty("--primary", accent.primary)
    root.style.setProperty("--accent", accent.accent)
    root.style.setProperty("--neon-cyan", accent.neonPrimary)
    root.style.setProperty("--neon-teal", accent.neonSecondary)
    root.style.setProperty("--ring", accent.primary)
    root.style.setProperty("--glow-primary", accent.primary.replace(")", " / 0.3)"))
    root.style.setProperty("--glow-accent", accent.accent.replace(")", " / 0.2)"))

    if (colorMode === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
  }, [accentTheme, colorMode])

  return null
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { colorMode } = useFitnessStore()

  return (
    <NextThemesProvider attribute="class" defaultTheme={colorMode} enableSystem={false} disableTransitionOnChange>
      <AccentThemeApplier />
      {children}
    </NextThemesProvider>
  )
}
