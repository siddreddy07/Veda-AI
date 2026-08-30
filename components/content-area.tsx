"use client"

import type { ReactNode } from "react"
import { SidebarInset } from "@/components/ui/sidebar"
import { Header } from "@/components/header"

interface ContentAreaProps {
  children: ReactNode
  title?: string
}

export function ContentArea({ children, title }: ContentAreaProps) {
  return (
    <SidebarInset>
      <Header title={title} />
      <div className="flex flex-1 flex-col min-h-0 mt-2 mb-2 mr-2">
        {children}
      </div>
    </SidebarInset>
  )
}
