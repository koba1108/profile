import { SectionHeading } from "@/components/portfolio/section-heading"
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import type { ApproachStep, SectionCopy } from "@/content/types"

interface EngineeringApproachSectionProps {
  copy: SectionCopy
  steps: readonly ApproachStep[]
}

export function EngineeringApproachSection({
  copy,
  steps,
}: EngineeringApproachSectionProps) {
  return (
    <section
      aria-labelledby="approach-title"
      className="scroll-mt-20 border-t py-16 sm:py-24"
      id="approach"
    >
      <SectionHeading
        description={copy.description}
        eyebrow={copy.eyebrow}
        id="approach-title"
        title={copy.title}
      />
      <ol className="mt-10 grid gap-5 lg:grid-cols-3">
        {steps.map((step) => (
          <li className="min-w-0" key={step.id}>
            <Card className="h-full shadow-sm">
              <CardHeader>
                <span className="text-sm font-semibold tabular-nums text-primary">
                  0{step.order}
                </span>
                <h3 className="text-xl font-semibold tracking-tight">
                  {step.title.value}
                </h3>
              </CardHeader>
              <CardContent>
                <p className="break-words leading-7 text-muted-foreground">
                  {step.description.value}
                </p>
              </CardContent>
            </Card>
          </li>
        ))}
      </ol>
    </section>
  )
}
