import React from "react"

interface DividerProps {
  variant?: "height1" | "height8" | "height16"
  color?: string
}

const Divider = ({ variant = "height1", color }: DividerProps) => {
  const getHeight = () => {
    switch (variant) {
      case "height1":
        return "1px"
      case "height8":
        return "8px"
      case "height16":
        return "16px"
      default:
        return "1px"
    }
  }

  const getBackgroundColor = () => {
    if (color) return color
    return variant === "height1"
      ? "var(--adaptiveHairlineBorder)"
      : "var(--adaptiveGrey100)"
  }

  return (
    <div
      style={{
        height: getHeight(),
        backgroundColor: getBackgroundColor(),
        width: "100%",
      }}
    />
  )
}

export default Divider
