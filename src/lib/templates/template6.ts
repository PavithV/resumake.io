import { stripIndent, source } from 'common-tags'
import { WHITESPACE } from './constants'
import renderSections from './sections'
import type { FormValues, Generator } from '../../types'

const generator: Omit<Generator, 'resumeHeader'> = {
  profileSection(basics) {
    if (!basics) {
      return ''
    }

    const { name = '', email, phone, location = {}, website } = basics
    const websiteLine = website ? `\\href{${website}}{${website}}` : ''

    const info = [email, phone, location.address, websiteLine].filter(Boolean)

    return stripIndent`
      \\begin{center}
      % Personal
      % -----------------------------------------------------
      {\\fontsize{\\sizeone}{\\sizeone}\\fontspec[Path = fonts/,LetterSpace=15]{Montserrat-Regular} \\MakeUppercase{${name}}}
      ${name && info.length > 1 ? '\\\\' : ''}
      \\vspace{2mm}
      {\\fontsize{1em}{1em}\\fontspec[Path = fonts/]{Montserrat-Light} ${info.join(
        ' -- '
      )}}
      \\end{center}
    `
  },

  educationSection(education, heading) {
    if (!education) {
      return ''
    }

    return source`
      % Chapter: Education
      % ------------------

      \\chap{\\MakeUppercase{${heading || 'Education'}}}{

      ${education.map((school) => {
        const {
          institution = '',
          location = '',
          area = '',
          studyType = '',
          score = '',
          startDate = '',
          endDate = ''
        } = school

        const degreeLine = [studyType, area].filter(Boolean).join(' ')
        let dateRange = ''

        if (startDate && endDate) {
          dateRange = `${startDate} – ${endDate}`
        } else if (startDate) {
          dateRange = `${startDate} – Present`
        } else {
          dateRange = endDate
        }

        return stripIndent`
            \\school
              {${institution}}
              {${dateRange}}
              {${degreeLine}}
              {${location}}
              {${
                score
                  ? `\\begin{newitemize}
                  \\item ${score ? `GPA: ${score}` : ''}
                \\end{newitemize}`
                  : ''
              }
          }
        `
      })}
      }
    `
  },

  workSection(work, heading) {
    if (!work) {
      return ''
    }

    return source`
      % Chapter: Work Experience
      % ------------------------
      \\chap{\\MakeUppercase{${heading || 'Experience'}}}{

      ${work.map((job) => {
        const {
          name = '',
          position = '',
          location = '',
          startDate = '',
          endDate = '',
          highlights = []
        } = job

        let dateRange = ''
        let dutyLines = ''

        if (startDate && endDate) {
          dateRange = `${startDate} – ${endDate}`
        } else if (startDate) {
          dateRange = `${startDate} – Present`
        } else {
          dateRange = endDate
        }

        if (highlights) {
          dutyLines = source`
            \\begin{newitemize}
              ${highlights.map((duty) => `\\item {${duty}}`)}
            \\end{newitemize}
            `
        }

        return stripIndent`
          \\job
            {${name}}
            {${dateRange}}
            {${position}}
            {${location}}
            {${dutyLines}}
        `
      })}
    }
    `
  },

  skillsSection(skills, heading) {
    if (!skills) {
      return ''
    }

    return source`
      % Chapter: Skills
      % ------------------------

      \\chap{\\MakeUppercase{${heading || 'Skills'}}}{
      \\begin{newitemize}
        ${skills.map((skill) => {
          const { name = '', keywords = [] } = skill

          let item = ''

          if (name) {
            item += `${name}: `
          }

          if (keywords.length > 0) {
            item += keywords.join(', ')
          }

          return `\\item ${item}`
        })}
      \\end{newitemize}
      }
    `
  },

  projectsSection(projects, heading) {
    if (!projects) {
      return ''
    }

    return source`
      % Chapter: Projects
      % ------------------------

      \\chap{\\MakeUppercase{${heading || 'Projects'}}}{

        ${projects.map((project) => {
          const {
            name = '',
            description = '',
            keywords = [],
            url = ''
          } = project

          const descriptionWithNewline = description
            ? `${description}\\\\`
            : description
          const urlLine = url ? `\\href{${url}}{${url}}` : ''

          return stripIndent`
            \\project
              {${name}}
              {${keywords.join(', ')}}
              {${urlLine}}
              {${descriptionWithNewline}}
          `
        })}
      }
    `
  },

  awardsSection(awards, heading) {
    if (!awards) {
      return ''
    }

    return source`
      % Chapter: Awards
      % ------------------------

      \\chap{\\MakeUppercase{${heading || 'Awards'}}}{

        ${awards.map((award) => {
          const { title = '', summary = '', awarder = '', date = '' } = award

          return stripIndent`
            \\award
              {${title}}
              {${date}}
              {${summary}}
              {${awarder}}
          `
        })}
      }
    `
  }
}

function template6(values: FormValues) {
  return stripIndent`
    \\documentclass[10pt]{article}
    \\usepackage[english]{babel}
    \\usepackage[hidelinks]{hyperref}
    \\input{minimal-resume-config}
    \\begin{document}
    ${renderSections(generator, values).join('\n')}
    ${WHITESPACE}
    \\end{document}
  `
}

export default template6
