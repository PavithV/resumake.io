import type { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'
import Archiver from 'archiver'
import { stripIndent } from 'common-tags'
import getTemplateData from '../../lib/templates'
import { FormValues } from '../../types'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).end()
    return
  }

  const sourceCode = await generateSourceCode(req.body as FormValues)
  sourceCode
    .pipe(res)
    .setHeader('content-type', 'application/zip')
    .setHeader('content-disposition', 'attachment; filename="resume.zip"')
}

/**
 * Generates resume source files from the request body,
 * and then saves it to a zip which is then sent to the client.
 *
 * @param formData The request body received from the client.
 *
 * @return The generated zip.
 */
function generateSourceCode(formData: FormValues) {
  const { texDoc, opts } = getTemplateData(formData)
  const prettyDoc = /*prettify(texDoc)*/ texDoc
  const zip = Archiver('zip')
  const readme = makeReadme(formData.selectedTemplate, opts.cmd)

  zip.append(prettyDoc, { name: 'resume.tex' })
  zip.append(readme, { name: 'README.md' })

  // Same layout as the in-browser compile in lib/latex.ts
  for (const file of opts.inputs || []) {
    zip.file(path.join('public', file), { name: path.basename(file) })
  }
  for (const file of opts.fonts || []) {
    zip.file(path.join('public', file), {
      name: `fonts/${path.basename(file)}`
    })
  }

  zip.finalize()

  return zip
}

/**
 * Generates a README to include in the output zip.
 * It details how to use the generated LaTeX source code.
 *
 * @param template The specified resume template.
 * @param cmd The LaTeX command that is used to generate the PDF.
 *
 * @return The generated README text.
 */
function makeReadme(template: number, cmd: string): string {
  return stripIndent`
    # Resumake Template ${template}
    > LaTeX code generated at [resumake.io](https://resumake.io)
    ## Usage
    To generate a PDF from this LaTeX code, navigate to this folder in a terminal and run:
        ${cmd} resume.tex
    ## Requirements
    You will need to have \`${cmd}\` installed on your machine.
    Alternatively, you can use a site like [ShareLaTeX](https://sharelatex.com) to build and edit your LaTeX instead.
  `
}
