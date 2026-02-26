import { Text } from "@toss/tds-mobile"
import type { ReviewItem } from "../types/review"
import PageHeader from "../components/PageHeader"

/**
 * 리뷰 상세 페이지
 * 선택한 리뷰의 전체 정보를 확인할 수 있습니다.
 */

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

const ReviewDetailPage = ({
  review,
  onBack,
}: {
  review: ReviewItem
  onBack: () => void
}) => {
  return (
    <div
      style={{
        backgroundColor: "#f9fafb",
        minHeight: "100vh",
        fontFamily: "Pretendard, -apple-system, sans-serif",
      }}
    >
      {/* 공통 헤더 */}
      <PageHeader title="리뷰 상세" onBack={onBack} />

      {/* 상단 이미지 히어로 섹션 */}
      <div
        style={{
          position: "relative",
          height: "280px",
          overflow: "hidden",
        }}
      >
        <img
          src={review.imageUrl}
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
      </div>
    </div>
  )
}

export default ReviewDetailPage
