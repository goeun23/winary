"use client"

import {
  Border,
  BottomCTA,
  BottomSheet,
  Button,
  List,
  ListHeader,
  ListRow,
  TableRow,
  Text,
  TextArea,
} from "@toss/tds-mobile"
import type { ReviewFormData } from "@/types/review"
import { useState } from "react"
import { adaptive } from "@toss/tds-colors"
import PageLayout from "@/components/PageLayout"

interface ReviewTasteViewProps {
  formData: ReviewFormData
  onUpdate: (updates: Partial<ReviewFormData>) => void
  onBack: () => void
  onNext: (finalData: ReviewFormData) => void
}

const ReviewTasteView = ({
  formData,
  onUpdate,
  onBack,
  onNext,
}: ReviewTasteViewProps) => {
  if (!formData) return null

  const [isOpen, setIsOpen] = useState(false)
  const [activeCharacteristic, setActiveCharacteristic] = useState<{
    label: string
    key: keyof ReviewFormData
  } | null>(null)
  const [comment, setComment] = useState(formData.comment ?? "")

  const handleCharacteristicClick = (item: {
    label: string
    key: string
    emoji: string
  }) => {
    setActiveCharacteristic({
      label: item.label,
      key: item.key as keyof ReviewFormData,
    })
    setIsOpen(true)
  }

  const handleSubmit = () => {
    onNext({ ...formData, comment })
  }

  return (
    <PageLayout title="맛과 생각 기록 (2/3)" onBack={onBack}>
      <div style={{ display: "flex", gap: "20px", flexDirection: "column" }}>
        {/* 선택한 와인 정보 간략 표시 */}
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
            style={{ paddingLeft: 0, paddingRight: 0 }}
          />
          <TableRow
            align="space-between"
            left="선택한 와인"
            right={formData.wineName}
          />
          <TableRow
            align="space-between"
            left="원산지"
            right={formData.wineRegion}
          />
          <TableRow
            align="space-between"
            left="유형"
            right={formData.wineType}
          />
          <TableRow
            align="space-between"
            left="도수"
            right={formData.wineAbv ? `${formData.wineAbv}%` : "-"}
            style={{ paddingLeft: 0, paddingRight: 0 }}
          />
        </div>
      </div>
      <div id="wine-review-container">
        <Border variant="height16" />
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
          style={{ paddingLeft: 0, paddingRight: 0 }}
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
                  {formData[item.key as keyof ReviewFormData]}
                  <span style={{ color: "#adb5bd", fontSize: "12px" }}>
                    &gt;
                  </span>
                </div>
              }
            />
          ))}
        </List>
      </div>

      <div id="optional-review-container">
        <TextArea
          variant="box"
          height="150px"
          placeholder="(Optional) 개별 리뷰를 작성하세요."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      <div style={{ padding: 16 }}>
        <BottomSheet
          open={isOpen}
          onClose={() => setIsOpen(false)}
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
                const value = Number(e.target.value)
                onUpdate({ [activeCharacteristic.key]: value })
                setIsOpen(false)
              }}
              value={String(formData[activeCharacteristic.key])}
              options={[1, 2, 3, 4, 5].map((v) => ({
                name: String(v),
                value: String(v),
              }))}
            />
          )}
        </BottomSheet>
      </div>

      {/* 하단 고정 버튼 */}
      <BottomCTA.Double
        leftButton={
          <Button color="dark" variant="weak" onClick={onBack}>
            뒤로
          </Button>
        }
        rightButton={
          <Button color="primary" onClick={handleSubmit}>
            등록하기
          </Button>
        }
      />
    </PageLayout>
  )
}

export default ReviewTasteView
