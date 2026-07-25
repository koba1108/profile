import { ScanSearch } from "lucide-react"
import {
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react"

import type { MagnifyProps } from "@/components/canvasui/Magnify"
import { SectionHeading } from "@/components/portfolio/section-heading"
import { useTheme } from "@/components/theme-context"
import { WorkCard } from "@/components/portfolio/work-card"
import { Button } from "@/components/ui/button"
import type { PublishedWork, WorkSectionCopy } from "@/content/types"

function MagnifyLoadFailure({
  onError,
}: Pick<MagnifyProps, "capture" | "interactionRef" | "onError">) {
  useEffect(() => {
    onError?.(new Error("Magnify module could not be loaded"))
  }, [onError])

  return <></>
}

const Magnify = lazy(async () => {
  try {
    const module = await import("@/components/canvasui/Magnify")
    return { default: module.Magnify }
  } catch {
    return { default: MagnifyLoadFailure }
  }
})

interface SelectedWorkSectionProps {
  copy: WorkSectionCopy
  works: readonly PublishedWork[]
}

type LensStatus = "fallback" | "loading" | "off" | "on"
type LensFallbackReason =
  | "coarse-pointer"
  | "capture"
  | "module"
  | "reduced-motion"
  | "save-data"
  | "webgl"

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

function readLensFallbackReason(): LensFallbackReason | null {
  if (typeof window.matchMedia !== "function") {
    return "coarse-pointer"
  }

  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return "reduced-motion"
    }
    if (getNetworkInformation()?.saveData === true) {
      return "save-data"
    }
    if (
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches
    ) {
      return "coarse-pointer"
    }
  } catch {
    return "coarse-pointer"
  }

  return null
}

function supportsWebGL2() {
  return typeof window.WebGL2RenderingContext !== "undefined"
}

function useLensEnvironment() {
  const [fallbackReason, setFallbackReason] = useState(readLensFallbackReason)

  useEffect(() => {
    if (typeof window.matchMedia !== "function") {
      return
    }

    let motionQuery: MediaQueryList
    let pointerQuery: MediaQueryList
    try {
      motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
      pointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)")
    } catch {
      return
    }
    const connection = getNetworkInformation()
    const handleChange = () => setFallbackReason(readLensFallbackReason())
    motionQuery.addEventListener?.("change", handleChange)
    pointerQuery.addEventListener?.("change", handleChange)
    connection?.addEventListener?.("change", handleChange)
    return () => {
      motionQuery.removeEventListener?.("change", handleChange)
      pointerQuery.removeEventListener?.("change", handleChange)
      connection?.removeEventListener?.("change", handleChange)
    }
  }, [])

  return fallbackReason
}

function WorkGrid({
  children,
  measureRef,
}: {
  children: ReactNode
  measureRef?: React.RefObject<HTMLDivElement | null>
}) {
  return (
    <div
      className="grid gap-5 md:grid-cols-2"
      data-work-grid=""
      ref={measureRef}
    >
      {children}
    </div>
  )
}

function ProjectLensCapture({
  copy,
  works,
}: {
  copy: WorkSectionCopy
  works: readonly PublishedWork[]
}) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {works.map((work) => (
        <article className="min-w-0" key={work.id}>
          <div className="flex h-full flex-col rounded-xl border bg-card py-6 shadow-sm">
            <div className="grid gap-3 px-6">
              <p className="text-sm font-semibold text-primary">{work.role}</p>
              <p className="text-balance text-2xl font-semibold tracking-tight">
                {work.title}
              </p>
              <p className="text-base leading-7 text-muted-foreground">
                {work.responsibilities.join(" / ")}
              </p>
            </div>
            <div className="flex-1 px-6 pt-6">
              <ul className="flex flex-wrap gap-2">
                {work.technologies.slice(0, 4).map((technology) => (
                  <li
                    className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold"
                    key={technology}
                  >
                    {technology}
                  </li>
                ))}
              </ul>
            </div>
            <div className="px-6 pt-6">
              <span className="inline-flex min-h-9 items-center rounded-md border px-4 text-sm font-medium">
                {copy.detailsCta}
              </span>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}

export function SelectedWorkSection({
  copy,
  works,
}: SelectedWorkSectionProps) {
  const { theme } = useTheme()
  const environmentFallback = useLensEnvironment()
  const [lensStatus, setLensStatus] = useState<LensStatus>(
    environmentFallback ? "fallback" : "off",
  )
  const [runtimeFallback, setRuntimeFallback] =
    useState<LensFallbackReason | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (environmentFallback) {
      setLensStatus("fallback")
    } else if (!runtimeFallback) {
      setLensStatus((current) => (current === "fallback" ? "off" : current))
    }
  }, [environmentFallback, runtimeFallback])

  const fallbackReason = runtimeFallback ?? environmentFallback
  const lensAvailable = fallbackReason === null
  const cards = works.map((work) => (
    <WorkCard copy={copy} key={work.id} work={work} />
  ))
  const enableLens = () => {
    if (!lensAvailable) return
    if (!supportsWebGL2()) {
      setRuntimeFallback("webgl")
      setLensStatus("fallback")
      return
    }
    setLensStatus("loading")
  }
  const disableLens = () => {
    setLensStatus("off")
  }
  const handleLensError = (error: Error) => {
    setRuntimeFallback(
      error.message.includes("module")
        ? "module"
        : error.message.includes("capture")
          ? "capture"
          : "webgl",
    )
    setLensStatus("fallback")
  }

  return (
    <section
      aria-labelledby="work-title"
      className="scroll-mt-20 border-t py-16 sm:py-24"
      id="work"
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          description={copy.description}
          eyebrow={copy.eyebrow}
          id="work-title"
          title={copy.title}
        />
        <div
          className="flex w-full min-w-0 flex-col items-start gap-3 sm:w-auto sm:shrink-0 sm:flex-row sm:items-center"
          data-project-lens-fallback-reason={fallbackReason ?? undefined}
          data-project-lens-status={lensStatus}
        >
          <div className="text-left sm:text-right">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              {copy.lens.label}
            </p>
            <p
              aria-live="polite"
              className="mt-1 text-xs text-muted-foreground"
              id="project-lens-note"
            >
              {lensAvailable
                ? lensStatus === "loading"
                  ? copy.lens.loading
                  : copy.lens.hint
                : copy.lens.unavailable}
            </p>
          </div>
          <Button
            aria-disabled={!lensAvailable}
            aria-describedby="project-lens-note"
            aria-pressed={lensStatus === "loading" || lensStatus === "on"}
            className={
              runtimeFallback
                ? "h-auto min-h-11 max-w-full cursor-not-allowed whitespace-normal opacity-50"
                : lensStatus === "on"
                  ? "h-auto min-h-11 max-w-full whitespace-normal border-foreground bg-foreground text-background hover:bg-foreground/90 hover:text-background"
                  : "h-auto min-h-11 max-w-full whitespace-normal"
            }
            disabled={environmentFallback !== null}
            onClick={
              lensStatus === "loading" || lensStatus === "on"
                ? disableLens
                : enableLens
            }
            type="button"
            variant="outline"
          >
            <ScanSearch aria-hidden="true" />
            {lensStatus === "loading" || lensStatus === "on"
              ? copy.lens.disable
              : copy.lens.enable}
          </Button>
        </div>
      </div>
      <div className="relative mt-10">
        <WorkGrid measureRef={gridRef}>{cards}</WorkGrid>
        {lensStatus === "loading" || lensStatus === "on" ? (
          <Suspense fallback={null}>
            <Magnify
              aberration={0.55}
              capture={<ProjectLensCapture copy={copy} works={works} />}
              className="pointer-events-none absolute inset-0"
              color={
                theme === "dark"
                  ? [0.58, 0.7, 1]
                  : [0.22, 0.43, 0.98]
              }
              follow={0.32}
              haze={0.12}
              hud={0.82}
              interactionRef={gridRef}
              onError={handleLensError}
              onReady={() => setLensStatus("on")}
              rippleBend={12}
              rippleGlow={0.75}
              ripples
              size={112}
              zoom={1.35}
            />
          </Suspense>
        ) : null}
      </div>
    </section>
  )
}
