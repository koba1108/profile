export const forbiddenFragments = [
  "facebook.com",
  "fonts.googleapis.com",
  "google.com/maps",
  "maps.google",
  "mailto:",
  "static/images/profile",
  "slides/services",
  "cdn-icons-png.flaticon.com",
  "data:image",
  "upload.wikimedia.org",
]

export const privatePatterns = [
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

export function assertNoForbiddenReferences(source, label) {
  for (const fragment of forbiddenFragments) {
    if (source.includes(fragment)) {
      throw new Error(`${label} に公開対象外の参照があります`)
    }
  }
}

export function assertNoPrivateValues(source, label) {
  for (const { label: patternLabel, pattern } of privatePatterns) {
    if (pattern.test(source)) {
      throw new Error(`${label} に公開対象外の${patternLabel}らしき値があります`)
    }
  }
}

export function assertNoPrivateText(source, label) {
  assertNoForbiddenReferences(source, label)
  assertNoPrivateValues(source, label)
}
