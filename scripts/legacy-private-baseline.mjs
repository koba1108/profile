import { execFile } from "node:child_process"
import { createHash } from "node:crypto"
import { promisify } from "node:util"

const execFileAsync = promisify(execFile)
const baselineCommit = "3b67135b0ff844530d4edb5308b30b9aadff4a19"
const legacyPrivateTextPaths = [
  "content/about.md",
  "data/homepage.yml",
  "hugo.toml",
]
const legacyPrivateBinaryPath = "static/images/profile.jpg"

async function readBaselineFile(file, encoding) {
  try {
    const { stdout } = await execFileAsync(
      "git",
      ["show", `${baselineCommit}:${file}`],
      {
        encoding,
        maxBuffer: 2_000_000,
      },
    )
    return stdout
  } catch {
    throw new Error(
      "Privacy baselineを取得できません。immutableなGit履歴を含むcheckoutが必要です",
    )
  }
}

export async function collectLegacyPrivateValues() {
  const values = new Set()
  const sources = await Promise.all(
    legacyPrivateTextPaths.map((file) => readBaselineFile(file, "utf8")),
  )

  for (const source of sources) {
    for (const match of source.matchAll(
      /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
    )) {
      values.add(match[0])
    }
    for (const match of source.matchAll(
      /https?:\/\/[^\s"'<>]*(?:facebook\.com|google\.com\/maps|maps\.google)[^\s"'<>]*/gi,
    )) {
      values.add(match[0])
    }
    for (const line of source.split(/\r?\n/)) {
      const markdownValue = line.match(
        /^\s*-\s*\*\*(?:年齢|住所)\*\*\s*[:：]\s*(.+?)\s*$/,
      )?.[1]
      const configValue = line.match(
        /^\s*(?:address|email|googlemaps)\s*=\s*["'](.+?)["']\s*$/i,
      )?.[1]
      for (const value of [markdownValue, configValue]) {
        if (value && value.length >= 4) values.add(value)
      }
    }
  }

  return [...values]
}

export async function getLegacyPrivateBinaryDigest() {
  const source = await readBaselineFile(legacyPrivateBinaryPath, "buffer")
  return createHash("sha256").update(source).digest("hex")
}
