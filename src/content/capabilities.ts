import type { Capability } from "@/content/types"

const homepageSource = "data/homepage.yml"
const aboutSource = "content/about.md"
const migrationSource = "docs/portfolio-renewal/content-migration.md"
const sourceRefs = [homepageSource, aboutSource, migrationSource] as const

function provisional<T>(value: T) {
  return {
    value,
    verificationStatus: "provisional" as const,
    sourceRefs,
  }
}

export const capabilities = [
  {
    id: "product-leadership",
    label: provisional("Product & Leadership"),
    title: provisional("Product & Leadership"),
    description: provisional(
      "CTO、PM、リードエンジニアとして、サービス立ち上げ、システム設計、開発チームのマネジメントを担当してきました。",
    ),
    technologies: provisional(["CTO", "PM", "Tech Lead"]),
  },
  {
    id: "backend",
    label: provisional("Backend Engineering"),
    title: provisional("Backend Engineering"),
    description: provisional(
      "API、マイクロサービス、イベント駆動システムを設計・実装し、RDBとNoSQLを用途に合わせて組み合わせます。",
    ),
    technologies: provisional(["Go", "Node.js", "GraphQL", "gRPC"]),
  },
  {
    id: "frontend",
    label: provisional("Frontend Engineering"),
    title: provisional("Frontend Engineering"),
    description: provisional(
      "SPAとSSRの開発経験をもとに、バックエンドとの境界を含めてWebアプリケーションを設計・実装します。",
    ),
    technologies: provisional([
      "TypeScript",
      "React",
      "Vue.js",
      "Nuxt.js",
      "Angular",
    ]),
  },
  {
    id: "cloud-architecture",
    label: provisional("Cloud & Architecture"),
    title: provisional("Cloud & Architecture"),
    description: provisional(
      "AWSとGCPで、サーバーレス、コンテナ、データストアを運用条件に合わせて構成します。",
    ),
    technologies: provisional([
      "AWS",
      "GCP",
      "Cloud Run",
      "Lambda",
      "Terraform",
    ]),
  },
  {
    id: "delivery-devops",
    label: provisional("Delivery & DevOps"),
    title: provisional("Delivery & DevOps"),
    description: provisional(
      "CI/CD、コンテナ化、IaC、監視サービスの連携を通じて、変更を継続的に届けられる開発環境を整えます。",
    ),
    technologies: provisional([
      "GitHub Actions",
      "Docker",
      "Kubernetes",
      "Sentry",
    ]),
  },
] as const satisfies readonly Capability[]
