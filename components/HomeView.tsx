"use client"

import Text from "@/components/common/Text"
import Divider from "@/components/common/Divider"
import { ListHeader, ListFooter } from "@/components/common/List/ListLayout"
import ListRow from "@/components/common/List/ListRow"
import Rating from "@/components/common/Rating"
import { useRouter } from "next/navigation"
import type { ReviewItem } from "@/types/review"
import { type WineInfoLocal } from "@/types/wine"
import { useState, useEffect } from "react"
import DailyRecommendWines from "./Home/DailyRecommendWines"
import WineIcon from "@/components/common/WineIcon"

const animationVideo = "/animation.webm"

interface HomeViewProps {
  reviews: ReviewItem[]
  recommendedWines: WineInfoLocal[]
  onNavigateSearch?: () => void
  onNavigateReviewCreate?: () => void
  onNavigateReviewDetail?: (reviewId: string) => void
  onNavigateWineList?: () => void
}

const HomeView = ({
  reviews,
  recommendedWines,
  onNavigateSearch,
  onNavigateReviewCreate,
  onNavigateReviewDetail,
  onNavigateWineList,
}: HomeViewProps) => {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleReviewCreateClick = () => {
    if (onNavigateReviewCreate) onNavigateReviewCreate()
    else router.push("/wines/search")
  }

  const handleWineDetailClick = (wineId: number | string) => {
    if (onNavigateReviewDetail) onNavigateReviewDetail(String(wineId))
    else router.push(`/wines/${wineId}`)
  }

  const handleWineListClick = () => {
    if (onNavigateWineList) onNavigateWineList()
    else router.push("/reviews")
  }

  return (
    <div
      style={{
        display: "flex",
        gap: "30px",
        flexDirection: "column",
        paddingBottom: "40px",
      }}
    >
      <div
        id="top-main-container"
        style={{ padding: "0 20px", marginTop: "20px" }}
      >
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Text fontWeight="bold" typography="t3">
              와인 리뷰를 <br />
              등록해주세요
            </Text>

            <div style={{ width: "100px", height: "100px" }}>
              {mounted ? (
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{
                    height: 100,
                    width: 100,
                    objectFit: "contain",
                  }}
                  src={animationVideo}
                />
              ) : (
                <div style={{ height: 100, width: 100 }} />
              )}
            </div>
          </div>

          <div style={{ marginTop: "24px" }}>
            <button
              onClick={handleReviewCreateClick}
              style={{
                width: "100%",
                padding: "16px",
                backgroundColor: "var(--adaptiveBlue500)",
                color: "#ffffff",
                border: "none",
                borderRadius: "16px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              와인 찾기
            </button>
          </div>
        </div>
      </div>

      <div id="daily-recommend-section">
        <Divider variant="height16" />
        <ListHeader
          title={
            <ListHeader.TitleParagraph
              typography="t5"
              color="var(--adaptiveGrey800)"
              fontWeight="bold"
            >
              오늘은 이 와인을 추천드려요
            </ListHeader.TitleParagraph>
          }
        />

        <DailyRecommendWines
          recommendedWines={recommendedWines}
          handleWineDetailClick={handleWineDetailClick}
        />
      </div>

      <div style={{ display: "flex", gap: "10px", flexDirection: "column" }}>
        <Divider variant="height16" />

        <ListHeader
          title={
            <ListHeader.TitleParagraph
              typography="t5"
              color="var(--adaptiveGrey800)"
              fontWeight="bold"
            >
              최근 등록된 리뷰
            </ListHeader.TitleParagraph>
          }
          description={
            <ListHeader.DescriptionParagraph>
              다른 사람들의 생생한 후기를 확인해보세요
            </ListHeader.DescriptionParagraph>
          }
        />

        <div id="recent-review-row">
          {reviews.map((review) => (
            <ListRow
              key={review.id}
              onClick={() => handleWineDetailClick(review.wineId)}
              left={<WineIcon wineType={review.wineType} />}
              contents={
                <ListRow.Texts
                  type="2RowTypeA"
                  top={review.wineName}
                  bottom={review.nickname}
                />
              }
              right={
                <Rating readOnly={true} value={review.rating} size="small" />
              }
              withArrow={true}
            />
          ))}
        </div>

        <ListFooter onClick={handleWineListClick} style={{ cursor: "pointer" }}>
          더 보기
        </ListFooter>
      </div>
    </div>
  )
}

export default HomeView
