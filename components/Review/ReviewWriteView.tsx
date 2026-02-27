import { createClient } from "@/supabase/server"
import { toReviewItem, type ReviewRow } from "@/types/supabase"
import { adaptive } from "@toss/tds-colors"
import { MOCK_REVIEWS, MOCK_COMMENTS } from "@/data/mockReviews"

import { useState, useMemo } from "react"
import {
  Button,
  Text,
  TableRow,
  ListHeader,
  List,
  ListRow,
  BottomSheet,
} from "@toss/tds-mobile"
import PageLayout from "@/components/PageLayout"

import { join } from "path"
import type { WineInfoLocal } from "@/types/wine"
import type { LocalReview } from "@/types/review"
import { CATEGORY_LABELS } from "@/types/wine"
import { createReview, updateReview } from "@/services/reviewService"

interface ReviewWriteViewProps {
  wine: WineInfoLocal
  onBack: () => void
  onSubmit: () => void
  editReview?: LocalReview
  editToken?: string
}

const ReviewWriteView = ({
  wine,
  onBack,
  onSubmit,
  editReview,
  editToken,
}: ReviewWriteViewProps) => {
  const isEditMode = !!editReview

  const [rating, setRating] = useState(editReview?.rating ?? 0)
  const [body, setBody] = useState(editReview?.body ?? 3)
  const [sweetness, setSweetness] = useState(editReview?.sweetness ?? 2)
  const [acidity, setAcidity] = useState(editReview?.acidity ?? 3)
  const [tannin, setTannin] = useState(editReview?.tannin ?? 3)
  const [comment, setComment] = useState(editReview?.comment ?? "")
  const [submitted, setSubmitted] = useState(false)

  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [activeCharacteristic, setActiveCharacteristic] = useState<{
    label: string
    key: string
  } | null>(null)

  const characteristicValues: Record<string, number> = {
    body,
    sweetness,
    acidity,
    tannin,
  }
  const setCharacteristicValue = (key: string, value: number) => {
    if (key === "body") setBody(value)
    else if (key === "sweetness") setSweetness(value)
    else if (key === "acidity") setAcidity(value)
    else if (key === "tannin") setTannin(value)
  }

  const handleCharacteristicClick = (item: { label: string; key: string }) => {
    setActiveCharacteristic(item)
    setIsSheetOpen(true)
  }

  const isSubmitDisabled = useMemo(() => rating === 0, [rating])

  const handleSubmit = async () => {
    if (rating === 0) return
    if (isEditMode && editToken) {
      await updateReview(
        editReview.id,
        editToken,
        rating,
        body,
        sweetness,
        acidity,
        tannin,
        comment,
      )
    } else {
      await createReview(
        wine.WINE_ID,
        rating,
        body,
        sweetness,
        acidity,
        tannin,
        comment,
      )
    }
    setSubmitted(true)
    setTimeout(() => onSubmit(), 1800)
  }

  if (submitted) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f9fafb",
          gap: "16px",
          animation: "fadeIn 0.5s ease",
        }}
      >
        <style>{`
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes bounceIn {
            0% { transform: scale(0.3); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
        `}</style>
        <div style={{ fontSize: "64px", animation: "bounceIn 0.6s ease" }}>
          🎉
        </div>
        <Text
          style={{ fontSize: "22px", fontWeight: "bold", color: "#191f28" }}
        >
          {isEditMode ? "수정했어요!" : "리뷰를 등록했어요!"}
        </Text>
        <Text style={{ fontSize: "15px", color: "#8b95a1" }}>
          {isEditMode ? "" : "1시간 이내에 수정할 수 있어요"}
        </Text>
      </div>
    )
  }

  return (
    <PageLayout
      title={isEditMode ? "리뷰 수정" : "맛과 생각 기록"}
      onBack={onBack}
    >
      <div style={{ display: "flex", gap: "30px", flexDirection: "column" }}>
        {/* 선택한 와인 정보 */}
        <div>
          <ListHeader
            title={
              <ListHeader.TitleParagraph
                typography="t7"
                color={adaptive.grey800}
                fontWeight="bold"
              >
                와인정보
              </ListHeader.TitleParagraph>
            }
            rightAlignment="center"
            descriptionPosition="bottom"
          />
          <TableRow
            align="space-between"
            left="선택한 와인"
            right={wine.WINE_NM_KR || wine.WINE_NM}
          />
          <TableRow align="space-between" left="영문명" right={wine.WINE_NM} />
          <TableRow
            align="space-between"
            left="원산지"
            right={wine.WINE_AREA || "-"}
          />
          <TableRow
            align="space-between"
            left="유형"
            right={
              CATEGORY_LABELS[
                wine.WINE_CATEGORY as keyof typeof CATEGORY_LABELS
              ] ?? wine.WINE_CATEGORY
            }
          />
          {wine.WINE_ABV > 0 && (
            <TableRow
              align="space-between"
              left="도수"
              right={`${wine.WINE_ABV}%`}
            />
          )}
        </div>
      </div>

      <div style={{ padding: "12px 0" }}>
        {/* 평점 섹션 - 기존 ReviewCreatePage 패턴 유지 */}
        <section style={{ marginBottom: "32px" }}>
          <Text
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              marginBottom: "16px",
              display: "block",
              color: "#191f28",
            }}
          >
            오늘 마신 와인, 어땠어요?
          </Text>
          <div
            style={{ display: "flex", gap: "8px", justifyContent: "center" }}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                style={{
                  fontSize: "40px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: star <= rating ? "#3182f6" : "#d1d5db",
                  transition: "all 0.15s ease",
                  transform: star <= rating ? "scale(1.1)" : "scale(1)",
                }}
              >
                ★
              </button>
            ))}
          </div>
          {rating > 0 && (
            <Text
              style={{
                textAlign: "center",
                fontSize: "14px",
                color: "#3182f6",
                fontWeight: 600,
                marginTop: "8px",
                display: "block",
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
                ][rating]
              }
            </Text>
          )}
        </section>

        {/* 4가지 특성 - ReviewTasteView와 동일한 BottomSheet 방식 */}
        <div id="wine-review-container">
          <ListHeader
            title={
              <ListHeader.TitleParagraph
                typography="t7"
                color={adaptive.grey800}
                fontWeight="bold"
              >
                종합평가
              </ListHeader.TitleParagraph>
            }
            rightAlignment="center"
            descriptionPosition="bottom"
          />
          <List>
            {[
              { label: "당도", key: "sweetness", emoji: "🍬" },
              { label: "산도", key: "acidity", emoji: "🍋" },
              { label: "바디", key: "body", emoji: "💪" },
              { label: "탄닌", key: "tannin", emoji: "🍇" },
            ].map((item) => (
              <ListRow
                key={item.key}
                onClick={() => handleCharacteristicClick(item)}
                contents={
                  <ListRow.Texts
                    type="1RowTypeA"
                    top={`${item.emoji} ${item.label}`}
                  />
                }
                right={
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      color: "#3182f6",
                      fontWeight: "bold",
                      fontSize: "15px",
                    }}
                  >
                    {characteristicValues[item.key]}
                    <span style={{ color: "#adb5bd", fontSize: "12px" }}>
                      &gt;
                    </span>
                  </div>
                }
              />
            ))}
          </List>
        </div>

        <div style={{ padding: "0 16px" }}>
          <BottomSheet
            open={isSheetOpen}
            onClose={() => setIsSheetOpen(false)}
            header={
              <BottomSheet.Header>
                {activeCharacteristic
                  ? `${activeCharacteristic.label}를 선택해주세요.`
                  : "값을 선택해주세요."}
              </BottomSheet.Header>
            }
          >
            {activeCharacteristic && (
              <BottomSheet.Select
                onChange={(e) => {
                  setCharacteristicValue(
                    activeCharacteristic.key,
                    Number(e.target.value),
                  )
                  setIsSheetOpen(false)
                }}
                value={String(characteristicValues[activeCharacteristic.key])}
                options={[1, 2, 3, 4, 5].map((v) => ({
                  name: String(v),
                  value: String(v),
                }))}
              />
            )}
          </BottomSheet>
        </div>

        {/* 리뷰 텍스트 */}
        <section style={{ marginBottom: "32px" }}>
          <Text
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              marginBottom: "16px",
              display: "block",
              color: "#191f28",
            }}
          >
            내 생각 적기{" "}
            <span
              style={{ fontSize: "14px", color: "#8b95a1", fontWeight: 400 }}
            >
              (선택)
            </span>
          </Text>
          <textarea
            placeholder="와인을 마시며 느낀 점을 기록해보세요"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={300}
            style={{
              width: "100%",
              minHeight: "140px",
              padding: "16px",
              borderRadius: "14px",
              border: "1px solid #e5e8eb",
              fontSize: "16px",
              outline: "none",
              resize: "none",
              fontFamily: "inherit",
              backgroundColor: "#fff",
              transition: "border-color 0.2s ease",
              lineHeight: "1.6",
              boxSizing: "border-box",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#3182f6")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e8eb")}
          />
          <Text
            style={{
              fontSize: "12px",
              color: "#b0b8c1",
              marginTop: "8px",
              display: "block",
              textAlign: "right",
            }}
          >
            {comment.length} / 300자
          </Text>
        </section>
      </div>

      {/* 하단 고정 CTA */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "16px 24px",
          paddingBottom: "calc(16px + env(safe-area-inset-bottom))",
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(12px)",
          borderTop: "1px solid #f2f4f6",
          zIndex: 1000,
        }}
      >
        <Button
          size="large"
          disabled={isSubmitDisabled}
          onClick={handleSubmit}
          style={{ width: "100%" }}
        >
          {isEditMode ? "수정 완료" : "리뷰 등록할게요"}
        </Button>
      </div>
    </PageLayout>
  )
}
export default ReviewWriteView
