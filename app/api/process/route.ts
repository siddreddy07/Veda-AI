import { generateObject } from "ai"
import { extractOcrPages, type OcrAnswerExtraction } from "@/lib/ocr/ocr-pages"
import { extractQuestions } from "@/lib/ai/extract-questions"
import { extractAnswerBlocks } from "@/lib/ai/extract-answers"
import { gradeAnswers, type GradingItem } from "@/lib/ai/grade-answers"
import {
  answerMappingSchema,
  type AnswerMapping,
  type QuestionBlockMapping,
} from "@/lib/ai/schemas/answer-blocks-schema"
import { model } from "@/lib/ai/providers"
import type { Question } from "@/lib/ai/schemas/question-schema"

const MAPPING_INSTRUCTIONS = `You map answer blocks of a student's written answers to the corresponding questions from a question paper.

Guidelines:
- Match based on semantic meaning of the content, NOT on position or order. Answers may be written out of question order.
- Return exactly one mapping entry for EVERY question provided. Do not omit or add questions.
- Copy the "questionNumber" EXACTLY as given. Never invent, renumber, or reformat it.
- One question may map to multiple blocks; include all matching block IDs for that question.
- A question with no matching answer must be mapped with an empty blockIds array.
- Do not force uncertain matches. If a block cannot be confidently matched to any question, put its ID in unmatchedBlockIds.
- Do not map a block to an unrelated question.
- Use only the provided question numbers and block IDs. Never invent or reference IDs that were not provided.
- Do not grade the answers and do not generate any feedback.`

export function GET() {
  return Response.json(
    {
      success: false,
      message: "Use POST with multipart form-data (questionPaper, answerSheet).",
    },
    { status: 405 },
  )
}

/**
 * Map every question to its answer block(s). Sends only question numbers/content
 * and block id/text — never coordinates, lineIds, pages, or regions.
 */
async function mapQuestionsToBlocks(
  questions: Question[],
  blocks: { id: string; text: string }[],
): Promise<AnswerMapping> {
  const questionInput = questions.map((q) => ({
    questionNumber: String(q.questionNo),
    content: q.content,
  }))
  const blockInput = blocks.map((b) => ({ id: b.id, text: b.text }))

  const result = await generateObject({
    model,
    schema: answerMappingSchema,
    schemaName: "AnswerMapping",
    schemaDescription:
      "Assigns each question to its answer block IDs, with a mapping for every question.",
    system: MAPPING_INSTRUCTIONS,
    temperature: 0,
    maxOutputTokens: 2048,
    prompt: `<questions>
${JSON.stringify(questionInput, null, 2)}
</questions>

<answer-blocks>
${JSON.stringify(blockInput, null, 2)}
</answer-blocks>

Return exactly one mapping entry for every question in <questions>, copying each question's exact "questionNumber". Blocks that match no question go in "unmatchedBlockIds".`,
  })

  return normalizeMapping(result.object, questionInput, blockInput)
}

/**
 * Guarantee exactly one mapping per provided question and only use provided
 * block IDs, regardless of what the model returns.
 */
function normalizeMapping(
  raw: AnswerMapping,
  questionInput: { questionNumber: string; content: string }[],
  blockInput: { id: string; text: string }[],
): AnswerMapping {
  const providedQuestionNos = new Set(questionInput.map((q) => q.questionNumber))
  const providedBlockIds = new Set(blockInput.map((b) => b.id))

  const byQuestion = new Map<string, string[]>()
  for (const q of questionInput) {
    byQuestion.set(q.questionNumber, [])
  }

  const assignedBlocks = new Set<string>()
  for (const m of raw.mappings) {
    const qNo = m.questionNumber
    if (!providedQuestionNos.has(qNo)) continue
    const target = byQuestion.get(qNo)!
    for (const id of m.blockIds) {
      if (!providedBlockIds.has(id) || assignedBlocks.has(id)) continue
      assignedBlocks.add(id)
      target.push(id)
    }
  }

  const mappings: QuestionBlockMapping[] = questionInput.map((q) => ({
    questionNumber: q.questionNumber,
    blockIds: byQuestion.get(q.questionNumber)!,
  }))

  const unmatchedBlockIds = blockInput
    .map((b) => b.id)
    .filter((id) => !assignedBlocks.has(id))

  return { mappings, unmatchedBlockIds }
}

export async function POST(request: Request) {
  const formData = await request.formData()

  const questionPaper = formData.get("questionPaper")
  const answerSheet = formData.get("answerSheet")

  console.log("Question Paper:", {
    name: (questionPaper as File)?.name,
    type: (questionPaper as File)?.type,
    size: (questionPaper as File)?.size,
  })
  console.log("Answer Sheet:", {
    name: (answerSheet as File)?.name,
    type: (answerSheet as File)?.type,
    size: (answerSheet as File)?.size,
  })

  if (!(questionPaper instanceof File) || !(answerSheet instanceof File)) {
    return Response.json(
      { success: false, message: "Missing question paper or answer sheet" },
      { status: 400 },
    )
  }

  // OCR the two documents sequentially.
  let questionResult: OcrAnswerExtraction | null = null
  try {
    questionResult = await extractOcrPages(questionPaper)
  } catch (error) {
    console.error("Google Vision OCR failed (question paper):", error)
    return Response.json(
      { success: false, message: (error as Error).message },
      { status: 503 },
    )
  }

  let answerResult: OcrAnswerExtraction | null = null
  try {
    answerResult = await extractOcrPages(answerSheet)
  } catch (error) {
    console.error("Google Vision OCR failed (answer sheet):", error)
    return Response.json(
      { success: false, message: (error as Error).message },
      { status: 503 },
    )
  }

  if (!questionResult || !answerResult) {
    return Response.json(
      { success: false, message: "OCR failed to return results" },
      { status: 503 },
    )
  }

  console.log(
    `OCR'd Question Paper: ${questionResult.pages.length} page(s), ` +
      `Answer Sheet: ${answerResult.pages.length} page(s)`,
  )

  const answerLines = answerResult.pages.flatMap((page) => page.lines)

  // 1) Extract structured questions from the question paper OCR (AI).
  let extractedQuestions: Question[] = []
  try {
    const questions = await extractQuestions(questionResult.pages)
    extractedQuestions = questions.questions
    console.log(
      `[questions] Extracted ${extractedQuestions.length} question(s)`,
    )
  } catch (error) {
    console.error("[questions] Extraction failed:", error)
  }

  // 2) Group answer OCR lines into blocks (AI), then add regions (TS).
  let answer = null
  try {
    answer = await extractAnswerBlocks(answerLines)
    console.log(
      `[blocks] Done — ${answer.blocks.length} block(s), ` +
        `${answer.unmatchedLineIds.length} unmatched`,
    )
  } catch (error) {
    console.error("[answers] Grouping failed:", error)
  }

  const answerBlocks = answer?.blocks ?? []
  const unmatchedLineIds = answer?.unmatchedLineIds ?? []

  // 3) Map questions → answer blocks (AI, small call).
  let mapping: AnswerMapping | null = null
  try {
    mapping = await mapQuestionsToBlocks(extractedQuestions, answerBlocks)
    console.log(
      `[mapping] Mapped ${mapping.mappings.length} question(s), ` +
        `${mapping.unmatchedBlockIds.length} unmatched block(s)`,
    )
  } catch (error) {
    console.error("[mapping] Mapping failed:", error)
  }

  // Question pages expose text only (no line ids/bbox, no blocks).
  const questionPages = questionResult.pages.map(({ page, text }) => ({
    page,
    text,
  }))

  // 4) Grade every mapped question in a single call, then add grading.
  let grading: GradingItem[] = []
  try {
    grading = await gradeAnswers(
      extractedQuestions,
      mapping?.mappings ?? [],
      answerBlocks,
    )
    console.log(`[grading] Graded ${grading.length} question(s)`)
  } catch (error) {
    console.error("[grading] Grading failed:", error)
  }

  return Response.json({
    success: true,
    questions: extractedQuestions,
    questionPages,
    answer: {
      pages: answerResult.pages,
      blocks: answerBlocks,
      unmatchedLineIds,
      mappings: mapping?.mappings ?? [],
      unmatchedBlockIds: mapping?.unmatchedBlockIds ?? [],
      grading,
    },
  })
}
