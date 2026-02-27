"use client"
import { useState, useEffect } from "react"
import {
  Text,
  BottomSheet,
  TableRow,
  List,
  ListRow,
  Button,
  ListFooter,
  Badge,
  Rating,
  Border,
  Top,
  Result,
  Asset,
  TextButton,
} from "@toss/tds-mobile"
import type { WineInfoLocal } from "../../types/wine"
import type { LocalReview } from "../../types/review"

import { getReviews, canEdit, getMyToken } from "../../services/reviewService"
import PageLayout from "../PageLayout"
import StarRating from "../common/StarRating"
import ReviewBottomSheet from "../Review/ReviewBottimSheet"
import RightArrow from "../common/RightArrow"
import { adaptive } from "@toss/tds-colors"
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
      <style>{`
        @keyframes pageFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes itemFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .review-card:hover {
          box-shadow: 0 4px 16px rgba(0,0,0,0.08) !important;
        }
        .write-btn:active {
          transform: scale(0.97);
        }
      `}</style>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          animation: "pageFadeIn 0.3s ease-out",
        }}
      >
        {/* 와인 정보 카드 */}
        <div>
          <Top
            title={
              <Top.TitleParagraph>{localWine.WINE_NM_KR}</Top.TitleParagraph>
            }
            subtitleTop={
              <Top.SubtitleParagraph>{localWine.WINE_NM}</Top.SubtitleParagraph>
            }
          />
          <List>
            <ListRow
              contents={<ListRow.Texts type="1RowTypeA" top="지역" />}
              right={<Text>{localWine.WINE_AREA}</Text>}
            />
            <ListRow
              contents={<ListRow.Texts type="1RowTypeA" top="도수" />}
              right={<Text>{localWine.WINE_ABV + "%"}</Text>}
            />
            <ListRow
              contents={<ListRow.Texts type="1RowTypeA" top="가격" />}
              right={<Text>{"₩" + localWine.WINE_PRC.toLocaleString()}</Text>}
            />
            <ListRow
              contents={<ListRow.Texts type="1RowTypeA" top="종류" />}
              right={<WineTypeBadge wineType={localWine.WINE_CATEGORY} />}
            />
            <ListRow
              contents={
                <TextButton
                  variant="underline"
                  size="small"
                  fontWeight="bold"
                  color={adaptive.blue400}
                  onClick={handleModifyWineInfo}
                >
                  정보가 잘못되었어요!
                </TextButton>
              }
            />
          </List>
        </div>
      </div>
      <div id="review-average-starage-container">
        {reviews.length > 0 && (
          <>
            <Top
              title={<Top.TitleParagraph>테이스팅리뷰</Top.TitleParagraph>}
              subtitleTop={
                <Top.SubtitleParagraph>
                  리뷰어들의 평균 별점이에요.
                </Top.SubtitleParagraph>
              }
            />
            <List>
              <CharacteristicBar label="당도" emoji="🍬" value={avgSweetness} />
              <CharacteristicBar label="산도" emoji="🍋" value={avgAcidity} />
              <CharacteristicBar label="바디" emoji="💪" value={avgBody} />
              <CharacteristicBar label="탄닌" emoji="🍇" value={avgTannin} />
              <CharacteristicBar label="전체" emoji="🍇" value={avgRating} />
            </List>
            {!isOpenPersonalReview && (
              <ListFooter onClick={handlePersonalReview}>더 보기</ListFooter>
            )}
          </>
        )}
      </div>
      <div id="review-section-container">
        {/* 리뷰 목록 헤더 */}

        {/* 리뷰 없을 때 */}
        {reviews.length === 0 && (
          <>
            <Result
              figure={
                <Asset.Icon
                  name="icn-info-line"
                  frameShape={Asset.frameShape.CleanH24}
                />
              }
              title="아직 리뷰가 없어요"
              description={`첫 번째 리뷰를 등록해주세요`}
            />
          </>
        )}

        {/* 리뷰 카드 목록 */}
        {isOpenPersonalReview && reviews.length > 0 && (
          <>
            {reviews.map((review, index) => {
              const editable = canEdit(review.id)
              return (
                <div
                  key={review.id}
                  className="review-card"
                  onClick={() => {
                    setSelectedReview(review)
                    setIsDetailOpen(true)
                  }}
                >
                  <List>
                    <ListRow
                      contents={
                        <>
                          <ListRow.Texts
                            type="2RowTypeA"
                            top={<StarRating value={review.rating} />}
                            bottom={
                              <>
                                <Text>{review.nickname}</Text>
                                {editable && (
                                  <Badge
                                    size="small"
                                    color="red"
                                    variant="weak"
                                  >
                                    내 글
                                  </Badge>
                                )}
                              </>
                            }
                          />
                        </>
                      }
                      right={
                        <Text>
                          <RightArrow />
                        </Text>
                      }
                    />
                  </List>
                </div>
              )
            })}
          </>
        )}
      </div>
      {/* 하단 플로팅 버튼 여백 확보 */}
      <div style={{ height: "140px" }} />

      {/* 리뷰 상세 바텀 시트 */}
      <ReviewBottomSheet
        handleEdit={handleEdit}
        open={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        selectedReview={selectedReview}
        header={<BottomSheet.Header>리뷰 상세</BottomSheet.Header>}
      />

      {/* 하단 고정: 리뷰 작성 버튼 */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "16px 20px calc(16px + env(safe-area-inset-bottom))",
          backgroundColor: "rgba(248,249,250,0.95)",
          backdropFilter: "blur(12px)",
          borderTop: "1px solid #f2f4f6",
        }}
      >
        <button
          className="write-btn"
          onClick={onWriteReview}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: "14px",
            border: "none",
            backgroundColor: "#3182f6",
            color: "#ffffff",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow: "0 4px 12px rgba(49,130,246,0.3)",
          }}
        >
          + 리뷰 작성하기
        </button>
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
