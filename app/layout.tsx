import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Winary",
  description: "나만의 와인 저장고",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
