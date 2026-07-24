import { readFile, readdir } from "node:fs/promises"
import path from "node:path"

const root = path.resolve("react-dist")
const publicRoot = path.resolve("react-public")
const publicPath = "/profile/"
const legacyPrivateSourcePaths = [
  path.resolve("content/about.md"),
  path.resolve("data/homepage.yml"),
  path.resolve("hugo.toml"),
]
const expectedCanonical = "https://koba1108.github.io/profile/"
const pageTitle = "小林 良昇 | ykoba"
const pageDescription =
  "小林 良昇（ykoba）のポートフォリオ。システムエンジニア、CTO、テックリードとして現行サイトで公開済みの経験と技術スタックを掲載しています。"
const socialDescription =
  "システムエンジニア、CTO、テックリードとしての公開済み経験と技術スタック。"
const expectedSocialMetadata = new Map([
  ["property:og:locale", "ja_JP"],
  ["property:og:type", "website"],
  ["property:og:site_name", pageTitle],
  ["property:og:title", pageTitle],
  ["property:og:description", socialDescription],
  ["property:og:url", expectedCanonical],
  ["property:og:image", `${expectedCanonical}ogp.png`],
  ["property:og:image:width", "1200"],
  ["property:og:image:height", "630"],
  ["property:og:image:alt", "小林 良昇 / ykoba ポートフォリオ"],
  ["name:twitter:card", "summary_large_image"],
  ["name:twitter:title", pageTitle],
  ["name:twitter:description", socialDescription],
  ["name:twitter:image", `${expectedCanonical}ogp.png`],
])
const forbiddenFragments = [
  "facebook.com",
  "fonts.googleapis.com",
  "google.com/maps",
  "maps.google",
  "mailto:",
  "static/images/profile",
  "slides/services",
  "cdn-icons-png.flaticon.com",
  "upload.wikimedia.org",
]
const privatePatterns = [
  {
    label: "email address",
    pattern: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
  },
  {
    label: "phone number",
    pattern: /(?:\+81[- (]*|0\d{1,4}[- (])\d{1,4}[- )]*\d{3,4}\b/,
  },
  {
    label: "private profile label",
    pattern: /(?:メールアドレス|電話番号|住所|所在地|年齢)\s*[:：]/,
  },
]
const allowedFilePatterns = [
  /^index\.html$/,
  /^favicon\.svg$/,
  /^ogp\.png$/,
  /^site\.webmanifest$/,
  /^assets\/index-[A-Za-z0-9_-]+\.js$/,
  /^assets\/index-[A-Za-z0-9_-]+\.css$/,
  /^assets\/ParticleObject-[A-Za-z0-9_-]+\.js$/,
  /^assets\/yk-particle-[A-Za-z0-9_-]+\.svg$/,
]

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

function parseAttributes(tag) {
  return Object.fromEntries(
    [...tag.matchAll(/([:\w-]+)\s*=\s*(["'])(.*?)\2/gs)].map((match) => [
      match[1],
      match[3],
    ]),
  )
}

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const target = path.join(directory, entry.name)
      return entry.isDirectory() ? listFiles(target) : [target]
    }),
  )
  return nested.flat()
}

async function collectLegacyPrivateValues() {
  const values = new Set()
  const sources = await Promise.all(
    legacyPrivateSourcePaths.map((file) => readFile(file, "utf8")),
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

function assertOneMatch(files, pattern) {
  const matches = files.filter((file) => pattern.test(file))
  assert(
    matches.length === 1,
    `React配布物は ${pattern} に一致するfileを1個だけ含めます: ${matches.join(", ")}`,
  )
  return matches[0]
}

function assertPublicRootUrls(file, source) {
  const rootUrls = [
    ...source.matchAll(/(?:href|src)=["'](\/[^"']+)["']/g),
    ...source.matchAll(/url\(\s*["']?(\/[^"')\s]+)["']?\s*\)/g),
  ].map((match) => match[1])

  for (const url of rootUrls) {
    assert(
      url.startsWith(publicPath),
      `${file} のroot-relative URLが ${publicPath} 外を参照しています: ${url}`,
    )
  }
}

function inspectPng(buffer, label) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  assert(
    buffer.subarray(0, signature.length).equals(signature),
    `${label} はPNGではありません`,
  )
  assert(buffer.length <= 500_000, `${label} は500KBを超えています`)

  const allowedChunks = new Set(["IHDR", "pHYs", "IDAT", "IEND"])
  const chunks = []
  let offset = signature.length
  let width
  let height

  while (offset < buffer.length) {
    assert(offset + 12 <= buffer.length, `${label} のPNG chunkが壊れています`)
    const length = buffer.readUInt32BE(offset)
    const type = buffer.toString("ascii", offset + 4, offset + 8)
    const dataStart = offset + 8
    const nextOffset = dataStart + length + 4
    assert(nextOffset <= buffer.length, `${label} の${type} chunkが壊れています`)
    assert(
      allowedChunks.has(type),
      `${label} に未承認のPNG metadata chunk ${type} があります`,
    )
    chunks.push(type)
    if (type === "IHDR") {
      width = buffer.readUInt32BE(dataStart)
      height = buffer.readUInt32BE(dataStart + 4)
    }
    offset = nextOffset
  }

  assert(offset === buffer.length, `${label} のPNG末尾が壊れています`)
  assert(width === 1200 && height === 630, `${label} は1200x630ではありません`)
  assert(chunks[0] === "IHDR", `${label} の先頭chunkがIHDRではありません`)
  assert(chunks.at(-1) === "IEND", `${label} の末尾chunkがIENDではありません`)
}

const files = await listFiles(root)
const relativeFiles = files.map((file) => path.relative(root, file))
const legacyPrivateValues = await collectLegacyPrivateValues()

for (const file of relativeFiles) {
  assert(
    allowedFilePatterns.some((pattern) => pattern.test(file)),
    `React配布物に未承認fileがあります: ${file}`,
  )
}
for (const pattern of allowedFilePatterns) {
  assertOneMatch(relativeFiles, pattern)
}

const textFiles = files.filter((file) => !file.endsWith(".png"))
for (const file of textFiles) {
  const relativeFile = path.relative(root, file)
  const source = await readFile(file, "utf8")
  for (const fragment of forbiddenFragments) {
    assert(
      !source.includes(fragment),
      `${relativeFile} に公開対象外の参照 ${fragment} があります`,
    )
  }
  for (const { label, pattern } of privatePatterns) {
    assert(
      !pattern.test(source),
      `${relativeFile} に公開対象外の${label}らしき値があります`,
    )
  }
  assert(
    !legacyPrivateValues.some((value) => source.includes(value)),
    `${relativeFile} に現行portfolioの非公開値が含まれています`,
  )
  assert(
    !source.includes("sourceMappingURL="),
    `${relativeFile} にsource map参照があります`,
  )
  assertPublicRootUrls(relativeFile, source)
}

const index = await readFile(path.join(root, "index.html"), "utf8")
assert(index.includes(`<title>${pageTitle}</title>`), "titleが未承認値です")
for (const link of [
  `rel="canonical" href="${expectedCanonical}"`,
  'rel="icon" href="/profile/favicon.svg"',
  'rel="manifest" href="/profile/site.webmanifest"',
]) {
  assert(index.includes(link), `index.htmlのlinkが未承認値です: ${link}`)
}

const metaAttributes = [...index.matchAll(/<meta\b[^>]*>/gs)].map((match) =>
  parseAttributes(match[0]),
)
const descriptions = metaAttributes.filter(
  (attributes) => attributes.name === "description",
)
assert(
  descriptions.length === 1 && descriptions[0].content === pageDescription,
  "description metadataは承認済みの1個だけを許可します",
)
assert(
  !metaAttributes.some((attributes) =>
    /^(?:email|telephone|address|location)$/i.test(attributes.name ?? ""),
  ),
  "連絡先・所在地metadataを公開しません",
)

const actualSocialMetadata = new Map()
for (const attributes of metaAttributes) {
  const key = attributes.property?.startsWith("og:")
    ? `property:${attributes.property}`
    : attributes.name?.startsWith("twitter:")
      ? `name:${attributes.name}`
      : undefined
  if (!key) continue
  assert(
    expectedSocialMetadata.has(key),
    `未承認のOG/Twitter metadataがあります: ${key}`,
  )
  assert(
    !actualSocialMetadata.has(key),
    `OG/Twitter metadataが重複しています: ${key}`,
  )
  actualSocialMetadata.set(key, attributes.content)
}
assert(
  actualSocialMetadata.size === expectedSocialMetadata.size,
  "OG/Twitter metadataの種類が承認済みpolicyと一致しません",
)
for (const [key, content] of expectedSocialMetadata) {
  assert(
    actualSocialMetadata.get(key) === content,
    `OG/Twitter metadataが未承認値です: ${key}`,
  )
}

const manifest = JSON.parse(
  await readFile(path.join(root, "site.webmanifest"), "utf8"),
)
assert(manifest.start_url === publicPath, "manifestのstart_urlが不正です")
assert(
  Array.isArray(manifest.icons) &&
    manifest.icons.length === 1 &&
    manifest.icons[0]?.src === `${publicPath}favicon.svg`,
  "manifestは承認済みfaviconだけを参照します",
)

const mainChunk = assertOneMatch(
  relativeFiles,
  /^assets\/index-[A-Za-z0-9_-]+\.js$/,
)
const particleChunk = assertOneMatch(
  relativeFiles,
  /^assets\/ParticleObject-[A-Za-z0-9_-]+\.js$/,
)
const [mainSource, particleSource] = await Promise.all([
  readFile(path.join(root, mainChunk), "utf8"),
  readFile(path.join(root, particleChunk), "utf8"),
])
assert(
  mainSource.includes(path.basename(particleChunk)),
  "main chunkからParticle Objectをdynamic importできません",
)
assert(
  !index.includes(path.basename(particleChunk)),
  "index.htmlからParticle Objectを直接読み込んでいます",
)
for (const marker of ["WebGLRenderer", "BufferGeometry"]) {
  assert(
    !mainSource.includes(marker),
    `Three.js marker ${marker} がmain chunkへ混入しています`,
  )
  assert(
    particleSource.includes(marker),
    `Three.js marker ${marker} がParticle chunkにありません`,
  )
}

const [sourceOgp, builtOgp] = await Promise.all([
  readFile(path.join(publicRoot, "ogp.png")),
  readFile(path.join(root, "ogp.png")),
])
inspectPng(sourceOgp, "react-public/ogp.png")
inspectPng(builtOgp, "react-dist/ogp.png")
assert(sourceOgp.equals(builtOgp), "build後のOGPが承認済みsourceと一致しません")

console.log(
  `React配布物監査: ${relativeFiles.length} files / allowlist・PII・base path・PNG metadata・lazy chunk分離 OK`,
)
