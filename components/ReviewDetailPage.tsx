"use client"

import { useState } from "react"
import { Text } from "@toss/tds-mobile"
import { useRouter } from "next/navigation"
import type { ReviewItem, CommentItem } from "@/types/review"
import { submitComment } from "@/services/reviewService"

const TAG_EMOJI_MAP: Record<string, string> = {
  Cherry: "🍒",
  Blackberry: "🫐",
  Vanilla: "🍦",
  Oak: "🪵",
  Leather: "👜",
  Tobacco: "🍂",
  Citrus: "🍊",
  Floral: "🌸",
  Spice: "🌶️",
  Chocolate: "🍫",
}

const WINE_TYPE_COLOR: Record<string, string> = {
  Red: "#8B1A1A",
  White: "#D4A843",
  Rosé: "#E8899E",
  Sparkling: "#C4A35A",
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
            transition: "background-color 0.3s ease",
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

interface ReviewDetailPageProps {
  review: ReviewItem
  initialComments?: CommentItem[]
}

const ReviewDetailPage = ({
  review,
  initialComments = [],
}: ReviewDetailPageProps) => {
  const router = useRouter()
  const [comments, setComments] = useState<CommentItem[]>(initialComments)
  const [nickname, setNickname] = useState("")
  const [commentText, setCommentText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmitComment = async () => {
    if (!commentText.trim() || !nickname.trim()) return
    if (isSubmitting) return
    setIsSubmitting(true)

    const AVATAR_EMOJIS = [
      "🍷",
      "🥂",
      "🍇",
      "🍾",
      "🫧",
      "🌿",
      "🍒",
      "🍊",
      "🌸",
      "💜",
    ]
    const avatarEmoji =
      AVATAR_EMOJIS[Math.floor(Math.random() * AVATAR_EMOJIS.length)]

    // 낙관적 업데이트: 로컬에 먼저 추가
    const optimisticComment: CommentItem = {
      id: `temp-${Date.now()}`,
      reviewId: review.id,
      nickname: nickname.trim(),
      avatarEmoji,
      content: commentText.trim(),
      createdAt: new Date().toISOString().slice(0, 16).replace("T", " "),
    }

    setComments((prev) => [...prev, optimisticComment])
    setCommentText("")

    try {
      await submitComment(review.id, nickname.trim(), commentText.trim())
    } catch {
      // Supabase 미설정 시에도 로컬 낙관적 업데이트는 유지
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      style={{
        backgroundColor: "#f9fafb",
        minHeight: "100vh",
        fontFamily: "Pretendard, -apple-system, sans-serif",
        paddingBottom: "100px",
      }}
    >
      {/* 상단 이미지 히어로 섹션 */}
      <div
        style={{
          position: "relative",
          height: "320px",
          overflow: "hidden",
        }}
      >
        <img
          src={
            review.imageUrl ||
            "https://images.unsplash.com/photo-1510850477530-ce740d041d6a?auto=format&fit=crop&q=80&w=400"
          }
          alt={review.wineName}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "brightness(0.85)",
          }}
        />
        {/* 오버레이 그라데이션 */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 30%, transparent 50%, rgba(0,0,0,0.65) 100%)",
          }}
        />

        {/* 뒤로가기 버튼 */}
        <button
          onClick={() => router.back()}
          style={{
            position: "absolute",
            top: "16px",
            left: "16px",
            background: "rgba(255,255,255,0.2)",
            backdropFilter: "blur(10px)",
            border: "none",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            fontSize: "20px",
            cursor: "pointer",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.2s ease",
          }}
        >
          ←
        </button>

        {/* 와인 기본 정보 */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "24px 20px",
            color: "white",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "8px",
            }}
          >
            <span
              style={{
                padding: "4px 10px",
                borderRadius: "6px",
                backgroundColor: WINE_TYPE_COLOR[review.wineType] || "#3182f6",
                fontSize: "12px",
                fontWeight: 700,
                color: "#fff",
              }}
            >
              {review.wineType}
            </span>
            <Text
              style={{
                fontSize: "13px",
                color: "rgba(255,255,255,0.85)",
              }}
            >
              {review.vintage} · {review.wineRegion}
            </Text>
          </div>
          <Text
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "#fff",
              lineHeight: "1.3",
            }}
          >
            {review.wineName}
          </Text>
        </div>
      </div>

      {/* 컨텐츠 영역 */}
      <div style={{ padding: "24px 20px" }}>
        {/* 평점 카드 */}
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <Text
              style={{
                fontSize: "42px",
                fontWeight: "bold",
                color: "#3182f6",
                lineHeight: "1",
                display: "block",
              }}
            >
              {review.rating}
            </Text>
            <div style={{ marginTop: "4px" }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  style={{
                    fontSize: "16px",
                    color: star <= review.rating ? "#3182f6" : "#d1d5db",
                  }}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
          <div
            style={{
              width: "1px",
              height: "48px",
              backgroundColor: "#f2f4f6",
            }}
          />
          <div>
            <Text
              style={{
                fontSize: "15px",
                fontWeight: 600,
                color: "#191f28",
                display: "block",
                marginBottom: "4px",
              }}
            >
              {
                [
                  "",
                  "아쉬워요",
                  "그저 그래요",
                  "괜찮아요",
                  "좋아요!",
                  "최고예요!",
                ][review.rating]
              }
            </Text>
            <Text
              style={{
                fontSize: "13px",
                color: "#8b95a1",
              }}
            >
              {review.createdAt} 기록
            </Text>
          </div>
        </div>

        {/* 테이스팅 노트 */}
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}
        >
          <Text
            style={{
              fontSize: "17px",
              fontWeight: "bold",
              color: "#191f28",
              marginBottom: "20px",
              display: "block",
            }}
          >
            테이스팅 노트
          </Text>

          <CharacteristicBar label="당도" emoji="🍬" value={review.sweetness} />
          <CharacteristicBar label="산도" emoji="🍋" value={review.acidity} />
          <CharacteristicBar label="바디" emoji="💪" value={review.body} />
          <CharacteristicBar label="탄닌" emoji="🍇" value={review.tannin} />
        </div>

        {/* 향 태그 */}
        {review.tags.length > 0 && (
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "16px",
              padding: "24px",
              marginBottom: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            <Text
              style={{
                fontSize: "17px",
                fontWeight: "bold",
                color: "#191f28",
                marginBottom: "16px",
                display: "block",
              }}
            >
              감지된 향
            </Text>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {review.tags.map((tag) => (
                <div
                  key={tag}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "10px 16px",
                    borderRadius: "24px",
                    backgroundColor: "rgba(49, 130, 246, 0.06)",
                    border: "1px solid rgba(49, 130, 246, 0.15)",
                  }}
                >
                  <span style={{ fontSize: "15px" }}>
                    {TAG_EMOJI_MAP[tag] || "🌿"}
                  </span>
                  <Text
                    style={{
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "#3182f6",
                    }}
                  >
                    {tag}
                  </Text>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 코멘트 */}
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}
        >
          <Text
            style={{
              fontSize: "17px",
              fontWeight: "bold",
              color: "#191f28",
              marginBottom: "16px",
              display: "block",
            }}
          >
            내 생각
          </Text>
          <Text
            style={{
              fontSize: "15px",
              lineHeight: "1.7",
              color: "#4e5968",
              whiteSpace: "pre-wrap",
            }}
          >
            {review.comment}
          </Text>
        </div>

        {/* ─── 댓글 영역 ─── */}
        <div
          id="comments-section"
          style={{
            backgroundColor: "#fff",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}
        >
          {/* 댓글 헤더 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            <Text
              style={{
                fontSize: "17px",
                fontWeight: "bold",
                color: "#191f28",
              }}
            >
              💬 댓글
            </Text>
            <Text
              style={{
                fontSize: "13px",
                color: "#8b95a1",
                fontWeight: 500,
              }}
            >
              {comments.length}개
            </Text>
          </div>

          {/* 댓글 목록 */}
          {comments.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "32px 0",
              }}
            >
              <div style={{ fontSize: "32px", marginBottom: "12px" }}>🍷</div>
              <Text
                style={{
                  fontSize: "14px",
                  color: "#adb5bd",
                  lineHeight: "1.6",
                }}
              >
                아직 댓글이 없어요.
                <br />첫 번째 댓글을 남겨보세요!
              </Text>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {comments.map((comment, index) => (
                <div
                  key={comment.id}
                  style={{
                    padding: "16px 0",
                    borderTop: index === 0 ? "none" : "1px solid #f2f4f6",
                    animation: "fadeIn 0.3s ease",
                  }}
                >
                  {/* 댓글 상단: 아바타 + 닉네임 + 시간 */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "8px",
                    }}
                  >
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        backgroundColor: "#f2f4f6",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "16px",
                        flexShrink: 0,
                      }}
                    >
                      {comment.avatarEmoji}
                    </div>
                    <div style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: "14px",
                          fontWeight: 600,
                          color: "#191f28",
                          display: "block",
                        }}
                      >
                        {comment.nickname}
                      </Text>
                    </div>
                    <Text
                      style={{
                        fontSize: "12px",
                        color: "#adb5bd",
                        flexShrink: 0,
                      }}
                    >
                      {comment.createdAt}
                    </Text>
                  </div>
                  {/* 댓글 본문 */}
                  <Text
                    style={{
                      fontSize: "14px",
                      lineHeight: "1.6",
                      color: "#4e5968",
                      paddingLeft: "42px",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                  >
                    {comment.content}
                  </Text>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ─── 하단 고정 댓글 입력 영역 ─── */}
      <div
        id="comment-input-bar"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "#fff",
          borderTop: "1px solid #f2f4f6",
          padding: "12px 16px",
          paddingBottom: "calc(12px + env(safe-area-inset-bottom))",
          zIndex: 100,
          boxShadow: "0 -2px 12px rgba(0,0,0,0.04)",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "8px",
            alignItems: "flex-end",
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          {/* 닉네임 입력 */}
          <input
            id="comment-nickname-input"
            type="text"
            placeholder="닉네임"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            maxLength={10}
            style={{
              width: "80px",
              flexShrink: 0,
              padding: "10px 12px",
              borderRadius: "12px",
              border: "1px solid #e5e8eb",
              backgroundColor: "#f9fafb",
              fontSize: "14px",
              color: "#191f28",
              outline: "none",
              transition: "border-color 0.2s",
              fontFamily: "inherit",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#3182f6")}
            onBlur={(e) => (e.target.style.borderColor = "#e5e8eb")}
          />
          {/* 댓글 내용 입력 */}
          <input
            id="comment-content-input"
            type="text"
            placeholder="댓글을 입력하세요..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                e.preventDefault()
                handleSubmitComment()
              }
            }}
            style={{
              flex: 1,
              padding: "10px 14px",
              borderRadius: "12px",
              border: "1px solid #e5e8eb",
              backgroundColor: "#f9fafb",
              fontSize: "14px",
              color: "#191f28",
              outline: "none",
              transition: "border-color 0.2s",
              fontFamily: "inherit",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#3182f6")}
            onBlur={(e) => (e.target.style.borderColor = "#e5e8eb")}
          />
          {/* 전송 버튼 */}
          <button
            id="comment-submit-button"
            onClick={handleSubmitComment}
            disabled={!commentText.trim() || !nickname.trim() || isSubmitting}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              border: "none",
              backgroundColor:
                commentText.trim() && nickname.trim() ? "#3182f6" : "#e5e8eb",
              color: "#fff",
              fontSize: "18px",
              cursor:
                commentText.trim() && nickname.trim()
                  ? "pointer"
                  : "not-allowed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "all 0.2s ease",
            }}
          >
            {isSubmitting ? "···" : "↑"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReviewDetailPage
