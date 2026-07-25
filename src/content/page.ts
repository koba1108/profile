import type { SectionCopy, WorkSectionCopy } from "@/content/types"

export const pageCopy = {
  skipLink: "本文へスキップ",
  navigation: {
    desktopLabel: "ページナビゲーション",
    mobileTriggerLabel: "メニューを開く",
    mobileTitle: "ページメニュー",
    mobileDescription: "このページのセクションへ移動します",
    mobileLabel: "モバイルナビゲーション",
  },
  hero: {
    workCta: "Selected Work",
    githubCta: "GitHub",
    visual: {
      monogram: "YK",
      leftLabel: "Product",
      rightLabel: "Engineering",
    },
  },
  work: {
    eyebrow: "Selected Work",
    title: "Selected Work",
    cardTechnologiesLabel: "主な使用技術",
    detailsCta: "詳細を見る",
    detailsCtaSuffix: "の詳細を見る",
    lens: {
      disable: "Project LensをOFFにする",
      enable: "Project LensをONにする",
      hint: "カーソルで作品をスキャン",
      label: "Project Lens",
      loading: "Lensを準備中",
      unavailable: "この環境では標準表示を使用します",
    },
    details: {
      context: "Context",
      role: "Role",
      responsibilities: "Responsibilities",
      stack: "Stack",
      technologiesLabel: "使用技術",
    },
  },
  capabilities: {
    eyebrow: "Capabilities",
    title: "Capabilities",
    tabListLabel: "能力カテゴリ",
    technologiesLabelSuffix: "の関連技術",
  },
  approach: {
    eyebrow: "Engineering Approach",
    title: "Engineering Approach",
  },
  about: {
    eyebrow: "About",
  },
  contact: {
    eyebrow: "Contact",
    title: "Contact",
    description:
      "プロジェクトや技術的な相談については、GitHubからご連絡ください。",
  },
} as const satisfies {
  skipLink: string
  navigation: Record<
    | "desktopLabel"
    | "mobileTriggerLabel"
    | "mobileTitle"
    | "mobileDescription"
    | "mobileLabel",
    string
  >
  hero: {
    workCta: string
    githubCta: string
    visual: Record<"monogram" | "leftLabel" | "rightLabel", string>
  }
  work: WorkSectionCopy
  capabilities: SectionCopy & {
    tabListLabel: string
    technologiesLabelSuffix: string
  }
  approach: SectionCopy
  about: { eyebrow: string }
  contact: SectionCopy
}
