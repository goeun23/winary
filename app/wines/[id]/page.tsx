"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import WineDetailView from "@/components/Wine/WineDetailView"
import { getWineById } from "@/services/reviewService"
import { WineInfoLocal } from "@/types/wine"
import { Asset, Loader, Result } from "@toss/tds-mobile"

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

  if (loading)
    return (
      <div>
        <div>
          <Loader label={"정보를 불러오고있어요."} />
        </div>
      </div>
    )
  if (!wine)
    return (
      <Result
        figure={
          <Asset.Icon
            name="icn-info-line"
            frameShape={Asset.frameShape.CleanH24}
          />
        }
        title="오류가 발생했습니다."
        description={`와인 정보를 불러올 수 없습니다\n다시 시도해주세요`}
      />
    )

  return (
    <WineDetailView
      wine={wine}
      onBack={() => router.back()}
      onWriteReview={() => router.push(`/reviews/new?wineId=${wine.WINE_ID}`)}
      onEditReview={(review, token) => {
        // 수정 로직 (필요시 구현)
        //router.push(`/reviews/edit?reviewId=${review.id}&token=${token}`)
      }}
    />
  )
}
