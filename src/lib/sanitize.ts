import { FormValues, Work } from '../types'

const LATEX_SPECIAL_CHARS: { [char: string]: string } = {
  '\\': '\\textbackslash{}',
  '&': '\\&',
  '%': '\\%',
  $: '\\$',
  '#': '\\#',
  _: '\\_',
  '{': '\\{',
  '}': '\\}',
  '~': '\\textasciitilde{}',
  '^': '\\textasciicircum{}'
}

function escapeLatex(text: string) {
  return text.replace(/[\\&%$#_{}~^]/g, (char) => LATEX_SPECIAL_CHARS[char])
}

function escapeValue(value: unknown): unknown {
  if (typeof value === 'string') {
    return escapeLatex(value)
  }

  if (Array.isArray(value)) {
    return value.map(escapeValue)
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, escapeValue(item)])
    )
  }

  return value
}

export const DEFAULT_SECTIONS: FormValues['sections'] = [
  'profile',
  'education',
  'work',
  'skills',
  'projects',
  'awards'
]

/**
 * Fills in the resumake-specific fields that plain JSON Resume files lack,
 * and migrates resumes created with older versions of resumake.io,
 * which stored the company of a work entry as `company` instead of
 * the JSON Resume standard `name`.
 */
export function normalizeResume<T extends Partial<FormValues>>(values: T): T {
  return {
    ...values,
    headings: values.headings || {},
    sections: values.sections || DEFAULT_SECTIONS,
    work: values.work?.map(({ company, ...job }: Work) => ({
      ...job,
      name: job.name || company || ''
    }))
  }
}

/**
 * Parses a stored or uploaded resume.
 * Returns null if the text is not a JSON object.
 */
export function parseResume(text: string): FormValues | null {
  try {
    const value = JSON.parse(text)
    return value && typeof value === 'object' && !Array.isArray(value)
      ? normalizeResume(value)
      : null
  } catch {
    return null
  }
}

function hasContent(value: unknown): boolean {
  if (Array.isArray(value)) {
    return value.some(hasContent)
  }
  if (value && typeof value === 'object') {
    return Object.values(value).some(hasContent)
  }
  return Boolean(value)
}

// Templates skip a section only when its list is missing, not when it is empty
function nonBlank<T>(list?: T[]): T[] | undefined {
  const kept = list?.filter(hasContent)
  return kept?.length ? kept : undefined
}

/**
 * Escapes all user-provided text so that it can be safely
 * inserted into a LaTeX document, and drops entries the user left blank.
 */
export function sanitize(values: FormValues): FormValues {
  const { headings, sections, selectedTemplate, ...resume } =
    normalizeResume(values)

  return {
    ...(escapeValue({
      ...resume,
      education: nonBlank(resume.education),
      work: nonBlank(resume.work),
      skills: nonBlank(resume.skills),
      projects: nonBlank(resume.projects),
      awards: nonBlank(resume.awards)
    }) as FormValues),
    headings: escapeValue(headings) as FormValues['headings'],
    sections,
    selectedTemplate
  }
}
