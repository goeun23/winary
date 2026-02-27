"use client"

import { useState, useMemo } from "react"
import { Text } from "@toss/tds-mobile"
import { useRouter } from "next/navigation"
import PageLayout from "@/components/PageLayout"
import type { ReviewItem } from "@/types/review"

import {
  WINE_CATEGORY_CONFIG,
  type WineCategory,
  CATEGORY_LABELS,
  WINE_TYPE_MAP,
} from "@/types/wine"

type FilterCategory = "ALL" | WineCategory | string

const FILTER_OPTIONS = [
  { key: "ALL", label: "전체" },
  ...Object.entries(WINE_CATEGORY_CONFIG).map(([key, config]) => ({
    key: config.label as FilterCategory,
    label: config.label,
  })),
]

const FILTER_COLORS = {
  ALL: { activeBg: "#191f28", activeText: "#ffffff" },
  ...Object.fromEntries(
    Object.values(WINE_CATEGORY_CONFIG).map((config) => [
      config.label,
      { activeBg: config.color, activeText: "#ffffff" },
    ]),
  ),
} as Record<FilterCategory, { activeBg: string; activeText: string }>

const TYPE_BADGE = Object.fromEntries(
  Object.entries(WINE_CATEGORY_CONFIG).map(([key, config]) => [
    key,
    {
      bg: config.bgColor,
      text: config.color,
      label: config.label,
      icon: config.icon,
    },
  ]),
) as Record<string, { bg: string; text: string; label: string; icon: string }>

interface ReviewListViewProps {
  reviews: ReviewItem[]
  onBack?: () => void
  onSelectPost?: (postId: string) => void
}

const ReviewListView = ({
  reviews,
  onBack,
  onSelectPost,
}: ReviewListViewProps) => {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("ALL")

  const filteredPosts = useMemo(() => {
    let posts = reviews

    if (activeFilter !== "ALL") {
      posts = posts.filter((p) => {
        // p.wineType은 "Red", "White" 등이고 activeFilter는 "레드", "화이트" 등일 수 있음
        const label =
          WINE_CATEGORY_CONFIG[activeFilter as WineCategory]?.label ||
          activeFilter
        return p.wineType === label || p.wineType === activeFilter
      })
    }

    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase()
      posts = posts.filter(
        (p) =>
          p.wineName.toLowerCase().includes(q) ||
          p.wineRegion.toLowerCase().includes(q),
      )
    }

    return posts
  }, [reviews, activeFilter, searchTerm])

  const renderStars = (rating: number) => (
    <span style={{ display: "inline-flex", gap: "1px" }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          style={{
            color: i <= rating ? "#fbbf24" : "#e5e8eb",
            fontSize: "13px",
          }}
        >
          ★
        </span>
      ))}
    </span>
  )

  return (
    <PageLayout
      title="와인 리스트"
      onBack={() => (onBack ? onBack() : router.back())}
    >
      <style>{`
        @keyframes wlPageFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes wlCardFadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .wl-card:active { transform: scale(0.98); }
        .wl-filter-btn { border: none; cursor: pointer; transition: all 0.2s ease; white-space: nowrap; }
        .wl-filter-btn:active { transform: scale(0.95); }
      `}</style>

      {/* Search Bar */}
      <div style={{ padding: "0 0 8px 0" }}>
        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              left: "14px",
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              alignItems: "center",
              pointerEvents: "none",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                stroke={isFocused ? "#3182f6" : "#8B95A1"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="등록한 와인을 검색해 보세요"
            style={{
              width: "100%",
              padding: "14px 40px 14px 40px",
              borderRadius: "12px",
              border: isFocused ? "2px solid #3182f6" : "2px solid transparent",
              backgroundColor: isFocused ? "#ffffff" : "#f2f4f6",
              fontSize: "15px",
              color: "#191f28",
              outline: "none",
              boxSizing: "border-box",
              transition: "all 0.2s ease",
              boxShadow: isFocused
                ? "0 0 0 4px rgba(49, 130, 246, 0.08)"
                : "none",
            }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "#e5e8eb",
                border: "none",
                borderRadius: "50%",
                width: "22px",
                height: "22px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path
                  d="M9 3L3 9M3 3L9 9"
                  stroke="#8b95a1"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Filter Chips */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          padding: "8px 0 16px 0",
          margin: "0 -20px",
          paddingLeft: "20px",
          paddingRight: "20px",
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
        }}
      >
        {FILTER_OPTIONS.map((opt) => {
          const isActive = activeFilter === opt.key
          const colors = FILTER_COLORS[opt.key]
          return (
            <button
              key={opt.key}
              className="wl-filter-btn"
              onClick={() => setActiveFilter(opt.key)}
              style={{
                padding: "8px 18px",
                borderRadius: "20px",
                fontSize: "14px",
                fontWeight: isActive ? "700" : "500",
                backgroundColor: isActive ? colors.activeBg : "#f2f4f6",
                color: isActive ? colors.activeText : "#6b7684",
                boxShadow: isActive ? `0 2px 8px ${colors.activeBg}33` : "none",
              }}
            >
              {opt.label}
            </button>
          )
        })}
      </div>

      {/* Result Count */}
      <div style={{ padding: "0 0 8px 0" }}>
        <Text style={{ fontSize: "13px", color: "#8b95a1" }}>
          총 {filteredPosts.length}건
        </Text>
      </div>

      {/* Wine Card List */}
      <div
        style={{
          flex: 1,
          padding: 0,
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post, index) => {
            const catKey = WINE_TYPE_MAP[post.wineType] || "RED"
            const badge = TYPE_BADGE[catKey]
            return (
              <div
                key={post.id}
                className="wl-card"
                onClick={() =>
                  onSelectPost
                    ? onSelectPost(post.id)
                    : router.push(`/reviews/${post.id}`)
                }
                style={{
                  display: "flex",
                  gap: "14px",
                  padding: "14px",
                  borderRadius: "16px",
                  backgroundColor: "#ffffff",
                  border: "1px solid #f2f4f6",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                  cursor: "pointer",
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  animation: `wlCardFadeIn 0.3s ease-out ${index * 0.04}s both`,
                }}
              >
                {/* Thumbnail */}
                <div
                  style={{
                    width: "72px",
                    height: "72px",
                    borderRadius: "12px",
                    overflow: "hidden",
                    flexShrink: 0,
                    backgroundColor: "#f2f4f6",
                  }}
                >
                  <img
                    src={post.imageUrl || badge.icon}
                    alt={post.wineName}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      padding: post.imageUrl ? 0 : "4px",
                    }}
                  />
                </div>

                {/* Info */}
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: "6px",
                    minWidth: 0,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: "700",
                        padding: "2px 8px",
                        borderRadius: "6px",
                        backgroundColor: badge.bg,
                        color: badge.text,
                        flexShrink: 0,
                      }}
                    >
                      {badge.label}
                    </span>
                    <Text
                      style={{
                        fontSize: "12px",
                        color: "#8b95a1",
                        flexShrink: 0,
                      }}
                    >
                      {post.wineRegion}
                    </Text>
                  </div>

                  <Text
                    style={{
                      fontSize: "15px",
                      fontWeight: "600",
                      color: "#191f28",
                      lineHeight: "1.3",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {post.wineName}
                  </Text>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    {renderStars(post.rating)}
                    <Text style={{ fontSize: "12px", color: "#b0b8c1" }}>
                      {post.createdAt}
                    </Text>
                  </div>
                </div>

                {/* Arrow */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexShrink: 0,
                    color: "#b0b8c1",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M9 6L15 12L9 18"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            )
          })
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "60px 0",
              animation: "wlCardFadeIn 0.3s ease-out",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div style={{ fontSize: "48px" }}>🍷</div>
            <Text
              style={{ fontSize: "16px", fontWeight: "600", color: "#191f28" }}
            >
              등록된 와인이 없어요
            </Text>
            <Text style={{ fontSize: "14px", color: "#8b95a1" }}>
              {searchTerm
                ? "검색 결과가 없어요. 다른 이름으로 검색해 보세요"
                : "리뷰를 등록하면 여기에 표시돼요"}
            </Text>
          </div>
        )}
      </div>
    </PageLayout>
  )
}

export default ReviewListView
