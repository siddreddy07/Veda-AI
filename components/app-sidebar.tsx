"use client"

import {
  SparklesIcon,
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

function GridIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  )
}

function ClassroomIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        fill="currentColor"
        d="M18.0053 0C19.1069 0 20 0.867353 20 1.93727V12.0627C20 12.8063 19.5687 13.452 18.9357 13.7767C18.7114 13.0842 18.552 12.599 18.4574 12.321C18.403 12.1608 18.3777 12.011 18.2979 11.8819C18.2236 11.7617 18.1006 11.6182 17.9791 11.4747L17.9521 11.4428C17.5516 10.968 17.0414 10.3553 16.609 9.82839C16.1946 9.32331 15.8524 8.89639 15.7181 8.78227C15.3989 8.51105 14.9468 8.21401 14.2686 8.21401H9.66755C9.62487 8.2067 9.53035 8.1911 9.41489 8.14943C8.91888 7.97045 7.88479 7.51948 7.36702 7.30995C6.21465 6.13586 5.35029 5.25332 4.77394 4.66235C4.72638 4.61361 4.61117 4.49397 4.42827 4.30347C4.20391 4.06978 3.83109 4.04594 3.57713 4.24907C3.32508 4.45067 3.28322 4.81013 3.48253 5.06133C5.29064 7.33994 6.21755 8.50276 6.2633 8.5498C6.37468 8.66433 6.70673 8.87699 7.11436 9.1439C7.53415 9.41875 8.03354 9.75 8.41755 10.0092C8.77511 10.2505 8.97606 10.3192 9.01596 10.655C9.10394 11.3955 9.21032 12.5105 9.33511 14H1.99468C0.893058 14 0 13.1326 0 12.0627V1.93727C0 0.867353 0.893058 0 1.99468 0H18.0053ZM15.7979 11.7915C15.9066 11.7819 16.0276 11.915 16.0771 11.9594C16.2486 12.1131 16.3003 12.1721 16.4096 12.2694C16.5691 12.4114 16.7331 12.5764 16.7553 12.6051C16.9727 12.99 17.2919 13.7639 17.4073 14L15.4654 14C15.5489 13.0617 15.6021 12.459 15.625 12.1919C15.6516 11.8819 15.6891 11.8011 15.7979 11.7915ZM12.4734 3.06088C11.1955 3.06088 10.1596 4.06699 10.1596 5.30811C10.1596 6.54922 11.1955 7.55534 12.4734 7.55534C13.7513 7.55534 14.7872 6.54922 14.7872 5.30811C14.7872 4.06699 13.7513 3.06088 12.4734 3.06088Z"
      />
    </svg>
  )
}

function LibraryIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M17.6751 13.2417C17.1449 14.4954 16.3157 15.6002 15.2599 16.4594C14.2042 17.3187 12.954 17.9062 11.6187 18.1707C10.2835 18.4351 8.90374 18.3685 7.60017 17.9765C6.29661 17.5845 5.10891 16.8792 4.1409 15.9222C3.1729 14.9652 2.45406 13.7856 2.04725 12.4866C1.64043 11.1876 1.55802 9.80874 1.80722 8.47053C2.05641 7.13232 2.62963 5.87553 3.47676 4.81003C4.32388 3.74453 5.41912 2.90277 6.66672 2.35834"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.3333 9.99999C18.3333 8.90564 18.1178 7.82201 17.699 6.81096C17.2802 5.79991 16.6664 4.88125 15.8926 4.10743C15.1187 3.33361 14.2001 2.71978 13.189 2.30099C12.178 1.8822 11.0943 1.66666 10 1.66666V9.99999H18.3333Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function AssignmentClipboardIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path d="M7.5 14.1667H12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M7.5 10.8333H12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M7.5 7.5H8.33333" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M4.16663 5C4.16663 3.61929 5.28591 2.5 6.66663 2.5H10.9763C11.4183 2.5 11.8422 2.67559 12.1548 2.98816L15.3451 6.17851C15.6577 6.49107 15.8333 6.915 15.8333 7.35702V15C15.8333 16.3807 14.714 17.5 13.3333 17.5H6.66663C5.28591 17.5 4.16663 16.3807 4.16663 15V5Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M10.8334 2.5V4.16667C10.8334 6.00762 12.3258 7.5 14.1667 7.5H15.8334"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  )
}

function ClipboardIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="8" y="2" width="8" height="4" rx="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M9 12h6" />
      <path d="M9 16h4" />
    </svg>
  )
}

const navItems = [
  { title: "Home", icon: GridIcon, href: "/" },
  { title: "My Classroom", icon: ClassroomIcon, href: "" },
  { title: "Assignments", icon: AssignmentClipboardIcon, href: "" },
  { title: "Exams", icon: ClipboardIcon, href: "/exams" },
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
          <SidebarSeparator className="!mx-0 !my-1 group-data-[collapsible=icon]:hidden" />

          {/* School card – expanded */}
          <div
            className="flex items-center gap-3 bg-surface-muted p-3 group-data-[collapsible=icon]:hidden"
            style={{ borderRadius: "16px" }}
          >
            <img
              src="/School.png"
              alt="Delhi Public School"
              className="size-12 shrink-0 rounded-full object-cover"
            />
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-sm font-medium text-foreground">
                Delhi Public School
              </span>
              <span className="text-xs text-[rgba(94,94,94,0.8)]">Bokaro Steel City</span>
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
