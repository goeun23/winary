"use client"

import { Text } from "@toss/tds-mobile"
import { useRouter } from "next/navigation"

interface PageHeaderProps {
  /** 헤더에 표시할 제목 텍스트 */
  title: string
  /** 뒤로가기 버튼 클릭 핸들러 (미제공 시 router.back() 사용) */
  onBack?: () => void
  /** 헤더 배경색 (기본: 투명 + 블러) */
  backgroundColor?: string
  /** sticky 여부 (기본: true) */
  sticky?: boolean
  /** 우측 액션 버튼 영역 (선택) */
  rightAction?: React.ReactNode
}

const PageHeader = ({
  title,
  onBack,
  backgroundColor = "rgba(255, 255, 255, 0.85)",
  sticky = true,
  rightAction,
}: PageHeaderProps) => {
  const router = useRouter()

  return (
    <header
      style={{
        position: sticky ? "sticky" : "relative",
        top: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        padding: "calc(12px + env(safe-area-inset-top)) 20px 12px 20px",
        backgroundColor,
        backdropFilter: sticky ? "blur(12px)" : undefined,
        WebkitBackdropFilter: sticky ? "blur(12px)" : undefined,
        borderBottom: "1px solid #f2f4f6",
      }}
    >
      {/* 뒤로가기 버튼 */}
      <button
        onClick={onBack ?? (() => router.back())}
        style={{
          background: "none",
          border: "none",
          padding: "8px",
          cursor: "pointer",
          marginLeft: "-8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "opacity 0.2s",
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M15 18L9 12L15 6"
            stroke="#191F28"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* 제목 */}
      <Text
        style={{
          flex: 1,
          fontSize: "18px",
          fontWeight: "bold",
          color: "#191f28",
          marginLeft: "8px",
        }}
      >
        {title}
      </Text>

      {/* 우측 액션 (선택) */}
      {rightAction && <div style={{ flexShrink: 0 }}>{rightAction}</div>}
    </header>
  )
}

export default PageHeader
