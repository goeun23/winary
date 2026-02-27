import React from "react"
import Text from "../Text"

interface ListHeaderProps {
  title: React.ReactNode
  description?: React.ReactNode
  rightAlignment?: "center" | "top"
}

export const ListHeader = ({ title, description }: ListHeaderProps) => {
  return (
    <div style={{ padding: "16px 20px 8px" }}>
      {typeof title === "string" ? (
        <Text typography="t5" fontWeight="bold">
          {title}
        </Text>
      ) : (
        title
      )}
      {description && (
        <div style={{ marginTop: "4px" }}>
          {typeof description === "string" ? (
            <Text typography="st2" color="var(--adaptiveGrey500)">
              {description}
            </Text>
          ) : (
            description
          )}
        </div>
      )}
    </div>
  )
}

const TitleParagraph = ({
  children,
  typography = "t5",
  color,
  fontWeight,
}: any) => (
  <Text typography={typography} color={color} fontWeight={fontWeight}>
    {children}
  </Text>
)

const DescriptionParagraph = ({ children }: any) => (
  <Text typography="st2" color="var(--adaptiveGrey500)">
    {children}
  </Text>
)

ListHeader.TitleParagraph = TitleParagraph
ListHeader.DescriptionParagraph = DescriptionParagraph

export const ListFooter = ({ onClick, children, style }: any) => (
  <div
    onClick={onClick}
    style={{
      padding: "16px 20px",
      textAlign: "center",
      cursor: "pointer",
      color: "var(--adaptiveGrey500)",
      fontSize: "14px",
      ...style,
    }}
  >
    {children}
  </div>
)
