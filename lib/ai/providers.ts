import { groq } from "@ai-sdk/groq"
import type { LanguageModel } from "ai"

const GROQ_MODEL = process.env.AI_MODEL_GROQ ?? "qwen/qwen3.8-27b"

/**
 * The single model used across the whole app (question extraction, content
 * grouping, and question→answer mapping).
 */
export const model: LanguageModel = groq(GROQ_MODEL)
