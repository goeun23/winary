"use client"
import { TDSMobileProvider } from "@toss/tds-mobile"

const defaultUserAgent = {
  colorPreference: undefined,
  fontA11y: undefined,
  fontScale: undefined,
  isAndroid: false,
  isIOS: false,
  safeAreaBottomTransparency: undefined,
}

export function TossThemeProvider({ children }: { children: React.ReactNode }) {
  return <TDSMobileProvider userAgent={defaultUserAgent}>{children}</TDSMobileProvider>
}
