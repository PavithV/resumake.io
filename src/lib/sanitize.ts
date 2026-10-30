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
 * Escapes all user-provided text so that it can be safely
 * inserted into a LaTeX document.
 */
export function sanitize(values: FormValues): FormValues {
  const { headings, sections, selectedTemplate, ...resume } =
    normalizeResume(values)

  return {
    ...(escapeValue(resume) as FormValues),
    headings: escapeValue(headings) as FormValues['headings'],
    sections,
    selectedTemplate
  }
}
