import { generateObject } from "ai"
import { gradingSchema, type GradingItem } from "./schemas/grading-schema"
import { model } from "./providers"
import type { Question } from "./schemas/question-schema"
import type { QuestionBlockMapping } from "./schemas/answer-blocks-schema"
import type { AnswerBlockWithRegions } from "./schemas/answer-blocks-schema"

export type { GradingItem } from "./schemas/grading-schema"

const GRADING_INSTRUCTIONS = `You grade a student's written answers against exam questions.

For every question you are given:
- questionNumber
- question (the question content)
- maxMarks (the maximum marks for that question)
- answer (the student's OCR'd answer for that question)

Rules:
- score must be an integer between 0 and maxMarks inclusive.
- Grade ONLY based on the question and the student's mapped answer provided. Never use other answers or outside knowledge to fill in content the student did not write.
- If a question has an empty answer (no answer was mapped), score must be 0 and feedback must say the question was unanswered.
- feedback must be short and useful. Explain what was correct, and what was missing or wrong. Do not invent content that is not present in the student's answer.
- Return exactly one result per provided question.`

export interface GradeableQuestion {
  questionNumber: string
  question: string
  maxMarks: number
  answer: string
}

/**
 * Deterministic reading order for a block: the earliest page, then the topmost
 * y position of any of the block's regions.
 */
function blockReadingOrder(a: AnswerBlockWithRegions, b: AnswerBlockWithRegions): number {
  const aPage = a.regions[0]?.page ?? Number.MAX_SAFE_INTEGER
  const bPage = b.regions[0]?.page ?? Number.MAX_SAFE_INTEGER
  if (aPage !== bPage) return aPage - bPage
  const aTop = a.regions[0]?.top ?? 0
  const bTop = b.regions[0]?.top ?? 0
  return aTop - bTop
}

/**
 * Build the grading input for every mapped question. The `answer` is the text
 * of the question's mapped blocks, combined in reading order (page, then top).
 * Questions with no mapped blocks get an empty answer string.
 */
export function buildGradingInput(
  questions: Question[],
  mappings: QuestionBlockMapping[],
  blocks: AnswerBlockWithRegions[],
): GradeableQuestion[] {
  const byBlockId = new Map(blocks.map((b) => [b.id, b]))
  const blockIdsByQuestion = new Map<string, string[]>()

  for (const q of questions) {
    blockIdsByQuestion.set(String(q.questionNo), [])
  }

  const assigned = new Set<string>()
  for (const m of mappings) {
    const target = blockIdsByQuestion.get(m.questionNumber)
    if (!target) continue
    for (const id of m.blockIds) {
      if (!byBlockId.has(id) || assigned.has(id)) continue
      assigned.add(id)
      target.push(id)
    }
  }

  return questions.map((q) => {
    const questionNumber = String(q.questionNo)
    const blockIds = blockIdsByQuestion.get(questionNumber) ?? []
    const orderedBlocks = blockIds
      .map((id) => byBlockId.get(id)!)
      .sort(blockReadingOrder)
    const answer = orderedBlocks.map((b) => b.text).join("\n").trim()

    return {
      questionNumber,
      question: q.content,
      maxMarks: q.maxMarks,
      answer,
    }
  })
}

/**
 * Grade every question in a single Groq call. Returns one result per question
 * with score clamped to [0, maxMarks].
 */
export async function gradeAnswers(
  questions: Question[],
  mappings: QuestionBlockMapping[],
  blocks: AnswerBlockWithRegions[],
): Promise<GradingItem[]> {
  const gradeable = buildGradingInput(questions, mappings, blocks)

  if (gradeable.length === 0) return []

  const result = await generateObject({
    model,
    schema: gradingSchema,
    schemaName: "AnswerGrading",
    schemaDescription:
      "Graded results for every question with an integer score between 0 and maxMarks, and short feedback.",
    system: GRADING_INSTRUCTIONS,
    temperature: 0,
    maxOutputTokens: 4096,
    prompt: `<questions-to-grade>
${JSON.stringify(gradeable, null, 2)}
</questions-to-grade>

Grade every question in <questions-to-grade> according to the instructions and schema. Return exactly one result for each question.`,
  })

  const maxByQuestion = new Map(gradeable.map((g) => [g.questionNumber, g.maxMarks]))

  return result.object.results.map((item) => {
    const maxMarks = maxByQuestion.get(item.questionNumber) ?? 0
    const score = Math.max(
      0,
      Math.min(maxMarks, Math.round(item.score)),
    )
    return {
      questionNumber: item.questionNumber,
      score,
      maxMarks,
      feedback: item.feedback,
    }
  })
}
