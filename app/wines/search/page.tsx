"use client"

import WineSearchView from "@/components/Wine/WineSearchView"
import { useRouter } from "next/navigation"

export default function WineSearchRoute() {
  const router = useRouter()

  return (
    <WineSearchView
      onBack={() => router.back()}
      onSelectWine={(wine) => {
        router.push(`/wines/${wine.WINE_ID}`)
      }}
      onManualRegister={() => {
        router.push("/reviews/new")
      }}
    />
  )
}
