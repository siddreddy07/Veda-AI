"use client"

import {
  ArrowLeftIcon,
  HelpCircleIcon,
  BellIcon,
  ChevronDownIcon,
  FileTextIcon,
  Menu,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { useSidebar } from "@/components/ui/sidebar"
import { useRouter } from "next/navigation"

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg
      width="21"
      height="20"
      viewBox="0 0 21 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.54441 8.66039C6.78395 7.91387 8.54132 6.15651 9.28783 3.91697L10.0344 1.67725L10.625 0L11.2203 1.67725L11.9668 3.91697C12.7133 6.15651 14.4707 7.91387 16.7102 8.66039L18.95 9.40696L20.625 10L18.95 10.5928L16.7102 11.3394C14.4707 12.0859 12.7133 13.8433 11.9668 16.0828L11.2203 18.3225L10.625 20L10.0344 18.3225L9.28783 16.0828C8.54132 13.8433 6.78395 12.0859 4.54441 11.3394L2.30469 10.5928L0 10L2.30469 9.40696L4.54441 8.66039Z"
        fill="#2B2B2B"
      />
    </svg>
  )
}

export function Header({ title }: { title?: string }) {
  const { toggleSidebar } = useSidebar()
  const router = useRouter()

  return (
    <>
      {/* ── Mobile Header ── */}
      <header
        className="m-2 flex h-14 shrink-0 items-center gap-2 rounded-[16px] px-2 py-2 md:hidden"
        style={{
          background: "rgba(255, 255, 255, 0.75)",
        }}
      >
        <Button
          variant="ghost"
          size="icon"
          className="size-10 shrink-0 rounded-full bg-white hover:bg-white/80"
          onClick={() => router.back()}
        >
          <ArrowLeftIcon className="size-6" style={{ color: "#303030" }} />
        </Button>

        <span
          className="text-[22px] font-bold leading-none tracking-[-0.06em] text-[#303030]"
          style={{ fontFamily: "var(--font-bricolage)" }}
        >
          VedaAI
        </span>

        <div className="flex flex-1" />

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="relative size-9 rounded-full bg-[#F6F6F6] hover:bg-[#EFEFEF]"
          >
            <BellIcon className="size-5" style={{ color: "#303030" }} />
            <span
              className="absolute top-1.5 right-1.5 size-2 rounded-full"
              style={{ background: "#FF5623" }}
            />
          </Button>

          <Avatar className="size-8 shrink-0">
            <AvatarImage src="/dp.jpg" alt="Madhur Rastogi" />
          </Avatar>

          <Button
            variant="ghost"
            size="icon"
            className="size-10 shrink-0 rounded-full bg-white hover:bg-white/80"
            onClick={toggleSidebar}
          >
            <Menu className="size-6" style={{ color: "#303030" }} />
          </Button>
        </div>
      </header>

      {/* ── Desktop Header ── */}
      <header
        className="hidden md:flex h-14 shrink-0 items-center gap-[10px] px-6 py-0 mt-2"
        style={{
          background: "rgba(255, 255, 255, 0.75)",
          borderRadius: "16px",
        }}
      >
        <Button
          variant="ghost"
          size="icon"
          className="size-10 shrink-0 rounded-full bg-white hover:bg-white/80"
          onClick={() => router.back()}
        >
          <ArrowLeftIcon className="size-6" style={{ color: "#303030" }} />
        </Button>

        <div className="flex flex-1 items-center gap-2">
          <FileTextIcon className="size-5 shrink-0" style={{ color: "#A9A9A9" }} />
          <span
            className="text-base font-semibold"
            style={{
              fontFamily: "var(--font-bricolage)",
              lineHeight: "19px",
              letterSpacing: "-0.04em",
              color: "#A9A9A9",
            }}
          >
            {title || "Exams"}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="ghost"
            size="icon"
            className="size-9 rounded-full bg-[#F6F6F6] hover:bg-[#EFEFEF]"
          >
            <HelpCircleIcon className="size-6" style={{ color: "#303030" }} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="relative size-9 rounded-full bg-[#F6F6F6] hover:bg-[#EFEFEF]"
          >
            <BellIcon className="size-6" style={{ color: "#303030" }} />
            <span
              className="absolute top-1.5 right-1.5 size-2 rounded-full"
              style={{ background: "#FF5623" }}
            />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="size-9 rounded-full bg-white hover:bg-white/80"
          >
            <SparkleIcon className="size-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer outline-none">
              <div
                className="flex items-center gap-2 rounded-xl"
                style={{ height: "44px", padding: "6px 12px" }}
              >
                <Avatar className="size-8">
                  <AvatarImage src="/dp.jpg" alt="Madhur Rastogi" />
                </Avatar>
                <span
                  className="text-base font-semibold"
                  style={{
                    fontFamily: "var(--font-bricolage)",
                    lineHeight: "19px",
                    letterSpacing: "-0.04em",
                    color: "#303030",
                  }}
                >
                  Madhur Rastogi
                </span>
                <ChevronDownIcon className="size-6" style={{ color: "#303030" }} />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={8}>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </>
  )
}
