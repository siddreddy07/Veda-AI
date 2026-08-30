"use client"

import type { ReactNode } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { ContentArea } from "@/components/content-area"

interface DashboardLayoutProps {
  children: ReactNode
  title?: string
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "304px",
          "--sidebar-width-icon": "64px",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <ContentArea title={title}>
        {children}
      </ContentArea>
    </SidebarProvider>
  )
}
