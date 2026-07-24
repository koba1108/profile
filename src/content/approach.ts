import type { ApproachStep } from "@/content/types"

const aboutSource = "content/about.md"
const migrationSource = "docs/portfolio-renewal/content-migration.md"
const sourceRefs = [aboutSource, migrationSource] as const

function provisional(value: string) {
  return {
    value,
    verificationStatus: "provisional" as const,
    sourceRefs,
  }
}

export const approachSteps = [
  {
    id: "frame",
    order: 1,
    title: provisional("課題と事業条件を整理する"),
    description: provisional(
      "CTO、PM、リードエンジニアとしてサービス立ち上げとシステム全体設計を担当してきた経験をもとに、実装前提と担当範囲を整理します。",
    ),
  },
  {
    id: "shape",
    order: 2,
    title: provisional("継続可能なアーキテクチャを設計する"),
    description: provisional(
      "API、データストア、AWS・GCPのクラウド構成を組み合わせ、バックエンドとフロントエンドを含むシステムを設計・実装します。",
    ),
  },
  {
    id: "ship",
    order: 3,
    title: provisional("チームと運用へ落とし込む"),
    description: provisional(
      "開発チームのマネジメントと、CI/CDによるデプロイ自動化まで担当します。",
    ),
  },
] as const satisfies readonly ApproachStep[]
