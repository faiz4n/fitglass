"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface AppHeaderProps {
  title?: string | ReactNode
  subtitle?: string | ReactNode
  children?: ReactNode
  className?: string
}

export function AppHeader({ title, subtitle, children, className }: AppHeaderProps) {
  return (
    <header className={cn("px-5 pt-6 pb-4 flex justify-between items-start", className)}>
      <div className="flex flex-col">
        <span className="text-4xl font-bold text-neon-cyan tracking-tight mb-3">FitGlass</span>
        {title && <div className="text-lg font-bold text-foreground">{title}</div>}
        {subtitle && <div className="text-sm text-muted-foreground">{subtitle}</div>}
      </div>
      {children && <div className="pt-1">{children}</div>}
    </header>
  )
}
