import { useState, useEffect } from "react"
import { Text, BottomSheet } from "@toss/tds-mobile"
import type { WineInfoLocal } from "../types/wine"
import type { LocalReview } from "../types/review"
import { CATEGORY_LABELS, CATEGORY_COLORS } from "../types/wine"
import { getReviews, canEdit, getMyToken } from "../services/reviewService"
import PageHeader from "../components/PageHeader"

interface WineDetailPageProps {
  wine: WineInfoLocal
  onBack: () => void
  onWriteReview: () => void
  onEditReview: (review: LocalReview, token: string) => void
}

const CharacteristicBar = ({
  label,
  emoji,
  value,
}: {
  label: string
  emoji: string
  value: number
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "12px",
      marginBottom: "14px",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        minWidth: "72px",
      }}
    >
      <span style={{ fontSize: "16px" }}>{emoji}</span>
      <Text style={{ fontSize: "14px", fontWeight: 600, color: "#4e5968" }}>
        {label}
      </Text>
    </div>
    <div
      style={{
        flex: 1,
        display: "flex",
        gap: "4px",
        alignItems: "center",
      }}
    >
      {[1, 2, 3, 4, 5].map((level) => (
        <div
          key={level}
          style={{
            flex: 1,
            height: "8px",
            borderRadius: "4px",
            backgroundColor: level <= value ? "#3182f6" : "#e5e8eb",
          }}
        />
      ))}
    </div>
    <Text
      style={{
        fontSize: "13px",
        fontWeight: "bold",
        color: "#3182f6",
        minWidth: "30px",
        textAlign: "right",
      }}
    >
      {value}/5
    </Text>
  </div>
)

const StarDisplay = ({
  rating,
  size = 16,
}: {
  rating: number
  size?: number
}) => (
  <div style={{ display: "flex", gap: "2px" }}>
    {[1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        style={{
          fontSize: `${size}px`,
          color: star <= rating ? "#f5a623" : "#e5e8eb",
        }}
      >
        ★
      </span>
    ))}
  </div>
)

const WineDetailPage = ({
  wine,
  onBack,
  onWriteReview,
  onEditReview,
}: WineDetailPageProps) => {
  const [reviews, setReviews] = useState<LocalReview[]>([])
  const [selectedReview, setSelectedReview] = useState<LocalReview | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const loadReviews = async () => {
    const data = await getReviews(wine.WINE_ID)
    setReviews(data)
  }

  useEffect(() => {
    loadReviews()
  }, [wine.WINE_ID])

  const handleEdit = (review: LocalReview) => {
    const tokenEntry = getMyToken(review.id)
    if (!tokenEntry) return
    onEditReview(review, tokenEntry.token)
  }

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0

  const catColor = CATEGORY_COLORS[
    wine.WINE_CATEGORY as keyof typeof CATEGORY_COLORS
  ] ?? {
    bg: "#f2f4f6",
    text: "#4e5968",
  }

  return (
    <div
      style={{
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
        fontFamily: "Pretendard, -apple-system, sans-serif",
        paddingBottom: "100px",
      }}
    >
      <style>{`
        @keyframes pageFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes itemFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .review-card:hover {
          box-shadow: 0 4px 16px rgba(0,0,0,0.08) !important;
        }
        .write-btn:active {
          transform: scale(0.97);
        }
      `}</style>

      {/* Header */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          backgroundColor: "rgba(248,249,250,0.92)",
          backdropFilter: "blur(12px)",
          paddingTop: "env(safe-area-inset-top)",
        }}
      >
        <div style={{ padding: "0 24px" }}>
          <PageHeader onBack={onBack} />
        </div>
      </div>

      <div
        style={{
          padding: "0 20px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          animation: "pageFadeIn 0.3s ease-out",
        }}
      >
        {/* 와인 정보 카드 */}
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "20px",
            padding: "20px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: "12px",
              }}
            >
              <div style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    color: "#191f28",
                    lineHeight: "1.3",
                    display: "block",
                  }}
                >
                  {wine.WINE_NM_KR || wine.WINE_NM}
                </Text>
                <Text
                  style={{
                    fontSize: "13px",
                    color: "#8b95a1",
                    display: "block",
                    marginTop: "2px",
                  }}
                >
                  {wine.WINE_NM}
                </Text>
              </div>
              <span
                style={{
                  fontSize: "12px",
                  padding: "4px 10px",
                  borderRadius: "8px",
                  backgroundColor: catColor.bg,
                  color: catColor.text,
                  fontWeight: "700",
                  flexShrink: 0,
                }}
              >
                {CATEGORY_LABELS[
                  wine.WINE_CATEGORY as keyof typeof CATEGORY_LABELS
                ] ?? wine.WINE_CATEGORY}
              </span>
            </div>

            {/* 메타 정보 */}
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              {wine.WINE_AREA && (
                <span style={{ fontSize: "13px", color: "#4e5968" }}>
                  📍 {wine.WINE_AREA}
                </span>
              )}
              {wine.WINE_ABV > 0 && (
                <span style={{ fontSize: "13px", color: "#4e5968" }}>
                  🍷 {wine.WINE_ABV}%
                </span>
              )}
              {wine.WINE_PRC > 0 && (
                <span style={{ fontSize: "13px", color: "#4e5968" }}>
                  💰 ₩{wine.WINE_PRC.toLocaleString()}
                </span>
              )}
            </div>

            {/* 평균 별점 */}
            {reviews.length > 0 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  paddingTop: "8px",
                  borderTop: "1px solid #f2f4f6",
                }}
              >
                <StarDisplay rating={Math.round(avgRating)} size={18} />
                <Text
                  style={{
                    fontSize: "15px",
                    fontWeight: "700",
                    color: "#191f28",
                  }}
                >
                  {avgRating.toFixed(1)}
                </Text>
                <Text style={{ fontSize: "13px", color: "#8b95a1" }}>
                  ({reviews.length}개의 리뷰)
                </Text>
              </div>
            )}
          </div>
        </div>

        {/* 리뷰 목록 헤더 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 4px",
          }}
        >
          <Text
            style={{ fontSize: "15px", fontWeight: "700", color: "#191f28" }}
          >
            리뷰 {reviews.length > 0 ? `${reviews.length}개` : ""}
          </Text>
          {reviews.length > 0 && (
            <Text style={{ fontSize: "12px", color: "#8b95a1" }}>최신순</Text>
          )}
        </div>

        {/* 리뷰 없을 때 */}
        {reviews.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "60px 0",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
              animation: "itemFadeIn 0.3s ease-out",
            }}
          >
            <span style={{ fontSize: "48px" }}>🍷</span>
            <Text
              style={{ fontSize: "16px", fontWeight: "600", color: "#191f28" }}
            >
              아직 리뷰가 없어요
            </Text>
            <Text style={{ fontSize: "14px", color: "#8b95a1" }}>
              첫 번째 리뷰를 남겨보세요
            </Text>
          </div>
        )}

        {/* 리뷰 카드 목록 */}
        {reviews.map((review, index) => {
          const editable = canEdit(review.id)

          return (
            <div
              key={review.id}
              className="review-card"
              onClick={() => {
                setSelectedReview(review)
                setIsDetailOpen(true)
              }}
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "16px",
                padding: "16px",
                boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
                transition: "box-shadow 0.2s ease",
                animation: `itemFadeIn 0.3s ease-out ${index * 0.05}s both`,
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                cursor: "pointer",
              }}
            >
              {/* 닉네임 + 날짜 */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#4e5968",
                  }}
                >
                  {review.nickname || "익명의 와인러버"}
                </Text>
                <Text style={{ fontSize: "11px", color: "#b0b8c1" }}>
                  {new Date(review.createdAt).toLocaleDateString("ko-KR", {
                    month: "short",
                    day: "numeric",
                  })}
                </Text>
              </div>

              {/* 별점 */}
              <StarDisplay rating={review.rating} size={15} />

              {review.comment.trim() && (
                <Text
                  style={{
                    fontSize: "14px",
                    color: "#333d4b",
                    lineHeight: "1.6",
                  }}
                >
                  {review.comment}
                </Text>
              )}

              {/* 수정 버튼 (내 리뷰 + 1시간 이내) */}
              {editable && (
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEdit(review)
                    }}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "20px",
                      border: "1.5px solid #e5e8eb",
                      backgroundColor: "transparent",
                      color: "#4e5968",
                      fontSize: "12px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    수정
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* 리뷰 상세 바텀 시트 */}
      <BottomSheet
        open={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        header={<BottomSheet.Header>리뷰 상세</BottomSheet.Header>}
      >
        {selectedReview && (
          <div style={{ padding: "0 20px 24px" }}>
            {/* 닉네임 + 날짜 */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "16px",
              }}
            >
              <Text
                style={{
                  fontSize: "14px",
                  fontWeight: "700",
                  color: "#191f28",
                }}
              >
                {selectedReview.nickname || "익명의 와인러버"}
              </Text>
              <Text style={{ fontSize: "12px", color: "#b0b8c1" }}>
                {new Date(selectedReview.createdAt).toLocaleDateString(
                  "ko-KR",
                  {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  },
                )}
              </Text>
            </div>

            {/* 별점 + 라벨 */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "20px",
              }}
            >
              <Text
                style={{
                  fontSize: "36px",
                  fontWeight: "bold",
                  color: "#3182f6",
                  lineHeight: "1",
                }}
              >
                {selectedReview.rating}
              </Text>
              <div>
                <div
                  style={{ display: "flex", gap: "2px", marginBottom: "2px" }}
                >
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      style={{
                        fontSize: "16px",
                        color:
                          star <= selectedReview.rating ? "#3182f6" : "#d1d5db",
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <Text style={{ fontSize: "13px", color: "#8b95a1" }}>
                  {
                    [
                      "",
                      "아쉬워요",
                      "그저 그래요",
                      "괜찮아요",
                      "좋아요!",
                      "최고예요!",
                    ][selectedReview.rating]
                  }
                </Text>
              </div>
            </div>

            {/* 테이스팅 노트 */}
            <div
              style={{
                backgroundColor: "#f8f9fa",
                borderRadius: "14px",
                padding: "16px 16px 2px",
                marginBottom: "16px",
              }}
            >
              <Text
                style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: "#4e5968",
                  display: "block",
                  marginBottom: "14px",
                }}
              >
                테이스팅 노트
              </Text>
              <CharacteristicBar
                label="당도"
                emoji="🍬"
                value={selectedReview.sweetness}
              />
              <CharacteristicBar
                label="산도"
                emoji="🍋"
                value={selectedReview.acidity}
              />
              <CharacteristicBar
                label="바디"
                emoji="💪"
                value={selectedReview.body}
              />
              <CharacteristicBar
                label="탄닌"
                emoji="🍇"
                value={selectedReview.tannin}
              />
            </div>

            {/* 코멘트 */}
            {selectedReview.comment.trim() && (
              <div
                style={{
                  backgroundColor: "#f8f9fa",
                  borderRadius: "14px",
                  padding: "16px",
                  marginBottom: "16px",
                }}
              >
                <Text
                  style={{
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "#4e5968",
                    display: "block",
                    marginBottom: "8px",
                  }}
                >
                  내 생각
                </Text>
                <Text
                  style={{
                    fontSize: "14px",
                    lineHeight: "1.7",
                    color: "#4e5968",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {selectedReview.comment}
                </Text>
              </div>
            )}

            {/* 수정하기 버튼 (내 리뷰 + 1시간 이내) */}
            {canEdit(selectedReview.id) && (
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  onClick={() => {
                    setIsDetailOpen(false)
                    handleEdit(selectedReview)
                  }}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "24px",
                    border: "1.5px solid #3182f6",
                    backgroundColor: "#f0f6ff",
                    color: "#3182f6",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  수정하기
                </button>
              </div>
            )}
          </div>
        )}
      </BottomSheet>

      {/* 하단 고정: 리뷰 작성 버튼 */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "16px 20px calc(16px + env(safe-area-inset-bottom))",
          backgroundColor: "rgba(248,249,250,0.95)",
          backdropFilter: "blur(12px)",
          borderTop: "1px solid #f2f4f6",
        }}
      >
        <button
          className="write-btn"
          onClick={onWriteReview}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: "14px",
            border: "none",
            backgroundColor: "#3182f6",
            color: "#ffffff",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow: "0 4px 12px rgba(49,130,246,0.3)",
          }}
        >
          + 리뷰 작성하기
        </button>
      </div>
    </div>
  )
}

export default WineDetailPage
