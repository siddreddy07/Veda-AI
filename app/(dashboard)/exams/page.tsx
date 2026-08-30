"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { UploadSection } from "@/components/upload-section"
import { Processing } from "@/components/processing"
import {
  saveExamFiles,
  saveExamResult,
  examExpiresAt,
  type ExamRecord,
} from "@/lib/client-storage"

type Screen = "upload" | "processing"

type ProcessResult = {
  success: boolean
  questions: unknown[]
  answer: unknown
}

export default function ExamsPage() {
  const router = useRouter()
  const [screen, setScreen] = useState<Screen>("upload")
  const [questionPaper, setQuestionPaper] = useState<File | null>(null)
  const [answerSheet, setAnswerSheet] = useState<File | null>(null)
  const [examId, setExamId] = useState<string | null>(null)

  const handleStartMapping = useCallback(() => {
    if (!questionPaper || !answerSheet) return

    // Generate one exam ID and persist both files in IndexedDB for this exam.
    const id = crypto.randomUUID()
    setExamId(id)
    void saveExamFiles(id, { questionPaper, answerSheet })
    setScreen("processing")
  }, [questionPaper, answerSheet])

  const handleProcessingComplete = useCallback(
    async (result: unknown) => {
      const data = result as ProcessResult
      if (!examId) return

      const record: ExamRecord = {
        id: examId,
        createdAt: new Date().toISOString(),
        expiresAt: examExpiresAt(),
        questionPaper: {
          name: questionPaper?.name ?? "",
          type: questionPaper?.type ?? "",
        },
        answerSheet: {
          name: answerSheet?.name ?? "",
          type: answerSheet?.type ?? "",
        },
        result: data,
      }

      try {
        saveExamResult(examId, record)
      } catch (error) {
        console.error("Failed to save exam result:", error)
      } finally {
        router.push(`/exams/result/${examId}`)
      }
    },
    [examId, questionPaper, answerSheet, router],
  )

  return (
    <DashboardLayout title="Exams">
      {screen === "upload" && (
        <UploadSection
          questionPaper={questionPaper}
          answerSheet={answerSheet}
          onQuestionPaperChange={setQuestionPaper}
          onAnswerSheetChange={setAnswerSheet}
          onStartMapping={handleStartMapping}
        />
      )}
      {screen === "processing" && (
        <Processing
          questionPaper={questionPaper}
          answerSheet={answerSheet}
          onComplete={handleProcessingComplete}
        />
      )}
    </DashboardLayout>
  )
}
