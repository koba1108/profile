import assert from "node:assert/strict"
import test from "node:test"

import {
  assertNoForbiddenReferences,
  assertNoPrivateText,
  assertNoPrivateValues,
} from "./publication-policy.mjs"

test("承認済みの公開文言を許可する", () => {
  assert.doesNotThrow(() =>
    assertNoPrivateText("GitHubで公開プロジェクトを見る", "fixture"),
  )
})

test("禁止した外部参照を値を表示せず拒否する", () => {
  assert.throws(
    () => assertNoForbiddenReferences("mailto:", "fixture"),
    /^Error: fixture に公開対象外の参照があります$/,
  )
})

test("PII形式とprivate labelを値を表示せず拒否する", () => {
  for (const value of [
    ["contact", "example.invalid"].join("@"),
    ["03", "0000", "0000"].join("-"),
    ["住所", "非公開サンプル"].join(": "),
  ]) {
    assert.throws(
      () => assertNoPrivateValues(value, "fixture"),
      /^Error: fixture に公開対象外の.+らしき値があります$/,
    )
  }
})
