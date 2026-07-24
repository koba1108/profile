import { access, mkdir, readFile } from "node:fs/promises"
import { spawn, spawnSync } from "node:child_process"
import net from "node:net"
import path from "node:path"

import { chromium } from "@playwright/test"

const host = "127.0.0.1"
const port = "4173"
const url = `http://${host}:${port}/profile/`
const outputDirectory = path.resolve("tmp/lighthouse")
const lighthouseCli = path.resolve("node_modules/lighthouse/cli/index.js")
const thresholds = {
  performance: 0.85,
  accessibility: 0.95,
  "best-practices": 0.95,
  seo: 0.95,
}
const runs = Number.parseInt(process.env.LIGHTHOUSE_RUNS ?? "3", 10)

async function firstExisting(candidates) {
  for (const candidate of candidates) {
    if (!candidate) continue
    try {
      await access(candidate)
      return candidate
    } catch {
      // Continue to the next known browser location.
    }
  }
  return undefined
}

function findOnPath(commands) {
  for (const command of commands) {
    const result = spawnSync("which", [command], { encoding: "utf8" })
    if (result.status === 0) {
      return result.stdout.trim()
    }
  }
  return undefined
}

async function waitForServer() {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    try {
      const response = await fetch(url)
      if (response.ok) return
    } catch {
      // Preview is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250))
  }
  throw new Error(`Preview did not start: ${url}`)
}

function assertPortAvailable() {
  return new Promise((resolve, reject) => {
    const server = net.createServer()
    server.once("error", (error) => {
      reject(
        new Error(
          `Lighthouse用port ${port}を利用できません: ${error.message}`,
        ),
      )
    })
    server.once("listening", () => server.close(resolve))
    server.listen(Number(port), host)
  })
}

function runLighthouse(outputPath, chromePath) {
  return new Promise((resolve, reject) => {
    const child = spawn(
      process.execPath,
      [
        lighthouseCli,
        url,
        "--quiet",
        "--only-categories=performance,accessibility,best-practices,seo",
        "--output=json",
        `--output-path=${outputPath}`,
        '--chrome-flags=--headless=new --no-sandbox',
      ],
      {
        env: { ...process.env, CHROME_PATH: chromePath },
        stdio: "inherit",
      },
    )
    child.on("error", reject)
    child.on("exit", (code) => {
      if (code === 0) resolve()
      else reject(new Error(`Lighthouse exited with code ${code}`))
    })
  })
}

function median(values) {
  const sorted = values.toSorted((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle]
}

async function stopPreview(preview) {
  if (preview.exitCode !== null) return

  const exited = new Promise((resolve) => preview.once("exit", resolve))
  preview.kill("SIGTERM")
  await Promise.race([
    exited,
    new Promise((resolve) => setTimeout(resolve, 5_000)),
  ])

  if (preview.exitCode === null) {
    preview.kill("SIGKILL")
    await Promise.race([
      exited,
      new Promise((resolve) => setTimeout(resolve, 1_000)),
    ])
  }
}

const chromePath =
  process.env.CHROME_PATH ??
  (await firstExisting([
    chromium.executablePath(),
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
  ])) ??
  findOnPath(["google-chrome", "google-chrome-stable", "chromium"])

if (!chromePath) {
  throw new Error("Chrome/Chromiumが見つかりません。CHROME_PATHを指定してください。")
}
if (!Number.isInteger(runs) || runs < 1) {
  throw new Error("LIGHTHOUSE_RUNSは1以上の整数にしてください。")
}

const browserVersion = spawnSync(chromePath, ["--version"], {
  encoding: "utf8",
})
const lighthouseVersion = JSON.parse(
  await readFile(path.resolve("node_modules/lighthouse/package.json"), "utf8"),
).version
console.log(
  `Lighthouse ${lighthouseVersion} / browser: ${
    browserVersion.stdout.trim() || chromePath
  }`,
)

await mkdir(outputDirectory, { recursive: true })
await assertPortAvailable()
const preview = spawn(
  process.execPath,
  [
    path.resolve("node_modules/vite/bin/vite.js"),
    "preview",
    "--host",
    host,
    "--port",
    port,
    "--strictPort",
  ],
  { stdio: "inherit" },
)

try {
  await Promise.race([
    waitForServer(),
    new Promise((_, reject) => {
      preview.once("exit", (code) => {
        reject(new Error(`Preview exited before startup with code ${code}`))
      })
    }),
  ])
  const scores = Object.fromEntries(
    Object.keys(thresholds).map((category) => [category, []]),
  )

  for (let run = 1; run <= runs; run += 1) {
    const outputPath = path.join(outputDirectory, `report-${run}.json`)
    console.log(`Lighthouse ${run}/${runs}: ${url}`)
    await runLighthouse(outputPath, chromePath)
    const report = JSON.parse(await readFile(outputPath, "utf8"))
    for (const category of Object.keys(thresholds)) {
      scores[category].push(report.categories[category].score)
    }
  }

  let failed = false
  for (const [category, threshold] of Object.entries(thresholds)) {
    const values = scores[category].toSorted((a, b) => a - b)
    const medianScore = median(values)
    console.log(
      `${category}: median ${Math.round(medianScore * 100)} (${values
        .map((value) => Math.round(value * 100))
        .join(", ")}) / target ${Math.round(threshold * 100)}`,
    )
    if (medianScore < threshold) failed = true
  }
  if (failed) {
    throw new Error("Lighthouseの目標値を満たしていません。")
  }
} finally {
  await stopPreview(preview)
}
