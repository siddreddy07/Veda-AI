"use client"

import * as React from "react"
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"
import { ChevronDown, ChevronUp } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import type { Question } from "@/lib/ai/schemas/question-schema"
import type { GradingItem } from "@/lib/ai/schemas/grading-schema"

interface QuestionsPanelProps {
  questions: Question[]
  grading: GradingItem[]
  selectedQuestion?: string | null
  onSelectQuestion?: (questionNumber: string) => void
}

export function QuestionsPanel({
  questions,
  grading,
  selectedQuestion,
  onSelectQuestion,
}: QuestionsPanelProps) {
  const allIds = React.useMemo(() => questions.map((q) => q.questionNo), [questions])
  const [openItems, setOpenItems] = React.useState<string[]>(
    selectedQuestion ? [selectedQuestion] : [],
  )
  const [isExpandingAll, setIsExpandingAll] = React.useState(false)
  const allExpanded = openItems.length === allIds.length

  // Keep the selected question open (e.g. when restored from storage or the
  // panel remounts after switching tabs).
  const prevSelected = React.useRef(selectedQuestion)
  React.useEffect(() => {
    if (selectedQuestion && selectedQuestion !== prevSelected.current) {
      setOpenItems((prev) =>
        prev.includes(selectedQuestion) ? prev : [selectedQuestion],
      )
    }
    prevSelected.current = selectedQuestion
  }, [selectedQuestion])

  const toggleExpandAll = () => {
    setIsExpandingAll(true)
    setOpenItems(allExpanded ? [] : allIds)
  }

  const handleValueChange = (value: string[]) => {
    if (isExpandingAll) {
      setIsExpandingAll(false)
      setOpenItems(value)
      return
    }

    // A single click opens only the clicked item and closes the others.
    const clicked = value.filter((id) => !openItems.includes(id))
    setOpenItems(clicked.length === 1 ? clicked : value)
  }

  const gradingByQuestion = React.useMemo(
    () => new Map(grading.map((g) => [g.questionNumber, g])),
    [grading],
  )

  return (
    <div className="flex flex-col w-full h-full font-bricolage">
      <div className="shrink-0 bg-transparent w-full flex flex-wrap items-center justify-between gap-2 px-4 py-3 sm:px-6 sm:py-4">
        <h2 className="text-[14px] font-bold text-[#303030] sm:text-[16px]">
          Extracted Questions (from question paper)
        </h2>
        <button
          type="button"
          onClick={toggleExpandAll}
          className="shrink-0 whitespace-nowrap rounded-full border border-[#E5E5E5] shadow-md cursor-pointer bg-white px-3 py-1 text-[12px] font-medium text-[#303030] transition-colors hover:bg-[#F6F6F6] sm:px-4 sm:py-1.5 sm:text-[14px]"
        >
          {allExpanded ? "Collapse All" : "Expand All"}
        </button>
      </div>

      <ScrollArea className="h-full bg-transparent min-h-0 flex-1">
        <div className="p-4">
          {questions.length === 0 ? (
            <p className="text-center text-sm text-[#858585] py-8">
              No questions were extracted.
            </p>
          ) : (
            <AccordionPrimitive.Root
              multiple
              value={openItems}
              onValueChange={(value) => handleValueChange(value as string[])}
              className="space-y-4"
            >
              {questions.map((q) => {
                const isOpen = openItems.includes(q.questionNo)
                const grade = gradingByQuestion.get(q.questionNo)
                const score = grade?.score ?? 0
                const percentage =
                  q.maxMarks > 0 ? (score / q.maxMarks) * 100 : 0
                const scoreColor =
                  percentage >= 70
                    ? "bg-[#EAF7EE] text-[#278247]"
                    : percentage >= 40
                      ? "bg-[#FFF3E0] text-[#B65C00]"
                      : "bg-[#FDECEC] text-[#C23B3B]"

                return (
                  <AccordionPrimitive.Item
                    key={q.questionNo}
                    value={q.questionNo}
                    className={cn(
                      "rounded-2xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-colors",
                      isOpen
                        ? "border-2 border-[#FF8D36]"
                        : "border-2 border-transparent"
                    )}
                  >
                    <AccordionPrimitive.Header className="flex">
                      <AccordionPrimitive.Trigger
                        onClick={() => onSelectQuestion?.(q.questionNo)}
                        className="group flex cursor-pointer w-full items-center gap-2.5 rounded-2xl px-3 py-2.5 text-left outline-none sm:gap-3 sm:px-4 sm:py-3"
                      >
                        <span
                          className={cn(
                            "flex h-7 min-w-7 shrink-0 items-center justify-center rounded-full px-1.5 text-[12px] font-extrabold leading-none text-white shadow-md sm:h-8 sm:min-w-8 sm:px-2 sm:text-[14px]",
                            isOpen ? "bg-[#FF5623]" : "bg-[#303030]"
                          )}
                        >
                          {q.questionNo}
                        </span>

                        <span className="min-w-0 flex-1 text-[13px] font-normal leading-[140%] tracking-[-0.04em] text-[#303030] sm:text-[16px]">
                          {q.content}
                        </span>

                        <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[12px] font-bold sm:px-2.5 sm:text-[14px]", scoreColor)}>
                          {score} / {q.maxMarks}
                        </span>

                        <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-[#F6F6F6] text-[#303030] sm:size-7 sm:rounded-lg">
                          {isOpen ? (
                            <ChevronUp className="size-3.5 sm:size-4" />
                          ) : (
                            <ChevronDown className="size-3.5 sm:size-4" />
                          )}
                        </span>
                      </AccordionPrimitive.Trigger>
                    </AccordionPrimitive.Header>

                    <AccordionPrimitive.Panel className="px-3 pb-4 sm:px-4">
                      <div className="mt-2 flex w-full flex-col items-start gap-2.5 rounded-2xl bg-[#F6F6F6] px-5 py-4">
                        <h3 className="text-[16px] font-bold leading-[140%] tracking-[-0.04em] text-[#303030]">
                          AI Feedback
                        </h3>
                        <p className="w-full text-[14px] font-normal leading-[140%] tracking-[-0.04em] text-[#303030]">
                          {grade?.feedback ?? "No feedback available for this question."}
                        </p>
                      </div>
                    </AccordionPrimitive.Panel>
                  </AccordionPrimitive.Item>
                )
              })}
            </AccordionPrimitive.Root>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
