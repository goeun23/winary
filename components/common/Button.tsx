import React from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "small" | "medium" | "large"
  variant?: "primary" | "secondary" | "text"
  fullWidth?: boolean
}

const Button = ({
  size = "medium",
  variant = "primary",
  fullWidth = false,
  style,
  disabled,
  children,
  ...props
}: ButtonProps) => {
  const getPadding = () => {
    switch (size) {
      case "small":
        return "8px 12px"
      case "medium":
        return "12px 16px"
      case "large":
        return "16px 20px"
      default:
        return "12px 16px"
    }
  }

  const getFontSize = () => {
    switch (size) {
      case "small":
        return "14px"
      case "medium":
        return "16px"
      case "large":
        return "17px"
      default:
        return "16px"
    }
  }

  const getColors = () => {
    if (disabled) {
      return {
        backgroundColor: "var(--adaptiveGrey100)",
        color: "var(--adaptiveGrey400)",
      }
    }
    switch (variant) {
      case "primary":
        return {
          backgroundColor: "var(--adaptiveBlue500)",
          color: "#ffffff",
        }
      case "secondary":
        return {
          backgroundColor: "var(--adaptiveBlue50)",
          color: "var(--adaptiveBlue500)",
        }
      case "text":
        return {
          backgroundColor: "transparent",
          color: "var(--adaptiveBlue500)",
        }
      default:
        return {
          backgroundColor: "var(--adaptiveBlue500)",
          color: "#ffffff",
        }
    }
  }

  const colors = getColors()

  return (
    <button
      disabled={disabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: fullWidth ? "100%" : "auto",
        padding: getPadding(),
        fontSize: getFontSize(),
        fontWeight: "600",
        borderRadius: "12px",
        border: "none",
        cursor: disabled ? "default" : "pointer",
        transition: "opacity 0.2s, background-color 0.2s",
        ...colors,
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
