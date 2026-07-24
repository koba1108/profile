import type {
  AboutWorkSource,
  ApprovedWorkCandidate,
  HomepageWorkSource,
} from "@/content/types"

const approvalUrl =
  "https://github.com/koba1108/profile/issues/4#issuecomment-5071031559" as const

const homepageSource = {
  liveStreaming:
    "https://github.com/koba1108/profile/blob/3b67135b0ff844530d4edb5308b30b9aadff4a19/data/homepage.yml#L47-L49",
  matchmaking:
    "https://github.com/koba1108/profile/blob/3b67135b0ff844530d4edb5308b30b9aadff4a19/data/homepage.yml#L52-L54",
  consulting:
    "https://github.com/koba1108/profile/blob/3b67135b0ff844530d4edb5308b30b9aadff4a19/data/homepage.yml#L57-L59",
  career:
    "https://github.com/koba1108/profile/blob/3b67135b0ff844530d4edb5308b30b9aadff4a19/data/homepage.yml#L62-L64",
} as const

const aboutSource = {
  liveStreaming:
    "https://github.com/koba1108/profile/blob/3b67135b0ff844530d4edb5308b30b9aadff4a19/content/about.md#L72-L76",
  matchmaking:
    "https://github.com/koba1108/profile/blob/3b67135b0ff844530d4edb5308b30b9aadff4a19/content/about.md#L84-L87",
  consulting:
    "https://github.com/koba1108/profile/blob/3b67135b0ff844530d4edb5308b30b9aadff4a19/content/about.md#L66-L70",
  career:
    "https://github.com/koba1108/profile/blob/3b67135b0ff844530d4edb5308b30b9aadff4a19/content/about.md#L60-L64",
} as const

function homepageField<T>(
  value: T,
  sourceRef: HomepageWorkSource,
) {
  return {
    value,
    verificationStatus: "verified" as const,
    sourceRefs: [sourceRef] as const,
  }
}

function aboutField<T>(
  value: T,
  sourceRef: AboutWorkSource,
) {
  return {
    value,
    verificationStatus: "verified" as const,
    sourceRefs: [sourceRef] as const,
  }
}

/**
 * 現行ポートフォリオで公開済みの値だけを置くクライアント境界。
 * Challenge / Decisions / Outcomeなどの非公開項目はproperty自体を持たせない。
 */
export const workCandidates = [
  {
    id: "live-streaming-platform",
    title: homepageField(
      "ライブ配信プラットフォーム",
      homepageSource.liveStreaming,
    ),
    role: homepageField("CTO", homepageSource.liveStreaming),
    context: aboutField(
      "ライブ配信プラットフォームサービスの立ち上げ",
      aboutSource.liveStreaming,
    ),
    responsibilities: aboutField(
      [
        "システム全体設計",
        "開発チームマネジメント",
        "バックエンド・フロントエンド実装",
      ] as const,
      aboutSource.liveStreaming,
    ),
    technologies: homepageField(
      ["AWS", "Go", "Nuxt.js", "Firestore", "DynamoDB", "OpenSearch"] as const,
      homepageSource.liveStreaming,
    ),
    publication: {
      status: "approved",
      approval: { kind: "issue-comment", url: approvalUrl },
    },
  },
  {
    id: "matchmaking-service",
    title: homepageField("婚活マッチングサービス", homepageSource.matchmaking),
    role: homepageField("CTO", homepageSource.matchmaking),
    context: aboutField(
      "婚活マッチングサービスの立ち上げ",
      aboutSource.matchmaking,
    ),
    responsibilities: aboutField(
      [
        "システム全体設計",
        "開発チームマネジメント",
        "バックエンド・フロントエンド実装",
      ] as const,
      aboutSource.matchmaking,
    ),
    technologies: homepageField(
      [
        "GCP",
        "Go",
        "Nuxt.js",
        "GraphQL",
        "MySQL",
        "Firestore",
        "BigQuery",
      ] as const,
      homepageSource.matchmaking,
    ),
    publication: {
      status: "approved",
      approval: { kind: "issue-comment", url: approvalUrl },
    },
  },
  {
    id: "consulting-talent-matching",
    title: homepageField(
      "コンサル人材マッチングサービス",
      homepageSource.consulting,
    ),
    role: homepageField("Lead Developer", homepageSource.consulting),
    context: aboutField(
      "コンサルティングマッチングサービス開発",
      aboutSource.consulting,
    ),
    responsibilities: aboutField(
      ["システム全体設計", "バックエンド・フロントエンド実装"] as const,
      aboutSource.consulting,
    ),
    technologies: homepageField(
      ["AWS", "Go", "Angular", "GraphQL", "DynamoDB", "OpenSearch"] as const,
      homepageSource.consulting,
    ),
    publication: {
      status: "approved",
      approval: { kind: "issue-comment", url: approvalUrl },
    },
  },
  {
    id: "career-matching",
    title: homepageField(
      "転職・副業マッチングサービス",
      homepageSource.career,
    ),
    role: homepageField("Project Manager", homepageSource.career),
    context: aboutField(
      "転職マッチングサービスの立ち上げ",
      aboutSource.career,
    ),
    responsibilities: aboutField(
      [
        "システム全体設計",
        "開発チームマネジメント",
        "バックエンド・フロントエンド実装",
      ] as const,
      aboutSource.career,
    ),
    technologies: homepageField(
      ["GCP", "Go", "Nuxt.js", "MySQL", "Cloud Pub/Sub"] as const,
      homepageSource.career,
    ),
    publication: {
      status: "approved",
      approval: { kind: "issue-comment", url: approvalUrl },
    },
  },
] as const satisfies readonly ApprovedWorkCandidate[]
