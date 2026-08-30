import type {
  AnswerBlockWithRegions,
  QuestionBlockMapping,
} from "@/lib/ai/schemas/answer-blocks-schema"
import type { OcrPageResult } from "@/lib/ocr/ocr-pages"
import type { GradingItem } from "@/lib/ai/schemas/grading-schema"

/**
 * The `answer` object returned by /api/process.
 */
export interface AnswerData {
  pages: OcrPageResult[]
  blocks: AnswerBlockWithRegions[]
  unmatchedLineIds: string[]
  mappings: QuestionBlockMapping[]
  unmatchedBlockIds: string[]
  grading: GradingItem[]
}
