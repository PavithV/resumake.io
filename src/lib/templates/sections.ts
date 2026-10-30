import { FormValues, Generator } from '../../types'

/**
 * Renders the resume sections in the order chosen by the user.
 */
export default function renderSections(
  generator: Omit<Generator, 'resumeHeader'>,
  values: FormValues
) {
  const { headings = {} } = values

  return values.sections.map((section) => {
    switch (section) {
      case 'profile':
        return generator.profileSection(values.basics)

      case 'education':
        return generator.educationSection(values.education, headings.education)

      case 'work':
        return generator.workSection(values.work, headings.work)

      case 'skills':
        return generator.skillsSection(values.skills, headings.skills)

      case 'projects':
        return generator.projectsSection(values.projects, headings.projects)

      case 'awards':
        return generator.awardsSection(values.awards, headings.awards)

      default:
        return ''
    }
  })
}
