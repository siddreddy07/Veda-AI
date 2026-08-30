import { z } from "zod"

export const questionSchema = z.object({
  questions: z.array(
    z.object({
      questionNo: z.string(),
      content: z.string(),
      maxMarks: z.number().int().nonnegative(),
    }),
  ),
})

export type QuestionExtraction = z.infer<typeof questionSchema>

export type Question = QuestionExtraction["questions"][number]
