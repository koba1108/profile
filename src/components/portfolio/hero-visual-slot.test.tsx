import { act, render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { HeroVisualSlot } from "@/components/portfolio/hero-visual-slot"

const particleMock = vi.hoisted(() => ({
  props: null as Record<string, unknown> | null,
}))

vi.mock("@/components/canvasui/ParticleObject", () => ({
  ParticleObject: (props: Record<string, unknown>) => {
    particleMock.props = props
    return <canvas data-testid="particle-object" />
  },
}))

const copy = {
  monogram: "YK",
  leftLabel: "Product",
  rightLabel: "Engineering",
}

function installMatchMedia(mobile: boolean) {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: query === "(max-width: 767px)" ? mobile : false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}

describe("HeroVisualSlot", () => {
  beforeEach(() => {
    particleMock.props = null
    installMatchMedia(false)
    Object.defineProperty(navigator, "connection", {
      configurable: true,
      value: undefined,
    })
  })

  it("Canvas読込中は静的YKを維持し、読込後にテーマ連動の粒子を表示する", async () => {
    const { container } = render(
      <HeroVisualSlot
        copy={copy}
        reducedMotion={false}
        theme="dark"
      />,
    )

    expect(container.firstChild).toHaveAttribute(
      "data-canvas-status",
      "loading",
    )
    expect(
      screen.getByTestId("hero-visual-fallback").querySelector("img"),
    ).toHaveAttribute("src", expect.stringContaining("yk-particle.svg"))
    await screen.findByTestId("particle-object")

    expect(particleMock.props).toMatchObject({
      autoRotate: false,
      color: "#9bb3ff",
      count: 7000,
      maxDpr: 1.5,
      orbit: false,
      zoom: false,
    })

    const onLoad = particleMock.props?.onLoad
    expect(onLoad).toBeTypeOf("function")
    act(() => {
      if (typeof onLoad === "function") {
        onLoad()
      }
    })

    expect(container.firstChild).toHaveAttribute(
      "data-canvas-status",
      "ready",
    )
    expect(screen.getByTestId("hero-visual-fallback")).toHaveClass(
      "opacity-15",
    )
  })

  it("初期化・asset読込失敗時はCanvasを外して静的表示へ戻す", async () => {
    const { container } = render(
      <HeroVisualSlot
        copy={copy}
        reducedMotion={false}
        theme="light"
      />,
    )
    await screen.findByTestId("particle-object")

    const onError = particleMock.props?.onError
    expect(onError).toBeTypeOf("function")
    act(() => {
      if (typeof onError === "function") {
        onError(new Error("WebGL unavailable"))
      }
    })

    await waitFor(() => {
      expect(container.firstChild).toHaveAttribute(
        "data-canvas-status",
        "fallback",
      )
    })
    expect(screen.queryByTestId("particle-object")).not.toBeInTheDocument()
    expect(screen.getByTestId("hero-visual-fallback")).toHaveClass(
      "opacity-100",
    )
  })

  it("reduced motion時はCanvasを初期化しない", () => {
    const { container } = render(
      <HeroVisualSlot
        copy={copy}
        reducedMotion
        theme="dark"
      />,
    )

    expect(container.firstChild).toHaveAttribute(
      "data-canvas-status",
      "fallback",
    )
    expect(screen.queryByTestId("particle-object")).not.toBeInTheDocument()
  })

  it("データセーバー有効時は遅延chunkを描画せず静的表示を使う", () => {
    Object.defineProperty(navigator, "connection", {
      configurable: true,
      value: { saveData: true },
    })
    const { container } = render(
      <HeroVisualSlot
        copy={copy}
        reducedMotion={false}
        theme="dark"
      />,
    )

    expect(container.firstChild).toHaveAttribute(
      "data-canvas-status",
      "fallback",
    )
    expect(screen.queryByTestId("particle-object")).not.toBeInTheDocument()
  })

  it("モバイルでは粒子数とDPRを抑える", async () => {
    installMatchMedia(true)
    render(
      <HeroVisualSlot
        copy={copy}
        reducedMotion={false}
        theme="light"
      />,
    )
    await screen.findByTestId("particle-object")

    expect(particleMock.props).toMatchObject({
      color: "#3158c9",
      count: 2500,
      maxDpr: 1,
      radius: 72,
    })
  })
})
