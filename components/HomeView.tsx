"use client"

import {
  Asset,
  Border,
  ListFooter,
  ListHeader,
  ListRow,
  Text,
  Top,
} from "@toss/tds-mobile"
import { adaptive } from "@toss/tds-colors"
import { useRouter } from "next/navigation"
import type { ReviewItem } from "@/types/review"
import type { MainHeaderInfo } from "@/types/main"
import {
  WINE_CATEGORY_CONFIG,
  WINE_TYPE_MAP,
  type WineCategory,
} from "@/types/wine"
import PageLayout from "@/components/PageLayout"

const TYPE_ICON = Object.fromEntries(
  Object.entries(WINE_CATEGORY_CONFIG).map(([key, config]) => [
    key,
    config.icon,
  ]),
) as Record<string, string>

const animationVideo = "/animation.webm"
const bottleImage1 = "/bottle1.png"
const bottleImage2 = "/bottle2.png"

const HEADER_DATA: MainHeaderInfo = {
  emoji: "🍷",
  subTitle: "나만의 와인 저장고",
  mainTitle: "오늘 마신 와인 기록할까요?",
  description: "취향에 딱 맞는 와인을 함께 찾아드릴게요.",
}

interface HomeViewProps {
  reviews: ReviewItem[]
  onNavigateSearch?: () => void
  onNavigateReviewCreate?: () => void
  onNavigateReviewDetail?: (reviewId: string) => void
  onNavigateWineList?: () => void
}

const HomeView = ({
  reviews,
  onNavigateSearch,
  onNavigateReviewCreate,
  onNavigateReviewDetail,
  onNavigateWineList,
}: HomeViewProps) => {
  const router = useRouter()

  const handleSearchClick = () => {
    if (onNavigateSearch) onNavigateSearch()
    else router.push("/wines/search")
  }

  const handleReviewCreateClick = () => {
    if (onNavigateReviewCreate) onNavigateReviewCreate()
    else router.push("/wines/search")
  }

  const handleReviewDetailClick = (reviewId: string) => {
    if (onNavigateReviewDetail) onNavigateReviewDetail(reviewId)
    else router.push(`/reviews/${reviewId}`)
  }

  const handleWineListClick = () => {
    if (onNavigateWineList) onNavigateWineList()
    else router.push("/reviews")
  }

  return (
    <div style={{ display: "flex", gap: "30px", flexDirection: "column" }}>
      <div id="top-main-container">
        <Top
          upperGap={0}
          lowerGap={0}
          upper={
            <Top.UpperAssetContent
              content={
                <Asset.Video
                  frameShape={{
                    height: 100,
                    width: 100,
                  }}
                  as="video"
                  src={animationVideo}
                />
              }
            />
          }
          title={
            <Top.TitleParagraph size={28} typography="t7">
              오늘 마신 와인 기록할까요?
            </Top.TitleParagraph>
          }
          lower={
            <Top.LowerButton onClick={handleReviewCreateClick}>
              리뷰 등록
            </Top.LowerButton>
          }
        />
      </div>

      <div id="daily-recommend-section">
        <Border variant="height16" />
        <ListHeader
          title={
            <ListHeader.TitleParagraph
              typography="t7"
              color={adaptive.grey800}
              fontWeight="bold"
            >
              오늘의 추천 와인
            </ListHeader.TitleParagraph>
          }
          rightAlignment="center"
          descriptionPosition="bottom"
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
            padding: "0 20px",
          }}
        >
          {[
            { src: bottleImage1, label: "모스카토 다스티", label2: "호주" },
            { src: bottleImage2, label: "스톤베이", label2: "뉴질랜드" },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                backgroundColor: "#f2f4f6",
                borderRadius: "16px",
                overflow: "hidden",
                cursor: "pointer",
                transition: "transform 0.2s ease",
              }}
            >
              <div
                style={{
                  width: "100%",
                  aspectRatio: "1 / 1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "16px",
                }}
              >
                <img
                  src={item.src}
                  alt={item.label}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    borderRadius: "14px",
                  }}
                />
              </div>
              <div style={{ padding: "0 14px 14px 14px" }}>
                <div>
                  <Text
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: adaptive.grey800,
                    }}
                  >
                    {item.label2}
                  </Text>
                </div>
                <Text
                  style={{
                    fontSize: "15px",
                    fontWeight: 600,
                    color: "#191f28",
                  }}
                >
                  {item.label}
                </Text>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: "10px", flexDirection: "column" }}>
        <Border variant="height16" />

        <ListHeader
          title={
            <ListHeader.TitleParagraph
              typography="t7"
              color={adaptive.grey800}
              fontWeight="bold"
            >
              최근 리뷰
            </ListHeader.TitleParagraph>
          }
          rightAlignment="center"
          descriptionPosition="bottom"
        />

        <div id="recent-review-row">
          {reviews.map((review) => (
            <ListRow
              key={review.id}
              onClick={() => handleReviewDetailClick(review.id)}
              left={
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    backgroundColor: adaptive.grey100,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    padding: "4px",
                  }}
                >
                  <img
                    src={
                      TYPE_ICON[WINE_TYPE_MAP[review.wineType] || "RED"] ||
                      "/images/red.png"
                    }
                    alt={review.wineType}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>
              }
              contents={
                <ListRow.Texts
                  type="2RowTypeA"
                  top={review.wineName}
                  bottom={review.wineRegion}
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
