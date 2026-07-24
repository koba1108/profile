import type {
  AboutWorkSource,
  ApprovedPublication,
  DisplayWorkField,
  ExistingPublicWorkSource,
  HomepageWorkSource,
  NonEmptyArray,
  PublishedWork,
  Work,
  WorkField,
} from "@/content/types"

const issueCommentPattern =
  /^https:\/\/github\.com\/koba1108\/profile\/issues\/4#issuecomment-5071031559$/
const homepageSourcePattern =
  /^https:\/\/github\.com\/koba1108\/profile\/blob\/3b67135b0ff844530d4edb5308b30b9aadff4a19\/data\/homepage\.yml#L\d+(?:-L\d+)?$/
const aboutSourcePattern =
  /^https:\/\/github\.com\/koba1108\/profile\/blob\/3b67135b0ff844530d4edb5308b30b9aadff4a19\/content\/about\.md#L\d+(?:-L\d+)?$/

type ValidatedPublicWork = Work & {
  title: DisplayWorkField<string> & {
    sourceRefs: NonEmptyArray<HomepageWorkSource>
  }
  role: DisplayWorkField<string> & {
    sourceRefs: NonEmptyArray<HomepageWorkSource>
  }
  context: DisplayWorkField<string> & {
    sourceRefs: NonEmptyArray<AboutWorkSource>
  }
  responsibilities: DisplayWorkField<NonEmptyArray<string>> & {
    sourceRefs: NonEmptyArray<AboutWorkSource>
  }
  technologies: DisplayWorkField<NonEmptyArray<string>> & {
    sourceRefs: NonEmptyArray<HomepageWorkSource>
  }
  challenge?: never
  decisions?: never
  outcomes?: never
  publication: ApprovedPublication
}

function isApprovalEvidenceValid(work: Work): boolean {
  if (work.publication.status !== "approved") {
    return false
  }

  const { approval } = work.publication
  return (
    approval.kind === "issue-comment" &&
    issueCommentPattern.test(approval.url)
  )
}

function isDisplayText(value: string | undefined): value is string {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    !/\b(?:TODO|TBD|pending)\b/i.test(value)
  )
}

function hasDisplayStatus<T>(
  field: WorkField<T>,
  sourcePattern: RegExp,
): field is DisplayWorkField<T> {
  return (
    field.verificationStatus === "verified" &&
    field.sourceRefs.length > 0 &&
    field.sourceRefs.every((sourceRef) => sourcePattern.test(sourceRef)) &&
    !Object.hasOwn(field, "candidates") &&
    field.value !== undefined
  )
}

function isDisplayTextField(
  field: WorkField<string>,
  sourcePattern: RegExp,
): field is DisplayWorkField<string> {
  return (
    hasDisplayStatus(field, sourcePattern) && isDisplayText(field.value)
  )
}

function isDisplayList(
  values: readonly string[] | undefined,
): values is NonEmptyArray<string> {
  return (
    Array.isArray(values) &&
    values.length > 0 &&
    values.every((value) => isDisplayText(value))
  )
}

function isDisplayListField(
  field: WorkField<readonly string[]>,
  sourcePattern: RegExp,
): field is DisplayWorkField<NonEmptyArray<string>> {
  return (
    hasDisplayStatus(field, sourcePattern) && isDisplayList(field.value)
  )
}

function hasNoNonPublicFields(work: Work): boolean {
  return (
    !Object.hasOwn(work, "challenge") &&
    !Object.hasOwn(work, "decisions") &&
    !Object.hasOwn(work, "outcomes")
  )
}

export function isPublishedWork(work: Work): work is ValidatedPublicWork {
  return (
    isApprovalEvidenceValid(work) &&
    isDisplayTextField(work.title, homepageSourcePattern) &&
    isDisplayTextField(work.role, homepageSourcePattern) &&
    isDisplayTextField(work.context, aboutSourcePattern) &&
    isDisplayListField(work.responsibilities, aboutSourcePattern) &&
    isDisplayListField(work.technologies, homepageSourcePattern) &&
    hasNoNonPublicFields(work)
  )
}

export function selectPublishedWorks(
  works: readonly Work[],
): readonly PublishedWork[] {
  return works.flatMap((work) => {
    if (!isPublishedWork(work)) {
      return []
    }

    return [
      {
        id: work.id,
        title: work.title.value,
        role: work.role.value,
        context: work.context.value,
        responsibilities: work.responsibilities.value,
        technologies: work.technologies.value,
      },
    ]
  })
}

export function isExistingPublicWorkSource(
  sourceRef: string,
): sourceRef is ExistingPublicWorkSource {
  return (
    homepageSourcePattern.test(sourceRef) ||
    aboutSourcePattern.test(sourceRef)
  )
}
