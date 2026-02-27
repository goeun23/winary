"use client"
import { useState } from "react"
import Text from "@/components/common/Text"
import BottomSheet from "@/components/common/BottomSheet"
import ListRow from "@/components/common/List/ListRow"
import Button from "@/components/common/Button"

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
      onClose()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Custom Modal for Modify Dialog */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 3000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          backgroundColor: "rgba(0,0,0,0.5)",
          animation: "fadeIn 0.2s ease-out",
        }}
        onClick={onClose}
      >
        <style>{`
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideUp {
                from { transform: translateY(20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        `}</style>
        <div
          style={{
            width: "100%",
            maxWidth: "400px",
            backgroundColor: "#ffffff",
            borderRadius: "24px",
            padding: "24px",
            animation: "slideUp 0.3s cubic-bezier(0, 0, 0.2, 1)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <Text
            typography="t4"
            fontWeight="bold"
            style={{ display: "block", marginBottom: "8px" }}
          >
            와인 정보를 수정해주세요
          </Text>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              marginBottom: "20px",
            }}
          >
            <ListRow
              contents={
                <Text typography="t7" color="var(--adaptiveGrey700)">
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
                    color: "var(--adaptiveGrey900)",
                    backgroundColor: "transparent",
                    width: "140px",
                  }}
                />
              }
              style={{ padding: "12px 0" }}
            />
            <ListRow
              contents={
                <Text typography="t7" color="var(--adaptiveGrey700)">
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
                    color: "var(--adaptiveGrey900)",
                    backgroundColor: "transparent",
                    width: "140px",
                  }}
                />
              }
              style={{ padding: "12px 0" }}
            />
            <ListRow
              onClick={() => setIsAreaSheetOpen(true)}
              contents={
                <Text typography="t7" color="var(--adaptiveGrey700)">
                  원산지
                </Text>
              }
              right={
                <div
                  style={{ display: "flex", alignItems: "center", gap: "4px" }}
                >
                  <Text typography="t7" fontWeight="600">
                    {area}
                  </Text>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M9 6L15 12L9 18"
                      stroke="var(--adaptiveGrey300)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              }
              style={{ padding: "12px 0" }}
            />
            <ListRow
              onClick={() => setIsCategorySheetOpen(true)}
              contents={
                <Text typography="t7" color="var(--adaptiveGrey700)">
                  종류
                </Text>
              }
              right={
                <div
                  style={{ display: "flex", alignItems: "center", gap: "4px" }}
                >
                  <Text typography="t7" fontWeight="600">
                    {CATEGORY_LABELS[
                      category as keyof typeof CATEGORY_LABELS
                    ] ?? category}
                  </Text>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M9 6L15 12L9 18"
                      stroke="var(--adaptiveGrey300)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              }
              style={{ padding: "12px 0" }}
            />
            <ListRow
              contents={
                <Text typography="t7" color="var(--adaptiveGrey700)">
                  도수 (%)
                </Text>
              }
              right={
                <input
                  type="number"
                  step="0.1"
                  value={abv}
                  onChange={(e) => setAbv(e.target.value)}
                  placeholder={String(wine.WINE_ABV)}
                  style={{
                    border: "none",
                    outline: "none",
                    textAlign: "right",
                    fontSize: "15px",
                    color: "var(--adaptiveGrey900)",
                    backgroundColor: "transparent",
                    width: "80px",
                  }}
                />
              }
              style={{ padding: "12px 0" }}
            />
            <ListRow
              contents={
                <Text typography="t7" color="var(--adaptiveGrey700)">
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
                    color: "var(--adaptiveGrey900)",
                    backgroundColor: "transparent",
                    width: "120px",
                  }}
                />
              }
              style={{ padding: "12px 0" }}
            />
          </div>

          <Text
            typography="st2"
            color="var(--adaptiveGrey500)"
            style={{ display: "block", marginBottom: "24px" }}
          >
            소중한 의견을 바탕으로 더 정확한 서비스를 만들게요.
          </Text>

          <div style={{ display: "flex", gap: "8px" }}>
            <Button variant="secondary" fullWidth onClick={onClose}>
              취소
            </Button>
            <Button fullWidth onClick={handleConfirm} disabled={isLoading}>
              {isLoading ? "저장 중..." : "확인"}
            </Button>
          </div>
        </div>
      </div>

      <BottomSheet
        open={isAreaSheetOpen}
        onClose={() => setIsAreaSheetOpen(false)}
        header="원산지 선택"
        options={WINE_AREA.map((a) => ({
          label: a,
          value: a,
          onClick: () => {
            setArea(a)
            setIsAreaSheetOpen(false)
          },
        }))}
      />

      <BottomSheet
        open={isCategorySheetOpen}
        onClose={() => setIsCategorySheetOpen(false)}
        header="종류 선택"
        options={Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
          label,
          value,
          onClick: () => {
            setCategory(value as any)
            setIsCategorySheetOpen(false)
          },
        }))}
      />
    </>
  )
}
