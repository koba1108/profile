import { ArrowDown, ExternalLink } from "lucide-react"
import { useEffect, useState } from "react"

import { HeroVisualSlot } from "@/components/portfolio/hero-visual-slot"
import { useTheme } from "@/components/theme-context"
import { Button } from "@/components/ui/button"
import type { Profile } from "@/content/types"

interface HeroSectionProps {
  copy: {
    githubCta: string
    visual: {
      leftLabel: string
      monogram: string
      rightLabel: string
    }
    workCta: string
  }
  githubHref: `https://${string}`
  hasPublishedWorks: boolean
  profile: Profile
}

function readReducedMotion() {
  if (typeof window.matchMedia !== "function") {
    return false
  }

  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches
  } catch {
    return false
  }
}

function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(readReducedMotion)

  useEffect(() => {
    if (typeof window.matchMedia !== "function") {
      return
    }

    let mediaQuery: MediaQueryList

    try {
      mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    } catch {
      return
    }

    const handleChange = () => setReducedMotion(mediaQuery.matches)
    mediaQuery.addEventListener?.("change", handleChange)
    return () => mediaQuery.removeEventListener?.("change", handleChange)
  }, [])

  return reducedMotion
}

export function HeroSection({
  copy,
  githubHref,
  hasPublishedWorks,
  profile,
}: HeroSectionProps) {
  const { theme } = useTheme()
  const reducedMotion = useReducedMotion()

  return (
    <section
      aria-labelledby="hero-title"
      className="scroll-mt-20 py-16 sm:py-24 lg:py-28"
      id="top"
    >
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] lg:gap-16">
        <div className="min-w-0">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            {profile.roles.value.join(" / ")}
          </p>
          <h1
            className="mt-5 max-w-3xl text-balance text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl"
            id="hero-title"
          >
            {profile.headline.value}
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground">
            {profile.introduction.value}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {hasPublishedWorks ? (
              <Button asChild className="min-h-11">
                <a href="#work">
                  {copy.workCta}
                  <ArrowDown aria-hidden="true" />
                </a>
              </Button>
            ) : null}
            <Button asChild className="min-h-11" variant="outline">
              <a
                href={githubHref}
                referrerPolicy="no-referrer"
                rel="noopener noreferrer"
                target="_blank"
              >
                {copy.githubCta}
                <ExternalLink aria-hidden="true" />
              </a>
            </Button>
          </div>
          <p className="mt-8 text-sm font-medium text-muted-foreground">
            {profile.displayName.value} · @{profile.handle.value}
          </p>
        </div>
        <HeroVisualSlot
          className="mx-auto lg:mx-0 lg:ml-auto"
          copy={copy.visual}
          reducedMotion={reducedMotion}
          theme={theme}
        />
      </div>
    </section>
  )
}
