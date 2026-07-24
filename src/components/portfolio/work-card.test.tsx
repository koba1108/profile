import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, it } from "vitest"

import { WorkCard } from "@/components/portfolio/work-card"
import { pageCopy } from "@/content/page"
import type { PublishedWork } from "@/content/types"

const workFixture = {
  id: "fixture",
  title: "ケーススタディ表示サンプル",
  role: "テスト担当",
  context: "表示コンポーネントのテストです。",
  responsibilities: ["公開情報だけを表示する", "キーボード操作を確認する"],
  technologies: ["TypeScript", "React"],
} as const satisfies PublishedWork

it("公開済み4項目だけを表示してEscapeでtriggerへ戻る", async () => {
  const user = userEvent.setup()
  render(<WorkCard copy={pageCopy.work} work={workFixture} />)

  const trigger = screen.getByRole("button", {
    name: "ケーススタディ表示サンプルの詳細を見る",
  })
  trigger.focus()
  await user.keyboard("{Enter}")

  const dialog = screen.getByRole("dialog", {
    name: "ケーススタディ表示サンプル",
  })
  for (const title of ["Context", "Role", "Responsibilities", "Stack"]) {
    expect(
      within(dialog).getByRole("heading", { level: 3, name: title }),
    ).toBeInTheDocument()
  }
  for (const privateTitle of ["Challenge", "Decisions", "Outcome"]) {
    expect(
      within(dialog).queryByRole("heading", {
        level: 3,
        name: privateTitle,
      }),
    ).not.toBeInTheDocument()
  }

  await user.keyboard("{Escape}")

  expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  expect(trigger).toHaveFocus()
})

it("複数のWorkを案件名を含む一意なボタン名で識別できる", () => {
  const secondWork = {
    ...workFixture,
    id: "fixture-2",
    title: "2件目のケーススタディ",
  } as const satisfies PublishedWork

  render(
    <>
      <WorkCard copy={pageCopy.work} work={workFixture} />
      <WorkCard copy={pageCopy.work} work={secondWork} />
    </>,
  )

  expect(
    screen.getByRole("button", {
      name: "ケーススタディ表示サンプルの詳細を見る",
    }),
  ).toBeInTheDocument()
  expect(
    screen.getByRole("button", {
      name: "2件目のケーススタディの詳細を見る",
    }),
  ).toBeInTheDocument()
})
