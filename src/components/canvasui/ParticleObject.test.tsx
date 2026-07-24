import { render, waitFor } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { ParticleObject } from "@/components/canvasui/ParticleObject"

describe("ParticleObject", () => {
  it("WebGLを初期化できない場合はonErrorへ通知する", async () => {
    const onError = vi.fn()
    const getContext = vi
      .spyOn(HTMLCanvasElement.prototype, "getContext")
      .mockReturnValue(null)
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined)

    try {
      render(<ParticleObject onError={onError} src="/yk-particle.svg" />)

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(
          expect.objectContaining({
            message: "Particle Object could not initialize WebGL",
          }),
        )
      })
      expect(consoleError).not.toHaveBeenCalled()
    } finally {
      getContext.mockRestore()
      consoleError.mockRestore()
    }
  })
})
