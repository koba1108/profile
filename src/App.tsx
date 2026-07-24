import { BadgeCheck, Boxes, Layers3, PanelRightOpen } from "lucide-react"

import { ThemeToggle } from "@/components/theme-toggle"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

function App() {
  return (
    <main className="relative min-h-svh overflow-hidden bg-background px-5 py-8 text-foreground sm:px-8 sm:py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-80 bg-[radial-gradient(circle_at_top_left,var(--primary),transparent_58%)] opacity-15"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col gap-8">
        <header className="flex items-center justify-between gap-4">
          <Badge className="gap-1.5" variant="outline">
            <BadgeCheck aria-hidden="true" className="size-3.5" />
            React基盤
          </Badge>
          <ThemeToggle />
        </header>

        <section aria-labelledby="preview-title">
          <Card className="overflow-hidden">
            <CardHeader className="gap-3 border-b bg-card/80">
              <div className="flex items-center gap-2 text-sm font-medium text-primary">
                <Boxes aria-hidden="true" className="size-4" />
                Portfolio renewal
              </div>
              <CardTitle>
                <h1
                  className="text-balance text-3xl leading-tight sm:text-4xl"
                  id="preview-title"
                >
                  新しいポートフォリオの土台ができました
                </h1>
              </CardTitle>
              <CardDescription className="max-w-2xl text-base leading-7">
                React、Vite、TypeScript、Tailwind CSS、shadcn/uiを、
                現行のHugoサイトと共存できる形で確認するための最小画面です。
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              <Tabs defaultValue="stack">
                <TabsList aria-label="基盤プレビュー">
                  <TabsTrigger value="stack">構成</TabsTrigger>
                  <TabsTrigger value="interaction">操作</TabsTrigger>
                </TabsList>
                <TabsContent
                  className="rounded-lg border bg-muted/45 p-5 leading-7"
                  value="stack"
                >
                  <div className="flex items-start gap-3">
                    <Layers3
                      aria-hidden="true"
                      className="mt-1 size-5 shrink-0 text-primary"
                    />
                    <p>
                      React 19とTypeScript
                      6を中心に、再利用可能なUIコンポーネントを組み込んでいます。
                    </p>
                  </div>
                </TabsContent>
                <TabsContent
                  className="rounded-lg border bg-muted/45 p-5 leading-7"
                  value="interaction"
                >
                  テーマ切り替え、タブ、シートをキーボードでも操作できます。
                </TabsContent>
              </Tabs>
            </CardContent>

            <CardFooter className="justify-end border-t pt-6">
              <Sheet>
                <SheetTrigger asChild>
                  <Button>
                    <PanelRightOpen aria-hidden="true" />
                    基盤の詳細を見る
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>React基盤の詳細</SheetTitle>
                    <SheetDescription>
                      このシートはshadcn/uiのDialog
                      primitiveを利用し、フォーカス管理とEscape操作に対応します。
                    </SheetDescription>
                  </SheetHeader>
                  <div className="rounded-lg border bg-muted/50 p-4 text-sm leading-6">
                    完成版のコンテンツとレイアウトは、次のIssueでこの最小画面から置き換えます。
                  </div>
                </SheetContent>
              </Sheet>
            </CardFooter>
          </Card>
        </section>
      </div>
    </main>
  )
}

export default App
