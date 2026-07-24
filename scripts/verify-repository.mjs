import { execFile } from "node:child_process"
import { createHash } from "node:crypto"
import { lstat, readFile, readdir } from "node:fs/promises"
import path from "node:path"
import { promisify } from "node:util"

import {
  collectLegacyPrivateValues,
  getLegacyPrivateBinaryDigest,
} from "./legacy-private-baseline.mjs"
import {
  assertNoForbiddenReferences,
  assertNoPrivateValues,
} from "./publication-policy.mjs"

const execFileAsync = promisify(execFile)
const removedLegacyPaths = [
  ".gitmodules",
  ".hugo_build.lock",
  "archetypes",
  "assets/jsconfig.json",
  "content",
  "data",
  "dist",
  "hugo.darwin",
  "hugo.exe",
  "hugo.linux",
  "hugo.toml",
  "hugo_stats.json",
  "resources",
  "static",
  "themes",
]
const publicSourceRoots = ["src", "react-public"]
const publicSourceFiles = ["index.html"]
const allowedBinaryDigests = new Map([
  [
    "docs/screenshots/issue-2/current-desktop.jpg",
    "87c3ad34d3ba246c5ac531b31301fed20f284161b9ca7d39d2be9a7ffcb079b0",
  ],
  [
    "docs/screenshots/issue-2/current-mobile.jpg",
    "0e47331ed3786ec51fdc9d741133c2ca8b63af003bbaadc439aff8c9894327de",
  ],
  [
    "react-public/ogp.png",
    "03baf1a8e6b96c0ba3d7aab9a4c19ee53afb59077538999eab8950c42d92bead",
  ],
])
const repositoryTextExtensions = new Set([
  ".css",
  ".html",
  ".json",
  ".md",
  ".mjs",
  ".svg",
  ".ts",
  ".tsx",
  ".webmanifest",
  ".yml",
  ".yaml",
])
const repositoryTextFilesWithoutExtension = new Set([".gitignore"])
const textExtensions = new Set([
  ".css",
  ".html",
  ".json",
  ".svg",
  ".ts",
  ".tsx",
])

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

async function pathExists(target) {
  try {
    await lstat(target)
    return true
  } catch (error) {
    if (error?.code === "ENOENT") return false
    throw error
  }
}

async function listTextFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const target = path.join(directory, entry.name)
      if (entry.isDirectory()) return listTextFiles(target)
      if (entry.isFile() && textExtensions.has(path.extname(entry.name))) {
        return [target]
      }
      return []
    }),
  )
  return nested.flat()
}

async function listRepositoryFiles() {
  const { stdout } = await execFileAsync(
    "git",
    ["ls-files", "--cached", "--others", "--exclude-standard", "-z"],
    { encoding: "buffer", maxBuffer: 2_000_000 },
  )
  return stdout
    .toString("utf8")
    .split("\0")
    .filter(Boolean)
}

for (const legacyPath of removedLegacyPaths) {
  assert(
    !(await pathExists(legacyPath)),
    `撤去済みのlegacy pathが復活しています: ${legacyPath}`,
  )
}

const [legacyPrivateValues, legacyPrivateBinaryDigest, repositoryFiles] =
  await Promise.all([
    collectLegacyPrivateValues(),
    getLegacyPrivateBinaryDigest(),
    listRepositoryFiles(),
  ])
let repositoryTextCount = 0
for (const file of repositoryFiles) {
  if (!(await pathExists(file))) continue
  const fileStat = await lstat(file)
  assert(
    fileStat.isFile() && !fileStat.isSymbolicLink(),
    `repositoryに通常file以外があります: ${file}`,
  )

  const source = await readFile(file)
  const digest = createHash("sha256").update(source).digest("hex")
  assert(
    digest !== legacyPrivateBinaryDigest,
    `${file} がprivacy baselineの非公開binaryと一致します`,
  )

  const extension = path.extname(file).toLowerCase()
  const isTextFile =
    repositoryTextExtensions.has(extension) ||
    repositoryTextFilesWithoutExtension.has(file)
  if (!isTextFile) {
    assert(
      allowedBinaryDigests.get(file) === digest,
      `未承認または変更されたbinary assetがあります: ${file}`,
    )
    continue
  }

  let text
  try {
    text = new TextDecoder("utf-8", { fatal: true }).decode(source)
  } catch {
    throw new Error(`text allowlist上のfileがUTF-8ではありません: ${file}`)
  }
  assert(!text.includes("\0"), `text fileにNUL byteがあります: ${file}`)
  assertNoPrivateValues(text, file)
  assert(
    !legacyPrivateValues.some((value) => text.includes(value)),
    `${file} にprivacy baselineと一致する非公開値があります`,
  )
  repositoryTextCount += 1
}

const sourceFiles = [
  ...publicSourceFiles,
  ...(
    await Promise.all(publicSourceRoots.map((root) => listTextFiles(root)))
  ).flat(),
]
for (const file of sourceFiles) {
  const source = await readFile(file, "utf8")
  assertNoPrivateValues(source, file)
  if (!file.includes(".test.")) {
    assertNoForbiddenReferences(source, file)
  }
}

const [qualityWorkflow, packageSource, readme] = await Promise.all([
  readFile(".github/workflows/react-quality.yml", "utf8"),
  readFile("package.json", "utf8"),
  readFile("README.md", "utf8"),
])
assert(
  !qualityWorkflow.includes("submodules:"),
  "React Quality workflowでsubmoduleを取得しません",
)

const packageJson = JSON.parse(packageSource)
assert(
  packageJson.scripts?.check?.startsWith("npm run verify:repo &&"),
  "checkの先頭でrepository境界を検証してください",
)
for (const command of [
  "npm ci",
  "npm run dev",
  "npm run check",
  "npm run test:e2e",
  "npm run test:lighthouse",
  "npm run preview",
  "npm run test:e2e:published",
]) {
  assert(readme.includes(command), `READMEに保守commandがありません: ${command}`)
}
assert(
  readme.includes("非公開情報") && readme.includes("react-dist"),
  "READMEにprivacy境界と公開artifactを記載してください",
)

console.log(
  `Repository監査: legacy path 0件 / repository text ${repositoryTextCount} files / 公開source ${sourceFiles.length} files / binary allowlist・保守手順 OK`,
)
