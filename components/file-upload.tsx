"use client"

import { useCallback, useRef, useState } from "react"
import { UploadIcon } from "lucide-react"
import { UploadedFile } from "@/components/uploaded-file"

const MAX_FILE_SIZE = 10 * 1024 * 1024

interface FileUploadProps {
  label: React.ReactNode
  file: File | null
  onChange: (file: File | null) => void
}

export function FileUpload({ label, file, onChange }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [inputKey, setInputKey] = useState(0)

  const validateAndSet = useCallback(
    (selected: File) => {
      if (selected.size > MAX_FILE_SIZE) {
        alert("File exceeds 10MB limit.")
        return
      }
      onChange(selected)
    },
    [onChange]
  )

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files?.[0]
      if (selected) validateAndSet(selected)
    },
    [validateAndSet]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const dropped = e.dataTransfer.files?.[0]
      if (dropped) validateAndSet(dropped)
    },
    [validateAndSet]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  const handleClick = useCallback(() => {
    if (file) {
      setInputKey((k) => k + 1)
    }
    inputRef.current?.click()
  }, [file])

  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onChange(null)
      setInputKey((k) => k + 1)
    },
    [onChange]
  )

  const handleReplace = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    inputRef.current?.click()
  }, [])

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={handleClick}
      className="flex h-[120px] w-full cursor-pointer flex-col items-center justify-center rounded-[20px] border-[1.5px] border-dashed border-[#CECECE] bg-white transition-colors hover:border-[#FF5623]/40 hover:bg-[#FFF0E9]/30 sm:h-[150px] md:h-[181px]"
    >
      {file ? (
        <div className="flex w-full justify-center px-3">
          <UploadedFile
            file={file}
            onRemove={handleRemove}
            onReplace={handleReplace}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-1.5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-[#F3F3F3] sm:size-11">
            <UploadIcon className="size-5 sm:size-7" style={{ color: "#303030" }} />
          </div>
          <p
            className="text-[15px] font-semibold sm:text-[18px]"
            style={{
              fontFamily: "var(--font-bricolage)",
              color: "#303030",
            }}
          >
            {label}
          </p>
          <p
            className="text-xs font-normal sm:text-sm"
            style={{ color: "rgba(94,94,94,0.55)" }}
          >
            Max 10MB
          </p>
        </div>
      )}

      <input
        key={inputKey}
        ref={inputRef}
        type="file"
        accept=".pdf,.png,.jpg,.jpeg"
        hidden
        onChange={handleFileChange}
      />
    </div>
  )
}
