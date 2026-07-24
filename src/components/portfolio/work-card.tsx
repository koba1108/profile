import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { WorkDetailsSheet } from "@/components/portfolio/work-details-sheet"
import type { PublishedWork, WorkSectionCopy } from "@/content/types"

interface WorkCardProps {
  copy: WorkSectionCopy
  work: PublishedWork
}

export function WorkCard({ copy, work }: WorkCardProps) {
  const technologies = work.technologies

  return (
    <article className="min-w-0">
      <Card className="flex h-full flex-col shadow-sm">
        <CardHeader className="gap-3">
          <p className="text-sm font-semibold text-primary">
            {work.role}
          </p>
          <h3 className="text-balance text-2xl font-semibold tracking-tight">
            {work.title}
          </h3>
          <CardDescription className="text-base leading-7">
            {work.responsibilities.join(" / ")}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <ul
            aria-label={copy.cardTechnologiesLabel}
            className="flex flex-wrap gap-2"
          >
            {technologies.slice(0, 4).map((technology) => (
              <li key={technology}>
                <Badge variant="outline">{technology}</Badge>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <WorkDetailsSheet copy={copy} work={work} />
        </CardFooter>
      </Card>
    </article>
  )
}
