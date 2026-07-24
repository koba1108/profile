import { expect, test } from "@playwright/test"

const publishedBaseURL = process.env.PLAYWRIGHT_BASE_URL

test("旧Hugo限定assetを公開していない", async ({ request }, testInfo) => {
  test.skip(!publishedBaseURL, "React版の公開後だけ検証する")
  test.skip(testInfo.project.name !== "desktop")

  const legacyAssetPaths = [
    "/profile/images/profile.jpg",
    "/profile/slides/services.html",
    "/profile/slides/services.md",
    "/profile/android-chrome-192x192.png",
    "/profile/browserconfig.xml",
  ]
  const responses = await Promise.all(
    legacyAssetPaths.map((assetPath) => request.get(assetPath)),
  )

  for (const response of responses) {
    expect(response.status()).toBe(404)
  }
})
