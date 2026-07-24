import { describe, expect, it } from "vitest"

import type {
  ExistingPublicWorkSource,
  Work,
} from "@/content/types"
import {
  isExistingPublicWorkSource,
  isPublishedWork,
  selectPublishedWorks,
} from "@/lib/publication"

const approvalUrl =
  "https://github.com/koba1108/profile/issues/4#issuecomment-5071031559" as const
const homepageSource =
  "https://github.com/koba1108/profile/blob/3b67135b0ff844530d4edb5308b30b9aadff4a19/data/homepage.yml#L47-L49" as const
const aboutSource =
  "https://github.com/koba1108/profile/blob/3b67135b0ff844530d4edb5308b30b9aadff4a19/content/about.md#L72-L76" as const

function field<T>(value: T, sourceRef: ExistingPublicWorkSource) {
  return {
    value,
    verificationStatus: "verified" as const,
    sourceRefs: [sourceRef],
  }
}

const approvedFixture = {
  id: "fixture",
  title: field("公開済みサンプル", homepageSource),
  role: field("テスト担当", homepageSource),
  context: field("既存公開情報の移行テスト", aboutSource),
  responsibilities: field(
    ["公開境界を検証する"] as const,
    aboutSource,
  ),
  technologies: field(["TypeScript", "React"] as const, homepageSource),
  publication: {
    status: "approved",
    approval: {
      kind: "issue-comment",
      url: approvalUrl,
    },
  },
} as const satisfies Work

describe("Work公開判定", () => {
  it("既存公開sourceと本人承認が揃ったWorkだけを公開DTOへ射影する", () => {
    expect(isPublishedWork(approvedFixture)).toBe(true)
    expect(
      selectPublishedWorks([
        approvedFixture,
        {
          ...approvedFixture,
          id: "pending",
          publication: { status: "pending" },
        },
      ]),
    ).toEqual([
      {
        id: "fixture",
        title: "公開済みサンプル",
        role: "テスト担当",
        context: "既存公開情報の移行テスト",
        responsibilities: ["公開境界を検証する"],
        technologies: ["TypeScript", "React"],
      },
    ])
  })

  it("別コメントを本人決定の承認根拠として扱わない", () => {
    expect(
      isPublishedWork({
        ...approvedFixture,
        publication: {
          status: "approved",
          approval: {
            kind: "issue-comment",
            url: "https://github.com/koba1108/profile/issues/4#issuecomment-5071031560",
          },
        },
      } as unknown as Work),
    ).toBe(false)
  })

  it("Challenge・Decisions・Outcomeがpropertyとして存在すれば値に関係なく拒否する", () => {
    for (const privateField of ["challenge", "decisions", "outcomes"] as const) {
      expect(
        isPublishedWork({
          ...approvedFixture,
          [privateField]: {
            verificationStatus: "withheld",
            sourceRefs: [],
          },
        }),
      ).toBe(false)
      expect(
        isPublishedWork({
          ...approvedFixture,
          [privateField]: {
            value: "非公開テスト値",
            verificationStatus: "withheld",
            sourceRefs: [],
          },
        }),
      ).toBe(false)
    }
  })

  it("provisional、候補、空欄、管理文言、不正sourceを拒否する", () => {
    expect(
      isPublishedWork({
        ...approvedFixture,
        role: {
          ...approvedFixture.role,
          verificationStatus: "provisional",
        },
      }),
    ).toBe(false)
    expect(
      isPublishedWork({
        ...approvedFixture,
        role: {
          ...approvedFixture.role,
          candidates: [{ value: "別候補", sourceRefs: [homepageSource] }],
        },
      }),
    ).toBe(false)
    expect(
      isPublishedWork({
        ...approvedFixture,
        context: field(" ", aboutSource),
      }),
    ).toBe(false)
    expect(
      isPublishedWork({
        ...approvedFixture,
        responsibilities: field(["TBD"], aboutSource),
      }),
    ).toBe(false)
    expect(
      isPublishedWork({
        ...approvedFixture,
        technologies: {
          ...approvedFixture.technologies,
          sourceRefs: ["content/about.md"],
        },
      }),
    ).toBe(false)
  })

  it("フィールドごとの採用sourceを入れ替えたWorkを拒否する", () => {
    expect(
      isPublishedWork({
        ...approvedFixture,
        title: field("公開済みサンプル", aboutSource),
      }),
    ).toBe(false)
    expect(
      isPublishedWork({
        ...approvedFixture,
        context: field("既存公開情報の移行テスト", homepageSource),
      }),
    ).toBe(false)
    expect(
      isPublishedWork({
        ...approvedFixture,
        responsibilities: field(
          ["公開境界を検証する"],
          homepageSource,
        ),
      }),
    ).toBe(false)
    expect(
      isPublishedWork({
        ...approvedFixture,
        technologies: field(["TypeScript"], aboutSource),
      }),
    ).toBe(false)
  })

  it("基準commitの2つの公開sourceだけを許可する", () => {
    expect(isExistingPublicWorkSource(homepageSource)).toBe(true)
    expect(isExistingPublicWorkSource(aboutSource)).toBe(true)
    expect(
      isExistingPublicWorkSource(
        "https://github.com/koba1108/profile/blob/main/content/about.md#L72-L76",
      ),
    ).toBe(false)
  })

})
