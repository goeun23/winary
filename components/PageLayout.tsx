"use client"

import React from "react"
import PageHeader from "./PageHeader"

interface PageLayoutProps {
  children: React.ReactNode
  title?: string
  onBack?: () => void
  rightAction?: React.ReactNode
  hasHeader?: boolean
  /** padding-top (header가 없을 때 사용) */
  topPadding?: string | number
  /** 가로 여백을 제거할지 여부 (예: 가로 꽉 차는 리스트나 검색바 등) */
  fullWidthContent?: boolean
  /** 배경색 (기본: 흰색) */
  backgroundColor?: string
}

/**
 * 전역 레이아웃을 통일하기 위한 컨테이너 컴포넌트
 * 좌우 20px, 하단 safe-area 여백을 보장하며 헤더 포함 여부를 결정할 수 있습니다.
 */
const PageLayout = ({
  children,
  title,
  onBack,
  rightAction,
  hasHeader = true,
  topPadding = "12px", // Slightly reduced default top padding
  fullWidthContent = false,
  backgroundColor = "transparent", // Default to transparent
}: PageLayoutProps) => {
  return (
    <div
      style={{
        backgroundColor,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        fontFamily: "Pretendard, -apple-system, sans-serif",
      }}
    >
      {hasHeader && title !== undefined && (
        <PageHeader title={title} onBack={onBack} rightAction={rightAction} />
      )}
      <main
        style={{
          flex: 1,
          paddingLeft: fullWidthContent ? "0" : "20px",
          paddingRight: fullWidthContent ? "0" : "20px",
          paddingTop: hasHeader ? "12px" : topPadding,
          paddingBottom: "calc(24px + env(safe-area-inset-bottom))",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </main>
    </div>
  )
}

export default PageLayout
