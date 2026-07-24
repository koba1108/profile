import { SectionHeading } from "@/components/portfolio/section-heading"
import { WorkCard } from "@/components/portfolio/work-card"
import type { PublishedWork, WorkSectionCopy } from "@/content/types"

interface SelectedWorkSectionProps {
  copy: WorkSectionCopy
  works: readonly PublishedWork[]
}

export function SelectedWorkSection({
  copy,
  works,
}: SelectedWorkSectionProps) {
  return (
    <section
      aria-labelledby="work-title"
      className="scroll-mt-20 border-t py-16 sm:py-24"
      id="work"
    >
      <SectionHeading
        description={copy.description}
        eyebrow={copy.eyebrow}
        id="work-title"
        title={copy.title}
      />
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {works.map((work) => (
          <WorkCard copy={copy} key={work.id} work={work} />
        ))}
      </div>
    </section>
  )
}
