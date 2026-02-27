"use client"
import { useState } from "react"
import {
  AlertDialog,
  TextField,
  ListRow,
  BottomSheet,
  Text,
  TableRow,
  List,
} from "@toss/tds-mobile"
import { adaptive } from "@toss/tds-colors"
import type { WineInfoLocal } from "../../types/wine"
import { CATEGORY_LABELS, WINE_AREA } from "../../types/wine"
import { upsertWineOverride } from "../../services/reviewService"

interface ModifyWineInfoDialogProps {
  isOpen: boolean
  onClose: () => void
  wine: WineInfoLocal
  onConfirm: (updated: WineInfoLocal) => void
}

export const ModifyWineInfoDialog = ({
  isOpen,
  onClose,
  wine,
  onConfirm,
}: ModifyWineInfoDialogProps) => {
  const [wineName, setWineName] = useState(wine.WINE_NM)
  const [wineNameKr, setWineNameKr] = useState(wine.WINE_NM_KR)
  const [area, setArea] = useState(wine.WINE_AREA)
  const [category, setCategory] = useState(wine.WINE_CATEGORY)
  const [abv, setAbv] = useState(String(wine.WINE_ABV))
  const [price, setPrice] = useState(String(wine.WINE_PRC))
  const [isAreaSheetOpen, setIsAreaSheetOpen] = useState(false)
  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  const handleConfirm = async () => {
    setIsLoading(true)
    try {
      const updated: WineInfoLocal = {
        WINE_ID: wine.WINE_ID,
        WINE_NM: wineName.trim() || wine.WINE_NM,
        WINE_NM_KR: wineNameKr.trim() || wine.WINE_NM_KR,
        WINE_AREA: area,
        WINE_CATEGORY: category,
        WINE_ABV: Number(abv) || wine.WINE_ABV,
        WINE_PRC: Number(price) || wine.WINE_PRC,
      }
      await upsertWineOverride(wine.WINE_ID, updated)
      onConfirm(updated)
    } catch {
      // 실패 시 조용히 닫기 (다음 방문 때 재시도 가능)
      onClose()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <AlertDialog
        open={true}
        onClose={onClose}
        title="와인 정보를 수정해주세요"
        description={
          <List>
            <ListRow
              contents={
                <Text typography="t6" color={adaptive.grey700}>
                  영문명
                </Text>
              }
              right={
                <input
                  value={wineName}
                  onChange={(e) => setWineName(e.target.value)}
                  placeholder={wine.WINE_NM}
                  style={{
                    border: "none",
                    outline: "none",
                    textAlign: "right",
                    fontSize: "15px",
                    color: adaptive.grey900,
                    backgroundColor: "transparent",
                    width: "160px",
                  }}
                />
              }
              style={{
                paddingTop: "6px",
                paddingBottom: "6px",
                paddingLeft: 0,
                paddingRight: 0,
              }}
            />
            <ListRow
              contents={
                <Text typography="t6" color={adaptive.grey700}>
                  한글명
                </Text>
              }
              right={
                <input
                  value={wineNameKr}
                  onChange={(e) => setWineNameKr(e.target.value)}
                  placeholder={wine.WINE_NM_KR}
                  style={{
                    border: "none",
                    outline: "none",
                    textAlign: "right",
                    fontSize: "15px",
                    color: adaptive.grey900,
                    backgroundColor: "transparent",
                    width: "160px",
                  }}
                />
              }
              style={{
                paddingTop: "6px",
                paddingBottom: "6px",
                paddingLeft: 0,
                paddingRight: 0,
              }}
            />
            <ListRow
              onClick={() => setIsAreaSheetOpen(true)}
              contents={
                <Text typography="t6" color={adaptive.grey700}>
                  원산지
                </Text>
              }
              style={{
                paddingTop: "6px",
                paddingBottom: "6px",
                paddingLeft: 0,
                paddingRight: 0,
              }}
              right={
                <div
                  style={{ display: "flex", alignItems: "center", gap: "4px" }}
                >
                  <Text typography="t6" color={adaptive.grey600}>
                    {area}
                  </Text>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M9 6L15 12L9 18"
                      stroke="#b0b8c1"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              }
            />
            <ListRow
              onClick={() => setIsCategorySheetOpen(true)}
              contents={
                <Text typography="t6" color={adaptive.grey700}>
                  종류
                </Text>
              }
              style={{
                paddingTop: "6px",
                paddingBottom: "6px",
                paddingLeft: 0,
                paddingRight: 0,
              }}
              right={
                <div
                  style={{ display: "flex", alignItems: "center", gap: "4px" }}
                >
                  <Text typography="t6" color={adaptive.grey600}>
                    {CATEGORY_LABELS[
                      category as keyof typeof CATEGORY_LABELS
                    ] ?? category}
                  </Text>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M9 6L15 12L9 18"
                      stroke="#b0b8c1"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              }
            />
            <ListRow
              contents={
                <Text typography="t6" color={adaptive.grey700}>
                  도수 (%)
                </Text>
              }
              right={
                <input
                  type="number"
                  value={abv}
                  onChange={(e) => setAbv(e.target.value)}
                  placeholder={String(wine.WINE_ABV)}
                  style={{
                    border: "none",
                    outline: "none",
                    textAlign: "right",
                    fontSize: "15px",
                    color: adaptive.grey900,
                    backgroundColor: "transparent",
                    width: "80px",
                  }}
                />
              }
              style={{
                paddingTop: "6px",
                paddingBottom: "6px",
                paddingLeft: 0,
                paddingRight: 0,
              }}
            />
            <ListRow
              contents={
                <Text typography="t6" color={adaptive.grey700}>
                  가격 (₩)
                </Text>
              }
              right={
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder={String(wine.WINE_PRC)}
                  style={{
                    border: "none",
                    outline: "none",
                    textAlign: "right",
                    fontSize: "15px",
                    color: adaptive.grey900,
                    backgroundColor: "transparent",
                    width: "120px",
                  }}
                />
              }
              style={{
                paddingTop: "6px",
                paddingBottom: "6px",
                paddingLeft: 0,
                paddingRight: 0,
              }}
            />
            <Text
              typography="t6"
              color={adaptive.grey500}
              style={{ marginTop: "2px" }}
            >
              소중한 의견을 바탕으로 더 정확한 서비스를 만들게요.
            </Text>
          </List>
        }
        alertButton={
          <AlertDialog.AlertButton onClick={handleConfirm} disabled={isLoading}>
            {isLoading ? "저장 중..." : "확인"}
          </AlertDialog.AlertButton>
        }
      />

      {/* 원산지 선택 */}
      <BottomSheet
        open={isAreaSheetOpen}
        onClose={() => setIsAreaSheetOpen(false)}
        header={<BottomSheet.Header>원산지 선택</BottomSheet.Header>}
      >
        <BottomSheet.Select
          value={area}
          onChange={(e) => {
            setArea(e.target.value)
            setIsAreaSheetOpen(false)
          }}
          options={WINE_AREA.map((a) => ({ name: a, value: a }))}
        />
      </BottomSheet>

      {/* 종류 선택 */}
      <BottomSheet
        open={isCategorySheetOpen}
        onClose={() => setIsCategorySheetOpen(false)}
        header={<BottomSheet.Header>종류 선택</BottomSheet.Header>}
      >
        <BottomSheet.Select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value)
            setIsCategorySheetOpen(false)
          }}
          options={Object.entries(CATEGORY_LABELS).map(([value, name]) => ({
            name,
            value,
          }))}
        />
      </BottomSheet>
    </>
  )
}
