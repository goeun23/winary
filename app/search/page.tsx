"use client"

import WineSearchPage from "@/components/WineSearchPage"
import { useRouter } from "next/navigation"

export default function SearchPage() {
  const router = useRouter()

  return (
    <WineSearchPage
      onBack={() => router.back()}
      onSelectWine={(wine) => {
        // 검색 결과 클릭 시 기존처럼 리뷰 작성 페이지로 이동하거나 상세로 이동
        router.push(`/review/new?wineId=${wine.WINE_ID}`)
      }}
      onManualRegister={() => {
        router.push("/review/new")
      }}
    />
  )
}
