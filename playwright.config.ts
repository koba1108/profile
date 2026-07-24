import { defineConfig } from "@playwright/test"

const host = "127.0.0.1"
const port = 4173
const origin = `http://${host}:${port}`

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI
    ? [["line"], ["html", { open: "never" }]]
    : [["list"], ["html", { open: "never" }]],
  expect: {
    timeout: 10_000,
  },
  use: {
    baseURL: `${origin}/profile/`,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  webServer: {
    command: `node node_modules/vite/bin/vite.js preview --host ${host} --port ${port} --strictPort`,
    url: `${origin}/profile/`,
    reuseExistingServer: false,
    timeout: 120_000,
  },
  projects: [
    {
      name: "mobile",
      use: {
        viewport: { width: 375, height: 812 },
      },
    },
    {
      name: "tablet",
      use: {
        viewport: { width: 768, height: 1024 },
      },
    },
    {
      name: "desktop",
      use: {
        viewport: { width: 1440, height: 1000 },
      },
    },
  ],
})
