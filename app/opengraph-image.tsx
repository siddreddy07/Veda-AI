import { ImageResponse } from "next/og"

export const alt = "Veda AI"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

function VedaLogo() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
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
        fill="url(#og-veda-gradient)"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.3334 28.3585C17.3334 28.3585 16.6059 30.3005 15.9392 30.4221H24.3635C26.0606 30.4221 27.5754 29.4511 28.0607 27.6302L32.9093 13.0643C32.9093 13.0643 33.3334 11.3042 34.0001 11.0008H25.4542C23.7571 11.0008 22.6664 11.6076 21.9997 13.8535L17.3334 28.3585Z"
        fill="white"
      />
      <defs>
        <linearGradient
          id="og-veda-gradient"
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

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #303030 0%, #232323 45%, #171717 100%)",
          color: "white",
        }}
      >
        <div style={{ display: "flex", width: 280, height: 280 }}>
          <VedaLogo />
        </div>
      </div>
    ),
    { ...size }
  )
}