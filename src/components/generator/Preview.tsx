import { useAtom } from 'jotai'
import { useState, useCallback } from 'react'
import { pdfjs, Document, Page } from 'react-pdf'
import type { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api'
import styled from 'styled-components'
import { MdFileDownload } from 'react-icons/md'
import { resumeAtom } from '../../atoms/resume'
import { colors } from '../../theme'

const workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`
pdfjs.GlobalWorkerOptions.workerSrc = workerSrc

const Output = styled.output`
  grid-area: preview;
  background: ${(props) => props.theme.lightBlack};
  overflow-y: auto;
`

const PdfContainer = styled.article`
  width: 100%;
  height: 100%;
`

const ResumeDocument = styled(Document)`
  width: 100%;
`

const ResumePage = styled(Page)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.5em 0 0;

  &:last-child {
    padding-bottom: 10rem;
  }

  canvas {
    max-width: 95% !important;
    height: auto !important;
  }
`

const Toolbar = styled.div`
  display: flex;
  gap: 4px;
  padding: 10px 16px;
  border-bottom: 1px solid ${colors.borders};
`

const ToolButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 35px;
  padding: 0 8px;
  font: inherit;
  font-size: 12px;
  text-decoration: none;
  color: #ddd;
  background: transparent;
  border: none;
  border-radius: 2px;
  cursor: pointer;

  svg {
    font-size: 20px;
  }

  &:hover {
    color: ${colors.primary};
  }

  &[aria-disabled='true'] {
    opacity: 0.4;
    pointer-events: none;
  }
`

// Form values are persisted here on every change (see Form/index.tsx)
function getFormJson() {
  return localStorage.getItem('jsonResume') || '{}'
}

function download(blob: Blob, filename: string) {
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = filename
  a.click()
  setTimeout(() => URL.revokeObjectURL(a.href))
}

function downloadJson() {
  download(
    new Blob([getFormJson()], { type: 'application/json' }),
    'resume.json'
  )
}

async function downloadSource() {
  const res = await fetch('/api/generate-source', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: getFormJson()
  })
  if (res.ok) {
    download(await res.blob(), 'resume.zip')
  }
}

export function Preview() {
  const [resume] = useAtom(resumeAtom)
  const [pageCount, setPageCount] = useState(1)
  const [scale] = useState(document.body.clientWidth > 1440 ? 1.75 : 1)

  const handleDocumentLoadSuccess = useCallback((pdf: PDFDocumentProxy) => {
    setPageCount(pdf.numPages)
  }, [])

  return (
    <Output>
      <Toolbar>
        <ToolButton
          as="a"
          href={resume.url || undefined}
          download="resume.pdf"
          aria-disabled={!resume.url}
        >
          <MdFileDownload /> PDF
        </ToolButton>
        <ToolButton type="button" onClick={downloadSource}>
          <MdFileDownload /> LaTeX
        </ToolButton>
        <ToolButton type="button" onClick={downloadJson}>
          <MdFileDownload /> JSON
        </ToolButton>
      </Toolbar>
      <PdfContainer>
        <ResumeDocument
          file={resume.url || '/blank.pdf'}
          onLoadSuccess={handleDocumentLoadSuccess}
          loading=""
        >
          {Array.from({ length: pageCount }, (_, i) => (
            <ResumePage
              key={i}
              pageNumber={i + 1}
              scale={scale}
              renderAnnotationLayer={false}
              renderTextLayer={false}
              loading=""
              // pageCount of the previous PDF may briefly exceed the new one
              error=""
            />
          ))}
        </ResumeDocument>
      </PdfContainer>
    </Output>
  )
}
