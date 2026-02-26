"use client"

import { ThemeProvider } from "@toss/tds-mobile"

export function TossThemeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return <ThemeProvider>{children}</ThemeProvider>
}
