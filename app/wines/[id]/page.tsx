"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import WineDetailView from "@/components/Wine/WineDetailView"
import { getWineById } from "@/services/reviewService"
import { WineInfoLocal } from "@/types/wine"
import { TossThemeProvider as ThemeProvider } from "@/components/providers/TossThemeProvider"

export default function WineDetailRoute() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string
  const [wine, setWine] = useState<WineInfoLocal | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      getWineById(Number(id)).then((data) => {
        setWine(data)
        setLoading(false)
      })
    }
  }, [id])

  if (loading) return <div>Loading...</div>
  if (!wine) return <div>와인 정보를 찾을 수 없습니다.</div>

  return (
    <ThemeProvider>
      <WineDetailView
        wine={wine}
        onBack={() => router.back()}
        onWriteReview={() => router.push(`/reviews/new?wineId=${wine.WINE_ID}`)}
        onEditReview={(review, token) => {
          // 수정 로직 (필요시 구현)
        }}
      />
    </ThemeProvider>
  )
}
