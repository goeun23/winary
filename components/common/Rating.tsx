import React from "react"

interface RatingProps {
  value: number
  max?: number
  readOnly?: boolean
  onChange?: (value: number) => void
  size?: "small" | "medium" | "large"
  variant?: "default" | "compact"
}

const Rating = ({
  value,
  max = 5,
  readOnly = false,
  onChange,
  size = "medium",
}: RatingProps) => {
  const stars = Array.from({ length: max }, (_, i) => i + 1)

  const getFontSize = () => {
    switch (size) {
      case "small":
        return "16px"
      case "medium":
        return "24px"
      case "large":
        return "32px"
      default:
        return "24px"
    }
  }

  return (
    <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
      {stars.map((star) => (
        <span
          key={star}
          onClick={() => !readOnly && onChange?.(star)}
          style={{
            fontSize: getFontSize(),
            color:
              star <= value
                ? "var(--adaptiveBlue500)"
                : "var(--adaptiveGrey200)",
            cursor: readOnly ? "default" : "pointer",
            transition: "color 0.2s",
          }}
        >
          ★
        </span>
      ))}
    </div>
  )
}

export default Rating
