"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import ReviewStep2Page from "@/components/ReviewStep2Page"
import { submitReview } from "@/services/reviewService"
import type { ReviewFormData } from "@/types/review"

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
  const [formData, setFormData] = useState<ReviewFormData | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const raw = sessionStorage.getItem("reviewDraft")
    if (!raw) {
      router.replace("/search")
      return
    }
    const draft = JSON.parse(raw)
    setFormData(draft.formData ?? INITIAL_FORM_DATA)
  }, [router])

  const handleUpdate = (updates: Partial<ReviewFormData>) => {
    setFormData((prev) => (prev ? { ...prev, ...updates } : prev))
  }

  const handleSubmit = async (finalData: ReviewFormData) => {
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      await submitReview(finalData)
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

  return (
    <ReviewStep2Page
      formData={formData}
      onUpdate={handleUpdate}
      onBack={() => router.push("/search")}
      onNext={handleSubmit}
    />
  )
}
