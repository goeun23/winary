"use client"
import React, { useEffect, useState } from "react"
import Text from "./Text"

interface BottomSheetOption {
  label: string
  value: string | number
  onClick: () => void
}

interface BottomSheetProps {
  open: boolean
  onClose: () => void
  children?: React.ReactNode
  header?: React.ReactNode
  options?: BottomSheetOption[]
}

const BottomSheet = ({
  open,
  onClose,
  children,
  header,
  options,
}: BottomSheetProps) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (open) {
      setIsVisible(true)
      document.body.style.overflow = "hidden"
    } else {
      setTimeout(() => setIsVisible(false), 300)
      document.body.style.overflow = "unset"
    }
  }, [open])

  if (!open && !isVisible) return null

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          opacity: open ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          backgroundColor: "#ffffff",
          borderTopLeftRadius: "24px",
          borderTopRightRadius: "24px",
          paddingBottom: "env(safe-area-inset-bottom, 24px)",
          maxHeight: "90vh",
          overflowY: "auto",
          transform: open ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.3s cubic-bezier(0, 0, 0.2, 1)",
          boxShadow: "0 -8px 24px rgba(0,0,0,0.12)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ padding: "12px 20px" }}>
          <div
            style={{
              width: "40px",
              height: "4px",
              backgroundColor: "var(--adaptiveGrey200)",
              borderRadius: "2px",
              margin: "0 auto 16px",
            }}
          />
          {header && (
            <div style={{ marginBottom: "20px" }}>
              {typeof header === "string" ? (
                <Text typography="t5" fontWeight="bold">
                  {header}
                </Text>
              ) : (
                header
              )}
            </div>
          )}

          {options ? (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "4px" }}
            >
              {options.map((option, idx) => (
                <div
                  key={`${option.value}-${idx}`}
                  onClick={option.onClick}
                  style={{
                    padding: "16px 0",
                    cursor: "pointer",
                    borderBottom:
                      idx === options.length - 1
                        ? "none"
                        : "1px solid var(--adaptiveHairlineBorder)",
                  }}
                >
                  <Text typography="t6">{option.label}</Text>
                </div>
              ))}
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  )
}

const Header = ({ children }: { children: React.ReactNode }) => (
  <Text typography="t5" fontWeight="bold">
    {children}
  </Text>
)

const Select = ({
  options,
  value,
  onChange,
}: {
  options: { name: string; value: string }[]
  value: string
  onChange: (e: any) => void
}) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
    {options.map((opt) => (
      <div
        key={opt.value}
        onClick={() => onChange({ target: { value: opt.value } })}
        style={{
          padding: "16px",
          borderRadius: "12px",
          backgroundColor:
            value === opt.value
              ? "var(--adaptiveBlue50)"
              : "var(--adaptiveGrey50)",
          color:
            value === opt.value
              ? "var(--adaptiveBlue500)"
              : "var(--adaptiveGrey900)",
          fontWeight: value === opt.value ? "700" : "500",
          cursor: "pointer",
          textAlign: "center",
        }}
      >
        {opt.name}
      </div>
    ))}
  </div>
)

BottomSheet.Header = Header
BottomSheet.Select = Select

export default BottomSheet
