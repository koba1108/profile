import { cn } from "@/lib/utils"
import type { Theme } from "@/lib/theme"

export interface HeroVisualProps {
  className?: string
  copy: {
    leftLabel: string
    monogram: string
    rightLabel: string
  }
  theme: Theme
  reducedMotion: boolean
}

export function HeroVisualSlot({
  className,
  copy,
  theme,
  reducedMotion,
}: HeroVisualProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative aspect-square w-full max-w-md overflow-hidden rounded-[2rem] border bg-card shadow-sm",
        className,
      )}
      data-reduced-motion={reducedMotion}
      data-theme={theme}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_22%,color-mix(in_oklch,var(--primary)_30%,transparent),transparent_42%),linear-gradient(145deg,transparent_20%,color-mix(in_oklch,var(--muted)_80%,transparent))]" />
      <div className="absolute -right-12 top-10 size-48 rounded-full border border-primary/25" />
      <div className="absolute -bottom-16 -left-10 size-64 rounded-full border border-primary/20" />
      <div className="absolute inset-0 grid place-items-center">
        <span className="select-none text-[clamp(6rem,24vw,10rem)] font-black leading-none tracking-[-0.12em] text-foreground/90">
          {copy.monogram}
        </span>
      </div>
      <div className="absolute inset-x-6 bottom-6 flex items-center justify-between border-t border-foreground/15 pt-3 text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
        <span>{copy.leftLabel}</span>
        <span>{copy.rightLabel}</span>
      </div>
    </div>
  )
}
