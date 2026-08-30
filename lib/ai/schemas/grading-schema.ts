import { z } from "zod"

export const gradingItemSchema = z.object({
  questionNumber: z.string(),
  score: z.number().min(0),
  maxMarks: z.number().min(0),
  feedback: z.string(),
})

export const gradingSchema = z.object({
  results: z.array(gradingItemSchema),
})

export type Grading = z.infer<typeof gradingSchema>
export type GradingItem = Grading["results"][number]
