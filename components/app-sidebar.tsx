"use client"

import {
  HomeIcon,
  BookOpenIcon,
  ClipboardListIcon,
  FileTextIcon,
  LibraryIcon,
  SettingsIcon,
  SparklesIcon,
  GraduationCapIcon,
  ChevronsRightIcon,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { useIsMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"
import { TooltipProvider } from "@/components/ui/tooltip"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
  { title: "Home", icon: HomeIcon, href: "/" },
  { title: "My Classroom", icon: BookOpenIcon, href: "" },
  { title: "Assignments", icon: ClipboardListIcon, href: "" },
  { title: "Exams", icon: FileTextIcon, href: "/exams" },
  { title: "My Library", icon: LibraryIcon, href: "" },
]

function VedaLogo({ className }: { className?: string }) {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="40" height="40" rx="10" fill="#303030" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M22.7271 28.3583C22.7271 28.3583 23.4546 30.3003 24.1213 30.4218H15.697C13.9999 30.4218 12.4851 29.4508 11.9998 27.6299L7.09084 13.0636C7.09084 13.0636 6.66679 11.3035 6.0001 11.0001H14.6063C16.3034 11.0609 17.4549 11.6677 18.1216 13.9135L22.7271 28.3583Z"
        fill="white"
      />
      <path
        opacity="0.2"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M22.7271 28.3583C22.7271 28.3583 23.4546 30.3003 24.1213 30.4218H15.697C13.9999 30.4218 12.4851 29.4508 11.9998 27.6299L7.09084 13.0636C7.09084 13.0636 6.66679 11.3035 6.0001 11.0001H14.6063C16.3034 11.0609 17.4549 11.6677 18.1216 13.9135L22.7271 28.3583Z"
        fill="url(#veda-gradient)"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.3334 28.3585C17.3334 28.3585 16.6059 30.3005 15.9392 30.4221H24.3635C26.0606 30.4221 27.5754 29.4511 28.0607 27.6302L32.9093 13.0643C32.9093 13.0643 33.3334 11.3042 34.0001 11.0008H25.4542C23.7571 11.0008 22.6664 11.6076 21.9997 13.8535L17.3334 28.3585Z"
        fill="white"
      />
      <defs>
        <linearGradient
          id="veda-gradient"
          x1="15.0607"
          y1="9.34906"
          x2="15.0607"
          y2="32.1338"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0" />
          <stop offset="0.33" stopColor="white" stopOpacity="0" />
          <stop offset="0.76" stopColor="#0E1513" />
          <stop offset="1" stopColor="#0E1513" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function AppSidebar() {
  const { toggleSidebar } = useSidebar()
  const isMobile = useIsMobile()
  const pathname = usePathname()

  return (
    <TooltipProvider>
      <Sidebar
        side={isMobile ? "right" : "left"}
        variant="floating"
        collapsible="icon"
        style={
          {
            "--sidebar-width": "304px",
            "--sidebar-width-icon": "64px",
          } as React.CSSProperties
        }
      >
        {/* ── HEADER ── */}
        <SidebarHeader className="!p-6 !pb-4 group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:!pb-1.5 group-data-[collapsible=icon]:!pt-1">
          {/* Expanded: logo + trigger row */}
          <div className="flex items-center justify-between group-data-[collapsible=icon]:hidden">
            <div className="flex items-center gap-2.5">
              <VedaLogo className="size-10 shrink-0" />
              <span
                className="text-[28px] font-bold leading-[20px] tracking-[-0.06em] text-[#303030]"
                style={{ fontFamily: "var(--font-bricolage)" }}
              >
                VedaAI
              </span>
            </div>
            <SidebarTrigger className="!size-8 !text-muted-foreground hover:!bg-surface-muted hover:!text-foreground hidden md:flex" />
          </div>

          {/* Collapsed: logo centered */}
          <div className="hidden justify-center group-data-[collapsible=icon]:flex">
            <VedaLogo className="size-8 shrink-0" />
          </div>

          {/* AI Toolkit button */}
          <div className="mt-4 w-full group-data-[collapsible=icon]:mt-2 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
            <Button
              className="w-full justify-center !h-[42px] rounded-full !bg-[#272727] !px-[43px] !py-2 text-sm font-medium text-white hover:!bg-[#1a1a1a] group-data-[collapsible=icon]:!h-9 group-data-[collapsible=icon]:!w-9 group-data-[collapsible=icon]:!rounded-full group-data-[collapsible=icon]:!px-0 border-2 border-[#FF5623]"
              style={{
                boxShadow:
                  "0px 16px 48px rgba(255, 255, 255, 0.12), 0px 32px 48px rgba(255, 255, 255, 0.2), inset 0px -1px 3.5px rgba(177, 177, 177, 0.6), inset 0px 0px 34.5px rgba(255, 255, 255, 0.25)",
                letterSpacing: "-0.04em",
              }}
            >
              <SparklesIcon className="size-[18px] text-white group-data-[collapsible=icon]:!size-4" strokeWidth={1.5} />
              <span className="group-data-[collapsible=icon]:hidden">AI Teacher’s Toolkit</span>
            </Button>
          </div>
        </SidebarHeader>

        {/* ── CONTENT ── */}
        <SidebarContent className="!px-3 !pt-2 group-data-[collapsible=icon]:!px-0 group-data-[collapsible=icon]:!pt-1">
          <SidebarGroup className="!p-0">
            <SidebarGroupContent>
              <SidebarMenu className="!gap-1 group-data-[collapsible=icon]:!gap-1 group-data-[collapsible=icon]:items-center">
                {navItems.map((item) => {
                  const isActive = item.href ? pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href)) : false
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        isActive={isActive}
                        tooltip={item.title}
                        render={item.href ? <Link href={item.href} /> : undefined}
                        className={
                          "!h-10 !rounded-lg !px-3.5 !text-sm !font-normal data-active:!bg-[#F0F0F0] data-active:!text-[#303030] data-active:!font-medium hover:bg-surface-muted text-[rgba(94,94,94,0.8)] " +
                          "[&_svg]:!size-5 " +
                          "group-data-[collapsible=icon]:!h-9 group-data-[collapsible=icon]:!w-9 group-data-[collapsible=icon]:!rounded-lg group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:!gap-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:items-center"
                        }
                      >
                        <item.icon className="!size-5 shrink-0 group-data-[collapsible=icon]:!size-[18px]" />
                        <span className="group-data-[collapsible=icon]:hidden">
                          {item.title}
                        </span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* ── FOOTER ── */}
        <SidebarFooter className="!p-6 !pt-3 !gap-3 group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:!gap-1.5 group-data-[collapsible=icon]:!pb-1">
          {/* Settings */}
          <SidebarMenu className="!gap-1 group-data-[collapsible=icon]:items-center">
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Settings"
                className={
                  "!h-10 !rounded-lg !px-3.5 !text-sm !font-normal hover:bg-surface-muted text-[rgba(94,94,94,0.8)] " +
                  "[&_svg]:!size-5 " +
                  "group-data-[collapsible=icon]:!h-9 group-data-[collapsible=icon]:!w-9 group-data-[collapsible=icon]:!rounded-lg group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:!gap-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:items-center"
                }
              >
                <SettingsIcon className="!size-5 shrink-0 group-data-[collapsible=icon]:!size-[18px]" />
                <span className="group-data-[collapsible=icon]:hidden">
                  Settings
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          <SidebarSeparator className="!mx-0 !my-1 group-data-[collapsible=icon]:hidden" />

          {/* School card – expanded */}
          <div
            className="flex items-center gap-3 bg-surface-muted p-3 group-data-[collapsible=icon]:hidden"
            style={{ borderRadius: "16px" }}
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#F0F0F0]">
              <GraduationCapIcon className="size-5 text-[rgba(94,94,94,0.8)]" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-sm font-medium text-foreground">
                Springfield Academy
              </span>
              <span className="text-xs text-[rgba(94,94,94,0.8)]">School</span>
            </div>
          </div>

          {/* School image – collapsed */}
          <div className="hidden justify-center group-data-[collapsible=icon]:flex">
            <div className="flex size-9 items-center justify-center rounded-full bg-[#F0F0F0]">
              <GraduationCapIcon className="size-[18px] text-[rgba(94,94,94,0.8)]" />
            </div>
          </div>

          {/* Expand button – collapsed only */}
          <div className="hidden justify-center pt-1 group-data-[collapsible=icon]:flex">
            <button
              onClick={toggleSidebar}
              className="flex size-8 items-center justify-center rounded-lg text-[rgba(94,94,94,0.8)] transition-colors hover:bg-surface-muted hover:text-foreground"
            >
              <ChevronsRightIcon className="size-4" />
            </button>
          </div>
        </SidebarFooter>
      </Sidebar>
    </TooltipProvider>
  )
}
