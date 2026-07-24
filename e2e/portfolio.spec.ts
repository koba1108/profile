import AxeBuilder from "@axe-core/playwright"
import { expect, test, type Locator, type Page } from "@playwright/test"

const expectedBaseURL = new URL(
  process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:4173/profile/",
)

function captureRuntimeErrors(page: Page) {
  const errors: string[] = []
  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(`console: ${message.text()}`)
    }
  })
  page.on("pageerror", (error) => {
    errors.push(`pageerror: ${error.message}`)
  })
  return errors
}

async function openPortfolio(page: Page) {
  const failedResponses: string[] = []
  page.on("response", (response) => {
    if (response.status() >= 400) {
      failedResponses.push(`${response.status()} ${response.url()}`)
    }
  })

  await page.goto("./")
  await expect(page).toHaveURL(/\/profile\/$/)
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "技術と事業をつなぎ、0→1から運用までプロダクトを前進させる。",
    }),
  ).toBeVisible()
  await page.waitForLoadState("networkidle")
  expect(failedResponses).toEqual([])
}

async function focusByTab(page: Page, target: Locator, maximumTabs = 40) {
  for (let count = 0; count < maximumTabs; count += 1) {
    await page.keyboard.press("Tab")
    if (
      await target.evaluate((element) => element === document.activeElement)
    ) {
      return
    }
  }
  throw new Error(
    `Tabキーで対象へ移動できませんでした: ${await target.allTextContents()}`,
  )
}

async function expectVisibleFocus(target: Locator) {
  await expect(target).toBeFocused()
  const focusStyle = await target.evaluate((element) => {
    const style = getComputedStyle(element)
    return {
      boxShadow: style.boxShadow,
      outlineStyle: style.outlineStyle,
      outlineWidth: style.outlineWidth,
    }
  })
  expect(
    focusStyle.boxShadow !== "none" ||
      (focusStyle.outlineStyle !== "none" &&
        Number.parseFloat(focusStyle.outlineWidth) > 0),
  ).toBe(true)
}

async function expectFocusInside(page: Page, container: Locator) {
  await expect
    .poll(() =>
      container.evaluate((element) => element.contains(document.activeElement)),
    )
    .toBe(true)
  await page.keyboard.press("Tab")
  expect(
    await container.evaluate((element) =>
      element.contains(document.activeElement),
    ),
  ).toBe(true)
}

test("主要導線、テーマ、詳細表示を利用できる", async ({
  page,
}, testInfo) => {
  const runtimeErrors = captureRuntimeErrors(page)
  await openPortfolio(page)

  await page.getByRole("link", { name: "Selected Work" }).first().click()
  await expect(page).toHaveURL(/\/profile\/#work$/)
  await expect(
    page.getByRole("heading", { level: 2, name: "Selected Work" }),
  ).toBeVisible()

  const detailsTrigger = page
    .getByRole("button", {
      name: "ライブ配信プラットフォームの詳細を見る",
    })
    .first()
  await detailsTrigger.click()
  await expect(
    page.getByRole("dialog", { name: "ライブ配信プラットフォーム" }),
  ).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(detailsTrigger).toBeFocused()

  const themeToggle = page.getByRole("button", {
    name: /^(ライト|ダーク)テーマに切り替える$/,
  })
  const initialThemeLabel = await themeToggle.getAttribute("aria-label")
  await themeToggle.click()
  await expect(themeToggle).not.toHaveAttribute(
    "aria-label",
    initialThemeLabel ?? "",
  )

  if (testInfo.project.name === "mobile") {
    await page.getByRole("button", { name: "メニューを開く" }).click()
    const menu = page.getByRole("dialog", { name: "ページメニュー" })
    await expect(menu).toBeVisible()
    await menu.getByRole("link", { name: "About" }).click()
    await expect(menu).toBeHidden()
    await expect(page).toHaveURL(/#about$/)
  }

  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  )
  expect(overflow).toBe(0)
  expect(runtimeErrors).toEqual([])
})

test("GitHubとContactは承認済みの安全な外部リンクだけを使う", async ({
  page,
}) => {
  const runtimeErrors = captureRuntimeErrors(page)
  await openPortfolio(page)

  const githubLinks = page.locator(
    'a[href="https://github.com/koba1108"][target="_blank"]',
  )
  await expect(githubLinks).toHaveCount(2)
  for (const link of await githubLinks.all()) {
    await expect(link).toHaveAttribute("rel", "noopener noreferrer")
    await expect(link).toHaveAttribute("referrerpolicy", "no-referrer")
  }
  expect(runtimeErrors).toEqual([])
})

test("section hashを含むURLを再読み込みできる", async ({ page }) => {
  const runtimeErrors = captureRuntimeErrors(page)
  const initialResponse = await page.goto("./#work")
  expect(initialResponse?.ok()).toBe(true)
  await expect(page).toHaveURL(/\/profile\/#work$/)

  const reloadResponse = await page.reload()
  expect(reloadResponse?.ok()).toBe(true)
  await expect(
    page.getByRole("heading", { level: 2, name: "Selected Work" }),
  ).toBeVisible()
  await expect(page).toHaveURL(/\/profile\/#work$/)
  expect(runtimeErrors).toEqual([])
})

test("主要操作をキーボードだけで利用できる", async ({
  page,
}, testInfo) => {
  const runtimeErrors = captureRuntimeErrors(page)
  await openPortfolio(page)

  await page.keyboard.press("Tab")
  const skipLink = page.getByRole("link", { name: "本文へスキップ" })
  await expectVisibleFocus(skipLink)
  await page.keyboard.press("Enter")
  await expect(page.getByRole("main")).toBeFocused()

  await page.reload()
  const themeToggle = page.getByRole("button", {
    name: /^(ライト|ダーク)テーマに切り替える$/,
  })
  await focusByTab(page, themeToggle)
  await expectVisibleFocus(themeToggle)
  const initialThemeLabel = await themeToggle.getAttribute("aria-label")
  await page.keyboard.press("Space")
  await expect(themeToggle).not.toHaveAttribute(
    "aria-label",
    initialThemeLabel ?? "",
  )

  await page.reload()
  const detailsTrigger = page
    .getByRole("button", {
      name: "ライブ配信プラットフォームの詳細を見る",
    })
    .first()
  await focusByTab(page, detailsTrigger)
  await expectVisibleFocus(detailsTrigger)
  await page.keyboard.press("Enter")
  const workDialog = page.getByRole("dialog", {
    name: "ライブ配信プラットフォーム",
  })
  await expect(workDialog).toBeVisible()
  await expectFocusInside(page, workDialog)
  await page.keyboard.press("Escape")
  await expect(detailsTrigger).toBeFocused()

  await page.reload()
  const productTab = page.getByRole("tab", {
    name: "Product & Leadership",
  })
  const backendTab = page.getByRole("tab", {
    name: "Backend Engineering",
  })
  await focusByTab(page, productTab)
  await expectVisibleFocus(productTab)
  await page.keyboard.press("ArrowRight")
  await expectVisibleFocus(backendTab)
  await expect(backendTab).toHaveAttribute("aria-selected", "true")

  if (testInfo.project.name === "mobile") {
    await page.reload()
    const menuTrigger = page.getByRole("button", { name: "メニューを開く" })
    await focusByTab(page, menuTrigger)
    await expectVisibleFocus(menuTrigger)
    await page.keyboard.press("Enter")
    const menuDialog = page.getByRole("dialog", { name: "ページメニュー" })
    await expect(menuDialog).toBeVisible()
    await expectFocusInside(page, menuDialog)
    await page.keyboard.press("Escape")
    await expect(menuTrigger).toBeFocused()
  }

  expect(runtimeErrors).toEqual([])
})

test("画面幅ごとのlayoutを維持する", async ({ page }, testInfo) => {
  const runtimeErrors = captureRuntimeErrors(page)
  await openPortfolio(page)

  const [heroColumns, workColumns] = await Promise.all([
    page.locator("#top > div").evaluate(
      (element) =>
        getComputedStyle(element).gridTemplateColumns.trim().split(/\s+/)
          .length,
    ),
    page.locator("#work > div:last-child").evaluate(
      (element) =>
        getComputedStyle(element).gridTemplateColumns.trim().split(/\s+/)
          .length,
    ),
  ])
  const desktopNavigation = page.getByRole("navigation", {
    name: "ページナビゲーション",
  })
  const mobileMenu = page.getByRole("button", { name: "メニューを開く" })
  const heroCopy = page.locator("#top > div > div").first()
  const heroVisual = page.locator("[data-canvas-status]")

  if (testInfo.project.name === "mobile") {
    expect(heroColumns).toBe(1)
    expect(workColumns).toBe(1)
    await expect(desktopNavigation).toBeHidden()
    await expect(mobileMenu).toBeVisible()
  } else if (testInfo.project.name === "tablet") {
    expect(heroColumns).toBe(1)
    expect(workColumns).toBe(2)
    await expect(desktopNavigation).toBeVisible()
    await expect(mobileMenu).toBeHidden()
  } else {
    expect(heroColumns).toBe(2)
    expect(workColumns).toBe(2)
    await expect(desktopNavigation).toBeVisible()
    await expect(mobileMenu).toBeHidden()
  }

  const [copyBox, visualBox] = await Promise.all([
    heroCopy.boundingBox(),
    heroVisual.boundingBox(),
  ])
  expect(copyBox).not.toBeNull()
  expect(visualBox).not.toBeNull()
  if (copyBox && visualBox) {
    const overlaps =
      copyBox.x < visualBox.x + visualBox.width &&
      copyBox.x + copyBox.width > visualBox.x &&
      copyBox.y < visualBox.y + visualBox.height &&
      copyBox.y + copyBox.height > visualBox.y
    expect(overlaps).toBe(false)
    expect(visualBox.x + visualBox.width).toBeLessThanOrEqual(
      testInfo.project.use.viewport?.width ?? 0,
    )
  }

  expect(runtimeErrors).toEqual([])
})

test("重大なaxe違反がない", async ({ page }) => {
  const runtimeErrors = captureRuntimeErrors(page)
  await openPortfolio(page)

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze()
  const seriousOrCritical = results.violations.filter((violation) =>
    ["serious", "critical"].includes(violation.impact ?? ""),
  )

  expect(seriousOrCritical).toEqual([])
  expect(runtimeErrors).toEqual([])
})

test("dialog・theme・fallback状態でも重大なaxe違反がない", async ({
  page,
}, testInfo) => {
  const runtimeErrors = captureRuntimeErrors(page)
  if (testInfo.project.name === "mobile") {
    await page.emulateMedia({ reducedMotion: "reduce" })
  }
  await openPortfolio(page)

  const themeToggle = page.getByRole("button", {
    name: /^(ライト|ダーク)テーマに切り替える$/,
  })
  await themeToggle.click()

  if (testInfo.project.name === "mobile") {
    await expect(page.locator("[data-canvas-status]")).toHaveAttribute(
      "data-canvas-fallback-reason",
      "reduced-motion",
    )
    await page.getByRole("button", { name: "メニューを開く" }).click()
    await expect(
      page.getByRole("dialog", { name: "ページメニュー" }),
    ).toBeVisible()
  } else {
    await page
      .getByRole("button", {
        name: "ライブ配信プラットフォームの詳細を見る",
      })
      .first()
      .click()
    await expect(
      page.getByRole("dialog", { name: "ライブ配信プラットフォーム" }),
    ).toBeVisible()
  }

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze()
  const seriousOrCritical = results.violations.filter((violation) =>
    ["serious", "critical"].includes(violation.impact ?? ""),
  )

  expect(seriousOrCritical).toEqual([])
  expect(runtimeErrors).toEqual([])
})

test("実行時通信はsame-origin assetだけを取得する", async ({ page }) => {
  const runtimeErrors = captureRuntimeErrors(page)
  const externalRequests: string[] = []
  const outsideBasePathRequests: string[] = []
  page.on("request", (request) => {
    const url = new URL(request.url())
    if (
      url.protocol.startsWith("http") &&
      url.origin !== expectedBaseURL.origin
    ) {
      externalRequests.push(request.url())
    } else if (
      url.protocol.startsWith("http") &&
      url.origin === expectedBaseURL.origin &&
      !url.pathname.startsWith(expectedBaseURL.pathname)
    ) {
      outsideBasePathRequests.push(request.url())
    }
  })

  await openPortfolio(page)
  await page.waitForLoadState("networkidle")

  expect(externalRequests).toEqual([])
  expect(outsideBasePathRequests).toEqual([])
  expect(runtimeErrors).toEqual([])
})

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" })

  test("Particle chunkを取得せず静的YKを表示する", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile")
    const runtimeErrors = captureRuntimeErrors(page)
    const particleRequests: string[] = []
    page.on("request", (request) => {
      if (request.url().includes("ParticleObject")) {
        particleRequests.push(request.url())
      }
    })

    await page.emulateMedia({ reducedMotion: "reduce" })
    await openPortfolio(page)
    const visual = page.locator("[data-canvas-status]")
    await expect(visual).toHaveAttribute("data-canvas-status", "fallback")
    await expect(visual).toHaveAttribute(
      "data-canvas-fallback-reason",
      "reduced-motion",
    )
    await expect(visual.locator("img")).toBeVisible()
    await expect(visual.locator("canvas")).toHaveCount(0)
    expect(particleRequests).toEqual([])
    expect(runtimeErrors).toEqual([])
  })
})

test("WebGL失敗時もConsole errorなしで静的YKへ切り替わる", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop")
  const runtimeErrors = captureRuntimeErrors(page)
  await page.addInitScript(() => {
    const originalGetContext = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = function (
      contextId: string,
      ...args: unknown[]
    ) {
      if (contextId === "webgl2") {
        return null
      }
      return Reflect.apply(originalGetContext, this, [contextId, ...args])
    } as typeof HTMLCanvasElement.prototype.getContext
  })

  await openPortfolio(page)
  const visual = page.locator("[data-canvas-status]")
  await expect(visual).toHaveAttribute("data-canvas-status", "fallback")
  await expect(visual).toHaveAttribute(
    "data-canvas-fallback-reason",
    "webgl",
  )
  await expect(visual.locator("img")).toBeVisible()
  await expect(visual.locator("canvas")).toHaveCount(0)
  expect(runtimeErrors).toEqual([])
})
