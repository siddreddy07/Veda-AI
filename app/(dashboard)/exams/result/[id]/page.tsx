"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ResultsScreen } from "@/components/results/results-screen"
import {
  getExamFiles,
  getExamResult,
  getSelectedQuestion,
  isExamExpired,
  removeExam,
} from "@/lib/client-storage"
import type { Question } from "@/lib/ai/schemas/question-schema"
import type { AnswerData } from "@/lib/types"

type ProcessResult = {
  success: boolean
  questions: Question[]
  answer: AnswerData
}

export default function ResultPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const id = params?.id

  const [questions, setQuestions] = useState<Question[]>([])
  const [answer, setAnswer] = useState<AnswerData | null>(null)
  const [answerSheetUrl, setAnswerSheetUrl] = useState<string | null>(null)
  const [answerSheetMimeType, setAnswerSheetMimeType] = useState<string | null>(
    null,
  )
  const [initialSelectedQuestion, setInitialSelectedQuestion] = useState<
    string | null
  >(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    let objectUrl: string | null = null

    const load = async () => {
      const record = getExamResult(id)
      if (!record) {
        // Case 2 — no matching exam in storage: redirect to the exams list.
        if (!cancelled) router.replace("/exams")
        return
      }

      if (isExamExpired(record)) {
        // Case 3 — TTL expired: clean up every piece of exam-scoped storage
        // (result JSON, uploaded files, selected-question state) and redirect.
        if (!cancelled) {
          await removeExam(id).catch(() => {})
          router.replace("/exams")
        }
        return
      }

      const result = record.result as ProcessResult | undefined
      const savedSelectedQuestion = getSelectedQuestion(id)

      const files = await getExamFiles(id).catch(() => null)
      if (!cancelled && files?.answerSheet) {
        objectUrl = URL.createObjectURL(files.answerSheet)
      }

      if (!cancelled) {
        setQuestions(result?.questions ?? [])
        setAnswer(result?.answer ?? null)
        setAnswerSheetUrl(objectUrl)
        setAnswerSheetMimeType(files?.answerSheet?.type ?? null)
        setInitialSelectedQuestion(savedSelectedQuestion)
        setLoaded(true)
      }
    }

    void load()

    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [id, router])

  return (
    <DashboardLayout title="Exams">
      {!loaded ? (
        <div className="flex h-full w-full items-center justify-center p-10">
          <p className="text-sm text-[#858585]">Loading result...</p>
        </div>
      ) : (
        <div className="h-full w-full">
          <ResultsScreen
            questions={questions}
            answer={answer}
            answerSheetUrl={answerSheetUrl ?? undefined}
            answerSheetMimeType={answerSheetMimeType ?? undefined}
            examId={id}
            initialSelectedQuestion={initialSelectedQuestion}
          />
        </div>
      )}
    </DashboardLayout>
  )
}
