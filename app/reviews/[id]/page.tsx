"use client"

import { useParams, useRouter } from "next/navigation"
import ReviewDetailView from "@/components/ReviewDetailView"
import { MOCK_REVIEWS } from "@/data/mockReviews"
import { TossThemeProvider as ThemeProvider } from "@/components/providers/TossThemeProvider"

export default function ReviewDetailRoute() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string

  const review = MOCK_REVIEWS.find((r) => r.id === id)

  if (!review) {
    return (
      <ThemeProvider>
        <div style={{ padding: "100px 20px", textAlign: "center" }}>
          리뷰를 찾을 수 없습니다.
          <button
            onClick={() => router.push("/")}
            style={{ display: "block", margin: "20px auto" }}
          >
            홈으로 이동
          </button>
        </div>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider>
      <ReviewDetailView review={review} onBack={() => router.back()} />
    </ThemeProvider>
  )
}
