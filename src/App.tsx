import { AboutSection } from "@/components/portfolio/about-section"
import { CapabilitiesSection } from "@/components/portfolio/capabilities-section"
import { ContactSection } from "@/components/portfolio/contact-section"
import { EngineeringApproachSection } from "@/components/portfolio/engineering-approach-section"
import { HeroSection } from "@/components/portfolio/hero-section"
import { SelectedWorkSection } from "@/components/portfolio/selected-work-section"
import { SiteFooter } from "@/components/portfolio/site-footer"
import { SiteHeader } from "@/components/portfolio/site-header"
import { approachSteps } from "@/content/approach"
import { capabilities } from "@/content/capabilities"
import { getNavigationItems } from "@/content/navigation"
import { pageCopy } from "@/content/page"
import { approvedContacts, profile } from "@/content/profile"
import { workCandidates } from "@/content/works"
import { selectPublishedWorks } from "@/lib/publication"

const approvedWorks = selectPublishedWorks(workCandidates)
const hasPublishedWorks = approvedWorks.length > 0
const navigationItems = getNavigationItems(hasPublishedWorks)
const githubContact = approvedContacts[0]

function App() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <a
        className="fixed left-4 top-3 z-[60] -translate-y-24 rounded-md bg-foreground px-4 py-3 text-sm font-semibold text-background transition-transform focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        href="#main-content"
      >
        {pageCopy.skipLink}
      </a>
      <SiteHeader
        copy={pageCopy.navigation}
        handle={profile.handle.value}
        items={navigationItems}
      />
      <main
        className="mx-auto w-full max-w-6xl px-5 outline-none sm:px-8"
        id="main-content"
        tabIndex={-1}
      >
        <HeroSection
          githubHref={githubContact.href}
          hasPublishedWorks={hasPublishedWorks}
          copy={pageCopy.hero}
          profile={profile}
        />
        {hasPublishedWorks ? (
          <SelectedWorkSection copy={pageCopy.work} works={approvedWorks} />
        ) : null}
        <CapabilitiesSection
          capabilities={capabilities}
          copy={pageCopy.capabilities}
        />
        <EngineeringApproachSection
          copy={pageCopy.approach}
          steps={approachSteps}
        />
        <AboutSection copy={pageCopy.about} profile={profile} />
        <ContactSection contacts={approvedContacts} copy={pageCopy.contact} />
      </main>
      <SiteFooter
        displayName={profile.displayName.value}
        handle={profile.handle.value}
      />
    </div>
  )
}

export default App
