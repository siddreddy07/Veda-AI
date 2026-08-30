"use client"

import { useState, useCallback } from "react"
import dynamic from "next/dynamic"
import { QuestionsPanel } from "@/components/results/questions-panel"
import { saveSelectedQuestion } from "@/lib/client-storage"
import type { Question } from "@/lib/ai/schemas/question-schema"
import type { AnswerData } from "@/lib/types"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const PdfViewer = dynamic(
  () => import("@/components/results/pdf-viewer").then((m) => m.PdfViewer),
  { ssr: false }
)

interface ResultsScreenProps {
  questions: Question[]
  answer: AnswerData | null
  answerSheetUrl?: string
  answerSheetMimeType?: string
  examId?: string
  initialSelectedQuestion?: string | null
}

export function ResultsScreen({
  questions,
  answer,
  answerSheetUrl,
  answerSheetMimeType,
  examId,
  initialSelectedQuestion,
}: ResultsScreenProps) {
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(
    initialSelectedQuestion ?? null,
  )

  const handleSelectQuestion = useCallback(
    (questionNo: string) => {
      setSelectedQuestion(questionNo)
      if (examId) saveSelectedQuestion(examId, questionNo)
    },
    [examId],
  )

  return (
    <>
      {/* Mobile & Tablet: Tabs */}
      <Tabs
        defaultValue="questions"
        className="w-full h-full flex flex-col gap-3 px-3 sm:px-4 lg:hidden"
      >
        <TabsList className="w-full shrink-0 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] p-1 !h-auto">
          <TabsTrigger value="questions" className="h-9 flex-1 rounded-full px-4 font-bricolage text-[14px] font-medium tracking-[-0.04em] text-[#303030] data-active:!bg-[#303030] data-active:!text-white data-active:!shadow-[0px_4px_4px_rgba(0,0,0,0.25),0px_32px_48px_rgba(0,0,0,0.2)]">
            Questions
          </TabsTrigger>
          <TabsTrigger value="answersheet" className="h-9 flex-1 rounded-full px-4 font-bricolage text-[14px] font-medium tracking-[-0.04em] text-[#303030] data-active:!bg-[#303030] data-active:!text-white data-active:!shadow-[0px_4px_4px_rgba(0,0,0,0.25),0px_32px_48px_rgba(0,0,0,0.2)]">
            Answer Sheet
          </TabsTrigger>
        </TabsList>
        <TabsContent value="questions" className="min-h-0 flex-1">
          <div className="h-full rounded-lg overflow-hidden bg-transparent shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
            <QuestionsPanel
              questions={questions}
              grading={answer?.grading ?? []}
              selectedQuestion={selectedQuestion}
              onSelectQuestion={handleSelectQuestion}
            />
          </div>
        </TabsContent>
        <TabsContent value="answersheet" className="min-h-0 flex-1">
          <div className="h-full rounded-lg overflow-hidden bg-transparent shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
            <PdfViewer
              answer={answer}
              selectedQuestion={selectedQuestion}
              answerSheetUrl={answerSheetUrl}
              answerSheetMimeType={answerSheetMimeType}
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Desktop: Resizable panels */}
      <div className="hidden h-full w-full lg:block">
        <ResizablePanelGroup
          orientation="horizontal"
          className="h-full w-full !overflow-visible"
        >
          <ResizablePanel defaultSize={50} minSize={30} className="h-full">
            <div className="h-full mr-2 rounded-lg overflow-hidden bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
              <QuestionsPanel
                questions={questions}
                grading={answer?.grading ?? []}
                selectedQuestion={selectedQuestion}
                onSelectQuestion={handleSelectQuestion}
              />
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={50} minSize={30} className="h-full">
            <div className="h-full ml-2 rounded-lg overflow-hidden bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
            <PdfViewer
              answer={answer}
              selectedQuestion={selectedQuestion}
              answerSheetUrl={answerSheetUrl}
              answerSheetMimeType={answerSheetMimeType}
            />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </>
  )
}
