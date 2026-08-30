import { z } from "zod"

export const answerBlocksSchema = z.object({
  blocks: z.array(
    z.object({
      id: z.string(),
      lineIds: z.array(z.string()),
      text: z.string(),
    }),
  ),
  unmatchedLineIds: z.array(z.string()),
})

export const answerMappingSchema = z.object({
  mappings: z.array(
    z.object({
      questionNumber: z.string(),
      blockIds: z.array(z.string()),
    }),
  ),
  unmatchedBlockIds: z.array(z.string()),
})

export type AnswerBlocks = z.infer<typeof answerBlocksSchema>
export type AnswerMapping = z.infer<typeof answerMappingSchema>

export type AnswerBlock = AnswerBlocks["blocks"][number]

export interface AnswerBlockRegion {
  page: number
  left: number
  top: number
  width: number
  height: number
}

export interface AnswerBlockWithRegions {
  id: string
  lineIds: string[]
  text: string
  regions: AnswerBlockRegion[]
}

export interface QuestionBlockMapping {
  questionNumber: string
  blockIds: string[]
}
