"use client"

import { cn } from "@/lib/utils"

const THEMES = [
  { id: "default", label: "Default", colors: "from-primary/20 to-primary/5", accent: "bg-primary" },
  { id: "axis", label: "Axis", colors: "from-red-500/20 to-red-900/5", accent: "bg-red-500" },
  { id: "allied", label: "Allied", colors: "from-blue-500/20 to-olive-900/5", accent: "bg-blue-600" },
  { id: "desert", label: "Desert", colors: "from-amber-500/20 to-yellow-900/5", accent: "bg-amber-500" },
  { id: "pacific", label: "Pacific", colors: "from-cyan-500/20 to-teal-900/5", accent: "bg-cyan-500" },
  { id: "arctic", label: "Arctic", colors: "from-sky-300/20 to-slate-300/5", accent: "bg-sky-300" },
] as const

export type ProfileTheme = typeof THEMES[number]["id"]

interface ThemePickerProps {
  value: string
  onChange: (theme: string) => void
}

export function ThemePicker({ value, onChange }: ThemePickerProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {THEMES.map((theme) => (
        <button
          key={theme.id}
          type="button"
          onClick={() => onChange(theme.id)}
          className={cn(
            "relative flex flex-col items-center gap-1.5 rounded-lg border p-3 transition-all hover:border-foreground/30",
            value === theme.id
              ? "border-primary ring-2 ring-primary/30"
              : "border-border/60"
          )}
        >
          <div className={cn("h-6 w-full rounded bg-gradient-to-r", theme.colors)} />
          <div className={cn("h-2 w-2 rounded-full", theme.accent)} />
          <span className="text-[10px] font-medium text-muted-foreground">{theme.label}</span>
        </button>
      ))}
    </div>
  )
}

export function getThemeClasses(theme: string): string {
  switch (theme) {
    case "axis":
      return "theme-axis"
    case "allied":
      return "theme-allied"
    case "desert":
      return "theme-desert"
    case "pacific":
      return "theme-pacific"
    case "arctic":
      return "theme-arctic"
    default:
      return ""
  }
}
