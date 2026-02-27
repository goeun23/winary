import { LocalReview } from "@/types/review"
import { BottomSheet, Button, Text } from "@toss/tds-mobile"
import { getReviews, canEdit, getMyToken } from "../../services/reviewService"
type ReviewBottomSheetProps = {
  open: boolean
  onClose: (open: boolean) => void
  selectedReview: LocalReview | null
  handleEdit: (review: LocalReview) => void
  header: React.ReactNode
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
  <>
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
  </>
)

const ReviewBottomSheet = ({
  open,
  onClose,
  selectedReview,
  handleEdit,
}: ReviewBottomSheetProps) => {
  return (
    <BottomSheet
      open={open}
      onClose={() => onClose(false)}
      header={
        <BottomSheet.Header>
          <></>
        </BottomSheet.Header>
      }
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
              {selectedReview.nickname || "와인도둑"}
            </Text>
            <Text style={{ fontSize: "12px", color: "#b0b8c1" }}>
              {new Date(selectedReview.createdAt).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
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
              <div style={{ display: "flex", gap: "2px", marginBottom: "2px" }}>
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
              ></Text>
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

          {/* 수정하기 버튼 (내 리뷰 + 1시간 이내)
          canEdit(selectedReview.id) && (
            <Button
              size="small"
              onClick={() => {
                onClose(false)
                handleEdit(selectedReview)
              }}
            >
              수정
            </Button>
          )
          */}
          {}
        </div>
      )}
    </BottomSheet>
  )
}

export default ReviewBottomSheet
