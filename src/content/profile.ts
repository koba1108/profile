import type { ContactMethod, Profile } from "@/content/types"

const homepageSource = "data/homepage.yml"
const aboutSource = "content/about.md"
const migrationSource = "docs/portfolio-renewal/content-migration.md"

export const profile = {
  displayName: {
    value: "小林 良昇",
    verificationStatus: "verified",
    sourceRefs: [homepageSource, aboutSource],
  },
  handle: {
    value: "ykoba",
    verificationStatus: "verified",
    sourceRefs: [homepageSource, aboutSource],
  },
  roles: {
    value: ["CTO", "PM", "テックリード", "開発者"],
    verificationStatus: "provisional",
    sourceRefs: [homepageSource, migrationSource],
  },
  headline: {
    value: "技術と事業をつなぎ、0→1から運用までプロダクトを前進させる。",
    verificationStatus: "provisional",
    sourceRefs: [migrationSource],
  },
  introduction: {
    value:
      "CTO、PM、テックリード、開発者として、Webサービスの立ち上げから設計・実装、チーム運営まで横断してきました。バックエンド、フロントエンド、クラウドをつなぎ、継続して運用できるプロダクトづくりに取り組みます。",
    verificationStatus: "provisional",
    sourceRefs: [aboutSource, migrationSource],
  },
  about: {
    value:
      "CTO、PM、テックリード、開発者として、複数のWebサービスに関わってきました。GoやTypeScriptによるアプリケーション開発、AWS・GCP上のアーキテクチャ設計、CI/CDとチーム運営を横断し、事業条件に合わせて実装と運用を組み立てることを大切にしています。",
    verificationStatus: "provisional",
    sourceRefs: [aboutSource, migrationSource],
  },
} satisfies Profile

export const approvedContacts = [
  {
    id: "github",
    label: "GitHub",
    description: "コードと公開プロジェクトを見る",
    href: "https://github.com/koba1108",
    publicationStatus: "approved",
    sourceRefs: [homepageSource, aboutSource, migrationSource],
  },
] as const satisfies readonly ContactMethod[]
