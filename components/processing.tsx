"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { SparklesIcon } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface ProcessingProps {
  questionPaper: File | null
  answerSheet: File | null
  onComplete?: (result: unknown) => void
}

export function Processing({
  questionPaper,
  answerSheet,
  onComplete,
}: ProcessingProps) {
  const router = useRouter()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 1, 85))
    }, 300)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    let cancelled = false

    const process = async () => {
      try {
        const formData = new FormData()
        if (questionPaper) formData.append("questionPaper", questionPaper)
        if (answerSheet) formData.append("answerSheet", answerSheet)

        const response = await axios.post("/api/process", formData)
        if (!cancelled && response.data?.success === true) {
          setProgress(100)
          onComplete?.(response.data)
        }
      } catch (error) {
        if (!cancelled) {
          const message = axios.isAxiosError(error)
            ? (error.response?.data?.message as string | undefined) ??
              error.message
            : "Something went wrong"
          toast.error("Processing failed", {
            description: message,
          })
          router.push("/")
        }
      }
    }

    const timer = setTimeout(() => {
      void process()
    }, 0)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [questionPaper, answerSheet, onComplete, router])

  return (
    <div className="ml-2 mt-0 mb-2 mr-0 flex h-full min-h-0 flex-1 flex-col items-center justify-center rounded-md bg-white px-5 py-10 sm:px-10">
      <div className="flex w-full max-w-md flex-col items-center gap-6 sm:gap-8">
        <div className="relative">
          <div className="absolute inset-0 animate-pulse rounded-full bg-accent-brand/10 blur-2xl" />
          <div className="relative flex size-16 items-center justify-center rounded-3xl bg-accent-soft shadow-[0_4px_24px_rgba(255,90,50,0.15)] sm:size-20">
            <SparklesIcon className="size-8 text-accent-brand animate-pulse sm:size-10" />
          </div>
        </div>

        <div className="space-y-1.5 text-center sm:space-y-2">
          <h2 className="text-xl font-semibold text-foreground sm:text-2xl md:text-3xl">
            Extracting...
          </h2>
          <p className="mx-auto max-w-sm text-sm text-muted-foreground md:text-base">
            Our AI is analyzing your documents and extracting questions, answers, and metadata. This may take a moment.
          </p>
        </div>

        <div className="w-full space-y-2">
          <Progress value={progress}>
            <span className="sr-only">{Math.round(progress)}% complete</span>
          </Progress>
          <p className="text-center text-xs text-muted-foreground">
            {progress < 30 && "Reading documents..."}
            {progress >= 30 && progress < 60 && "Extracting content..."}
            {progress >= 60 && progress < 85 && "Processing answers..."}
            {progress >= 85 && "Almost done..."}
            {progress >= 100 && "Done! Redirecting..."}
          </p>
        </div>
      </div>
    </div>
  )
}
