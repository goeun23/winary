import React from "react"
import Text from "./Text"

interface TableRowProps {
  left: React.ReactNode
  right: React.ReactNode
  align?: "space-between" | "flex-start"
}

const TableRow = ({ left, right }: TableRowProps) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 20px",
        backgroundColor: "#ffffff",
      }}
    >
      <Text typography="t7" color="var(--adaptiveGrey600)">
        {left}
      </Text>
      <Text
        typography="t7"
        fontWeight="600"
        color="var(--adaptiveGrey900)"
        style={{ textAlign: "right", flex: 1, marginLeft: "16px" }}
      >
        {right}
      </Text>
    </div>
  )
}

export default TableRow
