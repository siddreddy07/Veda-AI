import { generateObject } from "ai"
import {
  questionSchema,
  type QuestionExtraction,
} from "./schemas/question-schema"
import { model } from "./providers"
import type { OcrPageResult } from "@/lib/ocr/ocr-pages"

const EXTRACTION_INSTRUCTIONS = `You are an expert at extracting exam questions from the OCR text of a question paper.

Extract every question from the provided Question Paper OCR text:
- Extract EVERY question. Do not omit any.
- Maintain the exact printed order of questions.
- Preserve the original question numbering (questionNo) exactly as printed, e.g. "1", "11(a)", "11(b)". Never generate new numbering and never renumber.
- Treat each labelled sub-part as a separate question. For example, "11(a)" and "11(b)" must be separate entries.
- Preserve the complete question content for each entry.
- Read the maximum marks (maxMarks) for each question exactly as printed in the OCR (e.g. the number in parentheses/marks column). If no marks are visible, set maxMarks to 0.
- Do not invent questions.
- Do not merge separately labelled sub-parts into a single question.`

/**
 * Extract structured questions from normal OCR text of a question paper.
 * No line/bbox data is used here — only the extracted text per page.
 */
export async function extractQuestions(
  pages: OcrPageResult[],
): Promise<QuestionExtraction> {
  const ocrText = pages
    .map(
      (page) =>
        `--- Page ${page.page} ---\n${page.text.replace(/\s+$/, "\n")}`,
    )
    .join("\n")

  const result = await generateObject({
    model,
    schema: questionSchema,
    schemaName: "QuestionExtraction",
    schemaDescription:
      "The complete list of questions extracted from the question paper OCR text, with question number, content, and max marks, in original order.",
    system: EXTRACTION_INSTRUCTIONS,
    temperature: 0,
    prompt: `<question-paper-ocr>
${ocrText}
</question-paper-ocr>

Extract every question from the OCR text above according to the instructions and schema.`,
  })

  return result.object
}
