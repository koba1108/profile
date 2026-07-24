import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"

import App from "@/App"
import { ThemeProvider } from "@/components/theme-provider"
import { THEME_STORAGE_KEY } from "@/lib/theme"

function installMatchMedia(darkMode: boolean) {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: query.includes("color-scheme") ? darkMode : false,
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

function renderApp() {
  return render(
    <ThemeProvider>
      <App />
    </ThemeProvider>,
  )
}

describe("Portfolio", () => {
  beforeEach(() => {
    installMatchMedia(true)
  })

  it("承認済み情報だけで1ページの主要セクションを表示する", () => {
    const { container } = renderApp()

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "技術と事業をつなぎ、0→1から運用までプロダクトを前進させる。",
      }),
    ).toBeInTheDocument()

    expect(
      screen.getAllByRole("heading", { level: 2 }).map((heading) => heading.textContent),
    ).toEqual([
      "Selected Work",
      "Capabilities",
      "Engineering Approach",
      "小林 良昇 / ykoba",
      "Contact",
    ])
    for (const link of screen.getAllByRole("link", {
      name: "Selected Work",
    })) {
      expect(link).toHaveAttribute("href", "#work")
    }
    for (const title of [
      "ライブ配信プラットフォーム",
      "婚活マッチングサービス",
      "コンサル人材マッチングサービス",
      "転職・副業マッチングサービス",
    ]) {
      expect(
        screen.getByRole("heading", { level: 3, name: title }),
      ).toBeInTheDocument()
    }

    expect(container.querySelector('a[href^="mailto:"]')).toBeNull()
    expect(container.querySelector('a[href*="facebook"]')).toBeNull()
    expect(container.querySelector('a[href*="maps"]')).toBeNull()
    expect(container).not.toHaveTextContent(/\d+歳/)
    expect(container).not.toHaveTextContent(/現住所/)
    expect(container).not.toHaveTextContent(/\bTODO\b/i)
    expect(container.querySelector("img")).toBeNull()
  })

  it("skip linkとページ内anchorを提供する", () => {
    renderApp()

    expect(screen.getByRole("link", { name: "本文へスキップ" })).toHaveAttribute(
      "href",
      "#main-content",
    )
    expect(screen.getByRole("main")).toHaveAttribute("id", "main-content")
    expect(
      screen.getByRole("link", { name: "Capabilities" }),
    ).toHaveAttribute("href", "#capabilities")
  })

  it("モバイルメニューを開き、リンク選択で閉じる", async () => {
    const user = userEvent.setup()
    renderApp()

    await user.click(screen.getByRole("button", { name: "メニューを開く" }))
    const dialog = screen.getByRole("dialog", { name: "ページメニュー" })
    const aboutLink = within(dialog).getByRole("link", { name: "About" })

    await user.click(aboutLink)

    expect(
      screen.queryByRole("dialog", { name: "ページメニュー" }),
    ).not.toBeInTheDocument()
  })

  it("Capabilitiesのタブをクリックと矢印キーで切り替える", async () => {
    const user = userEvent.setup()
    renderApp()

    expect(
      screen.getByText(/サービス立ち上げ、システム設計/),
    ).toBeVisible()

    const backendTab = screen.getByRole("tab", {
      name: "Backend Engineering",
    })
    await user.click(backendTab)
    expect(screen.getByText(/イベント駆動システム/)).toBeVisible()

    const productTab = screen.getByRole("tab", {
      name: "Product & Leadership",
    })
    productTab.focus()
    await user.keyboard("{ArrowRight}")
    expect(backendTab).toHaveFocus()
  })

  it("GitHubリンクだけを安全な外部リンクとして公開する", () => {
    const { container } = renderApp()
    const links = Array.from(
      container.querySelectorAll<HTMLAnchorElement>('a[target="_blank"]'),
    )

    expect(links).toHaveLength(2)
    for (const link of links) {
      expect(link).toHaveAttribute("href", "https://github.com/koba1108")
      expect(link).toHaveAttribute("rel", "noopener noreferrer")
      expect(link).toHaveAttribute("referrerpolicy", "no-referrer")
    }
  })
})

describe("テーマ", () => {
  beforeEach(() => {
    installMatchMedia(true)
  })

  it("OS設定を初期値にし、切り替えた値だけを保存する", async () => {
    const user = userEvent.setup()
    renderApp()

    expect(document.documentElement).toHaveClass("dark")
    await user.click(
      screen.getByRole("button", { name: "ライトテーマに切り替える" }),
    )

    expect(document.documentElement).toHaveClass("light")
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("light")
    expect([...Object.keys(window.localStorage)]).toEqual([THEME_STORAGE_KEY])
  })

  it("不正な保存値を無視してOS設定へフォールバックする", () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, "unknown")

    renderApp()

    expect(document.documentElement).toHaveClass("dark")
    expect(document.documentElement).not.toHaveClass("unknown")
  })

  it("保存済みの有効なテーマを復元する", () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, "light")

    renderApp()

    expect(document.documentElement).toHaveClass("light")
    expect(document.documentElement).not.toHaveClass("dark")
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
