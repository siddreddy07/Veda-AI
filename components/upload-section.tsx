"use client"

import { useCallback, useSyncExternalStore } from "react"
import { ArrowRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FileUpload } from "@/components/file-upload"
import Image from "next/image"

interface UploadSectionProps {
  questionPaper: File | null
  answerSheet: File | null
  onQuestionPaperChange: (file: File | null) => void
  onAnswerSheetChange: (file: File | null) => void
  onStartMapping?: () => void
}

export function UploadSection({
  questionPaper,
  answerSheet,
  onQuestionPaperChange,
  onAnswerSheetChange,
  onStartMapping,
}: UploadSectionProps) {
  // Never notifies; used only to distinguish client hydration from server
  // render so the `disabled` attribute doesn't cause a hydration mismatch.
  const subscribe = useCallback(() => () => {}, [])
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,  // client snapshot
    () => false, // server snapshot
  )

  const bothUploaded = questionPaper !== null && answerSheet !== null

  // Keep the enabled/disabled state client-only: `File` state can't be
  // serialized to the server, so the server would always render disabled while
  // the restored client state (e.g. after a refresh) may differ, causing a
  // hydration mismatch on the `disabled` attribute.
  const startEnabled = mounted && bothUploaded

  return (
    <div className="flex flex-1 flex-col items-center justify-start overflow-y-auto bg-transparent px-4 py-6 md:px-8">
      <div className="flex w-full max-w-[600px] flex-col items-center gap-4">
        {/* Heading */}
        <div className="space-y-1.5 text-center">
          <h1
            className="text-[24px] font-bold leading-tight tracking-tight md:text-[32px]"
            style={{ fontFamily: "var(--font-bricolage)" }}
          >
            <span style={{ color: "#2B2B2B" }}>Upload </span>
            <span
              style={{
                color: "#FF5623",
                backgroundColor: "#FFF0E9",
                borderRadius: "8px",
                padding: "2px 8px",
              }}
            >
              Question Paper &amp; Answer Sheets
            </span>
          </h1>
          <p className="text-[14px] md:text-[16px]" style={{ color: "#303030" }}>
            Upload both files to get started
          </p>
        </div>

        {/* Illustration */}
        <div className="flex justify-center">
          <Image
            src="/teacher.png"
            alt="Teacher illustration"
            width={120}
            height={144}
            priority
          />
        </div>

        {/* Upload area - stacked */}
        <div
          className="flex w-full flex-col gap-3 p-3 md:flex-row md:gap-4 md:p-4"
          style={{
            background: "rgba(255, 255, 255, 0.5)",
            borderRadius: "24px",
          }}
        >
          <div className="w-full min-w-0 md:flex-1">
            <FileUpload
              label={<><span>Upload </span><span style={{ color: "#FF5623" }}>Question Paper</span></>}
              file={questionPaper}
              onChange={onQuestionPaperChange}
            />
          </div>
          <div className="w-full min-w-0 md:flex-1">
            <FileUpload
              label={<><span>Upload </span><span style={{ color: "#FF5623" }}>Answer Sheet</span></>}
              file={answerSheet}
              onChange={onAnswerSheetChange}
            />
          </div>
        </div>

        {/* Start Mapping */}
        <div className="flex flex-col items-center gap-2">
          <Button
            disabled={startEnabled ? undefined : true}
            onClick={onStartMapping}
            suppressHydrationWarning
            className="h-10 gap-2 rounded-full cursor-pointer bg-[#303030] px-6 text-sm font-medium text-white hover:bg-[#303030]/90 disabled:cursor-not-allowed disabled:bg-[#CECECE] disabled:text-white"
          >
            Start Mapping
            <ArrowRightIcon className="size-4" />
          </Button>
          <p className="text-center text-xs md:text-sm" style={{ color: "#858585" }}>
            Once both files are uploaded, you&apos;ll be able to map answers
            with questions
          </p>
        </div>
      </div>
    </div>
  )
}
