import assert from 'node:assert/strict'
import { test } from 'node:test'
import getTemplateData from '.'
import { TEMPLATES } from './constants'
import { DEFAULT_SECTIONS } from '../sanitize'
import { FormValues } from '../../types'

const special = 'R&D 100% $5 #1 a_b {x} ~ ^ \\'
const escaped =
  'R\\&D 100\\% \\$5 \\#1 a\\_b \\{x\\} \\textasciitilde{} \\textasciicircum{} \\textbackslash{}'

const resume: FormValues = {
  basics: {
    name: special,
    email: special,
    phone: special,
    website: special,
    location: { address: special }
  },
  education: [
    {
      institution: special,
      location: special,
      studyType: special,
      area: special,
      score: special,
      startDate: special,
      endDate: special
    }
  ],
  work: [
    {
      name: special,
      position: special,
      location: special,
      startDate: special,
      endDate: special,
      highlights: [special]
    }
  ],
  skills: [{ name: special, keywords: [special] }],
  projects: [
    { name: special, description: special, url: special, keywords: [special] }
  ],
  awards: [
    { title: special, summary: special, date: special, awarder: special }
  ],
  headings: { work: special },
  sections: DEFAULT_SECTIONS,
  selectedTemplate: 1
}

for (const id of TEMPLATES) {
  test(`template ${id} escapes user text`, () => {
    const { texDoc } = getTemplateData({ ...resume, selectedTemplate: id })
    assert.ok(texDoc.includes(escaped))
    assert.ok(!texDoc.includes(special))
  })

  test(`template ${id} renders a plain JSON Resume`, () => {
    // Like a file from jsonresume.org: no sections or headings, legacy `company`
    const plain = {
      basics: { name: 'Ada Lovelace' },
      work: [{ company: 'Analytical Engines' }],
      selectedTemplate: id
    } as unknown as FormValues
    const { texDoc } = getTemplateData(plain)
    assert.ok(texDoc.includes('Analytical Engines'))
    // \b skips LaTeX's own \@ifundefined
    assert.doesNotMatch(texDoc, /\bundefined\b/)
  })
}
