import { LaTeXOpts } from '../types'

const COMPILE_URL = 'https://latex.ytotech.com/builds/sync'

export default async function latex(texDoc: string, opts: LaTeXOpts) {
  const files = [
    ...(opts.inputs || []).map((url) => [url, basename(url)]),
    ...(opts.fonts || []).map((url) => [url, `fonts/${basename(url)}`])
  ]
  const resources = await Promise.all(
    files.map(async ([url, path]) => ({
      path,
      file: await toBase64(await (await fetch(url)).blob())
    }))
  )

  const res = await fetch(COMPILE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      compiler: opts.cmd,
      resources: [{ main: true, content: texDoc }, ...resources]
    })
  })
  if (!res.ok) {
    throw new Error(await res.text())
  }

  return URL.createObjectURL(await res.blob())
}

function toBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve((reader.result as string).split(',')[1])
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(blob)
  })
}

function basename(url: string) {
  return url.slice(url.lastIndexOf('/') + 1)
}
