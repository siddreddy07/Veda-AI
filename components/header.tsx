"use client"

import {
  ArrowLeftIcon,
  HelpCircleIcon,
  BellIcon,
  ChevronDownIcon,
  FileTextIcon,
  LayoutGridIcon,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSidebar } from "@/components/ui/sidebar"
import { useRouter } from "next/navigation"

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
            <AvatarImage src="" alt="Madhur Rastogi" />
            <AvatarFallback className="bg-[#F0F0F0] text-sm font-medium" style={{ color: "#303030" }}>
              MR
            </AvatarFallback>
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
            <LayoutGridIcon className="size-5" style={{ color: "#2B2B2B" }} />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer outline-none">
              <div
                className="flex items-center gap-2 rounded-xl"
                style={{ height: "44px", padding: "6px 12px" }}
              >
                <Avatar className="size-8">
                  <AvatarImage src="" alt="Madhur Rastogi" />
                  <AvatarFallback className="bg-[#F0F0F0] text-sm font-medium" style={{ color: "#303030" }}>
                    MR
                  </AvatarFallback>
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
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </>
  )
}
