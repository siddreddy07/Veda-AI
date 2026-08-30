import {
  Bricolage_Grotesque,
  Geist,
  Geist_Mono,
} from "next/font/google"

import type { Metadata } from "next"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { cn } from "@/lib/utils"

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Veda AI",
  description:
    "Veda AI — upload a question paper and answer sheet to auto-extract, map, and grade student answers with AI.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Veda AI",
    title: "Veda AI",
    description:
      "Veda AI — upload a question paper and answer sheet to auto-extract, map, and grade student answers with AI.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Veda AI",
    description:
      "Veda AI — upload a question paper and answer sheet to auto-extract, map, and grade student answers with AI.",
  },
}

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  weight: ["400", "500", "600", "700", "800"],
})

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        bricolage.variable,
        "font-sans",
        geist.variable
      )}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
        <Toaster richColors />
      </body>
    </html>
  )
}
