"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import WineDetailView from "@/components/Wine/WineDetailView"
import { getWineById } from "@/services/reviewService"
import { WineInfoLocal } from "@/types/wine"
import Text from "@/components/common/Text"

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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          gap: "16px",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "4px solid var(--adaptiveGrey100)",
            borderTop: "4px solid var(--adaptiveBlue500)",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <Text typography="t6" color="var(--adaptiveGrey600)">
          정보를 불러오고 있어요.
        </Text>
      </div>
    )

  if (!wine)
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          padding: "20px",
          textAlign: "center",
          gap: "12px",
        }}
      >
        <div style={{ fontSize: "48px" }}>🍷</div>
        <Text typography="t4" fontWeight="bold">
          오류가 발생했습니다.
        </Text>
        <Text
          typography="t6"
          color="var(--adaptiveGrey600)"
          style={{ whiteSpace: "pre-wrap" }}
        >
          {`와인 정보를 불러올 수 없습니다\n다시 시도해주세요`}
        </Text>
      </div>
    )

  return (
    <WineDetailView
      wine={wine}
      onBack={() => router.back()}
      onWriteReview={() => router.push(`/reviews/new?wineId=${wine.WINE_ID}`)}
      onEditReview={(review, token) => {
        // 수정 로직 (필요시 구현)
      }}
    />
  )
}
