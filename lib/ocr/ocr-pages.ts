import { ImageAnnotatorClient } from "@google-cloud/vision"

import type { protos } from "@google-cloud/vision"

export interface OcrBbox {
  left: number
  top: number
  width: number
  height: number
}

export interface OcrLine {
  id: string
  page: number
  text: string
  bbox: OcrBbox
}

export interface OcrPageResult {
  page: number
  width: number
  height: number
  text: string
  lines: OcrLine[]
}

export interface OcrAnswerExtraction {
  pages: OcrPageResult[]
}

type Vertex = protos.google.cloud.vision.v1.IVertex
type NormalizedVertex = protos.google.cloud.vision.v1.INormalizedVertex
type BoundingPoly = protos.google.cloud.vision.v1.IBoundingPoly
type VisionPage = protos.google.cloud.vision.v1.IPage

/**
 * Convert a Vision polygon into an absolute pixel bbox.
 *
 * Vision returns absolute `vertices` (pixels) for plain image OCR, but for the
 * PDF/file path the boxes come back as `normalizedVertices` (0..1 relative to
 * the page), with `vertices` empty. Handle both by preferring `vertices` and
 * scaling `normalizedVertices` by the page dimensions when they are absent.
 */
function bboxFromVertices(
  box: BoundingPoly | null | undefined,
  pageWidth: number,
  pageHeight: number,
): OcrBbox | null {
  let vertices: Vertex[] | null | undefined
  let normalized: NormalizedVertex[] | null | undefined

  if (box) {
    vertices = box.vertices
    normalized = box.normalizedVertices
  }

  if ((!vertices || vertices.length < 4) && normalized && normalized.length >= 4) {
    const xs = normalized.map((v) => (v.x ?? 0) * pageWidth)
    const ys = normalized.map((v) => (v.y ?? 0) * pageHeight)
    const left = Math.min(...xs)
    const top = Math.min(...ys)
    const right = Math.max(...xs)
    const bottom = Math.max(...ys)
    return {
      left,
      top,
      width: right - left,
      height: bottom - top,
    }
  }

  if (!vertices || vertices.length < 4) return null

  const xs = vertices.map((v) => v.x ?? 0)
  const ys = vertices.map((v) => v.y ?? 0)
  const left = Math.min(...xs)
  const top = Math.min(...ys)
  const right = Math.max(...xs)
  const bottom = Math.max(...ys)

  return {
    left,
    top,
    width: right - left,
    height: bottom - top,
  }
}

/**
 * Build an OCR line from a Vision paragraph's words: concatenate the words in
 * reading order and merge their bounding boxes into a single line bbox.
 */
function buildLine(
  paragraph: protos.google.cloud.vision.v1.IParagraph,
  page: number,
  pageWidth: number,
  pageHeight: number,
  lineIndex: number,
): OcrLine | null {
  const words = paragraph.words ?? []
  const text = words
    .map((word) => (word.symbols ?? []).map((s) => s.text ?? "").join(""))
    .join(" ")
    .trim()

  const lineBbox = words.reduce<OcrBbox | null>((merged, word) => {
    const wordBox = bboxFromVertices(
      word.boundingBox,
      pageWidth,
      pageHeight,
    )
    if (!wordBox) return merged
    if (!merged) return wordBox
    const left = Math.min(merged.left, wordBox.left)
    const top = Math.min(merged.top, wordBox.top)
    const right = Math.max(merged.left + merged.width, wordBox.left + wordBox.width)
    const bottom = Math.max(merged.top + merged.height, wordBox.top + wordBox.height)
    return { left, top, width: right - left, height: bottom - top }
  }, null)

  if (!text || !lineBbox) return null

  return {
    id: `p${page}-l${lineIndex + 1}`,
    page,
    text,
    bbox: lineBbox,
  }
}

/** Build per-page lines from a Vision page's blocks/paragraphs. */
function parseLines(page: number, pageData: VisionPage): OcrLine[] {
  const pageWidth = pageData.width ?? 0
  const pageHeight = pageData.height ?? 0
  const lines: OcrLine[] = []
  let lineNumber = 0

  for (const block of pageData.blocks ?? []) {
    for (const paragraph of block.paragraphs ?? []) {
      const line = buildLine(
        paragraph,
        page,
        pageWidth,
        pageHeight,
        lineNumber,
      )
      if (line) {
        lines.push(line)
        lineNumber += 1
      }
    }
  }

  return lines
}

/** Reconstruct per-page text from a Vision page's blocks/paragraphs in order. */
function pageText(pageData: VisionPage): string {
  const parts: string[] = []
  for (const block of pageData.blocks ?? []) {
    for (const paragraph of block.paragraphs ?? []) {
      const text = (paragraph.words ?? [])
        .map((word) => (word.symbols ?? []).map((s) => s.text ?? "").join(""))
        .join(" ")
      if (text.trim()) parts.push(text)
    }
  }
  return parts.join("\n")
}

/** Convert a single Vision page into the pipeline's OcrPageResult shape. */
function buildPageResult(pageData: VisionPage, page: number): OcrPageResult {
  const text = pageText(pageData)
  const lines = parseLines(page, pageData)

  console.log(`[ocr] Page ${page}: ${text.length} char(s), ${lines.length} line(s) with bbox`)

  for (const line of lines.slice(0, 3)) {
    console.log(
      `[ocr] Page ${page} ${line.id}: ${JSON.stringify({
        id: line.id,
        page: line.page,
        text: line.text,
        bbox: line.bbox,
      })}`,
    )
  }

  return {
    page,
    width: pageData.width ?? 0,
    height: pageData.height ?? 0,
    text,
    lines,
  }
}

let client: ImageAnnotatorClient | null = null

function getClient(): ImageAnnotatorClient {
  if (!client) {
    client = new ImageAnnotatorClient({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      credentials: {
        client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
        private_key: (process.env.GOOGLE_CLOUD_PRIVATE_KEY ?? "").replace(
          /\\n/g,
          "\n",
        ),
      },
    })
  }
  return client
}

function assertConfigured(): void {
  if (
    !process.env.GOOGLE_CLOUD_PROJECT_ID ||
    !process.env.GOOGLE_CLOUD_CLIENT_EMAIL ||
    !process.env.GOOGLE_CLOUD_PRIVATE_KEY
  ) {
    throw new Error(
      "GOOGLE_CLOUD_PROJECT_ID, GOOGLE_CLOUD_CLIENT_EMAIL and GOOGLE_CLOUD_PRIVATE_KEY must be set in the environment",
    )
  }
}

function isPdf(file: File): boolean {
  return (
    file.type === "application/pdf" ||
    /\.pdf$/i.test(file.name)
  )
}

/** OCR a plain image (JPEG/PNG/...) via the simple, synchronous image API. */
async function extractImagePages(
  vision: ImageAnnotatorClient,
  content: Uint8Array,
): Promise<OcrPageResult[]> {
  const [result] = await vision.documentTextDetection({
    image: { content },
  })

  if (result.error?.message) {
    throw new Error(`Google Vision image OCR error: ${result.error.message}`)
  }

  const annotation = result.fullTextAnnotation
  if (!annotation || !annotation.pages || annotation.pages.length === 0) {
    throw new Error(
      `Google Vision returned no pages for image OCR${
        result ? `: ${JSON.stringify(result)}` : ""
      }`,
    )
  }

  return annotation.pages.map((pageData, index) =>
    buildPageResult(pageData, index + 1),
  )
}

/**
 * OCR a PDF via the dedicated files API (batchAnnotateFiles). PDFs cannot be
 * sent through documentTextDetection; they need the file/PDF handling path.
 */
async function extractPdfPages(
  vision: ImageAnnotatorClient,
  content: Uint8Array,
): Promise<OcrPageResult[]> {
  const [result] = await vision.batchAnnotateFiles({
    requests: [
      {
        inputConfig: {
          mimeType: "application/pdf",
          content,
        },
        features: [{ type: "DOCUMENT_TEXT_DETECTION" }],
      },
    ],
  })

  const fileResponses = result.responses ?? []
  if (fileResponses.length === 0) {
    throw new Error(
      `Google Vision returned no file responses for PDF OCR: ${JSON.stringify(result)}`,
    )
  }

  const pages: OcrPageResult[] = []

  for (const fileResponse of fileResponses) {
    if (fileResponse.error?.message) {
      throw new Error(
        `Google Vision file OCR error: ${fileResponse.error.message}`,
      )
    }

    const pageResponses = fileResponse.responses ?? []
    for (const pageResponse of pageResponses) {
      if (pageResponse.error?.message) {
        throw new Error(
          `Google Vision PDF page error: ${pageResponse.error.message}`,
        )
      }

      const annotation = pageResponse.fullTextAnnotation
      if (
        !annotation ||
        !annotation.pages ||
        annotation.pages.length === 0
      ) {
        throw new Error(
          `Google Vision returned no page data for PDF page ${
            pages.length + 1
          }: ${JSON.stringify(pageResponse)}`,
        )
      }

      for (const pageData of annotation.pages) {
        pages.push(buildPageResult(pageData, pages.length + 1))
      }
    }
  }

  if (pages.length === 0) {
    throw new Error(
      `Google Vision returned no OCR pages for PDF: ${JSON.stringify(result)}`,
    )
  }

  return pages
}

export async function extractOcrPages(
  file: File,
): Promise<OcrAnswerExtraction> {
  assertConfigured()

  const vision = getClient()
  const content = new Uint8Array(await file.arrayBuffer())

  const pages = isPdf(file)
    ? await extractPdfPages(vision, content)
    : await extractImagePages(vision, content)

  console.log(`[ocr] Request complete: ${pages.length} page(s) in response`)

  return { pages }
}
