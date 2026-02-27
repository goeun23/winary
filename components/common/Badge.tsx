import React from "react"

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "small" | "medium"
  color?: "blue" | "teal" | "green" | "red" | "yellow" | "elephant" | string
  variant?: "solid" | "weak"
}

const Badge = ({
  size = "small",
  color = "blue",
  variant = "weak",
  style,
  children,
  ...props
}: BadgeProps) => {
  const getColors = () => {
    const isWeak = variant === "weak"
    switch (color) {
      case "blue":
        return {
          backgroundColor: isWeak
            ? "var(--tBlueBadgeBackground)"
            : "var(--adaptiveBlue500)",
          color: isWeak ? "var(--tBlueBadgeColor)" : "#ffffff",
        }
      case "teal":
        return {
          backgroundColor: isWeak
            ? "var(--tTealBadgeBackground)"
            : "var(--adaptiveBlue700)",
          color: isWeak ? "var(--tTealBadgeColor)" : "#ffffff",
        }
      case "green":
        return {
          backgroundColor: isWeak ? "var(--tGreenBadgeBackground)" : "#2ea64f",
          color: isWeak ? "var(--tGreenBadgeColor)" : "#ffffff",
        }
      case "red":
        return {
          backgroundColor: isWeak
            ? "var(--tRedBadgeBackground)"
            : "var(--adaptiveRed500)",
          color: isWeak ? "var(--tRedBadgeColor)" : "#ffffff",
        }
      case "yellow":
        return {
          backgroundColor: isWeak
            ? "var(--tYellowBadgeBackground)"
            : "var(--adaptiveYellow500)",
          color: isWeak ? "var(--tYellowBadgeColor)" : "#ffffff",
        }
      case "elephant":
        return {
          backgroundColor: isWeak
            ? "var(--tElephantBadgeBackground)"
            : "var(--adaptiveGrey600)",
          color: isWeak ? "var(--tElephantBadgeColor)" : "#ffffff",
        }
      default:
        return {
          backgroundColor: isWeak
            ? "var(--adaptiveGrey100)"
            : "var(--adaptiveGrey600)",
          color: isWeak ? "var(--adaptiveGrey600)" : "#ffffff",
        }
    }
  }

  const { backgroundColor, color: textColor } = getColors()

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: size === "small" ? "2px 8px" : "4px 12px",
        borderRadius: "4px",
        fontSize: size === "small" ? "12px" : "13px",
        fontWeight: "600",
        backgroundColor,
        color: textColor,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  )
}

export default Badge
