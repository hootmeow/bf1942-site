import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type SectionAccent =
  | "emerald"
  | "purple"
  | "primary"
  | "amber"
  | "blue"
  | "cyan"
  | "pink";

// Every class is a complete literal string so Tailwind's JIT generates it
// (interpolated classes are not picked up by the compiler).
const ACCENT: Record<SectionAccent, { bar: string; iconBg: string; ring: string; text: string }> = {
  emerald: { bar: "from-emerald-500 to-emerald-500/20", iconBg: "bg-emerald-500/10", ring: "ring-emerald-500/20", text: "text-emerald-500" },
  purple: { bar: "from-purple-500 to-purple-500/20", iconBg: "bg-purple-500/10", ring: "ring-purple-500/20", text: "text-purple-500" },
  primary: { bar: "from-primary to-primary/20", iconBg: "bg-primary/10", ring: "ring-primary/20", text: "text-primary" },
  amber: { bar: "from-amber-500 to-amber-500/20", iconBg: "bg-amber-500/10", ring: "ring-amber-500/20", text: "text-amber-500" },
  blue: { bar: "from-blue-500 to-blue-500/20", iconBg: "bg-blue-500/10", ring: "ring-blue-500/20", text: "text-blue-500" },
  cyan: { bar: "from-cyan-500 to-cyan-500/20", iconBg: "bg-cyan-500/10", ring: "ring-cyan-500/20", text: "text-cyan-500" },
  pink: { bar: "from-pink-500 to-pink-500/20", iconBg: "bg-pink-500/10", ring: "ring-pink-500/20", text: "text-pink-500" },
};

/**
 * Consistent section heading: an accent bar, an icon chip, and a title/subtitle.
 * Pass an `id` to make it an in-page anchor target (with scroll offset so it
 * doesn't land under the sticky chrome).
 */
export function SectionHeader({
  id,
  icon: Icon,
  title,
  subtitle,
  accent = "primary",
}: {
  id?: string;
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  accent?: SectionAccent;
}) {
  const a = ACCENT[accent];
  return (
    <div id={id} className={cn("flex items-center gap-3", id && "scroll-mt-32")}>
      <div className={cn("h-10 w-1 flex-shrink-0 rounded-full bg-gradient-to-b", a.bar)} />
      <div className={cn("rounded-lg p-2 ring-1", a.iconBg, a.ring)}>
        <Icon className={cn("h-5 w-5", a.text)} />
      </div>
      <div>
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
    </div>
  );
}
