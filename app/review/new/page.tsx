"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import MainPage from "@/components/MainPage"
import WineSearchPage from "@/components/WineSearchPage"
import WineListPage from "@/components/WineListPage"
import ReviewStep2Page from "@/components/ReviewStep2Page"
import ReviewDetailPage from "@/components/ReviewDetailPage"
import { TossThemeProvider as ThemeProvider } from "@/components/providers/TossThemeProvider"
import WineDetailPage from "@/components/WineDetailPage"
import ReviewWritePage from "@/components/ReviewWritePage"

import { createReview, saveCustomWine } from "@/services/reviewService"
import { MOCK_REVIEWS } from "@/data/mockReviews"
import type { ReviewFormData, LocalReview } from "@/types/review"
import type { WineInfoLocal } from "@/types/wine"

type PageType =
  | "main"
  | "search"
  | "wineList"
  | "reviewStep2"
  | "reviewDetail"
  | "wineDetail"
  | "reviewWrite"
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

export default function ReviewNewPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<ReviewFormData>(INITIAL_FORM_DATA)
  const [isSubmitting, setIsSubmitting] = useState(false)
  // 새 flow: 와인 상세 + 리뷰 작성
  const [selectedWine, setSelectedWine] = useState<WineInfoLocal | null>(null)
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null)
  const [editTargetReview, setEditTargetReview] = useState<LocalReview | null>(
    null,
  )
  const [editToken, setEditToken] = useState<string | undefined>(undefined)
  const [currentPage, setCurrentPage] = useState<PageType>("main")

  useEffect(() => {
    const raw = sessionStorage.getItem("reviewDraft")
    if (raw) {
      const draft = JSON.parse(raw)
      setFormData(draft.formData ?? INITIAL_FORM_DATA)
    }
  }, [])

  const handleNavigateDetail = (reviewId: string) => {
    setSelectedReviewId(reviewId)
    setCurrentPage("reviewDetail")
  }

  // 검색에서 와인 선택 → WineDetailPage로 이동 (새 flow)
  const handleSelectWine = (wine: WineInfoLocal) => {
    setSelectedWine(wine)
    setCurrentPage("wineDetail")
  }

  // 직접 입력 → WineDetailPage로 이동 (기존 handleManualRegister는 WineSearchPage에서 처리)
  const handleManualRegister = (
    name: string,
    origin: string,
    type: string,
    price: number,
    abv: number,
  ) => {
    const manualWine: WineInfoLocal = {
      WINE_ID: Date.now(),
      WINE_NM: name,
      WINE_NM_KR: name,
      WINE_AREA: origin,
      WINE_CATEGORY: type,
      WINE_ABV: abv,
      WINE_PRC: price,
    }
    setSelectedWine(manualWine)
    setCurrentPage("wineDetail")
  }

  const handleUpdateFormData = (updates: Partial<ReviewFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }

  const handleFinalSubmit = (finalData: ReviewFormData) => {
    console.log("Final Review Submitted:", finalData)
    alert("리뷰가 등록되었습니다!")
    setFormData(INITIAL_FORM_DATA)
    setSelectedWine(null)
    setCurrentPage("main")
  }

  // WineDetailPage에서 리뷰 작성하기 클릭
  const handleWriteReview = () => {
    setEditTargetReview(null)
    setEditToken(undefined)
    setCurrentPage("reviewWrite")
  }

  // WineDetailPage에서 수정 클릭
  const handleEditReview = (review: LocalReview, token: string) => {
    setEditTargetReview(review)
    setEditToken(token)
    setCurrentPage("reviewWrite")
  }

  // ReviewWritePage 제출 완료 → WineDetailPage로 복귀
  const handleReviewSubmitDone = () => {
    setEditTargetReview(null)
    setEditToken(undefined)
    setCurrentPage("wineDetail")
  }
  const selectedReview = MOCK_REVIEWS.find((r) => r.id === selectedReviewId)

  const handleSubmit = async (finalData: ReviewFormData) => {
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      const raw = sessionStorage.getItem("reviewDraft")
      const draft = raw ? JSON.parse(raw) : {}
      const selectedWine: WineInfoLocal | null = draft.selectedWine ?? null

      let wineId: number
      let isCustom = false

      if (selectedWine) {
        // 로컬 JSON 와인: WINE_ID 그대로 사용
        wineId = selectedWine.WINE_ID
      } else {
        // 직접 입력 와인: custom_wines 테이블에 저장 후 wine_id 획득
        const customWine = await saveCustomWine({
          WINE_ID: 0,
          WINE_NM: finalData.wineName,
          WINE_NM_KR: finalData.wineName,
          WINE_AREA: finalData.wineRegion,
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

  if (!formData) return null

  const renderPage = () => {
    switch (currentPage) {
      case "main":
        return (
          <MainPage
            reviews={MOCK_REVIEWS}
            onNavigateSearch={() => {
              setFormData(INITIAL_FORM_DATA)
              setSelectedWine(null)
              setCurrentPage("search")
            }}
            onNavigateReviewCreate={() => {
              setFormData(INITIAL_FORM_DATA)
              setSelectedWine(null)
              setCurrentPage("search")
            }}
            onNavigateReviewDetail={handleNavigateDetail}
            onNavigateWineList={() => setCurrentPage("wineList")}
          />
        )
      case "search":
        return (
          <WineSearchPage
            onBack={() => setCurrentPage("main")}
            onSelectWine={handleSelectWine}
            onManualRegister={handleManualRegister}
          />
        )
      case "wineList":
        return (
          <WineListPage
            reviews={MOCK_REVIEWS}
            onBack={() => setCurrentPage("main")}
            onSelectPost={(postId) => handleNavigateDetail(postId)}
          />
        )
      case "reviewStep2":
        return (
          <ReviewStep2Page
            formData={formData || INITIAL_FORM_DATA}
            onUpdate={handleUpdateFormData}
            onBack={() => setCurrentPage("search")}
            onNext={handleSubmit}
          />
        )
      case "reviewDetail":
        return selectedReview ? (
          <ReviewDetailPage
            review={selectedReview}
            onBack={() => setCurrentPage("main")}
          />
        ) : (
          <MainPage
            reviews={MOCK_REVIEWS}
            onNavigateSearch={() => setCurrentPage("search")}
            onNavigateReviewCreate={() => setCurrentPage("search")}
            onNavigateReviewDetail={handleNavigateDetail}
            onNavigateWineList={() => setCurrentPage("wineList")}
          />
        )
      case "wineDetail":
        return selectedWine ? (
          <WineDetailPage
            wine={selectedWine}
            onBack={() => setCurrentPage("search")}
            onWriteReview={handleWriteReview}
            onEditReview={handleEditReview}
          />
        ) : (
          <MainPage
            reviews={MOCK_REVIEWS}
            onNavigateSearch={() => setCurrentPage("search")}
            onNavigateReviewCreate={() => setCurrentPage("search")}
            onNavigateReviewDetail={handleNavigateDetail}
            onNavigateWineList={() => setCurrentPage("wineList")}
          />
        )
      case "reviewWrite":
        return selectedWine ? (
          <ReviewWritePage
            wine={selectedWine}
            onBack={() => setCurrentPage("wineDetail")}
            onSubmit={handleReviewSubmitDone}
            editReview={editTargetReview ?? undefined}
            editToken={editToken}
          />
        ) : (
          <MainPage
            reviews={MOCK_REVIEWS}
            onNavigateSearch={() => setCurrentPage("search")}
            onNavigateReviewCreate={() => setCurrentPage("search")}
            onNavigateReviewDetail={handleNavigateDetail}
            onNavigateWineList={() => setCurrentPage("wineList")}
          />
        )
      default:
        return null
    }
  }

  return <ThemeProvider>{renderPage()}</ThemeProvider>
}
