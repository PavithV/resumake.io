import template1 from './template1'
import template2 from './template2'
import template3 from './template3'
import template4 from './template4'
import template5 from './template5'
import template6 from './template6'
import template7 from './template7'
import template8 from './template8'
import template9 from './template9'
import { FormValues, LaTeXOpts, TemplateData } from '../../types'
import { sanitize } from '../sanitize'

const templates: {
  [id: number]: { render: (values: FormValues) => string; opts: LaTeXOpts }
} = {
  1: { render: template1, opts: { cmd: 'pdflatex' } },
  2: {
    render: template2,
    opts: {
      cmd: 'xelatex',
      inputs: [
        '/templates/template2/awesome-cv.cls',
        '/templates/template2/fontawesome.sty'
      ],
      fonts: [
        '/templates/template2/fonts/FontAwesome.otf',
        '/templates/template2/fonts/Roboto-Bold.ttf',
        '/templates/template2/fonts/Roboto-BoldItalic.ttf',
        '/templates/template2/fonts/Roboto-Italic.ttf',
        '/templates/template2/fonts/Roboto-Light.ttf',
        '/templates/template2/fonts/Roboto-LightItalic.ttf',
        '/templates/template2/fonts/Roboto-Medium.ttf',
        '/templates/template2/fonts/Roboto-MediumItalic.ttf',
        '/templates/template2/fonts/Roboto-Regular.ttf',
        '/templates/template2/fonts/Roboto-Thin.ttf',
        '/templates/template2/fonts/Roboto-ThinItalic.ttf',
        '/templates/template2/fonts/SourceSansPro-Bold.otf',
        '/templates/template2/fonts/SourceSansPro-BoldIt.otf',
        '/templates/template2/fonts/SourceSansPro-It.otf',
        '/templates/template2/fonts/SourceSansPro-Light.otf',
        '/templates/template2/fonts/SourceSansPro-LightIt.otf',
        '/templates/template2/fonts/SourceSansPro-Regular.otf',
        '/templates/template2/fonts/SourceSansPro-Semibold.otf',
        '/templates/template2/fonts/SourceSansPro-SemiboldIt.otf'
      ]
    }
  },
  3: { render: template3, opts: { cmd: 'pdflatex' } },
  4: {
    render: template4,
    opts: {
      cmd: 'xelatex',
      inputs: ['/templates/template4/deedy-resume-openfont.cls'],
      fonts: [
        '/templates/template4/fonts/Raleway-Bold.otf',
        '/templates/template4/fonts/Raleway-ExtraBold.otf',
        '/templates/template4/fonts/Raleway-ExtraLight.otf',
        '/templates/template4/fonts/Raleway-Heavy.otf',
        '/templates/template4/fonts/Raleway-Light.otf',
        '/templates/template4/fonts/Raleway-Medium.otf',
        '/templates/template4/fonts/Raleway-Regular.otf',
        '/templates/template4/fonts/Raleway-SemiBold.otf',
        '/templates/template4/fonts/Raleway-Thin.otf'
      ]
    }
  },
  5: {
    render: template5,
    opts: {
      cmd: 'xelatex',
      inputs: [
        '/templates/template5/helvetica.sty',
        '/templates/template5/res.cls'
      ]
    }
  },
  6: {
    render: template6,
    opts: {
      cmd: 'xelatex',
      inputs: [
        '/templates/template6/custom-command.tex',
        '/templates/template6/minimal-resume-config.tex',
        '/templates/template6/minimal-resume.sty'
      ],
      fonts: [
        '/templates/template6/fonts/CrimsonText-Bold.ttf',
        '/templates/template6/fonts/CrimsonText-BoldItalic.ttf',
        '/templates/template6/fonts/CrimsonText-Italic.ttf',
        '/templates/template6/fonts/CrimsonText-Regular.ttf',
        '/templates/template6/fonts/CrimsonText-Roman.ttf',
        '/templates/template6/fonts/CrimsonText-SemiBold.ttf',
        '/templates/template6/fonts/CrimsonText-SemiBoldItalic.ttf',
        '/templates/template6/fonts/Montserrat-Bold.ttf',
        '/templates/template6/fonts/Montserrat-Light.otf',
        '/templates/template6/fonts/Montserrat-Regular.ttf'
      ]
    }
  },
  7: {
    render: template7,
    opts: {
      cmd: 'pdflatex',
      inputs: [
        '/templates/template7/collection.sty',
        '/templates/template7/moderncv.cls',
        '/templates/template7/moderncvcolorblue.sty',
        '/templates/template7/moderncviconsletters.sty',
        '/templates/template7/moderncvcompatibility.sty',
        '/templates/template7/moderncviconsmarvosym.sty',
        '/templates/template7/moderncvstyleclassic.sty',
        '/templates/template7/tweaklist.sty'
      ]
    }
  },
  8: {
    render: template8,
    opts: { cmd: 'xelatex', inputs: ['/templates/template8/mcdowellcv.cls'] }
  },
  9: { render: template9, opts: { cmd: 'pdflatex' } }
}

export const TEMPLATE_IDS = Object.keys(templates).map(Number)

/**
 * Generates the LaTeX document based on the selected template
 * as well as the necessary options needed for it to create a pdf.
 * Unknown templates fall back to template 1.
 *
 * @param formData - The form data from the request body.
 *
 * @return The generated LaTeX document as well as its additional opts.
 */
export default function getTemplateData(formData: FormValues): TemplateData {
  const data = sanitize(formData)
  const { render, opts } = templates[data.selectedTemplate] || templates[1]

  return { texDoc: render(data), opts }
}
