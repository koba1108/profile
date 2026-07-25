import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useEffect } from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { SelectedWorkSection } from "@/components/portfolio/selected-work-section"
import { ThemeProvider } from "@/components/theme-provider"
import { pageCopy } from "@/content/page"
import { workCandidates } from "@/content/works"
import { selectPublishedWorks } from "@/lib/publication"

let magnifyMode: "capture-error" | "error" | "ready" = "ready"

vi.mock("@/components/canvasui/Magnify", () => ({
  Magnify: ({
    onError,
    onReady,
  }: {
    onError?: (error: Error) => void
    onReady?: () => void
  }) => {
    useEffect(() => {
      if (magnifyMode === "capture-error") {
        onError?.(new Error("Magnify could not capture HTML"))
      } else if (magnifyMode === "error") {
        onError?.(new Error("Magnify could not initialize WebGL"))
      } else {
        onReady?.()
      }
    }, [onError, onReady])

    return <div data-testid="magnify" />
  },
}))

const works = selectPublishedWorks(workCandidates)

function installMatchMedia({
  finePointer = true,
  reducedMotion = false,
}: {
  finePointer?: boolean
  reducedMotion?: boolean
} = {}) {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      addEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
      matches: query.includes("prefers-reduced-motion")
        ? reducedMotion
        : query.includes("pointer: fine")
          ? finePointer
          : false,
      media: query,
      onchange: null,
      removeEventListener: vi.fn(),
    })),
    writable: true,
  })
}

function renderSection() {
  return render(
    <ThemeProvider>
      <SelectedWorkSection copy={pageCopy.work} works={works} />
    </ThemeProvider>,
  )
}

describe("SelectedWorkSection Project Lens", () => {
  beforeEach(() => {
    magnifyMode = "ready"
    installMatchMedia()
    Object.defineProperty(navigator, "connection", {
      configurable: true,
      value: undefined,
    })
    Object.defineProperty(window, "WebGL2RenderingContext", {
      configurable: true,
      value: class WebGL2RenderingContext {},
    })
  })

  it("通常HTMLを初期表示し、明示操作でLensをON/OFFにする", async () => {
    const user = userEvent.setup()
    renderSection()

    const toggle = screen.getByRole("button", {
      name: pageCopy.work.lens.enable,
    })
    expect(toggle).toHaveAttribute("aria-pressed", "false")
    expect(screen.queryByTestId("magnify")).not.toBeInTheDocument()
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(
      works.length,
    )
    const firstHeading = screen.getByRole("heading", {
      level: 3,
      name: works[0].title,
    })
    const firstDetails = screen.getByRole("button", {
      name: `${works[0].title}${pageCopy.work.detailsCtaSuffix}`,
    })

    await user.click(toggle)

    expect(await screen.findByTestId("magnify")).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: pageCopy.work.lens.disable }),
    ).toHaveAttribute("aria-pressed", "true")
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(
      works.length,
    )
    expect(
      screen.getByRole("heading", { level: 3, name: works[0].title }),
    ).toBe(firstHeading)
    expect(
      screen.getByRole("button", {
        name: `${works[0].title}${pageCopy.work.detailsCtaSuffix}`,
      }),
    ).toBe(firstDetails)

    await user.click(
      screen.getByRole("button", { name: pageCopy.work.lens.disable }),
    )

    expect(screen.queryByTestId("magnify")).not.toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: pageCopy.work.lens.enable }),
    ).toHaveAttribute("aria-pressed", "false")
    expect(
      screen.getByRole("heading", { level: 3, name: works[0].title }),
    ).toBe(firstHeading)
  })

  it.each([
    {
      expectedReason: "reduced-motion",
      setup: () => installMatchMedia({ reducedMotion: true }),
    },
    {
      expectedReason: "coarse-pointer",
      setup: () => installMatchMedia({ finePointer: false }),
    },
    {
      expectedReason: "save-data",
      setup: () =>
        Object.defineProperty(navigator, "connection", {
          configurable: true,
          value: { saveData: true },
        }),
    },
  ])(
    "$expectedReasonでは通常HTMLだけを表示する",
    ({ expectedReason, setup }) => {
      setup()
      const { container } = renderSection()

      expect(
        screen.getByRole("button", { name: pageCopy.work.lens.enable }),
      ).toBeDisabled()
      expect(screen.queryByTestId("magnify")).not.toBeInTheDocument()
      expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(
        works.length,
      )
      expect(
        container.querySelector("[data-project-lens-status]"),
      ).toHaveAttribute("data-project-lens-fallback-reason", expectedReason)
    },
  )

  it("WebGL初期化失敗時はConsoleを使わず通常HTMLへ戻す", async () => {
    const user = userEvent.setup()
    magnifyMode = "error"
    const { container } = renderSection()

    await user.click(
      screen.getByRole("button", { name: pageCopy.work.lens.enable }),
    )

    await waitFor(() => {
      expect(
        container.querySelector("[data-project-lens-status]"),
      ).toHaveAttribute("data-project-lens-status", "fallback")
    })
    expect(
      container.querySelector("[data-project-lens-status]"),
    ).toHaveAttribute("data-project-lens-fallback-reason", "webgl")
    expect(screen.queryByTestId("magnify")).not.toBeInTheDocument()
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(
      works.length,
    )
  })

  it("WebGL2 preflight失敗時はMagnifyをmountしない", async () => {
    const user = userEvent.setup()
    Object.defineProperty(window, "WebGL2RenderingContext", {
      configurable: true,
      value: undefined,
    })
    const { container } = renderSection()

    await user.click(
      screen.getByRole("button", { name: pageCopy.work.lens.enable }),
    )

    expect(
      container.querySelector("[data-project-lens-status]"),
    ).toHaveAttribute("data-project-lens-fallback-reason", "webgl")
    expect(screen.queryByTestId("magnify")).not.toBeInTheDocument()
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(
      works.length,
    )
  })

  it("HTML capture失敗時は通常HTMLへ戻す", async () => {
    const user = userEvent.setup()
    magnifyMode = "capture-error"
    const { container } = renderSection()

    await user.click(
      screen.getByRole("button", { name: pageCopy.work.lens.enable }),
    )

    await waitFor(() => {
      expect(
        container.querySelector("[data-project-lens-status]"),
      ).toHaveAttribute("data-project-lens-fallback-reason", "capture")
    })
    expect(screen.queryByTestId("magnify")).not.toBeInTheDocument()
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(
      works.length,
    )
  })
})
