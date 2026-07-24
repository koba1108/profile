import assert from "node:assert/strict"
import { createHash } from "node:crypto"
import test from "node:test"

import {
  collectLegacyPrivateValues,
  getLegacyPrivateBinaryDigest,
} from "./legacy-private-baseline.mjs"

test("immutable historyから値を表示せずprivacy baselineを取得する", async () => {
  const [values, binaryDigest] = await Promise.all([
    collectLegacyPrivateValues(),
    getLegacyPrivateBinaryDigest(),
  ])

  assert.equal(values.length, 4)
  assert.ok(values.every((value) => value.length >= 4))
  assert.equal(
    createHash("sha256")
      .update([...values].sort().join("\0"))
      .digest("hex"),
    "48c3cb832add21baf4fbf8a1ad5bc5a8637f85160f391906f3f5880b2fc84347",
  )
  assert.equal(
    binaryDigest,
    "e15e54e6b7ccb0b426ef1cb22ffa7da0a5f6f4d248c2cc4d23b46c3560bdf337",
  )
})
