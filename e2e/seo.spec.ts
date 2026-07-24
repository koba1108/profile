import { expect, test } from "@playwright/test"

test("公開URL向けSEO metadataとローカル画像を提供する", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop")
  await page.goto("./")

  await expect(page).toHaveTitle("小林 良昇 | ykoba")
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    "小林 良昇（ykoba）のポートフォリオ。システムエンジニア、CTO、テックリードとして現行サイトで公開済みの経験と技術スタックを掲載しています。",
  )
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://koba1108.github.io/profile/",
  )
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
    "content",
    "https://koba1108.github.io/profile/",
  )
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    "https://koba1108.github.io/profile/ogp.png",
  )
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    "content",
    "summary_large_image",
  )
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute(
    "href",
    "/profile/favicon.svg",
  )

  const [favicon, ogp] = await Promise.all([
    page.request.get("/profile/favicon.svg"),
    page.request.get("/profile/ogp.png"),
  ])
  expect(favicon.ok()).toBe(true)
  expect(favicon.headers()["content-type"]).toContain("image/svg+xml")
  expect(ogp.ok()).toBe(true)
  expect(ogp.headers()["content-type"]).toContain("image/png")
})
