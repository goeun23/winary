"use client"
import { useState, useEffect } from "react"
import Text from "@/components/common/Text"
import BottomSheet from "@/components/common/BottomSheet"
import TableRow from "@/components/common/TableRow"
import ListRow from "@/components/common/List/ListRow"
import Button from "@/components/common/Button"
import { ListHeader, ListFooter } from "@/components/common/List/ListLayout"
import Badge from "@/components/common/Badge"
import Rating from "@/components/common/Rating"
import Divider from "@/components/common/Divider"

import type { WineInfoLocal } from "../../types/wine"
import type { LocalReview } from "../../types/review"

import { getReviews, canEdit, getMyToken } from "../../services/reviewService"
import PageLayout from "../PageLayout"
import StarRating from "../common/StarRating"
import ReviewBottomSheet from "../Review/ReviewBottimSheet"
import RightArrow from "../common/RightArrow"
import { CharacteristicBar } from "../Review/CharactersticBar"
import { ModifyWineInfoDialog } from "../Review/ModifyWineInfoDialog"
import { Toast } from "../common/Toast"
import WineTypeBadge from "../common/WineTypeBadge"

interface WineDetailViewProps {
  wine: WineInfoLocal
  onBack: () => void
  onWriteReview: () => void
  onEditReview: (review: LocalReview, token: string) => void
}

const WineDetailView = ({
  wine,
  onBack,
  onWriteReview,
  onEditReview,
}: WineDetailViewProps) => {
  const [localWine, setLocalWine] = useState<WineInfoLocal>(wine)
  const [reviews, setReviews] = useState<LocalReview[]>([])
  const [selectedReview, setSelectedReview] = useState<LocalReview | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isOpenPersonalReview, setIsOpenPersonalReview] = useState(false)
  const [isOpenModifyWineInfoDialog, setIsOpenModifyWineInfoDialog] =
    useState(false)
  const [showToast, setShowToast] = useState(false)

  const loadReviews = async () => {
    const data = await getReviews(localWine.WINE_ID)
    setReviews(data)
  }

  useEffect(() => {
    loadReviews()
  }, [localWine.WINE_ID])

  const handleEdit = (review: LocalReview) => {
    const tokenEntry = getMyToken(review.id)
    if (!tokenEntry) return
    onEditReview(review, tokenEntry.token)
  }

  const handlePersonalReview = () => {
    setIsOpenPersonalReview(true)
  }

  const handleModifyWineInfo = () => {
    setIsOpenModifyWineInfoDialog(true)
  }

  const handleOverrideConfirm = (updated: WineInfoLocal) => {
    setLocalWine(updated)
    setIsOpenModifyWineInfoDialog(false)
    setShowToast(true)
  }

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0

  const avgSweetness =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.sweetness, 0) / reviews.length
      : 0

  const avgAcidity =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.acidity, 0) / reviews.length
      : 0

  const avgBody =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.body, 0) / reviews.length
      : 0

  const avgTannin =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.tannin, 0) / reviews.length
      : 0

  return (
    <PageLayout title="와인 상세" onBack={onBack}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          animation: "pageFadeIn 0.3s ease-out",
        }}
      >
        <style>{`
          @keyframes pageFadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes itemFadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        {/* 와인 정보 카드 */}
        <div>
          <div style={{ padding: "16px 20px" }}>
            <Text
              typography="t4"
              fontWeight="bold"
              color="var(--adaptiveGrey900)"
            >
              {localWine.WINE_NM_KR}
            </Text>
            <div style={{ marginTop: "4px" }}>
              <Text typography="st2" color="var(--adaptiveGrey600)">
                {localWine.WINE_NM}
              </Text>
            </div>
          </div>
          <div>
            <ListRow
              contents={
                <Text typography="t7" color="var(--adaptiveGrey700)">
                  지역
                </Text>
              }
              right={
                <Text typography="t7" fontWeight="600">
                  {localWine.WINE_AREA}
                </Text>
              }
            />
            <ListRow
              contents={
                <Text typography="t7" color="var(--adaptiveGrey700)">
                  도수
                </Text>
              }
              right={
                <Text typography="t7" fontWeight="600">
                  {localWine.WINE_ABV + "%"}
                </Text>
              }
            />
            <ListRow
              contents={
                <Text typography="t7" color="var(--adaptiveGrey700)">
                  가격
                </Text>
              }
              right={
                <Text typography="t7" fontWeight="600">
                  {"₩" + localWine.WINE_PRC.toLocaleString()}
                </Text>
              }
            />
            <ListRow
              contents={
                <Text typography="t7" color="var(--adaptiveGrey700)">
                  종류
                </Text>
              }
              right={<WineTypeBadge wineType={localWine.WINE_CATEGORY} />}
            />
            <div style={{ padding: "8px 20px" }}>
              <Button
                variant="text"
                size="small"
                onClick={handleModifyWineInfo}
                style={{
                  padding: "0",
                  color: "var(--adaptiveBlue400)",
                  textDecoration: "underline",
                }}
              >
                정보가 잘못되었어요!
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div id="review-average-starage-container">
        {reviews.length > 0 && (
          <>
            <div style={{ padding: "16px 20px 8px" }}>
              <Text typography="t5" fontWeight="bold">
                테이스팅리뷰
              </Text>
              <div style={{ marginTop: "4px" }}>
                <Text typography="st2" color="var(--adaptiveGrey500)">
                  리뷰어들의 평균 별점이에요.
                </Text>
              </div>
            </div>
            <div>
              <CharacteristicBar label="당도" emoji="🍬" value={avgSweetness} />
              <CharacteristicBar label="산도" emoji="🍋" value={avgAcidity} />
              <CharacteristicBar label="바디" emoji="💪" value={avgBody} />
              <CharacteristicBar label="탄닌" emoji="🍇" value={avgTannin} />
              <CharacteristicBar label="전체" emoji="🍇" value={avgRating} />
            </div>
            {!isOpenPersonalReview && (
              <ListFooter onClick={handlePersonalReview}>더 보기</ListFooter>
            )}
          </>
        )}
      </div>
      <div id="review-section-container">
        {/* 리뷰 없을 때 */}
        {reviews.length === 0 && (
          <div
            style={{
              padding: "60px 20px",
              textAlign: "center",
              color: "var(--adaptiveGrey400)",
            }}
          >
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>ℹ️</div>
            <Text
              typography="t6"
              fontWeight="bold"
              color="var(--adaptiveGrey900)"
            >
              아직 리뷰가 없어요
            </Text>
            <div style={{ marginTop: "4px" }}>
              <Text typography="st2">첫 번째 리뷰를 등록해주세요</Text>
            </div>
          </div>
        )}

        {/* 리뷰 카드 목록 */}
        {isOpenPersonalReview && reviews.length > 0 && (
          <div style={{ padding: "0 0 20px" }}>
            {reviews.map((review) => {
              const editable = canEdit(review.id)
              return (
                <div
                  key={review.id}
                  style={{
                    borderBottom: "1px solid var(--adaptiveHairlineBorder)",
                  }}
                  onClick={() => {
                    setSelectedReview(review)
                    setIsDetailOpen(true)
                  }}
                >
                  <ListRow
                    contents={
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "4px",
                        }}
                      >
                        <StarRating value={review.rating} />
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <Text typography="st2" color="var(--adaptiveGrey600)">
                            {review.nickname}
                          </Text>
                          {editable && (
                            <Badge color="red" variant="weak">
                              내 글
                            </Badge>
                          )}
                        </div>
                      </div>
                    }
                    right={<RightArrow />}
                  />
                </div>
              )
            })}
          </div>
        )}
      </div>
      {/* 하단 플로팅 버튼 여백 확보 */}
      <div style={{ height: "140px" }} />

      {/* 리뷰 상세 바텀 시트 */}
      <ReviewBottomSheet
        handleEdit={handleEdit}
        header="리뷰 상세"
        open={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        selectedReview={selectedReview}
      />

      {/* 하단 고정: 리뷰 작성 버튼 */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "16px 20px calc(16px + env(safe-area-inset-bottom, 24px))",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(12px)",
          borderTop: "1px solid var(--adaptiveHairlineBorder)",
          zIndex: 100,
        }}
      >
        <Button
          size="large"
          fullWidth
          onClick={onWriteReview}
          style={{ boxShadow: "0 4px 12px rgba(49,130,246,0.3)" }}
        >
          + 리뷰 작성하기
        </Button>
      </div>
      {/* 수동 와인 정보 수정 다이얼로그 */}
      <ModifyWineInfoDialog
        isOpen={isOpenModifyWineInfoDialog}
        onClose={() => setIsOpenModifyWineInfoDialog(false)}
        wine={localWine}
        onConfirm={handleOverrideConfirm}
      />
      {showToast && (
        <Toast
          message="와인 정보가 수정되었어요"
          onClose={() => setShowToast(false)}
        />
      )}
    </PageLayout>
  )
}

export default WineDetailView
