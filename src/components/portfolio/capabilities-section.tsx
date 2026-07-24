import { SectionHeading } from "@/components/portfolio/section-heading"
import { Badge } from "@/components/ui/badge"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import type { Capability, SectionCopy } from "@/content/types"

interface CapabilitiesCopy extends SectionCopy {
  tabListLabel: string
  technologiesLabelSuffix: string
}

interface CapabilitiesSectionProps {
  capabilities: readonly Capability[]
  copy: CapabilitiesCopy
}

export function CapabilitiesSection({
  capabilities,
  copy,
}: CapabilitiesSectionProps) {
  const [firstCapability] = capabilities

  if (!firstCapability) {
    return null
  }

  return (
    <section
      aria-labelledby="capabilities-title"
      className="scroll-mt-20 border-t py-16 sm:py-24"
      id="capabilities"
    >
      <SectionHeading
        description={copy.description}
        eyebrow={copy.eyebrow}
        id="capabilities-title"
        title={copy.title}
      />
      <Tabs className="mt-10" defaultValue={firstCapability.id}>
        <div className="max-w-full overflow-x-auto pb-2">
          <TabsList
            aria-label={copy.tabListLabel}
            className="h-auto w-max justify-start gap-1"
          >
            {capabilities.map((capability) => (
              <TabsTrigger
                className="min-h-11 border border-transparent data-[state=active]:border-border data-[state=active]:font-semibold"
                key={capability.id}
                value={capability.id}
              >
                {capability.label.value}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        {capabilities.map((capability) => (
          <TabsContent
            className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8"
            key={capability.id}
            value={capability.id}
          >
            <h3 className="text-2xl font-semibold tracking-tight">
              {capability.title.value}
            </h3>
            <p className="mt-4 max-w-3xl text-pretty text-base leading-8 text-muted-foreground">
              {capability.description.value}
            </p>
            <ul
              aria-label={`${capability.label.value}${copy.technologiesLabelSuffix}`}
              className="mt-6 flex flex-wrap gap-2"
            >
              {capability.technologies.value.map((technology) => (
                <li key={technology}>
                  <Badge variant="outline">{technology}</Badge>
                </li>
              ))}
            </ul>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  )
}
