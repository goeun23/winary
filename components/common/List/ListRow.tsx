import React from "react"
import Text from "../Text"

interface ListRowProps extends React.HTMLAttributes<HTMLDivElement> {
  left?: React.ReactNode
  contents?: React.ReactNode
  right?: React.ReactNode
  withArrow?: boolean
  onClick?: () => void
}

const ListRow = ({
  left,
  contents,
  right,
  withArrow = false,
  onClick,
  style,
  children,
  ...props
}: ListRowProps) => {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        padding: "16px 20px",
        cursor: onClick ? "pointer" : "default",
        backgroundColor: "#ffffff",
        transition: "background-color 0.1s",
        ...style,
      }}
      {...props}
    >
      {left && <div style={{ marginRight: "16px", flexShrink: 0 }}>{left}</div>}

      <div style={{ flex: 1, minWidth: 0 }}>{contents || children}</div>

      {right && (
        <div style={{ marginLeft: "12px", flexShrink: 0 }}>{right}</div>
      )}

      {withArrow && (
        <div style={{ marginLeft: "8px", color: "var(--adaptiveGrey300)" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 18l6-6-6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
    </div>
  )
}

const Texts = ({
  type = "1RowTypeA",
  top,
  bottom,
}: {
  type?: "1RowTypeA" | "2RowTypeA"
  top: React.ReactNode
  bottom?: React.ReactNode
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
      <Text
        typography={type === "1RowTypeA" ? "t6" : "t6"}
        fontWeight="600"
        color="var(--adaptiveGrey900)"
      >
        {top}
      </Text>
      {bottom && (
        <Text typography="st2" color="var(--adaptiveGrey500)">
          {bottom}
        </Text>
      )}
    </div>
  )
}

ListRow.Texts = Texts

export default ListRow
