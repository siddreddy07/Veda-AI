import type { SVGProps } from "react"

export const PdfIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 512 512"
    {...props}
  >
    <path
      fill="#f4595e"
      fillRule="evenodd"
      d="M161.28 328.32a61 61 0 0 0-40.32-8.32H85.333v128h28.373v-48.853h12.16a55.04 55.04 0 0 0 35.84-8.747a38.61 38.61 0 0 0 13.44-30.933a37.33 37.33 0 0 0-13.866-31.147m-22.827 46.72a32.85 32.85 0 0 1-17.067 2.56h-8.32v-36.266h8.32a30.3 30.3 0 0 1 17.494 3.413a17.49 17.49 0 0 1 7.466 15.36a15.15 15.15 0 0 1-7.893 14.933M236.16 320h-35.414v128h33.92a90.24 90.24 0 0 0 50.134-9.6a60.16 60.16 0 0 0 23.893-54.4a64 64 0 0 0-17.707-48.853A73.4 73.4 0 0 0 236.16 320m28.16 98.987a51.2 51.2 0 0 1-29.227 6.4h-5.547v-82.773h5.12c17.92 0 24.96 1.706 32 8.106a43.95 43.95 0 0 1 12.16 33.28a41.39 41.39 0 0 1-14.506 34.987M339.84 448h28.8v-53.546h58.026V371.84H368.64v-29.226h58.026V320H339.84zM320 42.667H85.333v234.667H128v-192h174.293L384 167.04v110.294h42.666v-128z"
    />
  </svg>
)

export const ImageIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 17 16"
    {...props}
  >
    <g fill="#4da6ff" fillRule="evenodd" transform="translate(0, 2)">
      <path d="M13.438 11.944H2.557c-1.394 0-2.528-1.163-2.528-2.591v-6.75c0-1.43 1.135-2.591 2.528-2.591h10.881c1.393 0 2.527 1.161 2.527 2.591v6.75c0 1.428-1.135 2.591-2.527 2.591zM2.237.979c-.7 0-1.272.614-1.272 1.371v7.318c0 .757.572 1.371 1.272 1.371h11.517c.702 0 1.273-.614 1.273-1.371V2.35c0-.757-.571-1.371-1.273-1.371H2.237z" />
      <ellipse cx="5.471" cy="3.461" rx="1.471" ry="1.461" />
      <path d="m11.234 3.037l2.76 6.951H2.021L5.497 5.98l3.117.944l2.62-3.887z" />
    </g>
  </svg>
)

export const GenericFileIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 512 512"
    {...props}
  >
    <path
      fill="#9E9E9E"
      fillRule="evenodd"
      d="M352 32H160a32 32 0 0 0-32 32v384a32 32 0 0 0 32 32h192a32 32 0 0 0 32-32V64a32 32 0 0 0-32-32m-32 96a32 32 0 0 1 32-32h69.2L352 121.7zm32-64a32 32 0 0 1 0 64H320a32 32 0 0 1 0-64zm-96 224a32 32 0 0 1-32 32H160v48h32v-16h32v16h32v-48a32 32 0 0 1-32-32m-32 0a16 16 0 1 0 32 0a16 16 0 1 0-32 0m160 32a32 32 0 0 1-32 32h-32v16h-32v-16h-48v48h144v-80m-160 0h48v16h-48zm160-112H192v32h224z"
    />
  </svg>
)

type FileIconComponent = React.ComponentType<SVGProps<SVGSVGElement>>

const MIME_TO_ICON: Record<string, FileIconComponent> = {
  "application/pdf": PdfIcon,
  "image/png": ImageIcon,
  "image/jpeg": ImageIcon,
  "image/jpg": ImageIcon,
  "image/gif": ImageIcon,
  "image/webp": ImageIcon,
  "image/svg+xml": ImageIcon,
}

export function getFileIcon(mimeType: string): FileIconComponent {
  return MIME_TO_ICON[mimeType] ?? GenericFileIcon
}

export async function getPdfPageCount(file: File): Promise<number | null> {
  if (file.type !== "application/pdf") return null
  try {
    const buffer = await file.arrayBuffer()
    const bytes = new Uint8Array(buffer)
    let count = 0
    const pattern = /\/Type\s*\/Page[^s]/
    const chunkSize = 65536
    let overlap = ""

    for (let i = 0; i < bytes.length; i += chunkSize) {
      const end = Math.min(i + chunkSize, bytes.length)
      const chunk = overlap + new TextDecoder("latin1").decode(bytes.slice(i, end))
      const matches = chunk.match(pattern)
      if (matches) count += matches.length
      overlap = new TextDecoder("latin1").decode(bytes.slice(Math.max(0, end - 20), end))
    }

    return count > 0 ? count : null
  } catch {
    return null
  }
}
