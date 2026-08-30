import { generateObject } from "ai"
import {
  answerBlocksSchema,
  type AnswerBlocks,
  type AnswerBlock,
  type AnswerBlockWithRegions,
} from "./schemas/answer-blocks-schema"
import { model } from "./providers"
import type { OcrLine } from "@/lib/ocr/ocr-pages"

const GROUPING_INSTRUCTIONS = `You group OCR lines extracted from a scanned answer sheet into meaningful content/answer blocks.

Guidelines:
- lineIds are the source of truth. Never use anything other than the provided line IDs to identify or reference content.
- Group lines that belong to the same logical content or answer into a single block.
- Do NOT force every OCR line into a block.
- Do not include clearly unrelated or noisy lines just to complete a block.
- Preserve the original reading order (the lines are listed in order). A block may continue across pages.
- Use the surrounding context to understand noisy OCR, but never invent or add content that is not present in the lines.
- Use only the provided line IDs. Never reference an ID that was not provided.
- Assign each line to at most one block.
- Assign a short sequential id to each block (e.g. "b1", "b2", "b3", ...).
- The block text must be a clean, readable reconstruction of its grouped line texts, preserving their order.
- Place line IDs in unmatchedLineIds when the lines are severely corrupted, fragmented, meaningless, or cannot confidently be read as one logical content section.
- Diagram labels may still be grouped together when they clearly form one diagram or figure, but do not reconstruct, infer, or invent the meaning of diagram content.`

/**
 * Lines processed per grouping request. Keeping this bounded stays under Groq's
 * free-tier token-per-minute limit even for large PDFs.
 */
const CHUNK_LINES = 120
const MAX_OUTPUT_TOKENS = 2048

/**
 * Answer sheet pipeline:
 * 1. AI groups OCR lines into answer blocks (semantic grouping only).
 * 2. TypeScript computes each block's highlight regions from its OCR bboxes.
 */
export async function extractAnswerBlocks(
  lines: OcrLine[],
): Promise<{ blocks: AnswerBlockWithRegions[]; unmatchedLineIds: string[] }> {
  const { blocks, unmatchedLineIds } = await groupLinesInChunks(lines)
  const blocksWithRegions = addRegionsToBlocks(blocks, lines)
  return { blocks: blocksWithRegions, unmatchedLineIds }
}

async function groupLinesInChunks(lines: OcrLine[]): Promise<AnswerBlocks> {
  const allBlocks: AnswerBlock[] = []
  const allUnmatched: string[] = []

  let nextChunkStart = 0
  while (nextChunkStart < lines.length) {
    const chunk = lines.slice(nextChunkStart, nextChunkStart + CHUNK_LINES)
    nextChunkStart += chunk.length

    // Re-send unmatched lines from the previous chunk so noisy lines get a
    // second chance with the surrounding context of the next chunk.
    const carryover = lines
      .filter((line) => allUnmatched.includes(line.id))
      .slice(0, CHUNK_LINES)

    const result = await groupChunk(carryover, chunk)
    allBlocks.push(...result.blocks)
    allUnmatched.push(...result.unmatchedLineIds)
  }

  return { blocks: allBlocks, unmatchedLineIds: allUnmatched }
}

async function groupChunk(
  carryover: OcrLine[],
  chunk: OcrLine[],
): Promise<AnswerBlocks> {
  const ocrInput = [...carryover, ...chunk]
    .map((line) => `${line.id}\tpage ${line.page}: ${line.text}`)
    .join("\n")

  const result = await generateObject({
    model,
    schema: answerBlocksSchema,
    schemaName: "AnswerBlocks",
    schemaDescription:
      "OCR lines grouped into meaningful content/answer blocks, with unmatched lines listed separately.",
    system: GROUPING_INSTRUCTIONS,
    temperature: 0,
    maxOutputTokens: MAX_OUTPUT_TOKENS,
    prompt: `<ocr-lines>
${ocrInput}
</ocr-lines>

Group the OCR lines above into content/answer blocks according to the instructions and schema.`,
  })

  return result.object
}

/**
 * Deterministically add highlight regions to each block using the original
 * OCR line bboxes: block.lineIds → lines → group by page → merge bbox.
 * One merged region per page. Pure TypeScript, no AI.
 */
function addRegionsToBlocks(
  blocks: AnswerBlock[],
  lines: OcrLine[],
): AnswerBlockWithRegions[] {
  const byLineId = new Map(lines.map((l) => [l.id, l]))

  return blocks.map((block) => {
    const matchedLines = block.lineIds
      .map((id) => byLineId.get(id))
      .filter((l): l is OcrLine => l !== undefined)

    const byPage = new Map<number, OcrLine[]>()
    for (const line of matchedLines) {
      const pageLines = byPage.get(line.page) ?? []
      pageLines.push(line)
      byPage.set(line.page, pageLines)
    }

    const regions = [...byPage.entries()]
      .map(([page, pageLines]) => mergeBbox(page, pageLines))
      .sort((a, b) => a.page - b.page)

    return {
      id: block.id,
      lineIds: block.lineIds,
      text: block.text,
      regions,
    }
  })
}

const PADDING_X = 4
const PADDING_Y = 3

interface MergedRegion {
  page: number
  left: number
  top: number
  width: number
  height: number
}

function mergeBbox(page: number, pageLines: OcrLine[]): MergedRegion {
  const left = Math.min(...pageLines.map((l) => l.bbox.left))
  const top = Math.min(...pageLines.map((l) => l.bbox.top))
  const right = Math.max(...pageLines.map((l) => l.bbox.left + l.bbox.width))
  const bottom = Math.max(...pageLines.map((l) => l.bbox.top + l.bbox.height))

  return {
    page,
    left: left - PADDING_X,
    top: top - PADDING_Y,
    width: right - left + PADDING_X * 2,
    height: bottom - top + PADDING_Y * 2,
  }
}
