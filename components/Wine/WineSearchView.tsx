"use client"
import { useState, useEffect, useRef } from "react"
import {
  Text,
  TextField,
  ListRow,
  BottomSheet,
  Button,
  Asset,
  Result,
  ListHeader,
} from "@toss/tds-mobile"
import { adaptive } from "@toss/tds-colors"
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
  // lazy init: 마운트 전에 sessionStorage에서 바로 복원
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

  // 검색어 복원 시 자동 포커스 (검색어 없을 때만)
  useEffect(() => {
    if (!searchTerm) inputRef.current?.focus()
  }, [])

  // 검색 상태 sessionStorage에 저장 (뒤로가기 복원용)
  useEffect(() => {
    sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ searchTerm, results, displayCount }),
    )
  }, [searchTerm, results, displayCount])

  // 실시간 검색 (debounce 300ms)
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
      setDisplayCount(20) // reset display count on new search
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
          .wine-item:hover {
            background-color: #f9fafb !important;
            transform: scale(1.01);
            box-shadow: 0 4px 12px rgba(0,0,0,0.08) !important;
          }
          .wine-item:active {
            transform: scale(0.98);
          }
        `}
      </style>

      {!isManualEntry && (
        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              left: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              alignItems: "center",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                stroke={isFocused ? "#3182f6" : "#8B95A1"}
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
              border: isFocused ? "2px solid #3182f6" : "2px solid transparent",
              backgroundColor: isFocused ? "#ffffff" : "#f2f4f6",
              fontSize: "16px",
              color: "#191f28",
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
                background: "#e5e8eb",
                border: "none",
                borderRadius: "50%",
                width: "24px",
                height: "24px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.2s",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M9 3L3 9M3 3L9 9"
                  stroke="#8b95a1"
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
            }}
          >
            <div>
              <TextField
                variant="line"
                label="이름"
                labelOption="sustain"
                placeholder="와인 이름을 입력해주세요"
                value={manualWineName}
                ref={manualInputRef}
                onChange={(e) => setManualWineName(e.target.value)}
              />
            </div>
            <div>
              <ListRow
                onClick={() => setIsOriginSheetOpen(true)}
                contents={<ListRow.Texts type="1RowTypeA" top="원산지" />}
                right={
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <Text typography="t6" color={adaptive.grey600}>
                      {manualOrigin}
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
            </div>
            <div>
              <ListRow
                onClick={() => setIsWineTypeSheetOpen(true)}
                contents={<ListRow.Texts type="1RowTypeA" top="유형" />}
                right={
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <Text typography="t6" color={adaptive.grey600}>
                      {WINE_CATEGORY_CONFIG[manualWineType]?.label}
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
            </div>

            <div>
              <TextField
                variant="line"
                label="가격"
                labelOption="sustain"
                placeholder="0"
                type="number"
                value={manualPrice}
                onChange={(e) => setManualPrice(e.target.value)}
              />
            </div>
            <div>
              <TextField
                variant="line"
                label="도수"
                labelOption="sustain"
                placeholder="0.0"
                type="number"
                value={manualAbv}
                onChange={(e) => setManualAbv(e.target.value)}
              />
            </div>

            <button
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
              style={{
                padding: "16px",
                borderRadius: "14px",
                border: "none",
                backgroundColor: manualWineName.trim() ? "#3182f6" : "#e5e8eb",
                color: "#ffffff",
                fontSize: "16px",
                fontWeight: "600",
                cursor: manualWineName.trim() ? "pointer" : "not-allowed",
                transition: "all 0.2s ease",
              }}
            >
              완료
            </button>
            <button
              onClick={() => setIsManualEntry(false)}
              style={{
                alignSelf: "center",
                background: "none",
                border: "none",
                color: "#8b95a1",
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
              header={<BottomSheet.Header>원산지 선택</BottomSheet.Header>}
            >
              <BottomSheet.Select
                value={manualOrigin}
                onChange={(e) => {
                  setManualOrigin(e.target.value)
                  setIsOriginSheetOpen(false)
                }}
                options={WINE_AREA.map((area) => ({
                  name: area,
                  value: area,
                }))}
              />
            </BottomSheet>
            <BottomSheet
              open={isWineTypeSheetOpen}
              onClose={() => setIsWineTypeSheetOpen(false)}
              header={<BottomSheet.Header>유형 선택</BottomSheet.Header>}
            >
              <BottomSheet.Select
                value={manualWineType}
                onChange={(e) => {
                  setManualWineType(e.target.value as WineCategory)
                  setIsWineTypeSheetOpen(false)
                }}
                options={Object.entries(CATEGORY_LABELS).map(
                  ([value, name]) => ({
                    name,
                    value: value as WineCategory,
                  }),
                )}
              />
            </BottomSheet>

            {/* 유사 와인 확인 BottomSheet */}
            <BottomSheet
              open={isSimilarSheetOpen}
              onClose={() => setIsSimilarSheetOpen(false)}
              header={
                <BottomSheet.Header>혹시 이 와인인가요?</BottomSheet.Header>
              }
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  padding: "8px 0 16px",
                }}
              >
                {similarWines.map((wine) => {
                  return (
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
                        padding: "14px 16px",
                        borderRadius: "12px",
                        border: "1.5px solid #f2f4f6",
                        backgroundColor: "#ffffff",
                        cursor: "pointer",
                        textAlign: "left",
                        gap: "10px",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <Text
                          style={{
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#191f28",
                            display: "block",
                          }}
                        >
                          {wine.WINE_NM_KR || wine.WINE_NM}
                        </Text>
                        <Text style={{ fontSize: "12px", color: "#8b95a1" }}>
                          {wine.WINE_AREA}
                        </Text>
                      </div>
                      <WineTypeBadge wineType={wine.WINE_CATEGORY} />
                    </button>
                  )
                })}
                <button
                  onClick={async () => {
                    setIsSimilarSheetOpen(false)
                    if (pendingManualWine) {
                      const savedWine = await saveCustomWine(pendingManualWine)
                      onSelectWine(savedWine)
                    }
                  }}
                  style={{
                    marginTop: "4px",
                    padding: "14px",
                    borderRadius: "12px",
                    border: "none",
                    backgroundColor: "#f2f4f6",
                    color: "#4e5968",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  아니요, 새로 등록할게요
                </button>
              </div>
            </BottomSheet>
          </div>
        ) : results.length > 0 ? (
          <>
            <ListHeader
              title={
                <ListHeader.TitleParagraph
                  typography="t5"
                  color={adaptive.grey800}
                  fontWeight="bold"
                >
                  검색 결과 {results.length}건
                </ListHeader.TitleParagraph>
              }
              rightAlignment="center"
            />
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
            <div>
              <Result
                figure={
                  <Asset.Icon
                    name="icn-info-line"
                    frameShape={Asset.frameShape.CleanH24}
                  />
                }
                title="검색 결과가 없어요"
                button={
                  <Button
                    onClick={() => {
                      setIsManualEntry(true)
                      setManualWineName(searchTerm)
                      setTimeout(() => manualInputRef.current?.focus(), 100)
                    }}
                  >
                    직접 등록
                  </Button>
                }
              />
            </div>
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "60px 0",
              animation: "itemFadeIn 0.3s ease-out",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🍷</div>
            <Text style={{ fontSize: "16px", color: "#8b95a1" }}>
              궁금한 와인의 이름을 입력해 보세요
            </Text>
          </div>
        )}
      </section>
    </PageLayout>
  )
}

export default WineSearchView
