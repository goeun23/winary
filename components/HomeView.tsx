"use client"

import {
  Asset,
  Border,
  ListFooter,
  ListHeader,
  ListRow,
  Rating,
  Top,
} from "@toss/tds-mobile"
import { adaptive } from "@toss/tds-colors"
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

  const handleSearchClick = () => {
    if (onNavigateSearch) onNavigateSearch()
    else router.push("/wines/search")
  }

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
    <div style={{ display: "flex", gap: "30px", flexDirection: "column" }}>
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
            <Top.TitleParagraph fontWeight="bold" size={28} typography="st2">
              와인 리뷰를 <br />
              등록해주세요
            </Top.TitleParagraph>

            <div style={{ width: "100px", height: "100px" }}>
              {mounted ? (
                <Asset.Video
                  frameShape={{
                    height: 100,
                    width: 100,
                  }}
                  as="video"
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
                backgroundColor: "#3182f6",
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
        <Border variant="height16" />
        <ListHeader
          title={
            <ListHeader.TitleParagraph
              typography="t5"
              color={adaptive.grey800}
              fontWeight="bold"
            >
              오늘은 이 와인을 추천드려요
            </ListHeader.TitleParagraph>
          }
          rightAlignment="center"
        />

        <DailyRecommendWines
          recommendedWines={recommendedWines}
          handleWineDetailClick={handleWineDetailClick}
        />
      </div>

      <div style={{ display: "flex", gap: "10px", flexDirection: "column" }}>
        <Border variant="height16" />

        <ListHeader
          title={
            <ListHeader.TitleParagraph
              typography="t5"
              color={adaptive.grey800}
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
          rightAlignment="center"
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
                <Rating
                  readOnly={true}
                  value={review.rating}
                  max={5}
                  size="medium"
                  variant="compact"
                  aria-label="별점 평가"
                />
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
