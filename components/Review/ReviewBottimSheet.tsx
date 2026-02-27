import { LocalReview } from "@/types/review"
import BottomSheet from "@/components/common/BottomSheet"
import Button from "@/components/common/Button"
import Text from "@/components/common/Text"

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
        <Text typography="st2" fontWeight="600" color="var(--adaptiveGrey700)">
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
              backgroundColor:
                level <= value
                  ? "var(--adaptiveBlue500)"
                  : "var(--adaptiveGrey200)",
            }}
          />
        ))}
      </div>
      <Text
        typography="st2"
        fontWeight="bold"
        color="var(--adaptiveBlue500)"
        style={{
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
}: ReviewBottomSheetProps) => {
  return (
    <BottomSheet open={open} onClose={() => onClose(false)}>
      {selectedReview && (
        <div style={{ padding: "0 4px 24px" }}>
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
              typography="t7"
              fontWeight="700"
              color="var(--adaptiveGrey900)"
            >
              {selectedReview.nickname || "와인도둑"}
            </Text>
            <Text typography="st2" color="var(--adaptiveGrey400)">
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
              typography="t2"
              fontWeight="bold"
              color="var(--adaptiveBlue500)"
              style={{
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
                        star <= selectedReview.rating
                          ? "var(--adaptiveBlue500)"
                          : "var(--adaptiveGrey200)",
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>
              <Text typography="st2" color="var(--adaptiveGrey500)">
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
              backgroundColor: "var(--adaptiveGrey50)",
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
                backgroundColor: "var(--adaptiveGrey50)",
                borderRadius: "14px",
                padding: "16px",
                marginBottom: "16px",
              }}
            >
              <Text
                typography="st2"
                style={{
                  lineHeight: "1.7",
                  color: "var(--adaptiveGrey700)",
                  whiteSpace: "pre-wrap",
                }}
              >
                {selectedReview.comment}
              </Text>
            </div>
          )}
        </div>
      )}
    </BottomSheet>
  )
}

export default ReviewBottomSheet
