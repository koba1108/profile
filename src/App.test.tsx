import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"

import App from "@/App"
import { ThemeProvider } from "@/components/theme-provider"
import { THEME_STORAGE_KEY } from "@/lib/theme"

function installMatchMedia(matches: boolean) {
  const addEventListener = vi.fn()
  const removeEventListener = vi.fn()

  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: vi.fn().mockReturnValue({
      matches,
      media: "(prefers-color-scheme: dark)",
      onchange: null,
      addEventListener,
      removeEventListener,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }),
  })

  return { addEventListener, removeEventListener }
}

function renderApp() {
  return render(
    <ThemeProvider>
      <App />
    </ThemeProvider>,
  )
}

describe("React基盤プレビュー", () => {
  beforeEach(() => {
    installMatchMedia(true)
  })

  it("最小画面とshadcn/uiコンポーネントを表示する", () => {
    renderApp()

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "新しいポートフォリオの土台ができました",
      }),
    ).toBeInTheDocument()
    expect(screen.getByText("React基盤")).toBeInTheDocument()
    expect(
      screen.getByRole("tablist", { name: "基盤プレビュー" }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "基盤の詳細を見る" }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "ライトテーマに切り替える" }),
    ).toBeInTheDocument()
  })

  it("タブをクリックと矢印キーで切り替える", async () => {
    const user = userEvent.setup()
    renderApp()

    expect(
      screen.getByText(/React 19とTypeScript/),
    ).toBeVisible()

    const interactionTab = screen.getByRole("tab", { name: "操作" })
    await user.click(interactionTab)

    expect(
      screen.getByText(
        "テーマ切り替え、タブ、シートをキーボードでも操作できます。",
      ),
    ).toBeVisible()

    const stackTab = screen.getByRole("tab", { name: "構成" })
    stackTab.focus()
    await user.keyboard("{ArrowRight}")
    expect(interactionTab).toHaveFocus()
  })

  it("シートを開き、Escapeで閉じてtriggerへフォーカスを戻す", async () => {
    const user = userEvent.setup()
    renderApp()

    const trigger = screen.getByRole("button", { name: "基盤の詳細を見る" })
    trigger.focus()
    await user.keyboard("{Enter}")

    expect(
      screen.getByRole("dialog", { name: "React基盤の詳細" }),
    ).toBeVisible()

    await user.keyboard("{Escape}")
    expect(
      screen.queryByRole("dialog", { name: "React基盤の詳細" }),
    ).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })
})

describe("テーマ", () => {
  beforeEach(() => {
    installMatchMedia(true)
  })

  it("OS設定を初期値にし、切り替えた値を保存する", async () => {
    const user = userEvent.setup()
    renderApp()

    expect(document.documentElement).toHaveClass("dark")

    await user.click(
      screen.getByRole("button", { name: "ライトテーマに切り替える" }),
    )

    expect(document.documentElement).toHaveClass("light")
    expect(document.documentElement).not.toHaveClass("dark")
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("light")
    expect(
      screen.getByRole("button", { name: "ダークテーマに切り替える" }),
    ).toBeInTheDocument()
  })

  it("保存済みの有効なテーマを復元する", () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, "light")

    renderApp()

    expect(document.documentElement).toHaveClass("light")
    expect(document.documentElement).not.toHaveClass("dark")
  })

  it("不正な保存値を無視してOS設定へフォールバックする", () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, "unknown")

    renderApp()

    expect(document.documentElement).toHaveClass("dark")
    expect(document.documentElement).not.toHaveClass("unknown")
  })

  it("storageの読み書き失敗でもテーマ切り替えを継続する", async () => {
    const user = userEvent.setup()
    const getItem = vi
      .spyOn(Storage.prototype, "getItem")
      .mockImplementation(() => {
        throw new Error("storage blocked")
      })
    const setItem = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new Error("storage blocked")
      })

    renderApp()
    expect(document.documentElement).toHaveClass("dark")

    await user.click(
      screen.getByRole("button", { name: "ライトテーマに切り替える" }),
    )
    expect(document.documentElement).toHaveClass("light")

    getItem.mockRestore()
    setItem.mockRestore()
  })

  it("matchMediaが利用できない場合はDarkへフォールバックする", () => {
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      writable: true,
      value: undefined,
    })

    renderApp()

    expect(document.documentElement).toHaveClass("dark")
  })
})
