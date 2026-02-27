import React from "react"

interface TextProps extends React.HTMLAttributes<HTMLSpanElement> {
  typography?: "t1" | "t2" | "t3" | "t4" | "t5" | "t6" | "t7" | "st1" | "st2"
  fontWeight?: React.CSSProperties["fontWeight"]
  color?: string
}

const Text = ({
  typography = "t5",
  fontWeight,
  color,
  style,
  children,
  ...props
}: TextProps) => {
  const getFontSize = () => {
    switch (typography) {
      case "t1":
        return "48px"
      case "t2":
        return "38px"
      case "t3":
        return "28px"
      case "t4":
        return "24px"
      case "t5":
        return "20px"
      case "t6":
        return "17px"
      case "t7":
        return "15px"
      case "st1":
        return "16px"
      case "st2":
        return "14px"
      default:
        return "16px"
    }
  }

  const getLineHeight = () => {
    switch (typography) {
      case "t1":
      case "t2":
      case "t3":
        return "1.3"
      default:
        return "1.5"
    }
  }

  return (
    <span
      style={{
        fontSize: getFontSize(),
        lineHeight: getLineHeight(),
        fontWeight:
          fontWeight || (typography.startsWith("st") ? "600" : "normal"),
        color: color || "var(--adaptiveGrey900)",
        ...style,
      }}
      {...props}
    >
      {children}
    </span>
  )
}

export default Text
