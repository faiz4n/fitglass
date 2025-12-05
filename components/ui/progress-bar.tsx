"use client"

import { cn } from "@/lib/utils"

interface ProgressBarProps {
  value: number
  max: number
  className?: string
  color?: string
  showLabel?: boolean
  label?: string
}

export function ProgressBar({
  value,
  max,
  className,
  color = "var(--primary)",
  showLabel = true,
  label,
}: ProgressBarProps) {
  const progress = Math.min((value / max) * 100, 100)

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground">{label}</span>
          <span className="text-foreground font-medium">
            {value}/{max}
          </span>
        </div>
      )}
      <div className="h-3 rounded-full bg-muted/30 overflow-hidden border border-border/50">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${progress}%`,
            background: color,
          }}
        />
      </div>
    </div>
  )
}
