"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import WineSearchView from "@/components/Wine/WineSearchView"
import ReviewTasteView from "@/components/Review/ReviewTasteView"
import { TossThemeProvider as ThemeProvider } from "@/components/providers/TossThemeProvider"
import WineDetailView from "@/components/Wine/WineDetailView"
import ReviewWriteView from "@/components/Review/ReviewWriteView"

import {
  createReview,
  saveCustomWine,
  getWineById,
} from "@/services/reviewService"
import { MOCK_REVIEWS } from "@/data/mockReviews"
import type { ReviewFormData, LocalReview } from "@/types/review"
import type { WineInfoLocal } from "@/types/wine"

type PageType = "search" | "reviewStep2" | "wineDetail" | "reviewWrite"

const WINE_TYPE_TO_CATEGORY: Record<ReviewFormData["wineType"], string> = {
  Red: "RED",
  White: "WHITE",
  Rosé: "ROSE",
  Sparkling: "SPARKLING",
}

const INITIAL_FORM_DATA: ReviewFormData = {
  wineName: "",
  wineRegion: "",
  wineType: "Red",
  wineAbv: 0,
  vintage: new Date().getFullYear(),
  rating: 3,
  body: 3,
  tannin: 3,
  sweetness: 3,
  acidity: 3,
  comment: "",
  tags: [],
}

function ReviewNewContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState<ReviewFormData>(INITIAL_FORM_DATA)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedWine, setSelectedWine] = useState<WineInfoLocal | null>(null)
  const [editTargetReview, setEditTargetReview] = useState<LocalReview | null>(
    null,
  )
  const [editToken, setEditToken] = useState<string | undefined>(undefined)
  const [currentPage, setCurrentPage] = useState<PageType>("search")

  useEffect(() => {
    // URL에 wineId가 있으면 자동으로 와인 정보를 불러오고 상세 페이지로 전환
    const wineId = searchParams?.get("wineId")
    if (wineId) {
      getWineById(Number(wineId)).then((wine) => {
        if (wine) {
          setSelectedWine(wine)
          setCurrentPage("reviewWrite")
        }
      })
    }

    const raw = sessionStorage.getItem("reviewDraft")
    if (raw) {
      const draft = JSON.parse(raw)
      setFormData(draft.formData ?? INITIAL_FORM_DATA)
    }
  }, [searchParams])

  // 검색에서 와인 선택 → 전용 와인 상세 페이지로 이동
  const handleSelectWine = (wine: WineInfoLocal) => {
    router.push(`/wines/${wine.WINE_ID}`)
  }

  // 직접 입력 → 별도 저장 후 상세 페이지로 이동
  const handleManualRegister = async (
    name: string,
    origin: string,
    type: string,
    price: number,
    abv: number,
  ) => {
    try {
      const customWine = await saveCustomWine({
        WINE_ID: 0,
        WINE_NM: name,
        WINE_NM_KR: name,
        WINE_AREA: origin,
        WINE_CATEGORY: type,
        WINE_ABV: abv,
        WINE_PRC: price,
      })
      router.push(`/wines/${customWine.WINE_ID}`)
    } catch (err) {
      console.error("Manual register failed:", err)
    }
  }

  const handleUpdateFormData = (updates: Partial<ReviewFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }

  const handleWriteReview = () => {
    setEditTargetReview(null)
    setEditToken(undefined)
    setCurrentPage("reviewWrite")
  }

  const handleEditReview = (review: LocalReview, token: string) => {
    setEditTargetReview(review)
    setEditToken(token)
    setCurrentPage("reviewWrite")
  }

  const handleReviewSubmitDone = () => {
    setEditTargetReview(null)
    setEditToken(undefined)
    setCurrentPage("wineDetail")
  }

  const handleSubmit = async (finalData: ReviewFormData) => {
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      let wineId: number
      let isCustom = false

      if (selectedWine && selectedWine.WINE_ID !== 0) {
        wineId = selectedWine.WINE_ID
      } else {
        const customWine = await saveCustomWine({
          WINE_ID: 0,
          WINE_NM: finalData.wineName || selectedWine?.WINE_NM || "",
          WINE_NM_KR: finalData.wineName || selectedWine?.WINE_NM_KR || "",
          WINE_AREA: finalData.wineRegion || selectedWine?.WINE_AREA || "",
          WINE_CATEGORY: WINE_TYPE_TO_CATEGORY[finalData.wineType] ?? "RED",
          WINE_ABV: finalData.wineAbv,
          WINE_PRC: 0,
        })
        wineId = customWine.WINE_ID
        isCustom = true
      }

      await createReview(
        wineId,
        finalData.rating,
        finalData.body,
        finalData.sweetness,
        finalData.acidity,
        finalData.tannin,
        finalData.comment,
        isCustom,
      )

      sessionStorage.removeItem("reviewDraft")
      router.push("/")
    } catch (err) {
      console.error("리뷰 등록 실패:", err)
      alert("리뷰 등록 중 오류가 발생했어요. 다시 시도해 주세요.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderPage = () => {
    switch (currentPage) {
      case "search":
        return (
          <WineSearchView
            onBack={() => router.push("/")}
            onSelectWine={handleSelectWine}
            onManualRegister={handleManualRegister}
          />
        )
      case "reviewWrite":
        return selectedWine ? (
          <ReviewWriteView
            wine={selectedWine}
            onBack={() => {
              if (searchParams?.get("wineId")) {
                router.back()
              } else {
                setCurrentPage("search")
              }
            }}
            onSubmit={() => {
              sessionStorage.removeItem("reviewDraft")
              router.push("/")
            }}
            editReview={editTargetReview ?? undefined}
            editToken={editToken}
          />
        ) : (
          <WineSearchView
            onBack={() => router.push("/")}
            onSelectWine={handleSelectWine}
            onManualRegister={handleManualRegister}
          />
        )
      default:
        return (
          <WineSearchView
            onBack={() => router.push("/")}
            onSelectWine={handleSelectWine}
            onManualRegister={handleManualRegister}
          />
        )
    }
  }

  return <ThemeProvider>{renderPage()}</ThemeProvider>
}

export default function ReviewNewPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReviewNewContent />
    </Suspense>
  )
}
