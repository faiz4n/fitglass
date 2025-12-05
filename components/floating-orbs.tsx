"use client"

export function FloatingOrbs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Primary orb - top left */}
      <div
        className="orb w-80 h-80 -top-20 -left-20"
        style={{
          background: "var(--glow-primary)",
          animationDelay: "0s",
        }}
      />
      {/* Secondary orb - bottom right */}
      <div
        className="orb w-96 h-96 -bottom-32 -right-32"
        style={{
          background: "var(--glow-accent)",
          animationDelay: "2s",
        }}
      />
      {/* Accent orb - center */}
      <div
        className="orb w-64 h-64 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          background: "var(--glow-primary)",
          animationDelay: "4s",
        }}
      />
      {/* Small accent orb */}
      <div
        className="orb w-40 h-40 top-1/4 right-1/4"
        style={{
          background: "var(--glow-accent)",
          animationDelay: "1s",
        }}
      />
    </div>
  )
}
