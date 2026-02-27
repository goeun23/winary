"use client"
import { useState, useEffect, useRef } from "react"
import Text from "@/components/common/Text"
import BottomSheet from "@/components/common/BottomSheet"
import Button from "@/components/common/Button"
import ListRow from "@/components/common/List/ListRow"
import { ListHeader } from "@/components/common/List/ListLayout"

import { searchAllWines, saveCustomWine } from "../../services/reviewService"
import type { WineInfoLocal } from "../../types/wine"
import {
  WINE_CATEGORY_CONFIG,
  CATEGORY_LABELS,
  WINE_AREA,
  WineCategory,
} from "../../types/wine"
import PageLayout from "../PageLayout"
import WineCardList from "../common/WineCardList"
import WineTypeBadge from "../common/WineTypeBadge"

interface WineSearchViewProps {
  onBack: () => void
  onSelectWine: (wine: WineInfoLocal) => void
  onManualRegister: (
    name: string,
    origin: string,
    type: string,
    price: number,
    abv: number,
  ) => void
}

const SESSION_KEY = "wineSearchState"

function loadSavedState() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (raw)
      return JSON.parse(raw) as {
        searchTerm: string
        results: WineInfoLocal[]
        displayCount: number
      }
  } catch {}
  return null
}

const WineSearchView = ({
  onBack,
  onSelectWine,
  onManualRegister,
}: WineSearchViewProps) => {
  // lazy init
  const [searchTerm, setSearchTerm] = useState<string>(
    () => loadSavedState()?.searchTerm ?? "",
  )
  const [results, setResults] = useState<WineInfoLocal[]>(
    () => loadSavedState()?.results ?? [],
  )
  const [displayCount, setDisplayCount] = useState<number>(
    () => loadSavedState()?.displayCount ?? 20,
  )
  const [isFocused, setIsFocused] = useState(false)
  const [hasSearched, setHasSearched] = useState<boolean>(
    () => !!loadSavedState()?.searchTerm,
  )
  const [isManualEntry, setIsManualEntry] = useState(false)

  // 직접 입력 상태
  const [manualWineName, setManualWineName] = useState("")
  const [manualOrigin, setManualOrigin] = useState("Italy")
  const [manualPrice, setManualPrice] = useState("")
  const [manualAbv, setManualAbv] = useState("")
  const [manualWineType, setManualWineType] = useState<WineCategory>("RED")
  const [isOriginSheetOpen, setIsOriginSheetOpen] = useState(false)
  const [isWineTypeSheetOpen, setIsWineTypeSheetOpen] = useState(false)
  const [isSimilarSheetOpen, setIsSimilarSheetOpen] = useState(false)
  const [similarWines, setSimilarWines] = useState<WineInfoLocal[]>([])
  const [pendingManualWine, setPendingManualWine] =
    useState<WineInfoLocal | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)
  const manualInputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!searchTerm) inputRef.current?.focus()
  }, [])

  useEffect(() => {
    sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ searchTerm, results, displayCount }),
    )
  }, [searchTerm, results, displayCount])

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    if (!searchTerm.trim()) {
      setResults([])
      setHasSearched(false)
      setDisplayCount(20)
      return
    }

    debounceRef.current = setTimeout(async () => {
      const searchResults = await searchAllWines(searchTerm, 20)
      setResults(searchResults)
      setHasSearched(true)
      setDisplayCount(20)
    }, 300)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [searchTerm])

  const handleClear = () => {
    setSearchTerm("")
    setResults([])
    setHasSearched(false)
    setDisplayCount(20)
    sessionStorage.removeItem(SESSION_KEY)
    inputRef.current?.focus()
  }

  return (
    <PageLayout title="와인 검색" onBack={onBack}>
      <style>
        {`
          @keyframes pageFadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes itemFadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>

      {!isManualEntry && (
        <div style={{ position: "relative", marginBottom: "20px" }}>
          <div
            style={{
              position: "absolute",
              left: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              alignItems: "center",
              zIndex: 1,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                stroke={
                  isFocused
                    ? "var(--adaptiveBlue500)"
                    : "var(--adaptiveGrey400)"
                }
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="와인 이름을 검색하세요 (영문/한글)"
            style={{
              width: "100%",
              padding: "16px 48px 16px 44px",
              borderRadius: "14px",
              border: isFocused
                ? "2px solid var(--adaptiveBlue500)"
                : "2px solid transparent",
              backgroundColor: isFocused ? "#ffffff" : "var(--adaptiveGrey50)",
              fontSize: "16px",
              color: "var(--adaptiveGrey900)",
              outline: "none",
              boxSizing: "border-box",
              transition: "all 0.2s ease",
              boxShadow: isFocused
                ? "0 0 0 4px rgba(49, 130, 246, 0.1)"
                : "none",
            }}
          />
          {searchTerm && (
            <button
              onClick={handleClear}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "var(--adaptiveGrey100)",
                border: "none",
                borderRadius: "50%",
                width: "24px",
                height: "24px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.2s",
                zIndex: 1,
              }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M9 3L3 9M3 3L9 9"
                  stroke="var(--adaptiveGrey500)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}
        </div>
      )}

      {/* Results List or Manual Entry */}
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          flex: 1,
        }}
      >
        {isManualEntry ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              animation: "itemFadeIn 0.3s ease-out",
              padding: "0 4px",
            }}
          >
            {/* Custom TextField Implementation */}
            <div>
              <Text
                typography="t7"
                fontWeight="600"
                color="var(--adaptiveGrey600)"
                style={{ display: "block", marginBottom: "8px" }}
              >
                이름
              </Text>
              <input
                ref={manualInputRef}
                type="text"
                placeholder="와인 이름을 입력해주세요"
                value={manualWineName}
                onChange={(e) => setManualWineName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 0",
                  fontSize: "16px",
                  border: "none",
                  borderBottom: "1px solid var(--adaptiveGrey200)",
                  outline: "none",
                }}
              />
            </div>

            <ListRow
              onClick={() => setIsOriginSheetOpen(true)}
              contents={
                <Text typography="t7" color="var(--adaptiveGrey600)">
                  원산지
                </Text>
              }
              right={
                <div
                  style={{ display: "flex", alignItems: "center", gap: "4px" }}
                >
                  <Text typography="t6" fontWeight="600">
                    {manualOrigin}
                  </Text>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
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
            />

            <ListRow
              onClick={() => setIsWineTypeSheetOpen(true)}
              contents={
                <Text typography="t7" color="var(--adaptiveGrey600)">
                  유형
                </Text>
              }
              right={
                <div
                  style={{ display: "flex", alignItems: "center", gap: "4px" }}
                >
                  <Text typography="t6" fontWeight="600">
                    {WINE_CATEGORY_CONFIG[manualWineType]?.label}
                  </Text>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
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
            />

            <div>
              <Text
                typography="t7"
                fontWeight="600"
                color="var(--adaptiveGrey600)"
                style={{ display: "block", marginBottom: "8px" }}
              >
                가격
              </Text>
              <input
                type="number"
                placeholder="0"
                value={manualPrice}
                onChange={(e) => setManualPrice(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 0",
                  fontSize: "16px",
                  border: "none",
                  borderBottom: "1px solid var(--adaptiveGrey200)",
                  outline: "none",
                }}
              />
            </div>

            <div>
              <Text
                typography="t7"
                fontWeight="600"
                color="var(--adaptiveGrey600)"
                style={{ display: "block", marginBottom: "8px" }}
              >
                도수
              </Text>
              <input
                type="number"
                step="0.1"
                placeholder="0.0"
                value={manualAbv}
                onChange={(e) => setManualAbv(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 0",
                  fontSize: "16px",
                  border: "none",
                  borderBottom: "1px solid var(--adaptiveGrey200)",
                  outline: "none",
                }}
              />
            </div>

            <Button
              onClick={async () => {
                const wine: WineInfoLocal = {
                  WINE_ID: Date.now(),
                  WINE_NM: manualWineName,
                  WINE_NM_KR: manualWineName,
                  WINE_AREA: manualOrigin,
                  WINE_CATEGORY: manualWineType,
                  WINE_ABV: Number(manualAbv) || 0,
                  WINE_PRC: Number(manualPrice) || 0,
                }
                const found = await searchAllWines(manualWineName, 4)
                if (found.length > 0) {
                  setSimilarWines(found)
                  setPendingManualWine(wine)
                  setIsSimilarSheetOpen(true)
                } else {
                  const savedWine = await saveCustomWine(wine)
                  if (onSelectWine) onSelectWine(savedWine)
                }
              }}
              disabled={!manualWineName.trim()}
              size="large"
              fullWidth
            >
              완료
            </Button>
            <button
              onClick={() => setIsManualEntry(false)}
              style={{
                alignSelf: "center",
                background: "none",
                border: "none",
                color: "var(--adaptiveGrey400)",
                fontSize: "14px",
                cursor: "pointer",
                padding: "8px",
              }}
            >
              검색으로 돌아가기
            </button>

            <BottomSheet
              open={isOriginSheetOpen}
              onClose={() => setIsOriginSheetOpen(false)}
              header="원산지 선택"
              options={WINE_AREA.map((area) => ({
                label: area,
                value: area,
                onClick: () => {
                  setManualOrigin(area)
                  setIsOriginSheetOpen(false)
                },
              }))}
            />

            <BottomSheet
              open={isWineTypeSheetOpen}
              onClose={() => setIsWineTypeSheetOpen(false)}
              header="유형 선택"
              options={Object.entries(CATEGORY_LABELS).map(
                ([value, label]) => ({
                  label,
                  value,
                  onClick: () => {
                    setManualWineType(value as WineCategory)
                    setIsWineTypeSheetOpen(false)
                  },
                }),
              )}
            />

            {/* 유사 와인 확인 BottomSheet */}
            <BottomSheet
              open={isSimilarSheetOpen}
              onClose={() => setIsSimilarSheetOpen(false)}
              header="혹시 이 와인인가요?"
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  padding: "8px 0 16px",
                }}
              >
                {similarWines.map((wine) => (
                  <button
                    key={wine.WINE_ID}
                    onClick={() => {
                      setIsSimilarSheetOpen(false)
                      if (onSelectWine) onSelectWine(wine)
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "16px",
                      borderRadius: "14px",
                      border: "1px solid var(--adaptiveHairlineBorder)",
                      backgroundColor: "#ffffff",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <div style={{ flex: 1, marginRight: "12px" }}>
                      <Text
                        typography="t7"
                        fontWeight="600"
                        style={{ display: "block", marginBottom: "4px" }}
                      >
                        {wine.WINE_NM_KR || wine.WINE_NM}
                      </Text>
                      <Text typography="st2" color="var(--adaptiveGrey500)">
                        {wine.WINE_AREA}
                      </Text>
                    </div>
                    <WineTypeBadge wineType={wine.WINE_CATEGORY} />
                  </button>
                ))}
                <Button
                  variant="secondary"
                  size="large"
                  fullWidth
                  onClick={async () => {
                    setIsSimilarSheetOpen(false)
                    if (pendingManualWine) {
                      const savedWine = await saveCustomWine(pendingManualWine)
                      onSelectWine(savedWine)
                    }
                  }}
                  style={{ marginTop: "8px" }}
                >
                  아니요, 새로 등록할게요
                </Button>
              </div>
            </BottomSheet>
          </div>
        ) : results.length > 0 ? (
          <>
            <div style={{ padding: "8px 0" }}>
              <Text
                typography="t6"
                fontWeight="bold"
                color="var(--adaptiveGrey800)"
              >
                검색 결과 {results.length}건
              </Text>
            </div>
            <WineCardList results={results} onSelectWine={onSelectWine} />
          </>
        ) : hasSearched && searchTerm ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 0",
              animation: "itemFadeIn 0.3s ease-out",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <div style={{ fontSize: "40px", marginBottom: "8px" }}>ℹ️</div>
            <Text
              typography="t6"
              fontWeight="bold"
              color="var(--adaptiveGrey900)"
            >
              검색 결과가 없어요
            </Text>
            <Text typography="st2" color="var(--adaptiveGrey600)">
              직접 정보를 입력하여 등록할 수 있어요
            </Text>
            <Button
              onClick={() => {
                setIsManualEntry(true)
                setManualWineName(searchTerm)
                setTimeout(() => manualInputRef.current?.focus(), 100)
              }}
            >
              직접 등록하기
            </Button>
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "80px 0",
              animation: "itemFadeIn 0.3s ease-out",
            }}
          >
            <div style={{ fontSize: "64px", marginBottom: "24px" }}>🍷</div>
            <Text typography="t6" color="var(--adaptiveGrey400)">
              궁금한 와인의 이름을 입력해 보세요
            </Text>
          </div>
        )}
      </section>
    </PageLayout>
  )
}

export default WineSearchView
