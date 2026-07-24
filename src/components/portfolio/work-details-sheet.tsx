import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import type { PublishedWork, WorkSectionCopy } from "@/content/types"

interface WorkDetailsSheetProps {
  copy: WorkSectionCopy
  work: PublishedWork
}

export function WorkDetailsSheet({ copy, work }: WorkDetailsSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          aria-label={`${work.title}${copy.detailsCtaSuffix}`}
          className="min-h-11"
          variant="outline"
        >
          {copy.detailsCta}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[min(42rem,calc(100vw-1rem))] max-w-2xl gap-0 overflow-hidden p-0 sm:max-w-2xl">
        <SheetHeader className="border-b px-6 py-6 pr-12 text-left">
          <SheetTitle className="text-2xl">{work.title}</SheetTitle>
          <SheetDescription className="pt-2 text-base leading-7">
            {work.responsibilities.join(" / ")}
          </SheetDescription>
        </SheetHeader>
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-7">
            <Detail title={copy.details.context}>
              <p>{work.context}</p>
            </Detail>
            <Detail title={copy.details.role}>
              <p>{work.role}</p>
            </Detail>
            <Detail title={copy.details.responsibilities}>
              <ul className="list-disc space-y-2 pl-5">
                {work.responsibilities.map((responsibility) => (
                  <li key={responsibility}>{responsibility}</li>
                ))}
              </ul>
            </Detail>
            <Detail title={copy.details.stack}>
              <ul
                aria-label={copy.details.technologiesLabel}
                className="flex flex-wrap gap-2"
              >
                {work.technologies.map((technology) => (
                  <li key={technology}>
                    <Badge variant="outline">{technology}</Badge>
                  </li>
                ))}
              </ul>
            </Detail>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

interface DetailProps {
  children: React.ReactNode
  title: string
}

function Detail({ children, title }: DetailProps) {
  return (
    <section>
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-primary">
        {title}
      </h3>
      <div className="break-words text-sm leading-7 text-muted-foreground">
        {children}
      </div>
    </section>
  )
}
