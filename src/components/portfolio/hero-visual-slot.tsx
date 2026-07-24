import { lazy, Suspense, useEffect, useState } from "react"

import ykParticleSource from "@/assets/yk-particle.svg?no-inline"
import { cn } from "@/lib/utils"
import type { Theme } from "@/lib/theme"
import type { ParticleObjectProps } from "@/components/canvasui/ParticleObject"

function ParticleObjectLoadFailure({
  onError,
}: Pick<ParticleObjectProps, "onError">) {
  useEffect(() => {
    onError?.(new Error("Particle Object module could not be loaded"))
  }, [onError])

  return <></>
}

const ParticleObject = lazy(async () => {
  try {
    const module = await import("@/components/canvasui/ParticleObject")
    return { default: module.ParticleObject }
  } catch {
    return { default: ParticleObjectLoadFailure }
  }
})

type CanvasStatus = "loading" | "ready" | "fallback"
type CanvasFallbackReason =
  | "asset-decode"
  | "asset-fetch"
  | "asset-format"
  | "module"
  | "reduced-motion"
  | "save-data"
  | "webgl"
type ParticleProfile = "mobile" | "tablet" | "desktop"

interface NetworkInformationLike {
  addEventListener?: (type: "change", listener: () => void) => void
  removeEventListener?: (type: "change", listener: () => void) => void
  saveData?: boolean
}

function getNetworkInformation(): NetworkInformationLike | undefined {
  return (
    navigator as Navigator & { connection?: NetworkInformationLike }
  ).connection
}

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

function readParticleProfile(): ParticleProfile {
  if (typeof window.matchMedia !== "function") {
    return "desktop"
  }

  try {
    if (window.matchMedia("(max-width: 767px)").matches) {
      return "mobile"
    }
    if (window.matchMedia("(max-width: 1023px)").matches) {
      return "tablet"
    }
    return "desktop"
  } catch {
    return "desktop"
  }
}

function useParticleEnvironment() {
  const [profile, setProfile] = useState(readParticleProfile)
  const [saveData, setSaveData] = useState(
    () => getNetworkInformation()?.saveData === true,
  )

  useEffect(() => {
    if (typeof window.matchMedia !== "function") {
      return
    }

    let mobileQuery: MediaQueryList
    let tabletQuery: MediaQueryList
    try {
      mobileQuery = window.matchMedia("(max-width: 767px)")
      tabletQuery = window.matchMedia("(max-width: 1023px)")
    } catch {
      return
    }

    const connection = getNetworkInformation()
    const handleChange = () => {
      setProfile(readParticleProfile())
      setSaveData(connection?.saveData === true)
    }
    mobileQuery.addEventListener?.("change", handleChange)
    tabletQuery.addEventListener?.("change", handleChange)
    connection?.addEventListener?.("change", handleChange)
    return () => {
      mobileQuery.removeEventListener?.("change", handleChange)
      tabletQuery.removeEventListener?.("change", handleChange)
      connection?.removeEventListener?.("change", handleChange)
    }
  }, [])

  return { profile, saveData }
}

export function HeroVisualSlot({
  className,
  copy,
  theme,
  reducedMotion,
}: HeroVisualProps) {
  const { profile, saveData } = useParticleEnvironment()
  const [canvasStatus, setCanvasStatus] = useState<CanvasStatus>(
    reducedMotion || saveData ? "fallback" : "loading",
  )
  const [fallbackReason, setFallbackReason] =
    useState<CanvasFallbackReason | null>(
      reducedMotion ? "reduced-motion" : saveData ? "save-data" : null,
    )

  useEffect(() => {
    setCanvasStatus(reducedMotion || saveData ? "fallback" : "loading")
    setFallbackReason(
      reducedMotion ? "reduced-motion" : saveData ? "save-data" : null,
    )
  }, [reducedMotion, saveData])

  const particleColor = theme === "dark" ? "#9bb3ff" : "#3158c9"
  const renderCanvas =
    !reducedMotion && !saveData && canvasStatus !== "fallback"
  const particlePerformance = {
    mobile: { count: 2500, maxDpr: 1, radius: 72, size: 2.7 },
    tablet: { count: 4000, maxDpr: 1.25, radius: 90, size: 2.5 },
    desktop: { count: 7000, maxDpr: 1.5, radius: 105, size: 2.4 },
  }[profile]
  const handleCanvasError = (error: unknown) => {
    const message = error instanceof Error ? error.message : ""
    let reason: CanvasFallbackReason = "asset-fetch"
    if (message.includes("module")) {
      reason = "module"
    } else if (message.includes("WebGL")) {
      reason = "webgl"
    } else if (message.includes("decode") || message.includes("2d context")) {
      reason = "asset-decode"
    } else if (message.includes("format")) {
      reason = "asset-format"
    }
    setFallbackReason(reason)
    setCanvasStatus("fallback")
  }

  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative aspect-square w-full max-w-md overflow-hidden rounded-[2rem] border bg-card shadow-sm",
        className,
      )}
      data-canvas-status={canvasStatus}
      data-canvas-fallback-reason={fallbackReason ?? undefined}
      data-particle-profile={profile}
      data-particle-source={ykParticleSource}
      data-reduced-motion={reducedMotion}
      data-save-data={saveData}
      data-theme={theme}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_22%,color-mix(in_oklch,var(--primary)_30%,transparent),transparent_42%),linear-gradient(145deg,transparent_20%,color-mix(in_oklch,var(--muted)_80%,transparent))]" />
      <div className="absolute -right-12 top-10 size-48 rounded-full border border-primary/25" />
      <div className="absolute -bottom-16 -left-10 size-64 rounded-full border border-primary/20" />

      <div
        className={cn(
          "absolute inset-0 grid place-items-center transition-opacity duration-300",
          canvasStatus === "ready" ? "opacity-15" : "opacity-100",
        )}
        data-testid="hero-visual-fallback"
      >
        <img
          alt=""
          className="size-[72%] select-none object-contain"
          src={ykParticleSource}
        />
      </div>

      {renderCanvas ? (
        <Suspense fallback={null}>
          <ParticleObject
            autoRotate={false}
            cameraDistance={4.5}
            className="absolute inset-0"
            color={particleColor}
            count={particlePerformance.count}
            drift={0.18}
            floatIntensity={0.25}
            floatSpeed={0.55}
            maxDpr={particlePerformance.maxDpr}
            onError={handleCanvasError}
            onLoad={() => {
              setCanvasStatus("ready")
              setFallbackReason(null)
            }}
            orbit={false}
            radius={particlePerformance.radius}
            rotationIntensity={0.12}
            scale={2.9}
            size={particlePerformance.size}
            spring={1.15}
            src={ykParticleSource}
            strength={0.9}
            style={{ inset: 0, position: "absolute" }}
            swirl={0.35}
            zoom={false}
          />
        </Suspense>
      ) : null}

      <div className="absolute inset-x-6 bottom-6 flex items-center justify-between border-t border-foreground/15 pt-3 text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
        <span>{copy.leftLabel}</span>
        <span>{copy.rightLabel}</span>
      </div>
    </div>
  )
}
